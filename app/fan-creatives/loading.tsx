const SKELETON_COUNT = 6

export default function Loading() {
  return (
    <main className="bg-black min-h-screen px-6 md:px-10 py-16 md:py-24 max-w-7xl mx-auto">
      <section>
        <div className="h-10 w-48 bg-neutral-800 rounded animate-pulse mb-8 md:mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i}>
              <div className="aspect-square bg-neutral-900 rounded animate-pulse" />
              <div className="mt-3 h-4 w-32 bg-neutral-800 rounded animate-pulse" />
              <div className="mt-1 h-3 w-16 bg-neutral-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
