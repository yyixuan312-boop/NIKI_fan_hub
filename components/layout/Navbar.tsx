import Link from 'next/link'

const NAV_LINKS = [
  { label: 'home', href: '/' },
  { label: 'videos', href: '/videos' },
  { label: 'fan creatives', href: '/fan-creatives' },
  { label: 'profile', href: '/profile' },
  { label: 'design agent', href: '/design-agent' },
]

export default function Navbar() {
  return (
    <nav className="fixed z-20 px-6 md:px-10 pt-6 top-0 left-0 right-0 flex items-center justify-between gap-4">

      <div className="hidden md:flex items-center gap-1 bg-neutral-900/90 backdrop-blur rounded-full px-3 py-2">
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="text-neutral-300 hover:text-white transition-colors text-sm px-5 py-2 rounded-full"
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
