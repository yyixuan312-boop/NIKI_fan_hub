'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { GalleryItem } from '@/lib/types'

const TRANSPARENT_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

interface Props {
  items: GalleryItem[]
}

function GalleryCard({ item }: { item: GalleryItem }) {
  const [imgSrc, setImgSrc] = useState(item.src)

  return (
    <a
      href={item.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded bg-neutral-900">
        <Image
          src={imgSrc}
          alt={item.alt}
          width={600}
          height={450}
          unoptimized
          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-200"
          onError={() => setImgSrc(TRANSPARENT_PIXEL)}
        />
      </div>
      <div className="mt-2">
        <p className="text-xs text-white/70">{item.credit}</p>
        <p className="text-xs text-neutral-400 mt-0.5">
          {item.date} · {item.category}
        </p>
      </div>
    </a>
  )
}

export default function GalleryGrid({ items }: Props) {
  if (items.length === 0) {
    return (
      <p className="text-neutral-500 text-sm text-center py-16">
        nothing here yet — check back soon
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
      {items.map((item) => (
        <GalleryCard key={item.id} item={item} />
      ))}
    </div>
  )
}
