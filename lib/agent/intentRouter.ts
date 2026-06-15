import type { AgentIntent } from "@/lib/types"

const BADGE_KEYWORDS = ["badge", "吧唧", "pin", "button badge", "acrylic badge"]
const DOLL_KEYWORDS = ["doll", "棉花娃娃", "cotton doll", "plush", "soft toy", "mochi"]
const STYLE_KEYWORDS = ["change", "modify", "update", "redesign", "make it", "alter", "adjust", "restyle"]

export function routeIntent(input: string): AgentIntent {
  const lower = input.toLowerCase()

  if (BADGE_KEYWORDS.some((kw) => lower.includes(kw))) return "badge"
  if (DOLL_KEYWORDS.some((kw) => lower.includes(kw))) return "doll"
  if (STYLE_KEYWORDS.some((kw) => lower.includes(kw))) return "style-change"
  return "info"
}
