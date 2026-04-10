'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const values = [
  {
    icon: 'verified',
    title: '100% Organic',
    description: 'Every product is certified to the highest global organic standards.',
  },
  {
    icon: 'eco',
    title: 'No Chemicals',
    description: 'Zero synthetic pesticides or fertilizers, ever. Purely nature\'s design.',
  },
  {
    icon: 'agriculture',
    title: 'Farm Fresh',
    description: 'Direct from our botanical atelier to your table, minimizing travel time.',
  },
  {
    icon: 'workspace_premium',
    title: 'Trusted Quality',
    description: 'A heritage of excellence spanning three decades of conscious cultivation.',
  },
]

export default function ValuesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-32 bg-primary text-on-primary overflow-hidden relative" ref={ref}>
      {/* Grid lines decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="grid grid-cols-6 h-full w-full">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-r border-on-primary" />
          ))}
          <div />
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-8 relative z-10">
        {/* Section label */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="font-headline font-bold tracking-[0.3em] uppercase text-sm text-on-primary/50 block mb-3">
            Our Promise
          </span>
          <h2 className="font-headline font-extrabold text-4xl md:text-5xl">
            Why Choose Rawat
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              className="flex flex-col items-start space-y-5 group"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary-container transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
                  {value.icon}
                </span>
              </div>
              <h4 className="font-headline font-bold text-2xl">{value.title}</h4>
              <p className="text-on-primary/60 leading-relaxed text-sm">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
