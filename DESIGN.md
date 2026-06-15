# DESIGN.md
# Riki Nishimura — Fan Info Hub

---

## Visual Identity

**Aesthetic:** Dark, minimal, Japanese-influenced. Clean typographic hierarchy. No decorative elements.

**Color palette (Tailwind only):**

| Role | Value |
|---|---|
| Background | `bg-black` / `#000000` |
| Surface | `bg-neutral-900` / `bg-neutral-900/90` |
| Primary text | `text-white` |
| Secondary text | `text-white/70` |
| Muted text | `text-neutral-400` |
| Divider / accent | `bg-white/40` |
| Button bg | `bg-white` → hover `bg-neutral-200` |
| Button text | `text-black` |

No purple, no indigo, no gradients except the hero bottom fade (`from-transparent to-black`).

---

## Typography

**Font:** Readex Pro (Google Fonts) — weights 300, 400, 500, 600, 700
Load via `next/font/google`.

| Use | Class |
|---|---|
| Hero headline | `hero-title` — `text-[14vw] md:text-[13vw] font-medium` · `letter-spacing: -0.04em` · `line-height: 0.95` |
| Section heading | `text-3xl md:text-4xl font-medium tracking-tight` |
| Card title | `text-base font-medium` |
| Body / description | `text-[15px] leading-snug` |
| Label / badge | `text-xs font-normal` |
| Stat number | `text-4xl md:text-5xl font-medium tracking-tight` |
| Stat sublabel | `text-xs md:text-sm text-white/70` |

**Rule:** All text displayed on site must be lowercase. Enforce via copy, not CSS `text-transform` (to preserve accessibility).

---

## Hero Section

Full spec in this section. Built in `components/hero/HeroSection.tsx`.

### Layout
- `<section>`: `relative h-screen w-full overflow-hidden bg-black`
- Background `<video>`: `absolute inset-0 w-full h-full object-cover` — `autoPlay loop muted playsInline`
- Video src: `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_063509_7d167302-4fd4-480b-8260-18ab572333d4.mp4`
- Bottom fade: `pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black`

### Navbar
Position: `absolute z-20 px-6 md:px-10 pt-6 top-0 left-0 right-0`

**Left pill** — `flex items-center gap-2 bg-neutral-900/90 backdrop-blur rounded-full pl-4 pr-6 py-3`
- SVG logo `viewBox="0 0 256 256"` `h-5 w-5` fill `#ffffff`
  ```
  M 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 128 L 64 128 Z
  M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z
  M 128 64 L 128 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 Z
  M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 128 0 L 192 0 Z
  ```
- Brand text `"riki"` — `text-white text-sm font-normal tracking-tight`

**Center pill** — `hidden md:flex items-center gap-1 bg-neutral-900/90 backdrop-blur rounded-full px-3 py-2`
- Links: `home` · `videos` · `fan creatives` · `about`
- Each: `text-neutral-300 hover:text-white transition-colors text-sm px-5 py-2 rounded-full`

**Right button** — `"explore"` · `bg-white text-black text-sm font-normal rounded-full px-6 py-3 hover:bg-neutral-200 transition-colors`

### Headlines (staggered, absolute positioned)
Each: `<h1 className="hero-title absolute text-white font-medium text-[14vw] md:text-[13vw]">`

| Word | Position |
|---|---|
| `"nishimura"` | `left-4 md:left-10 top-[18%]` |
| `"riki"` | `right-4 md:right-10 top-[38%]` |
| `"enhypen"` | `left-[18%] md:left-[28%] top-[58%]` |

### Description
`absolute left-6 md:left-10 top-[46%] max-w-[240px] text-[15px] leading-snug text-white/90`
Text: `"your go-to english hub for all things riki — fan art, videos, and more"`

### Stat blocks

**Top-right** — `absolute right-6 md:right-24 top-[14%]`
- Row: diagonal divider `hidden md:block h-px w-24 bg-white/40 rotate-[20deg]` + `"+7"` `text-4xl md:text-5xl font-medium`
- Label: `"albums released"` `text-xs md:text-sm text-white/70 mt-1 text-right`

