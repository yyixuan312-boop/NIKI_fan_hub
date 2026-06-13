# Architecture & Technical Constraints
# Rikito Nishimura — Fan Info Hub

> Claude Code must read PRODUCT.md and DESIGN.md before referencing this file.
> This file defines hard constraints. Do not deviate without explicit user instruction.

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | Use server components by default |
| Language | TypeScript (strict mode) | No `any` types allowed |
| Styling | Tailwind CSS | No CSS modules, no styled-components |
| Animation | Framer Motion | Hero section only, keep it minimal |
| Font | Readex Pro (Google Fonts) | Via `next/font/google` |
| Data | Local JSON files in `/data` | No database for MVP |
| Deploy | Vercel | `next build` must pass with zero errors |
| Package manager | npm | Do not use yarn or pnpm |

---

## Directory Structure

```
/
├── app/
│   ├── layout.tsx              # Root layout, font loading, global styles
│   ├── page.tsx                # Home — hero section
│   ├── profile/
│   │   └── page.tsx
│   ├── timeline/
│   │   └── page.tsx
│   ├── videos/
│   │   └── page.tsx
│   ├── fan-creatives/
│   │   └── page.tsx
│   └── gallery/
│       └── page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── hero/
│   │   └── HeroSection.tsx
│   ├── cards/
│   │   ├── VideoCard.tsx
│   │   ├── FanArtCard.tsx
│   │   └── GroupOrderCard.tsx
│   └── ui/
│       ├── StatBlock.tsx
│       ├── PlatformBadge.tsx
│       └── SectionHeader.tsx
│
├── data/
│   ├── videos.json
│   ├── fan-creatives.json
│   ├── timeline.json
│   └── gallery.json
│
├── lib/
│   ├── types.ts                # All TypeScript interfaces
│   └── utils.ts                # Helper functions
│
├── public/
│   └── screenshots/            # Locally stored thumbnails for fan creatives
│
├── PRODUCT.md
├── DESIGN.md
└── ARCHITECTURE.md
```

---

## Data Models

All types defined in `lib/types.ts`. JSON files must match these interfaces exactly.

### Video (`data/videos.json`)
```ts
interface Video {
  id: string                  // e.g. "mv-001"
  title: string
  youtubeId: string           // YouTube video ID only, not full URL
  category: "mv" | "performance" | "variety" | "fancam" | "weverse-live"
  channelName: string
  date: string                // ISO format: "YYYY-MM-DD"
  durationLabel: string       // Manual, e.g. "3:42"
}
```

### Fan Creative (`data/fan-creatives.json`)
```ts
interface FanCreative {
  id: string
  type: "digital" | "traditional" | "3d" | "acrylic" | "doll" | "group-order"
  artist: string              // Handle including @
  platform: "Twitter" | "Instagram" | "Pixiv" | "Weibo" | "Carrd" | "Other"
  url: string                 // Original post URL
  thumbnail: string           // Path under /public/screenshots/ OR external URL
  date: string                // "YYYY-MM"
  orderStatus?: "open" | "closed" | "shipped"   // group-order only
  tags?: string[]
}
```

### Timeline Event (`data/timeline.json`)
```ts
interface TimelineEvent {
  id: string
  date: string                // "YYYY-MM-DD" or "YYYY-MM"
  title: string
  description: string
  category: "debut" | "album" | "award" | "tour" | "personal" | "other"
  sourceUrl?: string
}
```

### Gallery Item (`data/gallery.json`)
```ts
interface GalleryItem {
  id: string
  src: string                 // Low-res image URL only
  alt: string
  credit: string              // e.g. "BELIFT LAB / HYBE"
  sourceUrl: string           // Link back to official source
  date: string                // "YYYY-MM"
  category: "press" | "album" | "event" | "weverse"
}
```

---

## Service Layer Conventions

### YouTube Thumbnails
Always construct thumbnail URLs client-side from `youtubeId`:
```ts
// lib/utils.ts
export const getYoutubeThumbnail = (youtubeId: string) =>
  `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
```
Never store full YouTube URLs or embed `<iframe>` anywhere.

### Outbound Links
All external links must:
- Use `target="_blank" rel="noopener noreferrer"`
- Never open in the same tab

### Data Loading
Load JSON data in Server Components using `import` (not `fetch`):
```ts
// Good
import videos from '@/data/videos.json'

// Bad — do not use fetch() for local JSON
const res = await fetch('/data/videos.json')
```

### Image Handling
Use `next/image` for all images with explicit `width` and `height`.  
Exception: background video uses a plain `<video>` tag as specified in DESIGN.md.

---

## AI Reference Mechanism

When Claude Code modifies or creates any file, it must:

1. **Read before writing** — always read the existing file content before editing
2. **Respect type contracts** — never change interfaces in `lib/types.ts` without updating all consuming JSON files
3. **One component per file** — no barrel files that re-export multiple components
4. **No hardcoded content** — all displayed content (names, dates, stats) must come from JSON files or typed constants, never hardcoded in JSX

When asked to add a new page or feature:
- Check PRODUCT.md feature scope table first
- If feature is marked "Blacklist" — refuse and explain why
- If feature is marked "v2" — note it and ask for confirmation before building

---

## Development Constraints

### Must follow
- All text displayed on site must be **lowercase** (enforce via CSS `text-transform: lowercase` on body, or explicitly in copy)
- Color palette: black · white · `neutral-900` · white opacity variants only — no other colors except these
- No database, no backend API routes for MVP
- `next build` must produce zero TypeScript errors and zero ESLint errors
- Mobile-first: every component must work at 375px width minimum

### Must not do
- Do not add authentication of any kind
- Do not add a comment system, guestbook, or any user-generated content input
- Do not embed YouTube videos (`<iframe>`) — thumbnail + outbound link only
- Do not store any video or image files in the repo (except `/public/screenshots/` for fan creative thumbnails)
- Do not install additional UI libraries (shadcn, MUI, Radix, etc.) — Tailwind only
- Do not use `any` type in TypeScript
- Do not use `useEffect` for data fetching — use Server Components

---

## Invariants — Do Not Break

These are core behaviors that must never be removed or changed:

1. **Attribution on every fan creative card** — `artist`, `platform`, and `url` fields must always be visible and linked
2. **YouTube thumbnail → outbound link pattern** — VideoCard must never embed a player
3. **Source credit on every gallery image** — `credit` and `sourceUrl` always rendered
4. **Takedown email in Footer** — Footer must always include a contact/takedown email
5. **`rel="noopener noreferrer"` on all external links** — non-negotiable for security

---

## Acceptance Criteria

A feature is considered done when:

- [ ] `npm run build` passes with zero errors
- [ ] TypeScript strict mode passes — `npx tsc --noEmit` clean
- [ ] Renders correctly at 375px (mobile) and 1280px (desktop)
- [ ] All external links open in new tab with correct `rel` attributes
- [ ] Fan creative cards show: artist handle, platform badge, source link
- [ ] Video cards show: thumbnail (from YouTube), title, channel, date — no embed
- [ ] Gallery items show: image credit and source URL
- [ ] Footer contains takedown contact email
- [ ] No hardcoded content in JSX — all data from `/data/*.json`
- [ ] Lighthouse performance score ≥ 80 on mobile