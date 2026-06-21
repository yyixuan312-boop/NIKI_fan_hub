'use client'

import { useState, useEffect } from 'react'
import type { FanCreative } from '@/lib/types'

interface OGMeta {
  title: string
  imageUrl: string
  description: string
  platform: string
  finalUrl: string
}

const TYPES: FanCreative['type'][] = ['digital', 'traditional', '3d', 'acrylic', 'doll', 'group-order']
const PLATFORMS = ['Xiaohongshu', 'Twitter', 'Weibo', 'Instagram', 'Pixiv', 'Weidian', 'Carrd', 'Other']

const inputCls =
  'w-full bg-neutral-900 border border-white/15 rounded px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/40'
const selectCls =
  'w-full bg-neutral-900 border border-white/15 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40'
const labelCls = 'text-xs text-white/40 block mb-1'

export default function AddCreativePanel() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Activate once by running in browser console:
    //   localStorage.setItem('niki_admin', '1')
    // Deactivate: localStorage.removeItem('niki_admin')
    setIsAdmin(localStorage.getItem('niki_admin') === '1')
  }, [])

  if (!isAdmin) return null
  const [url, setUrl] = useState('')
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [meta, setMeta] = useState<OGMeta | null>(null)

  const [artist, setArtist] = useState('')
  const [type, setType] = useState<FanCreative['type']>('digital')
  const [platform, setPlatform] = useState('')
  const [tags, setTags] = useState('')
  const [orderStatus, setOrderStatus] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleFetch() {
    const trimmed = url.trim()
    if (!trimmed) return
    setFetching(true)
    setFetchError('')
    setMeta(null)
    try {
      const res = await fetch(`/api/og-meta?url=${encodeURIComponent(trimmed)}`)
      const data = (await res.json()) as OGMeta & { error?: string }
      if (data.error) {
        setFetchError(data.error)
      } else {
        setMeta(data)
        setPlatform(data.platform || 'Other')
      }
    } catch {
      setFetchError('Network error — check the URL and try again')
    } finally {
      setFetching(false)
    }
  }

  function buildEntry(): Record<string, unknown> {
    const id = `${artist.replace(/[@\s]/g, '').toLowerCase()}-${Date.now().toString(36)}`
    const entry: Record<string, unknown> = {
      id,
      type,
      artist,
      platform,
      url: url.trim(),
      thumbnail: meta?.imageUrl
        ? `/api/proxy-image?url=${encodeURIComponent(meta.imageUrl)}`
        : '',
      date: new Date().toISOString().slice(0, 7),
    }
    if (orderStatus) entry.orderStatus = orderStatus
    if (tags.trim()) entry.tags = tags.split(',').map((t) => t.trim()).filter(Boolean)
    return entry
  }

  async function handleCopy() {
    const json = JSON.stringify(buildEntry(), null, 2)
    await navigator.clipboard.writeText(json)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mb-8 text-xs text-white/40 hover:text-white/80 transition-colors border border-white/15 hover:border-white/40 px-4 py-2 rounded-full"
      >
        + add fan art
      </button>
    )
  }

  return (
    <div className="mb-12 border border-white/15 rounded-lg p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white/80">add fan art</span>
        <button
          onClick={() => { setOpen(false); setMeta(null); setFetchError('') }}
          className="text-white/40 hover:text-white text-xs transition-colors"
        >
          close ✕
        </button>
      </div>

      {/* URL input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
          placeholder="paste XHS / X / Weibo / Weidian URL"
          className={inputCls}
        />
        <button
          onClick={handleFetch}
          disabled={fetching || !url.trim()}
          className="px-4 py-2 text-sm border border-white/20 rounded text-white/70 hover:text-white hover:border-white/50 transition-colors disabled:opacity-40 shrink-0"
        >
          {fetching ? '…' : 'fetch'}
        </button>
      </div>

      {fetchError && <p className="text-xs text-red-400">{fetchError}</p>}

      {meta && (
        <>
          {/* Preview */}
          <div className="flex gap-3 items-start p-3 bg-neutral-900/60 rounded">
            {meta.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={meta.imageUrl}
                alt=""
                className="w-16 h-16 object-cover rounded shrink-0 bg-neutral-800"
              />
            )}
            <div className="min-w-0">
              <p className="text-sm text-white/80 line-clamp-2">{meta.title || '(no title found)'}</p>
              <p className="text-xs text-white/40 mt-1">{meta.platform} · {new URL(meta.finalUrl).hostname}</p>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={labelCls}>artist / account</label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="@username"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as FanCreative['type'])}
                className={selectCls}
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className={selectCls}
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>order status (optional)</label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className={selectCls}
              >
                <option value="">none</option>
                <option value="open">open</option>
                <option value="closed">closed</option>
                <option value="shipped">shipped</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="cute, animal, sticker"
                className={inputCls}
              />
            </div>
          </div>

          <button
            onClick={handleCopy}
            disabled={!artist.trim()}
            className="w-full py-2.5 text-sm border border-white/20 rounded text-white/70 hover:text-white hover:border-white/50 transition-colors disabled:opacity-40"
          >
            {copied ? '✓ copied! paste into fan-creatives.json' : 'copy JSON'}
          </button>
        </>
      )}
    </div>
  )
}
