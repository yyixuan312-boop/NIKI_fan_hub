'use client'

import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import looks from '@/data/riki-looks.json'

interface Look {
  id: string
  era: string
  label: string
  thumbnail: string
  hairColor: string
  hairStyle: string
  outfit: string
  vibe: string
  date?: string  // "YYYY-MM" — used for year label when era has no year
}

const PRODUCT_TYPES = ['badge', 'doll', 'cartoon', 'sticker', 'other'] as const
type ProductType = (typeof PRODUCT_TYPES)[number]

interface AgentResult {
  imagePrompt: string
  imageUrl: string | null
}

interface Turn {
  productType: string
  description: string
  result: AgentResult
}

interface ApiMessage {
  role: 'user' | 'assistant'
  content: string
}

// ─── Layout constants for 8-card fan ─────────────────────────────────────────

// Rotations evenly spread across ±52°, step = 104/7 ≈ 14.86° rounded to 15°
const ROTATIONS = [-52, -37, -22, -7, 7, 22, 37, 52] as const
// Step = 96px (128 card width − 32px overlap). Span = 7×96 = 672px, centered.
const X_OFFSETS = [-336, -240, -144, -48, 48, 144, 240, 336] as const
// Center pair (indices 3,4) highest; outer cards flush with arc.
const Y_OFFSETS = [0, -8, -16, -24, -24, -16, -8, 0] as const
// Bell-curve z stacking, center pair at top.
const Z_BASE    = [1, 2, 3, 5, 5, 3, 2, 1] as const

// Arc SVG: 800×80. Endpoints at x=64 (=400−336) and x=736 (=400+336), y=60.
// Path: M 64 60 Q 400 10 736 60  — x is linear for this symmetric bezier.
// Dot x: 64 + 672*(i/7). Dot y: 60 − 100*t*(1−t).
// Cards pivot at bottom:20px (= SVG_H − arc-endpoint-y = 80−60).
const SVG_W = 800
const SVG_H = 80
const CARD_BOTTOM = 20

// ─── Arc Timeline ─────────────────────────────────────────────────────────────

