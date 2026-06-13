const SKELETON_COUNT = 5

export default function Loading() {
  return (
    <main className="bg-black min-h-screen px-6 md:px-10 py-16 md:py-24 max-w-7xl mx-auto">
      <div className="h-10 w-36 bg-neutral-800 rounded animate-pulse mb-2" />
      <div className="h-3 w-24 bg-neutral-800 rounded animate-pulse mb-10" />

      <ol className="max-w-2xl">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <li key={i} className="relative pl-8 pb-10 border-l border-white/10">
            <div className="absolute left-[-5px] top-[5px] h-2.5 w-2.5 rounded-full bg-neutral-800" />
            <div className="h-3 w-24 bg-neutral-800 rounded animate-pulse mb-2" />
            <div className="h-5 w-56 bg-neutral-800 rounded animate-pulse mb-2" />
            <div className="h-4 w-full bg-neutral-800 rounded animate-pulse" />
            <div className="h-4 w-4/5 bg-neutral-800 rounded animate-pulse mt-1" />
          </li>
        ))}
      </ol>
    </main>
  )
}
