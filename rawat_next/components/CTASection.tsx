'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import Image from 'next/image'

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section className="py-24 px-8" id="contact" ref={ref}>
      <motion.div
        className="max-w-screen-xl mx-auto rounded-[3rem] overflow-hidden relative editorial-shadow"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80"
            alt="Misty forest floor with sunlight filtering through canopy"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-8 py-24 text-center flex flex-col items-center">
          <h2 className="text-white font-headline font-extrabold text-4xl md:text-6xl mb-6 max-w-3xl">
            Join the Conscious Community
          </h2>
          <p className="text-white/70 text-lg mb-12 max-w-xl mx-auto">
            Receive updates on our harvests, seasonal offerings, and botanical wisdom.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 text-white bg-white/15 px-8 py-4 rounded-full"
            >
              <span className="material-symbols-outlined text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <span className="font-headline font-semibold">Thank you! We&apos;ll be in touch.</span>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-lg flex flex-col sm:flex-row gap-4"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-grow bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-fixed transition-all"
              />
              <button
                type="submit"
                className="bg-white text-primary px-10 py-4 rounded-full font-headline font-bold hover:bg-surface-container-highest transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  )
}
