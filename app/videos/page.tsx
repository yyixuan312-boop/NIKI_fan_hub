import type { Video } from '@/lib/types'
import videosData from '@/data/videos.json'
import SectionHeader from '@/components/ui/SectionHeader'
import VideoGrid from '@/components/videos/VideoGrid'
import { searchNikiVideos } from '@/lib/youtube'

const staticVideos = videosData as Video[]
// Extract clean 11-char IDs (static entries have &list=... suffix)
const STATIC_IDS = new Set(staticVideos.map(v => v.youtubeId.split('&')[0]))

export default async function VideosPage() {
  let combined = staticVideos

  try {
    const ytVideos = await searchNikiVideos()
    const newOnly = ytVideos.filter(v => !STATIC_IDS.has(v.youtubeId))
    if (newOnly.length > 0) {
      combined = [...staticVideos, ...newOnly]
    }
  } catch {
    // YouTube API unavailable (e.g. local dev in China) — show static list
  }

  return (
    <main className="bg-black min-h-screen px-6 md:px-10 py-16 md:py-24">
      <SectionHeader title="videos" />
      <VideoGrid videos={combined} />
    </main>
  )
}
