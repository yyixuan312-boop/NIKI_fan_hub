import { buildSystemPrompt } from "@/lib/agent/promptBuilder"
import { searchWeb } from "@/lib/agent/search"

export const maxDuration = 60

interface ClientMessage {
  role: "user" | "assistant"
  content: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyMessage = Record<string, any>

interface ToolCall {
  id: string
  function: { name: string; arguments: string }
}

interface DeepSeekChoice {
  finish_reason: string
  message: {
    role: string
    content: string | null
    tool_calls?: ToolCall[]
  }
}

interface DeepSeekResponse {
  choices: DeepSeekChoice[]
}

const TOOLS = [
  {
    type: "function",
    function: {
      name: "search_web",
      description:
        "Search the web for K-pop era references, NIKI/ENHYPEN outfit details, color palettes, visual style references. Use this when you need more specific era or styling information.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search query in English" },
        },
        required: ["query"],
      },
    },
  },
]

function parseOutput(raw: string): { imagePrompt: string } {
  const promptMatch = raw.match(/###\s*Image Generation Prompt\s*\n([\s\S]*)/)
  return {
    imagePrompt: promptMatch?.[1]?.trim() ?? raw.trim(),
  }
}

function isClientMessage(m: unknown): m is ClientMessage {
  return (
    typeof m === "object" &&
    m !== null &&
    ((m as Record<string, unknown>).role === "user" ||
      (m as Record<string, unknown>).role === "assistant") &&
    typeof (m as Record<string, unknown>).content === "string"
  )
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 })
  }

  let productType: string
  let description: string
  let history: ClientMessage[]

  try {
    const body = (await request.json()) as Record<string, unknown>

    if (typeof body.productType !== "string" || !body.productType.trim()) {
      return Response.json({ error: "Missing productType" }, { status: 400 })
    }
    if (typeof body.description !== "string" || !body.description.trim()) {
      return Response.json({ error: "Missing description" }, { status: 400 })
    }

    productType = body.productType.trim()
    description = body.description.trim()

    history = Array.isArray(body.messages)
      ? (body.messages as unknown[]).filter(isClientMessage)
      : []
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }

  const systemPrompt = buildSystemPrompt(productType)
  const messages: AnyMessage[] = [{ role: "system", content: systemPrompt }]

  for (const msg of history) {
    messages.push({ role: msg.role, content: msg.content })
  }

  messages.push({
    role: "user",
    content: `Product type: ${productType}\n\nDescription: ${description}`,
  })

  // Agent loop — DeepSeek can call search_web before writing the final prompt
  const MAX_TURNS = 3
  let raw = ""

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    let res: Response
    try {
      res = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-v4-pro",
          messages,
          tools: TOOLS,
          tool_choice: "auto",
        }),
        signal: AbortSignal.timeout(25_000),
      })
    } catch (err) {
      console.error("DeepSeek fetch failed:", err)
      return Response.json({ error: "Failed to reach upstream API" }, { status: 502 })
    }

    if (!res.ok) {
      const text = await res.text()
      console.error("DeepSeek error:", res.status, text)
      return Response.json({ error: "Upstream API error" }, { status: 502 })
    }

    const data = (await res.json()) as DeepSeekResponse
    const choice = data.choices[0]

    if (choice.finish_reason === "tool_calls" && choice.message.tool_calls?.length) {
      // Add assistant message with tool calls to history
      messages.push(choice.message)

      // Execute each tool call
      for (const toolCall of choice.message.tool_calls) {
        let result: string
        if (toolCall.function.name === "search_web") {
          try {
            const args = JSON.parse(toolCall.function.arguments) as { query: string }
            console.log("Searching:", args.query)
            result = await searchWeb(args.query)
          } catch (err) {
            console.error("search_web failed:", err)
            result = "Search failed, proceed without this information."
          }
        } else {
          result = "Unknown tool."
        }

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: result,
        })
      }
      // Continue loop so DeepSeek can use the search results
    } else {
      // Final answer
      raw = choice.message.content ?? ""
      break
    }
  }

  const { imagePrompt } = parseOutput(raw)
  return Response.json({ imagePrompt })
}
