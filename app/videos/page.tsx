import type { Video } from '@/lib/types'
import videosData from '@/data/videos.json'
import SectionHeader from '@/components/ui/SectionHeader'
import VideoGrid from '@/components/videos/VideoGrid'

const videos = videosData as Video[]

export default function VideosPage() {
  return (
    <main className="bg-black min-h-screen px-6 md:px-10 py-16 md:py-24">
      <SectionHeader title="videos" />
      <VideoGrid videos={videos} />
    </main>
  )
}
