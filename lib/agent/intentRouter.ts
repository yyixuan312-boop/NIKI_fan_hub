import type { AgentIntent } from "@/lib/types"

const BADGE_KEYWORDS = ["badge", "吧唧", "pin", "button badge", "acrylic badge"]
const DOLL_KEYWORDS = ["doll", "棉花娃娃", "cotton doll", "plush", "soft toy", "mochi"]
const STYLE_KEYWORDS = ["change", "modify", "update", "redesign", "make it", "alter", "adjust", "restyle"]

interface DeepSeekChoice {
  finish_reason: string
  message: {
    role: string
    content: string | null
  }
}

interface DeepSeekResponse {
  choices: DeepSeekChoice[]
}

export function routeIntent(input: string): AgentIntent {
  const lower = input.toLowerCase()

  if (BADGE_KEYWORDS.some((kw) => lower.includes(kw))) return "badge"
  if (DOLL_KEYWORDS.some((kw) => lower.includes(kw))) return "doll"
  if (STYLE_KEYWORDS.some((kw) => lower.includes(kw))) return "style-change"
  return "info"
}

export async function routeIntentWithDeepSeekFallback(input: string): Promise<AgentIntent> {
  const ruleIntent = routeIntent(input)
  if (ruleIntent !== "info") return ruleIntent

  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) return ruleIntent

  const prompt = `You are an intent classifier for a fan creative design assistant. Classify the user's request into exactly one of these labels: badge, doll, style-change, info. Respond with a single label only, no explanation.`

  try {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: `User request: "${input.trim()}"` },
        ],
        max_tokens: 10,
        temperature: 0,
      }),
      signal: AbortSignal.timeout(15_000),
    })

    if (!res.ok) return ruleIntent

    const data = (await res.json()) as DeepSeekResponse
    const answer = data.choices?.[0]?.message?.content?.trim().toLowerCase() ?? ""

    if (answer.includes("badge")) return "badge"
    if (answer.includes("doll")) return "doll"
    if (answer.includes("style")) return "style-change"
  } catch {
    // Silence fallback errors and preserve rule-based intent.
  }

  return "info"
}
