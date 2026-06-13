const FACT_COUNT = 10

export default function Loading() {
  return (
    <main className="bg-black min-h-screen px-6 md:px-10 py-16 md:py-24 max-w-7xl mx-auto">
      <div className="h-10 w-32 bg-neutral-800 rounded animate-pulse mb-2" />
      <div className="h-3 w-24 bg-neutral-800 rounded animate-pulse mb-10" />

      <div className="max-w-2xl space-y-2 mb-16">
        <div className="h-4 w-full bg-neutral-800 rounded animate-pulse" />
        <div className="h-4 w-full bg-neutral-800 rounded animate-pulse" />
        <div className="h-4 w-full bg-neutral-800 rounded animate-pulse" />
        <div className="h-4 w-3/5 bg-neutral-800 rounded animate-pulse" />
      </div>

      <div className="h-5 w-12 bg-neutral-800 rounded animate-pulse mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 max-w-2xl">
        {Array.from({ length: FACT_COUNT }).map((_, i) => (
          <div key={i} className="border-b border-white/10 py-4">
            <div className="h-3 w-20 bg-neutral-800 rounded animate-pulse mb-1.5" />
            <div className="h-5 w-36 bg-neutral-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </main>
  )
}
