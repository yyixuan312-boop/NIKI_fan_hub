import type { FanCreative } from '@/lib/types'

interface Props {
  platform: FanCreative['platform']
}

export default function PlatformBadge({ platform }: Props) {
  return (
    <span className="text-xs px-2 py-0.5 rounded-full border border-white/30 text-white/70 shrink-0">
      {platform.toLowerCase()}
    </span>
  )
}
