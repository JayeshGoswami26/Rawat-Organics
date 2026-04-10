'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const testimonials = [
  {
    quote: '"The aromatic quality of their heritage spices is unmatched. It\'s like cooking with the soul of the earth."',
    name: 'Eleanor Vance',
    role: 'Culinary Director',
  },
  {
    quote: '"Finding true organic authenticity is rare. Rawat Organics is my primary source for all botanical essentials."',
    name: 'Julian Thorne',
    role: 'Wellness Practitioner',
  },
  {
    quote: '"Their commitment to regenerative farming is inspiring. You can actually taste the difference in the grains."',
    name: 'Dr. Amara Singh',
    role: 'Environmental Scientist',
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5 text-secondary mb-6">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className="material-symbols-outlined"
          style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1, 'wght' 400" }}
        >
          star
        </span>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-32 bg-surface" ref={ref}>
      <div className="max-w-screen-2xl mx-auto px-8">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-2xl">
            <span className="text-secondary font-headline font-bold tracking-widest uppercase text-sm mb-4 block">
              Voices
            </span>
            <h2 className="text-primary font-headline font-extrabold text-4xl md:text-5xl">
              The Conscious Voice
            </h2>
          </div>
          <div className="flex gap-4">
            <button className="w-12 h-12 rounded-full border border-outline/30 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group">
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">chevron_left</span>
            </button>
            <button className="w-12 h-12 rounded-full border border-outline/30 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group">
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">chevron_right</span>
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="bg-surface-container p-10 rounded-[2.5rem] flex flex-col justify-between h-full group hover:bg-surface-container-high transition-colors duration-300"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div>
                <Stars />
                <p className="text-primary font-body text-xl italic leading-relaxed mb-8">
                  {t.quote}
                </p>
              </div>
              <div>
                <p className="font-headline font-bold text-primary">{t.name}</p>
                <p className="text-on-surface/50 text-sm mt-1">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
