'use client'

import Image from 'next/image'
import { useState, useRef } from 'react'

const PRODUCT_TYPES = ['badge', 'doll', 'cartoon', 'sticker', 'other'] as const
type ProductType = (typeof PRODUCT_TYPES)[number]

interface AgentResult {
  designBrief: string
  imagePrompt: string
}

interface Turn {
  productType: string
  description: string
  userImage?: string
  result: AgentResult
}

interface ApiMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function DesignAgentPage() {
  const [productType, setProductType] = useState<ProductType>('badge')
  const [customType, setCustomType] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<Turn[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const effectiveProductType =
    productType === 'other' ? customType.trim() || 'other' : productType
  const canSubmit =
    description.trim().length > 0 && (productType !== 'other' || customType.trim().length > 0)

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('only jpg and png files are supported')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('image must be under 5mb')
      return
    }

    const reader = new FileReader()
    reader.onload = () => setImage(reader.result as string)
    reader.readAsDataURL(file)
    setFileName(file.name)
    setError(null)
  }

  function clearImage() {
    setImage(null)
    setFileName(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  function handleNewDraft() {
    setHistory([])
    setProductType('badge')
    setCustomType('')
    setDescription('')
    setError(null)
    clearImage()
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!canSubmit || loading) return

    setLoading(true)
    setError(null)

    const messages: ApiMessage[] = history.flatMap((turn) => [
      {
        role: 'user',
        content: `Product type: ${turn.productType}\n\nDescription: ${turn.description}`,
      },
      {
        role: 'assistant',
        content: `### Design Brief\n${turn.result.designBrief}\n\n### Image Generation Prompt\n${turn.result.imagePrompt}`,
      },
    ])

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productType: effectiveProductType,
          description: description.trim(),
          messages,
          image: image ?? undefined,
        }),
      })

      if (!res.ok) {
        const errBody = await res.json().catch(() => null) as { error?: string } | null
        throw new Error(errBody?.error ?? `request failed (${res.status})`)
      }

      const data = (await res.json()) as AgentResult
      setHistory((prev) => [
        ...prev,
        {
          productType: effectiveProductType,
          description: description.trim(),
          userImage: image ?? undefined,
          result: data,
        },
      ])
      setDescription('')
      clearImage()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'something went wrong — try again')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy(text: string, id: string) {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-10 pt-28 pb-16">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-start justify-between mb-2">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight">design agent</h1>
          {history.length > 0 && (
            <button
              onClick={handleNewDraft}
              className="text-xs text-neutral-400 hover:text-white transition-colors mt-2 shrink-0"
            >
              new draft
            </button>
          )}
        </div>
        <p className="text-[15px] leading-snug text-white/70 mb-10">
          describe a fan creative concept and get a design brief + image generation prompt.
        </p>

        {/* Conversation history */}
        {history.length > 0 && (
          <div className="space-y-10 mb-12">
            {history.map((turn, i) => (
              <div key={i} className="space-y-6">
                <div className="space-y-2">
                  <span className="text-xs text-neutral-500">
                    you · {turn.productType}
                  </span>
                  {turn.userImage && (
                    <Image
                      src={turn.userImage}
                      alt="uploaded reference"
                      width={64}
                      height={64}
                      unoptimized
                      className="rounded object-cover block"
                    />
                  )}
                  <p className="text-[15px] text-white/70">{turn.description}</p>
                </div>

                <div className="h-px bg-white/10" />

                <div className="grid md:grid-cols-2 gap-6">
                  <section>
                    <h2 className="text-base font-medium mb-3">design brief</h2>
                    <div className="text-[15px] leading-snug text-white/80 whitespace-pre-wrap">
                      {turn.result.designBrief}
                    </div>
                  </section>
                  <section>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-base font-medium">image prompt</h2>
                      <button
                        onClick={() => handleCopy(turn.result.imagePrompt, String(i))}
                        className="text-xs text-neutral-400 hover:text-white transition-colors"
                      >
                        {copied === String(i) ? 'copied' : 'copy'}
                      </button>
                    </div>
                    <pre className="bg-neutral-900 text-[13px] text-white/80 rounded p-4 overflow-x-auto whitespace-pre-wrap break-words">
                      <code>{turn.result.imagePrompt}</code>
                    </pre>
                  </section>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* 1. Product type selector */}
          <div className="space-y-3">
            <p className="text-xs text-neutral-500">product type</p>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setProductType(type)}
                  className={
                    productType === type
                      ? 'bg-white text-black text-sm rounded-full px-4 py-1.5 transition-colors'
                      : 'border border-white/30 text-white/50 text-sm rounded-full px-4 py-1.5 hover:text-white/80 transition-colors'
                  }
                >
                  {type}
                </button>
              ))}
            </div>
            {productType === 'other' && (
              <input
                type="text"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder="specify product type..."
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2 text-white text-sm placeholder:text-neutral-500 outline-none focus:border-white/30 transition-colors"
              />
            )}
          </div>

          {/* 2. Description textarea */}
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="describe the vibe, colors, pose, outfit details..."
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-500 outline-none focus:border-white/30 transition-colors resize-none"
          />

          {/* 3. Image upload */}
          <div className="space-y-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={handleFileSelect}
            />
            {image && fileName ? (
              <div className="flex items-center gap-3">
                <Image
                  src={image}
                  alt="upload preview"
                  width={48}
                  height={48}
                  unoptimized
                  className="rounded object-cover shrink-0"
                />
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs text-white/80 truncate">{fileName}</span>
                  <button
                    type="button"
                    onClick={clearImage}
                    className="text-xs text-neutral-500 hover:text-white transition-colors text-left"
                  >
                    remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 border border-white/20 text-white/50 hover:text-white hover:border-white/40 text-xs rounded-full px-4 py-1.5 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                upload reference image (optional)
              </button>
            )}
          </div>

          {/* 4. Submit */}
          <button
            type="submit"
            disabled={loading || !canSubmit}
            className="w-full md:w-auto bg-white text-black text-sm font-normal rounded-full px-8 py-3 hover:bg-neutral-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            generate
          </button>
        </form>

        {error && (
          <p className="text-white/60 text-sm mt-4">{error}</p>
        )}

        {loading && (
          <div className="animate-pulse space-y-6 mt-10">
            <p className="text-neutral-500 text-sm">thinking...</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-neutral-900 rounded h-48" />
              <div className="bg-neutral-900 rounded h-48" />
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
