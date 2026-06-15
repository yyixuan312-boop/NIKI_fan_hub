import { routeIntent } from "@/lib/agent/intentRouter"
import { buildPrompt } from "@/lib/agent/promptBuilder"

interface DeepSeekMessage {
  role: "assistant" | "user" | "system"
  content: string
}

interface DeepSeekResponse {
  choices: Array<{ message: DeepSeekMessage }>
}

function parseOutput(raw: string): { designBrief: string; imagePrompt: string } {
  const briefMatch = raw.match(/###\s*Design Brief\s*\n([\s\S]*?)(?=###\s*Image Generation Prompt|$)/)
  const promptMatch = raw.match(/###\s*Image Generation Prompt\s*\n([\s\S]*)/)

  return {
    designBrief: briefMatch?.[1]?.trim() ?? raw.trim(),
    imagePrompt: promptMatch?.[1]?.trim() ?? "",
  }
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 })
  }

  let input: string
  try {
    const body = await request.json() as { input?: unknown }
    if (typeof body.input !== "string" || body.input.trim() === "") {
      return Response.json({ error: "Missing or invalid input" }, { status: 400 })
    }
    input = body.input.trim()
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }

  const intent = routeIntent(input)
  const prompt = buildPrompt(intent, input)

  let raw: string
  try {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
      }),
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

  const { designBrief, imagePrompt } = parseOutput(raw)
  return Response.json({ designBrief, imagePrompt })
}
