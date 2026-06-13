import SectionHeader from '@/components/ui/SectionHeader'

interface ProfileFact {
  label: string
  value: string
}

interface Unit {
  name: string
  description: string
  url: string
}

const LAST_UPDATED = 'june 2026'

const BIO =
  'nishimura riki, known by his stage name ni-ki, is a japanese main dancer and vocalist. he is a member of enhypen, a south korean-japanese boy group formed through the 2020 mnet survival program i-land, managed by belift lab under hybe. a trained street dancer from okayama, japan, ni-ki is recognised for his sharp, high-energy performances and commanding stage presence.'

const PROFILE_FACTS: ProfileFact[] = [
  { label: 'full name', value: 'nishimura riki (西村 力)' },
  { label: 'stage name', value: 'ni-ki' },
  { label: 'birthday', value: 'december 9, 2005' },
  { label: 'birthplace', value: 'okayama, japan' },
  { label: 'height', value: '~180 cm' },
  { label: 'nationality', value: 'japanese' },
  { label: 'position', value: 'main dancer · vocalist' },
  { label: 'group', value: 'enhypen' },
  { label: 'label', value: 'belift lab / hybe' },
  { label: 'debut', value: 'november 30, 2020' },
]

const UNITS: Unit[] = [
  {
    name: 'enhypen',
    description:
      'south korean-japanese boy group under belift lab / hybe. debuted november 30, 2020. members: jungwon, heeseung, jay, jake, sunghoon, sunoo, ni-ki.',
    url: 'https://weverse.io/enhypen',
  },
]

export default function ProfilePage() {
  return (
    <main className="bg-black min-h-screen px-6 md:px-10 py-16 md:py-24 max-w-7xl mx-auto">
      <SectionHeader title="profile" lastUpdated={LAST_UPDATED} />

      <section className="max-w-2xl">
        <p className="text-[15px] leading-snug text-white/90">{BIO}</p>
      </section>

      <section className="mt-12 md:mt-16 max-w-2xl">
        <h2 className="text-xl font-medium tracking-tight mb-6">facts</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
          {PROFILE_FACTS.map(({ label, value }) => (
            <div key={label} className="flex flex-col border-b border-white/10 py-4">
              <dt className="text-xs text-neutral-400">{label}</dt>
              <dd className="text-base font-medium text-white mt-0.5">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12 md:mt-16 max-w-2xl">
        <h2 className="text-xl font-medium tracking-tight mb-6">units</h2>
        <div className="space-y-0">
          {UNITS.map((unit) => (
            <div key={unit.name} className="border-b border-white/10 py-4">
              <p className="text-base font-medium text-white">{unit.name}</p>
              <p className="text-[15px] leading-snug text-white/70 mt-1">{unit.description}</p>
              <a
                href={unit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/50 hover:text-white transition-colors mt-2 inline-block"
              >
                weverse →
              </a>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-16 text-xs text-neutral-500 max-w-2xl">
        information sourced from official hybe / belift lab channels, weverse, and public records.
      </p>
    </main>
  )
}
