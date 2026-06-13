const TAKEDOWN_EMAIL = 'takedown@rikito.fan'

export default function Footer() {
  return (
    <footer className="text-xs text-neutral-500 text-center py-8 px-6">
      for takedown requests or credit corrections:{' '}
      <a
        href={`mailto:${TAKEDOWN_EMAIL}`}
        className="hover:text-neutral-300 transition-colors"
      >
        {TAKEDOWN_EMAIL}
      </a>
    </footer>
  )
}
