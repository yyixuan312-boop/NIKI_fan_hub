'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import Navbar from '@/components/layout/Navbar'

declare global {
  interface Window {
    YT: {
      Player: new (elementId: string, options: YTPlayerOptions) => YTPlayer
      PlayerState: { ENDED: number; PLAYING: number; PAUSED: number }
    }
    onYouTubeIframeAPIReady: () => void
  }
}

interface YTPlayer {
  getCurrentTime: () => number
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  playVideo: () => void
  destroy: () => void
}

interface YTPlayerOptions {
  videoId: string
  playerVars?: Record<string, string | number>
  events?: {
    onReady?: (event: { target: YTPlayer }) => void
  }
}

const SEGMENTS = [
  { start: 63, end: 74 },
  { start: 107, end: 110 },
  { start: 136, end: 141 },
  { start: 172, end: 175 },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export default function HeroSection() {
  const playerRef = useRef<YTPlayer | null>(null)
  const segIdxRef = useRef(0)
  const watcherRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    function nextSegment() {
      segIdxRef.current = (segIdxRef.current + 1) % SEGMENTS.length
      playerRef.current?.seekTo(SEGMENTS[segIdxRef.current].start, true)
    }

    function startWatcher() {
      if (watcherRef.current) clearInterval(watcherRef.current)
      watcherRef.current = setInterval(() => {
        if (!playerRef.current) return
        const t = playerRef.current.getCurrentTime()
        if (t >= SEGMENTS[segIdxRef.current].end) nextSegment()
      }, 150)
    }

    function initPlayer() {
      playerRef.current = new window.YT.Player('yt-bg', {
        videoId: '2JTBSa7XsjE',
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          playsinline: 1,
          rel: 0,
          start: SEGMENTS[0].start,
        },
        events: {
          onReady: (e) => {
            e.target.playVideo()
            startWatcher()
          },
        },
      })
    }

    if (window.YT?.Player) {
      initPlayer()
    } else {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
      window.onYouTubeIframeAPIReady = initPlayer
    }

    return () => {
      if (watcherRef.current) clearInterval(watcherRef.current)
      playerRef.current?.destroy()
    }
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div id="yt-bg" />
      </div>

      <Navbar />

      <div className="relative h-full w-full">
        <motion.div
          className="absolute inset-0"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.h1
            variants={item}
            className="hero-title absolute text-white font-medium text-[14vw] md:text-[13vw] left-4 md:left-10 top-[18%]"
          >
            NI_KI
          </motion.h1>
          <motion.h1
            variants={item}
            className="hero-title absolute text-white font-medium text-[14vw] md:text-[13vw] right-4 md:right-10 top-[38%] text-right"
          >
            Nishimura Riki
          </motion.h1>
          <motion.h1
            variants={item}
            className="hero-title absolute text-white font-medium text-[14vw] md:text-[13vw] left-[18%] md:left-[28%] top-[58%]"
          >
            enhypen
          </motion.h1>
        </motion.div>

        <p className="absolute left-6 md:left-10 top-[46%] max-w-[240px] text-[15px] leading-snug text-white/90">
          Dance Machine
        </p>

        <div className="absolute right-6 md:right-24 top-[14%]">
          <div className="flex items-center gap-3 justify-end">
            <div className="hidden md:block h-px w-24 bg-white/40 rotate-[20deg]" />
            <span className="text-4xl md:text-5xl font-medium tracking-tight">+7</span>
          </div>
          <p className="text-xs md:text-sm text-white/70 mt-1 text-right">albums released</p>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black" />

        <div className="absolute left-6 md:left-20 bottom-20 md:bottom-24">
          <div className="flex items-center gap-3">
            <span className="text-4xl md:text-5xl font-medium tracking-tight">+4m</span>
            <div className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
          </div>
          <p className="text-xs md:text-sm text-white/70 mt-1">followers worldwide</p>
        </div>

        <div className="absolute right-6 md:right-20 bottom-16 md:bottom-20">
          <div className="flex items-center gap-3 justify-end">
            <div className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
            <span className="text-4xl md:text-5xl font-medium tracking-tight">#</span>
          </div>
          <p className="text-xs md:text-sm text-white/70 mt-1 text-right">#</p>
        </div>
      </div>
    </section>
  )
}
