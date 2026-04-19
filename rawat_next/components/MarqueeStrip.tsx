'use client'

const items = [
  'Whole Spices',
  'Powder Spices',
  'Heritage Seeds',
  '100% Organic',
  'Farm Fresh',
  'No Chemicals',
  'Hand-Harvested',
  'Botanical Purity',
  'Regenerative Farming',
  'Direct from Farm',
  'Cold-Milled',
  'Zero Additives',
]

export default function MarqueeStrip() {
  const doubled = [...items, ...items]

  return (
    <div className="bg-primary py-4 overflow-hidden border-y border-primary-container/20">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className="text-primary-fixed/70 font-headline font-semibold text-xs tracking-[0.25em] uppercase px-8">
              {item}
            </span>
            <span className="text-primary-fixed/25 text-base select-none">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
