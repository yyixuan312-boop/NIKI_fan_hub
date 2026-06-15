'use client'

import { useState } from 'react'

interface AgentResult {
  designBrief: string
  imagePrompt: string
}

export default function DesignAgentPage() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AgentResult | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      })

      if (!res.ok) throw new Error('request failed')

      const data = (await res.json()) as AgentResult
      setResult(data)
    } catch {
      setError('something went wrong — try again')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!result?.imagePrompt) return
    await navigator.clipboard.writeText(result.imagePrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-10 pt-28 pb-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-2">design agent</h1>
        <p className="text-[15px] leading-snug text-white/70 mb-10">
          describe a fan creative concept — badge, doll, or artwork — and get a design brief + image prompt.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-3 mb-12">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="describe what you want..."
            className="flex-1 bg-neutral-900 text-white text-sm placeholder:text-neutral-500 rounded-full px-6 py-3 outline-none border border-neutral-800 focus:border-white/30 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-white text-black text-sm font-normal rounded-full px-6 py-3 hover:bg-neutral-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            generate
          </button>
        </form>

        {error && (
          <p className="text-white/60 text-sm mb-8">{error}</p>
        )}

        {loading && (
          <div className="animate-pulse space-y-6">
            <p className="text-neutral-500 text-sm">thinking...</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-neutral-900 rounded h-48" />
              <div className="bg-neutral-900 rounded h-48" />
            </div>
          </div>
        )}

        {result && !loading && (
          <div className="grid md:grid-cols-2 gap-6">
            <section>
              <h2 className="text-base font-medium mb-3">design brief</h2>
              <div className="text-[15px] leading-snug text-white/80 whitespace-pre-wrap">
                {result.designBrief}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-medium">image prompt</h2>
                <button
                  onClick={handleCopy}
                  className="text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  {copied ? 'copied' : 'copy'}
                </button>
              </div>
              <pre className="bg-neutral-900 text-[13px] text-white/80 rounded p-4 overflow-x-auto whitespace-pre-wrap break-words">
                <code>{result.imagePrompt}</code>
              </pre>
            </section>
          </div>
        )}
      </div>
    </main>
  )
}
