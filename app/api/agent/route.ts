import { buildSystemPrompt } from "@/lib/agent/promptBuilder"

export const maxDuration = 30

interface ClientMessage {
  role: "user" | "assistant"
  content: string
}

interface DeepSeekMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface DeepSeekResponse {
  choices: Array<{ message: { role: string; content: string } }>
}

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
    const body = await request.json() as Record<string, unknown>

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

  const userMessageText = `Product type: ${productType}\n\nDescription: ${description}`
  const systemPrompt = buildSystemPrompt(productType)

  const deepSeekMessages: DeepSeekMessage[] = [{ role: "system", content: systemPrompt }]

  for (const msg of history) {
    deepSeekMessages.push({ role: msg.role, content: msg.content })
  }

  deepSeekMessages.push({ role: "user", content: userMessageText })

  let raw: string
  try {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: "deepseek-v4-pro", messages: deepSeekMessages }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error("DeepSeek error:", res.status, text)
      return Response.json({ error: "Upstream API error" }, { status: 502 })
    }

    const data = (await res.json()) as DeepSeekResponse
    raw = data.choices[0]?.message?.content ?? ""
  } catch (err) {
    console.error("DeepSeek fetch failed:", err)
    return Response.json({ error: "Failed to reach upstream API" }, { status: 502 })
  }

  const { imagePrompt } = parseOutput(raw)
  return Response.json({ imagePrompt })
}
