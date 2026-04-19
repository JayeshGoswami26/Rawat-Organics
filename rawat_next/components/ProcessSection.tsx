'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const steps = [
  {
    number: '01',
    icon: 'water_drop',
    title: 'Sow',
    description:
      'Heirloom seeds are planted in mineral-rich, untreated soil under the open sky — no shortcuts, no synthetics.',
  },
  {
    number: '02',
    icon: 'wb_sunny',
    title: 'Grow',
    description:
      'Nurtured through natural rainfall and ancient rotational farming cycles that restore, not deplete, the land.',
  },
  {
    number: '03',
    icon: 'front_hand',
    title: 'Harvest',
    description:
      'Hand-picked at precise peak potency by skilled farmers who understand that timing is everything.',
  },
  {
    number: '04',
    icon: 'package_2',
    title: 'Deliver',
    description:
      'Cold-processed and sealed fresh at our atelier, shipped directly to your door without compromise.',
  },
]

export default function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-32 bg-surface relative overflow-hidden" ref={ref}>
      {/* Subtle background texture */}
      <div className="noise-overlay opacity-[0.025]" />

      <div className="max-w-screen-2xl mx-auto px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-secondary font-headline font-bold tracking-[0.2em] uppercase text-sm mb-4 block">
              Our Process
            </span>
            <h2 className="text-primary font-headline font-extrabold text-4xl md:text-6xl leading-tight">
              From Earth{' '}
              <span className="font-light italic">to Table</span>
            </h2>
          </motion.div>
          <motion.p
            className="text-on-surface/60 max-w-xs text-sm leading-relaxed md:text-right"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            Every step is a deliberate act of care — from the seed we choose to the seal on your package.
          </motion.p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 relative">
          {/* Connecting line desktop */}
          <motion.div
            className="hidden lg:block absolute top-[1.9rem] left-8 right-8 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(115,121,115,0.25) 15%, rgba(115,121,115,0.25) 85%, transparent 100%)',
            }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.4, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="relative flex flex-col px-8 pb-12 pt-0 group border-b lg:border-b-0 lg:border-r border-outline-variant/20 last:border-0"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.3 + i * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {/* Step dot */}
              <div className="relative z-10 w-16 h-16 rounded-full bg-surface border-2 border-outline-variant/40 flex items-center justify-center mb-8 group-hover:border-primary group-hover:bg-primary-container transition-all duration-500 shrink-0">
                <span
                  className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors duration-500"
                  style={{ fontSize: '24px', fontVariationSettings: "'FILL' 0, 'wght' 200" }}
                >
                  {step.icon}
                </span>
              </div>

              <span className="font-headline font-extrabold text-xs tracking-[0.3em] text-secondary/60 uppercase mb-3">
                {step.number}
              </span>
              <h3 className="font-headline font-extrabold text-3xl text-primary mb-4 group-hover:translate-x-1 transition-transform duration-300">
                {step.title}
              </h3>
              <p className="text-on-surface/55 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
