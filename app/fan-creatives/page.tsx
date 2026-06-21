import type { FanCreative } from '@/lib/types'
import fanCreativesData from '@/data/fan-creatives.json'
import SectionHeader from '@/components/ui/SectionHeader'
import GroupOrderCard from '@/components/cards/GroupOrderCard'
import AddCreativePanel from '@/components/fan-creatives/AddCreativePanel'
import FanCreativesGrid from '@/components/fan-creatives/FanCreativesGrid'

const creatives = fanCreativesData as FanCreative[]

const FAN_ART_TYPES: FanCreative['type'][] = ['solo', 'ship', 'group']
const DOLL_TYPES: FanCreative['type'][] = ['doll']
const GROUP_ORDER_TYPES: FanCreative['type'][] = ['group-order']

export default function FanCreativesPage() {
  const fanArt = creatives.filter((c) => FAN_ART_TYPES.includes(c.type))
  const dolls = creatives.filter((c) => DOLL_TYPES.includes(c.type))
  const groupOrders = creatives.filter((c) => GROUP_ORDER_TYPES.includes(c.type))

  return (
    <main className="bg-black min-h-screen px-6 md:px-10 py-16 md:py-24 max-w-7xl mx-auto">
      <AddCreativePanel />

      <section>
        <SectionHeader title="fan art" />
        <FanCreativesGrid creatives={fanArt} />
      </section>

      <section className="mt-16 md:mt-24">
        <SectionHeader title="dolls" />
        {dolls.length === 0 ? (
          <p className="text-neutral-500 text-sm text-center py-16">nothing here yet — check back soon</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {dolls.map((c) => <GroupOrderCard key={c.id} creative={c} />)}
          </div>
        )}
      </section>

      <section className="mt-16 md:mt-24">
        <SectionHeader title="group orders" />
        {groupOrders.length === 0 ? (
          <p className="text-neutral-500 text-sm text-center py-16">nothing here yet — check back soon</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {groupOrders.map((c) => <GroupOrderCard key={c.id} creative={c} />)}
          </div>
        )}
      </section>
    </main>
  )
}
