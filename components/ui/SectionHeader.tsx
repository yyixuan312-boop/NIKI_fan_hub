interface Props {
  title: string
  lastUpdated?: string
}

export default function SectionHeader({ title, lastUpdated }: Props) {
  return (
    <div className="mb-8 md:mb-10">
      <h2 className="text-3xl md:text-4xl font-medium tracking-tight">{title}</h2>
      {lastUpdated && (
        <p className="text-xs text-neutral-500 mt-1">last updated {lastUpdated}</p>
      )}
    </div>
  )
}
