interface TavilyResult {
  title: string
  url: string
  content: string
}

interface TavilyResponse {
  results: TavilyResult[]
}

export async function searchWeb(query: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) throw new Error("TAVILY_API_KEY not configured")

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      max_results: 4,
      search_depth: "basic",
    }),
    signal: AbortSignal.timeout(15_000),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    console.error("Tavily error:", res.status, text)
    throw new Error(`Tavily API error ${res.status}`)
  }

  const data = (await res.json()) as TavilyResponse
  return data.results
    .map((r) => `[${r.title}]\n${r.content}`)
    .join("\n\n---\n\n")
}
