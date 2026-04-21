'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { wholeSpices } from '@/lib/products'
import Navbar from '@/components/Navbar'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function WholeSpicesPage() {
  const pairs = []
  for (let i = 0; i < wholeSpices.length; i += 2) {
    pairs.push(wholeSpices.slice(i, i + 2))
  }

  return (
    <main className="bg-[#f7f5f0] min-h-screen">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative h-[75vh] min-h-[520px] overflow-hidden">
        <Image
          src="/products/spices-variety.png"
          alt="Whole spices collection"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

        {/* Glassmorphism info card */}
        <motion.div
          className="absolute bottom-12 left-8 md:left-16 max-w-md"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="bg-[#021c10]/75 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <span className="text-primary-fixed/50 font-headline font-bold tracking-[0.25em] uppercase text-xs mb-3 block">
              Our Whole Spices
            </span>
            <h1 className="text-primary-fixed font-headline font-extrabold text-4xl md:text-5xl leading-tight mb-4">
              Nature&apos;s Botanicals,<br />
              <span className="font-light italic">Unaltered.</span>
            </h1>
            <p className="text-primary-fixed/65 text-sm leading-relaxed">
              Hand-harvested and sun-dried, preserving essential oils and vibrant aromatics across {wholeSpices.length} varieties.
            </p>
          </div>
        </motion.div>

        {/* Back link */}
        <Link
          href="/"
          className="absolute top-24 left-8 md:left-16 inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-headline transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
          Back to Home
        </Link>
      </section>

      {/* ── Collection Grid ──────────────────────────────────────────────────── */}
      <section className="py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-screen-2xl mx-auto">
          <motion.div
            className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div>
              <span className="text-primary/50 font-headline font-bold tracking-[0.25em] uppercase text-xs mb-3 block">
                Rawat Organics
              </span>
              <h2 className="text-primary font-headline font-extrabold text-4xl md:text-5xl">
                The <span className="font-light italic">Collection</span>
              </h2>
            </div>
            <p className="text-on-surface/50 font-headline text-sm max-w-xs leading-relaxed">
              {wholeSpices.length} hand-selected varieties in their most primal, unaltered form.
            </p>
          </motion.div>

          {/* Bento rows — alternating 3fr 2fr / 2fr 3fr */}
          <div className="flex flex-col gap-5">
            {pairs.map((pair, rowIdx) => (
              <div
                key={rowIdx}
                className={`grid gap-5 ${
                  pair.length === 1
                    ? 'grid-cols-1'
                    : rowIdx % 2 === 0
                    ? 'grid-cols-1 md:grid-cols-[3fr_2fr]'
                    : 'grid-cols-1 md:grid-cols-[2fr_3fr]'
                }`}
              >
                {pair.map((spice, colIdx) => {
                  const isLarge = pair.length === 1 || (rowIdx % 2 === 0 ? colIdx === 0 : colIdx === 1)
                  return (
                    <motion.div
                      key={spice.slug}
                      custom={rowIdx * 2 + colIdx}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: '-40px' }}
                    >
                      <Link
                        href={`/whole-spices/${spice.slug}`}
                        className="group block relative overflow-hidden rounded-2xl bg-[#021c10]"
                        style={{ aspectRatio: isLarge ? '16/10' : '4/3' }}
                      >
                        {/* Product image */}
                        <Image
                          src={spice.primaryImage}
                          alt={spice.name}
                          fill
                          className="object-cover opacity-60 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-70"
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#021c10] via-[#021c10]/30 to-transparent" />

                        {/* Content overlay */}
                        <div className="absolute inset-0 p-7 flex flex-col justify-between">
                          {/* Top: badge */}
                          <div className="flex items-start justify-between">
                            <span
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-headline font-bold tracking-widest uppercase"
                              style={{ backgroundColor: `${spice.color}25`, color: spice.color, border: `1px solid ${spice.color}40` }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: spice.color }} />
                              Whole Spice
                            </span>

                            <span className="material-symbols-outlined text-white/0 group-hover:text-white/80 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500" style={{ fontSize: '22px' }}>
                              north_east
                            </span>
                          </div>

                          {/* Bottom: name + description */}
                          <div>
                            <h3 className="text-white font-headline font-extrabold text-2xl md:text-3xl mb-2 leading-tight">
                              {spice.name}
                            </h3>
                            <p className="text-white/55 text-xs md:text-sm leading-relaxed max-w-xs line-clamp-2">
                              {spice.description}
                            </p>
                            <div className="mt-5 inline-flex items-center gap-2 text-white/70 group-hover:text-white font-headline font-semibold text-xs tracking-wider uppercase transition-colors duration-300">
                              View Details
                              <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1" style={{ fontSize: '14px' }}>arrow_forward</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quote + CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-primary py-28 px-8 relative overflow-hidden">
        <div className="noise-overlay opacity-[0.04]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary-container/20 blur-[100px] pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <span
            className="material-symbols-outlined text-5xl text-primary-fixed/10 mb-8 block"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            format_quote
          </span>
          <h2 className="text-3xl md:text-5xl font-headline italic text-primary-fixed leading-tight mb-8">
            &ldquo;The journey of a thousand flavors begins with a single, unaltered whole spice.&rdquo;
          </h2>
          <p className="font-headline tracking-widest uppercase text-xs text-primary-fixed/40 mb-12">
            — The Rawat Philosophy
          </p>
          <a
            href="mailto:hello@rawatorganics.com?subject=Wholesale Inquiry — Whole Spices"
            className="inline-flex items-center gap-3 px-10 py-4 bg-primary-fixed text-primary font-headline font-bold rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl"
          >
            Inquire for Wholesale
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>north_east</span>
          </a>
        </div>
      </section>
    </main>
  )
}
