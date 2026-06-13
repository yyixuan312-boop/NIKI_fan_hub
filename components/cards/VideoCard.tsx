'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Video } from '@/lib/types'
import { getYoutubeThumbnail } from '@/lib/utils'

const TRANSPARENT_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

interface Props {
  video: Video
}

export default function VideoCard({ video }: Props) {
  const [imgSrc, setImgSrc] = useState(getYoutubeThumbnail(video.youtubeId))

  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="relative aspect-video overflow-hidden rounded bg-neutral-900">
        <Image
          src={imgSrc}
          alt={video.title}
          width={480}
          height={270}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-200"
          onError={() => setImgSrc(TRANSPARENT_PIXEL)}
        />
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-base font-medium text-white line-clamp-2">{video.title}</p>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-white/70 truncate">
            {video.channelName} · {video.date} · {video.durationLabel}
          </p>
          <span className="shrink-0 text-xs px-2 py-0.5 rounded-full border border-white/30 text-white/70">
            {video.category}
          </span>
        </div>
      </div>
    </a>
  )
}
