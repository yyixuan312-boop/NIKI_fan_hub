export interface Video {
  id: string
  title: string
  youtubeId: string
  thumbnail?: string
  category: string
  channelName: string
  date: string
  durationLabel: string
}

export interface FanCreative {
  id: string
  type: "digital" | "traditional" | "3d" | "acrylic" | "doll" | "group-order"
  artist: string
  platform: "Twitter" | "Instagram" | "Pixiv" | "Weibo" | "Carrd" | "Other"
  url: string
  thumbnail: string
  date: string
  orderStatus?: "open" | "closed" | "shipped"
  tags?: string[]
}

export interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  category: "debut" | "album" | "award" | "tour" | "personal" | "other"
  sourceUrl?: string
}

export interface GalleryItem {
  id: string
  src: string
  alt: string
  credit: string
  sourceUrl: string
  date: string
  category: "press" | "album" | "event" | "weverse"
}

export type AgentIntent = "badge" | "doll" | "style-change" | "info"
