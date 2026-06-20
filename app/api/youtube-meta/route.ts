import { fetchVideoMeta, extractVideoId } from "@/lib/youtube"

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const input = searchParams.get("url")

  if (!input) {
    return Response.json({ error: "Missing url param" }, { status: 400 })
  }

  const videoId = extractVideoId(input)
  if (!videoId) {
    return Response.json({ error: "Could not extract YouTube video ID" }, { status: 400 })
  }

  try {
    const meta = await fetchVideoMeta(videoId)
    return Response.json(meta)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return Response.json({ error: message }, { status: 502 })
  }
}
