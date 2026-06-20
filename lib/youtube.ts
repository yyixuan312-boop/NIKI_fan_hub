export interface YouTubeVideoMeta {
  youtubeId: string
  title: string
  channelName: string
  date: string        // YYYY-MM-DD
  durationLabel: string  // "m:ss"
  thumbnailUrl: string
}

function parseDuration(iso: string): string {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return "0:00"
  const h = parseInt(m[1] ?? "0")
  const min = parseInt(m[2] ?? "0")
  const sec = parseInt(m[3] ?? "0")
  const totalMin = h * 60 + min
  return `${totalMin}:${String(sec).padStart(2, "0")}`
}

export function extractVideoId(urlOrId: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/,
    /^([A-Za-z0-9_-]{11})$/,
  ]
  for (const pattern of patterns) {
    const m = urlOrId.match(pattern)
    if (m) return m[1]
  }
  return null
}

export async function fetchVideoMeta(videoId: string): Promise<YouTubeVideoMeta> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) throw new Error("YOUTUBE_API_KEY not configured")

  const url = new URL("https://www.googleapis.com/youtube/v3/videos")
  url.searchParams.set("id", videoId)
  url.searchParams.set("part", "snippet,contentDetails")
  url.searchParams.set("key", apiKey)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`YouTube API error ${res.status}`)

  const data = await res.json() as {
    items: Array<{
      snippet: {
        title: string
        channelTitle: string
        publishedAt: string
        thumbnails: { maxres?: { url: string }; high?: { url: string } }
      }
      contentDetails: { duration: string }
    }>
  }

  const item = data.items[0]
  if (!item) throw new Error(`Video ${videoId} not found`)

  return {
    youtubeId: videoId,
    title: item.snippet.title,
    channelName: item.snippet.channelTitle,
    date: item.snippet.publishedAt.slice(0, 10),
    durationLabel: parseDuration(item.contentDetails.duration),
    thumbnailUrl: item.snippet.thumbnails.maxres?.url ?? item.snippet.thumbnails.high?.url ?? "",
  }
}
