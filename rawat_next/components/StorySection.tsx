'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'

export default function StorySection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
  })

  return (
    <section className="py-32 px-8 bg-surface" id="story" ref={ref}>
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Image stack */}
          <motion.div className="lg:col-span-5 relative" {...fadeUp(0)}>
            <div className="relative z-10 aspect-[4/5] rounded-3xl overflow-hidden editorial-shadow">
              <Image
                src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80"
                alt="Hands holding fresh organic soil with green sprouts"
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative inset image */}
            <div className="absolute -bottom-12 -right-12 w-2/3 aspect-square rounded-3xl overflow-hidden editorial-shadow border-8 border-surface z-20 hidden md:block">
              <Image
                src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4e4?w=800&q=80"
                alt="Organic lentils and seeds arranged in rustic wooden bowls"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Text content */}
          <div className="lg:col-span-7 lg:pl-12">
            <motion.span
              className="text-secondary font-headline font-bold tracking-[0.2em] uppercase text-sm mb-6 block"
              {...fadeUp(0.1)}
            >
              Our Legacy
            </motion.span>

            <motion.h2
              className="text-primary font-headline font-extrabold text-4xl md:text-6xl mb-8 leading-tight"
              {...fadeUp(0.2)}
            >
              The Rawat Story:{' '}
              <br />
              <span className="font-light italic">A Botanical Atelier</span>
            </motion.h2>

            <motion.div
              className="space-y-6 text-on-surface/80 text-lg leading-relaxed max-w-xl"
              {...fadeUp(0.3)}
            >
              <p>
                Founded on the principles of regenerative alchemy, Rawat Organics
                is more than a farm. It is a sanctuary where ancestral wisdom meets
                modern sustainability.
              </p>
              <p>
                Every seed we plant and every oil we press is a testament to our
                commitment to the earth&apos;s rhythm. We believe that true luxury
                lies in the purity of the process and the integrity of the soil.
              </p>
              <div className="pt-8">
                <a
                  href="#collection"
                  className="inline-flex items-center gap-3 text-primary font-headline font-bold border-b-2 border-primary pb-1 hover:gap-5 transition-all duration-300"
                >
                  Discover Our Heritage{' '}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
