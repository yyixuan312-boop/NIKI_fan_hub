'use client'

import { useState } from 'react'
import type { FanCreative } from '@/lib/types'
import FanArtCard from '@/components/cards/FanArtCard'

const TABS: Array<FanCreative['type'] | 'all'> = ['all', 'solo', 'ship', 'group']

interface Props {
  creatives: FanCreative[]
}

export default function FanCreativesGrid({ creatives }: Props) {
  const [active, setActive] = useState<FanCreative['type'] | 'all'>('all')

  const filtered = active === 'all' ? creatives : creatives.filter((c) => c.type === active)

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`text-xs px-4 py-1.5 rounded-full border transition-colors duration-150 ${
              active === tab
                ? 'border-white text-black bg-white'
                : 'border-white/30 text-white/60 hover:border-white/60 hover:text-white/90'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-neutral-500 text-sm text-center py-16">nothing here yet — check back soon</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filtered.map((creative) => (
            <FanArtCard key={creative.id} creative={creative} />
          ))}
        </div>
      )}
    </>
  )
}
