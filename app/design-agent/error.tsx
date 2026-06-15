'use client'

export default function Error() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-1">
        <p className="text-white/60 text-sm">something went wrong</p>
        <p className="text-white/60 text-sm">try refreshing the page</p>
      </div>
    </main>
  )
}
