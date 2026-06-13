'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { FanCreative } from '@/lib/types'
import PlatformBadge from '@/components/ui/PlatformBadge'

const TRANSPARENT_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

interface Props {
  creative: FanCreative
}

export default function FanArtCard({ creative }: Props) {
  const [imgSrc, setImgSrc] = useState(creative.thumbnail)

  return (
    <a
      href={creative.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block hover:scale-[1.02] transition-transform duration-200"
    >
      <div className="relative aspect-square overflow-hidden rounded bg-neutral-900">
        <Image
          src={imgSrc}
          alt={`fan art by ${creative.artist}`}
          width={400}
          height={400}
          className="w-full h-full object-cover"
          onError={() => setImgSrc(TRANSPARENT_PIXEL)}
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-base font-medium text-white truncate">{creative.artist}</span>
        <PlatformBadge platform={creative.platform} />
      </div>
      <p className="text-xs text-white/70 mt-1">{creative.date}</p>
    </a>
  )
}
