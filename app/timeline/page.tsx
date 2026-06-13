import type { TimelineEvent } from '@/lib/types'
import timelineData from '@/data/timeline.json'
import SectionHeader from '@/components/ui/SectionHeader'

const events = timelineData as TimelineEvent[]
const LAST_UPDATED = 'june 2026'

export default function TimelinePage() {
  return (
    <main className="bg-black min-h-screen px-6 md:px-10 py-16 md:py-24 max-w-7xl mx-auto">
      <SectionHeader title="timeline" lastUpdated={LAST_UPDATED} />

      {events.length === 0 ? (
        <p className="text-neutral-500 text-sm text-center py-16">
          nothing here yet — check back soon
        </p>
      ) : (
        <ol className="max-w-2xl">
          {events.map((event) => (
            <li
              key={event.id}
              className="relative pl-8 pb-10 border-l border-white/20 last:border-l-transparent last:pb-0"
            >
              <span className="absolute left-[-5px] top-[5px] h-2.5 w-2.5 rounded-full bg-white/40 ring-2 ring-black" />
              <p className="text-xs text-neutral-400 mb-1">{event.date}</p>
              <p className="text-base font-medium text-white">{event.title}</p>
              <p className="text-[15px] leading-snug text-white/70 mt-1">{event.description}</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-xs text-neutral-400">{event.category}</span>
                {event.sourceUrl && (
                  <a
                    href={event.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white/50 hover:text-white transition-colors"
                  >
                    source →
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </main>
  )
}
