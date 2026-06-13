'use client'

export default function Error({
  error: _error,
  reset: _reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <main className="bg-black min-h-screen flex flex-col items-center justify-center gap-1">
      <p className="text-white/60 text-sm">something went wrong</p>
      <p className="text-white/60 text-sm">try refreshing the page</p>
    </main>
  )
}
