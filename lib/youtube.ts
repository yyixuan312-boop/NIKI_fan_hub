import { unstable_cache } from 'next/cache'
import type { Video } from './types'

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

function inferVideoCategory(title: string, publishedAt: string): string {
  if (/cover|커버/i.test(title)) return 'Cover'
  if (/gayo|joint stage|weverse con|위버스콘|concert/i.test(title)) return 'Joint Stage'
  if (/blood saga/i.test(title)) return '4th World Tour'
  const year = parseInt(publishedAt.slice(0, 4))
  return year <= 2024 ? '2nd Full Album' : 'mini 6'
}

async function _searchNikiVideos(): Promise<Video[]> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) return []

  const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search')
  searchUrl.searchParams.set('q', 'ENHYPEN NIKI 니키 직캠 fancam')
  searchUrl.searchParams.set('type', 'video')
  searchUrl.searchParams.set('order', 'date')
  searchUrl.searchParams.set('maxResults', '20')
  searchUrl.searchParams.set('part', 'snippet')
  searchUrl.searchParams.set('key', apiKey)

  const searchRes = await fetch(searchUrl.toString())
  if (!searchRes.ok) return []

  const searchData = await searchRes.json() as {
    items?: Array<{ id: { videoId: string } }>
  }
  if (!searchData.items?.length) return []

  const ids = searchData.items.map(i => i.id.videoId).join(',')
  const detailUrl = new URL('https://www.googleapis.com/youtube/v3/videos')
  detailUrl.searchParams.set('id', ids)
  detailUrl.searchParams.set('part', 'snippet,contentDetails')
  detailUrl.searchParams.set('key', apiKey)

  const detailRes = await fetch(detailUrl.toString())
  if (!detailRes.ok) return []

  const detailData = await detailRes.json() as {
    items?: Array<{
      id: string
      snippet: {
        title: string
        channelTitle: string
        publishedAt: string
        thumbnails: {
          maxres?: { url: string }
          high?: { url: string }
          medium?: { url: string }
        }
      }
      contentDetails: { duration: string }
    }>
  }

  return (detailData.items ?? []).map(item => ({
    id: `yt-${item.id}`,
    title: item.snippet.title,
    youtubeId: item.id,
    thumbnail: item.snippet.thumbnails.maxres?.url
      ?? item.snippet.thumbnails.high?.url
      ?? item.snippet.thumbnails.medium?.url,
    category: inferVideoCategory(item.snippet.title, item.snippet.publishedAt),
    channelName: item.snippet.channelTitle,
    date: item.snippet.publishedAt.slice(0, 10),
    durationLabel: parseDuration(item.contentDetails.duration),
  }))
}

export const searchNikiVideos = unstable_cache(
  _searchNikiVideos,
  ['niki-youtube-search'],
  { revalidate: 86400, tags: ['youtube-videos'] }
)
