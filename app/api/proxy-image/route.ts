export const maxDuration = 30

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url || !url.startsWith("https://")) {
    return new Response("Invalid URL", { status: 400 })
  }

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(25_000) })
    if (!res.ok) return new Response("Upstream error", { status: 502 })

    const contentType = res.headers.get("content-type") ?? "image/png"
    const buffer = await res.arrayBuffer()
    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch (err) {
    console.error("Proxy image error:", err)
    return new Response("Failed to fetch image", { status: 502 })
  }
}
