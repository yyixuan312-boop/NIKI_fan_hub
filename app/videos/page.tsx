import type { Video } from '@/lib/types'
import videosData from '@/data/videos.json'
import VideoCard from '@/components/cards/VideoCard'
import SectionHeader from '@/components/ui/SectionHeader'

const videos = videosData as Video[]

export default function VideosPage() {
  return (
    <main className="bg-black min-h-screen px-6 md:px-10 py-16 md:py-24 max-w-7xl mx-auto">
      <SectionHeader title="videos" />

      {videos.length === 0 ? (
        <p className="text-neutral-500 text-sm text-center py-16">
          nothing here yet — check back soon
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </main>
  )
}
