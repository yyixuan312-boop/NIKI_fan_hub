import type { GalleryItem } from '@/lib/types'
import galleryData from '@/data/gallery.json'
import SectionHeader from '@/components/ui/SectionHeader'
import GalleryGrid from './GalleryGrid'

const items = galleryData as GalleryItem[]
const LAST_UPDATED = 'june 2026'

export default function GalleryPage() {
  return (
    <main className="bg-black min-h-screen px-6 md:px-10 py-16 md:py-24 max-w-7xl mx-auto">
      <SectionHeader title="gallery" lastUpdated={LAST_UPDATED} />
      <GalleryGrid items={items} />
    </main>
  )
}
