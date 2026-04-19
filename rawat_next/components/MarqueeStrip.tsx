'use client'

import ScrollVelocity from './ui/ScrollVelocity'

const items = [
  'Whole Spices ✦ Powder Spices ✦ Heritage Seeds ✦ 100% Organic ✦ Farm Fresh ✦ No Chemicals ✦ Hand‑Harvested ✦ Botanical Purity ✦ Regenerative Farming ✦ Direct from Farm ✦',
]

export default function MarqueeStrip() {
  return (
    <div className="bg-primary border-y border-primary-container/20 py-3 overflow-hidden select-none">
      <ScrollVelocity
        texts={items}
        velocity={60}
        className="text-primary-fixed/65 font-headline font-semibold text-xs tracking-[0.22em] uppercase pr-4"
        numCopies={4}
        parallaxClassName="py-0"
        scrollerClassName="items-center"
      />
    </div>
  )
}
