'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

function useCounter(target: number, duration: number, inView: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let current = 0
    const steps = 60
    const increment = target / steps
    const interval = duration / steps

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, interval)

    return () => clearInterval(timer)
  }, [inView, target, duration])

  return count
}

const stats = [
  {
    value: 30,
    suffix: '+',
    label: 'Years of Heritage',
    sub: 'Three decades cultivating trust',
    icon: 'history',
  },
  {
    value: 100,
    suffix: '%',
    label: 'Organic Certified',
    sub: 'Every product, every single batch',
    icon: 'verified',
  },
  {
    value: 50,
    suffix: '+',
    label: 'Spice Varieties',
    sub: 'From rare heirloom varietals',
    icon: 'grass',
  },
  {
    value: 0,
    suffix: '',
    label: 'Chemicals Used',
    sub: 'Purely by nature\'s design',
    icon: 'eco',
  },
]

function StatCard({ stat, i, inView }: { stat: typeof stats[0]; i: number; inView: boolean }) {
  const count = useCounter(stat.value, 1600, inView)

  return (
    <motion.div
      className="flex flex-col items-start px-8 md:px-12 py-10 border-r border-outline-variant/20 last:border-r-0 group"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <span
        className="material-symbols-outlined text-secondary/60 mb-4 group-hover:text-secondary transition-colors duration-300"
        style={{ fontSize: '28px', fontVariationSettings: "'FILL' 0, 'wght' 200" }}
      >
        {stat.icon}
      </span>
      <div className="font-headline font-extrabold text-6xl md:text-7xl text-primary mb-3 tabular-nums leading-none">
        {count}
        <span className="text-secondary">{stat.suffix}</span>
      </div>
      <div className="font-headline font-bold text-primary text-lg mb-1">{stat.label}</div>
      <div className="text-on-surface/50 text-sm leading-relaxed">{stat.sub}</div>
    </motion.div>
  )
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="bg-surface-container-low py-4 overflow-hidden" ref={ref}>
      <div className="max-w-screen-2xl mx-auto px-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 divide-outline-variant/20 border-y border-outline-variant/20">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} i={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