**Bottom-left** — `absolute left-6 md:left-20 bottom-20 md:bottom-24`
- Row: `"+4m"` + divider `rotate-[-20deg]`
- Label: `"followers worldwide"`

**Bottom-right** — `absolute right-6 md:right-20 bottom-16 md:bottom-20`
- Row: divider `rotate-[-20deg]` + `"since 2020"`
- Label: `"debut year"` `text-right`

---

## Component Reuse Conventions

### VideoCard
File: `components/cards/VideoCard.tsx`
- Thumbnail: `<Image>` from `https://img.youtube.com/vi/{youtubeId}/mqdefault.jpg`
- On click: open YouTube URL in new tab
- Always shows: title · channel name · date · duration label · category badge
- Aspect ratio: `aspect-video` (16:9)
- Hover: `group-hover:opacity-80 transition-opacity` on thumbnail

### FanArtCard
File: `components/cards/FanArtCard.tsx`
- Thumbnail: `<Image>` from `/public/screenshots/` or external URL
- Always shows: artist handle · platform badge · date
- Source link: entire card is a link → `target="_blank" rel="noopener noreferrer"`
- Hover: subtle `scale-[1.02] transition-transform`

### GroupOrderCard
File: `components/cards/GroupOrderCard.tsx`
- Extends FanArtCard
- Additional: order status badge — `open` (white border) · `closed` (neutral) · `shipped` (white filled)
- Always shows: maker name · status · link to original order post

### PlatformBadge
File: `components/ui/PlatformBadge.tsx`
- Props: `platform: "Twitter" | "Instagram" | "Pixiv" | "Weibo" | "Carrd" | "Other"`
- Style: `text-xs px-2 py-0.5 rounded-full border border-white/30 text-white/70`

### SectionHeader
File: `components/ui/SectionHeader.tsx`
- Props: `title: string`, `lastUpdated?: string`
- Always render `lastUpdated` if provided — `text-xs text-neutral-500 mt-1`

### Footer
File: `components/layout/Footer.tsx`
- Must always contain: takedown/contact email (e.g. `takedown@riki.fan`)
- Text: `"for takedown requests or credit corrections: [email]"`
- Style: `text-xs text-neutral-500 text-center py-8`

---

## Key Interaction Effects

| Element | Interaction |
|---|---|
| Nav links | `hover:text-white transition-colors` |
| CTA button | `hover:bg-neutral-200 transition-colors` |
| VideoCard thumbnail | `group-hover:opacity-80 transition-opacity duration-200` |
| FanArtCard | `hover:scale-[1.02] transition-transform duration-200` |
| Timeline item | No hover effect — static |
| Gallery image | `hover:opacity-90 transition-opacity duration-200` |

No other animations except Framer Motion stagger on hero headlines (entrance only, plays once).

### Framer Motion — Hero stagger (entrance only)
```tsx
const container = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } }
const item = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }
```
Apply to each headline word. Does not loop or repeat.

---

## Error / Loading / Empty States

### Loading state
- Use Next.js `loading.tsx` per route segment
- Show: full-width skeleton bars — `animate-pulse bg-neutral-800 rounded`
- Card skeleton: same aspect ratio as real card, `bg-neutral-900 rounded animate-pulse`
- No spinner, no loading text

### Error state
- Use Next.js `error.tsx` per route segment
- Show: centered message — `"something went wrong"` + `"try refreshing the page"` — `text-white/60 text-sm`
- No emoji, no illustrations

### Empty state (no data in JSON)
- Show inside the section grid area
- Text: `"nothing here yet — check back soon"` — `text-neutral-500 text-sm text-center py-16`
- No icons, no illustrations

### Image load failure
- `onError` on `<Image>` → replace src with a 1×1 transparent placeholder
- Container retains its dimensions — no layout shift
- For VideoCard: show `bg-neutral-900` fill with no text

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| < 768px (mobile) | Single column grid · Nav links hidden · Stat dividers hidden · Hero text scales via vw |
| ≥ 768px (md) | Two-column grid for cards · Nav links visible · Stat dividers visible |
| ≥ 1280px (xl) | Three-column grid for VideoCard and FanArtCard |

Minimum supported width: **375px**.