'use client'

import { useState } from 'react'
import type { Video } from '@/lib/types'
import VideoCard from '@/components/cards/VideoCard'

interface Props {
  videos: Video[]
}

export default function VideoGrid({ videos }: Props) {
  const categories = ['All', ...Array.from(new Set(videos.map((v) => v.category)))]
  const [active, setActive] = useState('All')

  const filtered = active === 'All' ? videos : videos.filter((v) => v.category === active)

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`text-xs px-4 py-1.5 rounded-full border transition-colors duration-150 ${
              active === cat
                ? 'border-white text-black bg-white'
                : 'border-white/30 text-white/60 hover:border-white/60 hover:text-white/90'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-neutral-500 text-sm text-center py-16">nothing here yet — check back soon</p>
      ) : (
        <div className="grid gap-4 md:gap-6 justify-start [grid-template-columns:repeat(auto-fill,minmax(280px,340px))]">
          {filtered.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </>
  )
}