function ArcTimeline({ looks, selectedLookId }: { looks: Look[]; selectedLookId: string | null }) {
  const n = looks.length
  const dots = looks.map((look, i) => {
    const t = i / (n - 1)
    const x = 64 + 672 * t
    const y = 60 - 100 * t * (1 - t)
    const year = look.date?.slice(0, 4) ?? look.era.match(/\d{4}/)?.[0] ?? ''
    return { x, y, year, isSelected: look.id === selectedLookId }
  })

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`}>
        {/* Faint verticals from dot down to card pivot line (y=60) */}
        {dots.map((dot, i) => (
          <line
            key={i}
            x1={dot.x} y1={dot.y}
            x2={dot.x} y2={60}
            stroke="white"
            strokeWidth="1"
            strokeOpacity="0.1"
          />
        ))}

        {/* Arc */}
        <path
          d="M 64 60 Q 400 10 736 60"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
          fill="none"
        />

        {/* Dots + year labels */}
        {dots.map((dot, i) => (
          <g key={i}>
            <motion.circle
              cx={dot.x}
              cy={dot.y}
              animate={{
                r:    dot.isSelected ? 4 : 2.5,
                fill: dot.isSelected ? '#ffffff' : 'rgba(255,255,255,0.3)',
              }}
              transition={{ duration: 0.3 }}
            />
            <text
              x={dot.x}
              y={dot.y + 14}
              textAnchor="middle"
              fontSize="10"
              fill="rgba(255,255,255,0.3)"
              style={{ fontFamily: 'inherit' }}
            >
              {dot.year}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

// ─── Fan Card ────────────────────────────────────────────────────────────────

interface FanCardProps {
  look: Look
  index: number
  isFlipped: boolean
  isSelected: boolean
  anyHovered: boolean
  onCardClick: () => void
  onUseLook: () => void
  onHoverStart: () => void
  onHoverEnd: () => void
}

function FanCard({
  look,
  index,
  isFlipped,
  isSelected,
  anyHovered,
  onCardClick,
  onUseLook,
  onHoverStart,
  onHoverEnd,
}: FanCardProps) {
  const [hovered, setHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const vibeTags = look.vibe.split(',').map((v) => v.trim())

  const zIndex = hovered ? 9999 : isFlipped ? 70 : Z_BASE[index]

  // After mount, drop the stagger delay so interactions are instant.
  const transition = !mounted
    ? { delay: index * 0.06, duration: 0.45, ease: 'easeOut' as const }
    : {
        duration: 0.25,
        ease: 'easeOut' as const,
        scale: { type: 'spring' as const, stiffness: 300, damping: 24 },
        y: { type: 'spring' as const, stiffness: 300, damping: 24 },
      }

  return (
    <motion.div
      style={{
        position: 'absolute',
        bottom: CARD_BOTTOM,
        left: `calc(50% + ${X_OFFSETS[index]}px - 4rem)`,
        width: '8rem',
        height: '12rem',
        transformOrigin: 'bottom center',
        zIndex,
        cursor: 'pointer',
      }}
      initial={{ rotate: 0, y: 0, scale: 1, opacity: 0, filter: 'grayscale(1)' }}
      animate={{
        rotate: ROTATIONS[index],
        y: Y_OFFSETS[index],
        scale: 1,
        opacity: isFlipped ? 1 : anyHovered ? 0.3 : 0.4,
        filter: isFlipped ? 'grayscale(0)' : 'grayscale(1)',
      }}
      transition={transition}
      whileHover={{ scale: 1.5, y: Y_OFFSETS[index] - 20, opacity: 1, filter: 'grayscale(0)' }}
      onClick={onCardClick}
      onHoverStart={() => { setHovered(true); onHoverStart() }}
      onHoverEnd={() => { setHovered(false); onHoverEnd() }}
    >
      {/* Perspective wrapper */}
      <div style={{ perspective: '800px', width: '100%', height: '100%' }}>
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            position: 'relative',
          }}
        >
          {/* Front face */}
          <div
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            className={`absolute inset-0 rounded-xl overflow-hidden border bg-neutral-900 ${
              isSelected ? 'border-white' : 'border-white/20'
            }`}
          >
            {/* Top 80%: photo anchored to top so heads aren't cropped */}
            <div className="relative" style={{ height: '80%' }}>
              <Image
                src={look.thumbnail}
                alt={look.label}
                fill
                unoptimized
                className="object-cover object-top"
              />
            </div>
            {/* Bottom 20%: era + look name */}
            <div className="bg-neutral-900 px-2 py-1.5" style={{ height: '20%' }}>
              <p className="text-xs text-white/50 truncate leading-tight">{look.era}</p>
              <p className="text-sm text-white truncate leading-tight">{look.label}</p>
            </div>
          </div>

          {/* Back face */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
            className="absolute inset-0 rounded-xl overflow-hidden border border-white bg-neutral-900 flex flex-col p-2.5"
          >
            <p className="text-[9px] text-white/50 leading-none">{look.era}</p>
            <p className="text-[11px] font-medium text-white mt-1 leading-tight">{look.label}</p>
            <p className="text-[9px] text-white/60 mt-1.5 leading-snug">
              {look.hairColor} · {look.hairStyle}
            </p>
            <p className="text-[9px] text-white/60 mt-1 leading-snug line-clamp-2">{look.outfit}</p>
            <div className="flex flex-wrap gap-0.5 mt-1.5">
              {vibeTags.map((tag) => (
                <span
                  key={tag}
                  className="text-[8px] px-1.5 py-0.5 rounded-full border border-white/30 text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onUseLook()
                }}
                className="w-full bg-white text-black text-[10px] rounded-full px-3 py-1 hover:bg-neutral-200 transition-colors"
              >
                use this look
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DesignAgentPage() {
  const [productType, setProductType] = useState<ProductType>('badge')
  const [customType, setCustomType] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<Turn[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  const [selectedLookId, setSelectedLookId] = useState<string | null>(null)
  const [flippedLookId, setFlippedLookId] = useState<string | null>(null)
  const [hoveredLookId, setHoveredLookId] = useState<string | null>(null)
  const latestResultRef = useRef<HTMLDivElement>(null)

  const selectedLook = (looks as Look[]).find((l) => l.id === selectedLookId) ?? null
  const lookContext = selectedLook
    ? `Reference look — era: ${selectedLook.era}, hair: ${selectedLook.hairColor} ${selectedLook.hairStyle}, outfit: ${selectedLook.outfit}, vibe: ${selectedLook.vibe}`
    : ''

  const effectiveProductType =
    productType === 'other' ? customType.trim() || 'other' : productType
  const canSubmit =
    description.trim().length > 0 && (productType !== 'other' || customType.trim().length > 0)

  function handleLookCardClick(lookId: string) {
    setFlippedLookId(prev => prev === lookId ? null : lookId)
  }

  function handleUseLook(lookId: string) {
    setSelectedLookId(lookId)
    setFlippedLookId(null)
  }

  function handleNewDraft() {
    setHistory([])
    setProductType('badge')
    setCustomType('')
    setDescription('')
    setError(null)
    setSelectedLookId(null)
    setFlippedLookId(null)
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
        content: `### Image Generation Prompt\n${turn.result.imagePrompt}`,
      },
    ])

    try {
      const referenceImageUrl = selectedLook
        ? `${window.location.origin}${selectedLook.thumbnail}`
        : undefined

      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(120_000),
        body: JSON.stringify({
          productType: effectiveProductType,
          description: [description.trim(), lookContext].filter(Boolean).join('\n\n'),
          messages,
          referenceImageUrl,
        }),
      })

      if (!res.ok) {
        const errBody = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(errBody?.error ?? `request failed (${res.status})`)
      }

      const data = (await res.json()) as AgentResult
      setHistory((prev) => [
        ...prev,
        {
          productType: effectiveProductType,
          description: description.trim(),
          result: data,
        },
      ])
      setDescription('')
      setTimeout(() => latestResultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
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
    <main className="min-h-screen bg-black text-white px-6 md:px-10 pt-20 pb-16">
      <div className="max-w-4xl mx-auto">

        <div className="mb-2">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight">design agent</h1>
        </div>
        <p className="text-[15px] leading-snug text-white/70 mb-10">
          describe a fan creative concept and get a design brief + image generation prompt.
        </p>

        {/* Fan card look selector */}
        <div className="mb-12">
          <p className="text-xs text-white/40 mb-4">select a look (optional)</p>
          <div className="relative w-full h-[340px]">
            <ArcTimeline
              looks={looks as Look[]}
              selectedLookId={selectedLookId}
            />
            {(looks as Look[]).map((look, index) => (
              <FanCard
                key={look.id}
                look={look}
                index={index}
                isFlipped={flippedLookId === look.id}
                isSelected={selectedLookId === look.id}
                anyHovered={hoveredLookId !== null}
                onCardClick={() => handleLookCardClick(look.id)}
                onUseLook={() => handleUseLook(look.id)}
                onHoverStart={() => setHoveredLookId(look.id)}
                onHoverEnd={() => setHoveredLookId(null)}
              />
            ))}
          </div>
        </div>

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
          <div className="space-y-2">
            {selectedLook && (
              <p className="text-xs text-white/40">reference look: {selectedLook.label}</p>
            )}
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="describe the vibe, colors, pose, outfit details..."
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-500 outline-none focus:border-white/30 transition-colors resize-none"
            />
          </div>

          {/* 3. Submit */}
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

        {(loading || history.length > 0) && (
          <div className="mt-10">
            {history.length > 0 && (
              <div className="mb-6">
                <button
                  onClick={handleNewDraft}
                  className="text-xs rounded-full px-4 py-1.5 bg-transparent border border-white/20 text-white/60 hover:text-white transition-colors"
                >
                  new version
                </button>
              </div>
            )}

            {loading ? (
              <div className="animate-pulse space-y-6">
                <p className="text-neutral-500 text-sm">thinking + generating image…</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-neutral-900 rounded h-48" />
                  <div className="bg-neutral-900 rounded h-48" />
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                {history.map((turn, i) => (
                  <div key={i} className="space-y-6" ref={i === history.length - 1 ? latestResultRef : undefined}>
                    <div className="space-y-2">
                      <span className="text-xs text-neutral-500">
                        you · {turn.productType}
                      </span>
                      <p className="text-[15px] text-white/70">{turn.description}</p>
                    </div>

                    <div className="h-px bg-white/10" />

                    <div className="grid md:grid-cols-2 gap-6">
                      <section>
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="text-base font-medium">image prompt</h2>
                          <button
                            onClick={() => handleCopy(turn.result.imagePrompt.replace(/\*\*/g, ''), String(i))}
                            className="text-xs text-neutral-400 hover:text-white transition-colors"
                          >
                            {copied === String(i) ? 'copied' : 'copy'}
                          </button>
                        </div>
                        <p className="bg-neutral-900 text-[13px] text-white/70 rounded p-4 leading-relaxed whitespace-pre-wrap break-words">
                          {turn.result.imagePrompt.split(/\*\*([^*]+)\*\*/g).map((part, j) =>
                            j % 2 === 1
                              ? <strong key={j} className="text-white font-semibold">{part}</strong>
                              : part
                          )}
                        </p>
                      </section>
                      <section>
                        {turn.result.imageUrl ? (
                          <img
                            src={turn.result.imageUrl}
                            alt="generated design"
                            className="w-full rounded-xl border border-white/10 object-cover"
                          />
                        ) : (
                          <div className="w-full aspect-square rounded-xl border border-white/10 bg-neutral-900 flex items-center justify-center">
                            <p className="text-xs text-white/30">image generation failed</p>
                          </div>
                        )}
                      </section>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  )
}
