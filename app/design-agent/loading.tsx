export default function Loading() {
  return (
    <main className="min-h-screen bg-black px-6 md:px-10 pt-28 pb-16">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="animate-pulse bg-neutral-800 rounded h-9 w-52" />
        <div className="animate-pulse bg-neutral-800 rounded h-4 w-80 max-w-full" />
        <div className="pt-6 animate-pulse bg-neutral-800 rounded-full h-12" />
        <div className="grid md:grid-cols-2 gap-6 pt-8">
          <div className="animate-pulse bg-neutral-900 rounded h-48" />
          <div className="animate-pulse bg-neutral-900 rounded h-48" />
        </div>
      </div>
    </main>
  )
}
