'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { powderSpices } from '@/lib/products'
import type { ProductTag } from '@/lib/products'
import Navbar from '@/components/Navbar'

type FilterTab = 'all' | ProductTag

const TABS: { label: string; value: FilterTab }[] = [
  { label: 'All', value: 'all' },
  { label: 'Spicy', value: 'spicy' },
  { label: 'Sweet', value: 'sweet' },
  { label: 'Earthy', value: 'earthy' },
  { label: 'Aromatic', value: 'aromatic' },
]

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
}

export default function PowderSpicesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')

  const filtered = activeFilter === 'all'
    ? powderSpices
    : powderSpices.filter((p) => p.tags.includes(activeFilter))

  return (
    <main className="bg-[#f7f5f0] min-h-screen">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-[#0d0d0d]">
        {/* Background giant text */}
        <div className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none select-none">
          <span className="text-[clamp(80px,18vw,200px)] font-headline font-extrabold leading-none pr-8 text-white/[0.04] tracking-tighter whitespace-nowrap">
            ARTISANAL
          </span>
        </div>
        <div className="absolute inset-0 flex items-end justify-end overflow-hidden pointer-events-none select-none pb-16">
          <span className="text-[clamp(60px,12vw,150px)] font-headline font-extrabold leading-none pr-8 text-white/[0.04] tracking-tighter whitespace-nowrap">
            SPICES
          </span>
        </div>

        {/* Product image right side */}
        <div className="absolute right-0 top-0 w-1/2 h-full">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0d0d0d] z-10" />
          <Image
            src="/products/turmeric.png"
            alt="Artisanal powder spices"
            fill
            priority
            className="object-cover opacity-40"
          />
        </div>

        <div className="relative z-20 max-w-screen-2xl mx-auto px-8 md:px-16 w-full pt-32 pb-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm font-headline mb-12 transition-colors group"
          >
            <span className="material-symbols-outlined transition-transform duration-300 group-hover:-translate-x-1" style={{ fontSize: '16px' }}>arrow_back</span>
            Back to Home
          </Link>

          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse" />
            <span className="text-white/70 font-headline font-bold text-xs tracking-[0.2em] uppercase">Premium Collection</span>
          </motion.div>

          <motion.h1
            className="text-white font-headline font-extrabold text-4xl md:text-6xl lg:text-7xl leading-tight max-w-2xl mb-6"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Artisanal Powders:{' '}
            <span className="italic font-light text-primary-fixed/80">Pure, Potent,</span>
            {' '}& Ground with Care
          </motion.h1>

          <motion.p
            className="text-white/50 text-base md:text-lg max-w-xl leading-relaxed mb-10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Cold-milled at low temperature to preserve volatile oils and vivid color.
            {powderSpices.length} botanicals ground to their purest, most potent form.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <a
              href="#collection"
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-primary-fixed text-primary font-headline font-bold text-sm rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
            >
              Explore Collection
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>south</span>
            </a>
            <div className="flex items-center gap-3 text-white/30 text-sm font-headline">
              <div className="h-px w-8 bg-white/20" />
              {powderSpices.length} varieties available
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Collection with filters ──────────────────────────────────────────── */}
      <section className="py-20 px-6 md:px-16" id="collection">
        <div className="max-w-screen-2xl mx-auto">

          {/* Section header + filter tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-primary/40 font-headline font-bold tracking-[0.25em] uppercase text-xs mb-3 block">
                Rawat Organics
              </span>
              <h2 className="text-primary font-headline font-extrabold text-4xl">
                Finely Ground <span className="font-light italic">Heritage</span>
              </h2>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveFilter(tab.value)}
                  className={`px-5 py-2 rounded-full font-headline font-semibold text-xs tracking-widest uppercase transition-all duration-300 border ${
                    activeFilter === tab.value
                      ? 'bg-primary text-primary-fixed border-primary shadow-md'
                      : 'bg-transparent text-on-surface/50 border-outline-variant/50 hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Product grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((spice, i) => (
                <motion.div
                  key={spice.slug}
                  layout
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <Link
                    href={`/powder-spices/${spice.slug}`}
                    className="group flex flex-col bg-white rounded-2xl border border-outline-variant/20 hover:border-primary/20 hover:shadow-xl transition-all duration-300 overflow-hidden h-full"
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-[#f0ede6]">
                      <Image
                        src={spice.primaryImage}
                        alt={spice.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-600"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div
                        className="absolute top-3 left-3 w-3 h-3 rounded-full shadow-md"
                        style={{ backgroundColor: spice.color }}
                      />
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="font-headline font-extrabold text-primary text-lg mb-2 group-hover:translate-x-0.5 transition-transform duration-300 leading-tight">
                        {spice.name}
                      </h3>
                      <p className="text-on-surface/50 text-xs leading-relaxed flex-grow mb-5 line-clamp-3">
                        {spice.description}
                      </p>
                      <div className="inline-flex items-center gap-1.5 text-primary font-headline font-bold text-xs tracking-wider uppercase group-hover:gap-3 transition-all duration-300 border border-primary/20 hover:border-primary rounded-full px-4 py-2 self-start">
                        View Details
                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>arrow_forward</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── The Spice Journal CTA ────────────────────────────────────────────── */}
      <section className="bg-primary relative overflow-hidden">
        <div className="noise-overlay opacity-[0.04]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary-container/15 blur-[120px] pointer-events-none" />

        <div className="max-w-screen-2xl mx-auto px-8 md:px-16 py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <span className="text-primary-fixed/40 font-headline font-bold tracking-[0.25em] uppercase text-xs mb-5 block">
                Stay Connected
              </span>
              <h2 className="text-primary-fixed font-headline font-extrabold text-4xl md:text-5xl leading-tight mb-6">
                The Spice <span className="font-light italic">Journal</span>
              </h2>
              <p className="text-primary-fixed/55 text-base leading-relaxed mb-8 max-w-md">
                Reach out for wholesale inquiries, custom blends, or to learn more about our sourcing practices and farm partnerships.
              </p>
              <a
                href="mailto:hello@rawatorganics.com?subject=Wholesale Inquiry — Powder Spices"
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary-fixed text-primary font-headline font-bold text-sm rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl"
              >
                Get in Touch
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>north_east</span>
              </a>
            </div>

            {/* Right: decorative */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative w-48 h-48 md:w-64 md:h-64">
                <div className="absolute inset-0 rounded-full bg-primary-fixed/5 border border-primary-fixed/10" />
                <div className="absolute inset-4 rounded-full bg-primary-fixed/5 border border-primary-fixed/10" />
                <div className="absolute inset-8 rounded-full bg-primary-fixed/5 border border-primary-fixed/10 flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-primary-fixed/40"
                    style={{ fontSize: '64px', fontVariationSettings: "'FILL' 1" }}
                  >
                    eco
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
