interface GenerateImageOptions {
  prompt: string
  referenceImageUrl?: string
  size?: string
}

export async function generateImage({
  prompt,
  referenceImageUrl,
  size = "1024x1024",
}: GenerateImageOptions): Promise<string> {
  const apiKey = process.env.AGNES_API_KEY
  if (!apiKey) throw new Error("AGNES_API_KEY not configured")

  const extraBody: Record<string, unknown> = { response_format: "url" }
  if (referenceImageUrl) {
    extraBody.image = [referenceImageUrl]
  }

  const body = {
    model: "agnes-image-2.1-flash",
    prompt,
    size,
    extra_body: extraBody,
  }

  const res = await fetch("https://apihub.agnes-ai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(50_000),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    console.error("Agnes image gen error:", res.status, text)
    throw new Error(`Agnes API error ${res.status}`)
  }

  const data = (await res.json()) as { data: Array<{ url: string }> }
  const url = data.data?.[0]?.url
  if (!url) throw new Error("No image URL in Agnes response")
  return url
}
