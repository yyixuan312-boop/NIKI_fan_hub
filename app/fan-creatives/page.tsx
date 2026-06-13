import type { FanCreative } from '@/lib/types'
import fanCreativesData from '@/data/fan-creatives.json'
import FanArtCard from '@/components/cards/FanArtCard'
import GroupOrderCard from '@/components/cards/GroupOrderCard'
import SectionHeader from '@/components/ui/SectionHeader'

const creatives = fanCreativesData as FanCreative[]

const FAN_ART_TYPES: FanCreative['type'][] = ['digital', 'traditional', '3d', 'acrylic']
const GROUP_ORDER_TYPES: FanCreative['type'][] = ['doll', 'group-order']

export default function FanCreativesPage() {
  const fanArt = creatives.filter((c) => FAN_ART_TYPES.includes(c.type))
  const groupOrders = creatives.filter((c) => GROUP_ORDER_TYPES.includes(c.type))

  return (
    <main className="bg-black min-h-screen px-6 md:px-10 py-16 md:py-24 max-w-7xl mx-auto">
      <section>
        <SectionHeader title="fan art" />
        {fanArt.length === 0 ? (
          <p className="text-neutral-500 text-sm text-center py-16">
            nothing here yet — check back soon
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {fanArt.map((creative) => (
              <FanArtCard key={creative.id} creative={creative} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-16 md:mt-24">
        <SectionHeader title="group orders & dolls" />
        {groupOrders.length === 0 ? (
          <p className="text-neutral-500 text-sm text-center py-16">
            nothing here yet — check back soon
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {groupOrders.map((creative) => (
              <GroupOrderCard key={creative.id} creative={creative} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
