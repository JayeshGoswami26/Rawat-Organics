'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/lib/products'
import SpotlightCard from '@/components/ui/SpotlightCard'

const SIZES = ['50g', '100g', '250g', '500g', '1kg']

interface Props {
  product: Product
  related: Product[]
  categoryLabel: string
  categoryHref: string
}

export default function ProductDetailClient({ product, related, categoryLabel, categoryHref }: Props) {
  const [selectedSize, setSelectedSize] = useState('250g')
  const [activeImage, setActiveImage] = useState(0)

  const tagColors: Record<string, string> = {
    spicy: '#DC2626',
    sweet: '#D97706',
    earthy: '#92400E',
    aromatic: '#065F46',
  }

  return (
    <main className="bg-[#f7f5f0] min-h-screen">
      {/* ── Back bar ──────────────────────────────────────────────────────────── */}
      <div className="pt-24 pb-4 px-6 md:px-16 max-w-screen-2xl mx-auto">
        <Link
          href={categoryHref}
          className="inline-flex items-center gap-2 text-primary/60 hover:text-primary text-sm font-headline transition-colors group"
        >
          <span className="material-symbols-outlined transition-transform duration-300 group-hover:-translate-x-1" style={{ fontSize: '16px' }}>arrow_back</span>
          Back to {categoryLabel}
        </Link>
      </div>

      {/* ── Main layout ───────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-16 py-8 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-start">

          {/* Left: Images */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Primary image */}
            <div className="relative rounded-2xl overflow-hidden bg-[#021c10] aspect-[4/3] mb-4 shadow-2xl">
              <Image
                src={product.images[activeImage] ?? product.primaryImage}
                alt={product.name}
                fill
                priority
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

              {/* Category badge */}
              <div className="absolute top-5 left-5">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#021c10]/80 backdrop-blur-sm text-primary-fixed text-xs font-headline font-bold tracking-wider border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed/60" />
                  {categoryLabel}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative rounded-xl overflow-hidden aspect-[4/3] transition-all duration-300 ${
                    activeImage === i
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-[#f7f5f0]'
                      : 'opacity-60 hover:opacity-90'
                  }`}
                >
                  <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right: Details */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="pt-2"
          >
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-headline text-on-surface/40 mb-6">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>chevron_right</span>
              <Link href={categoryHref} className="hover:text-primary transition-colors">{categoryLabel}</Link>
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>chevron_right</span>
              <span className="text-on-surface/70">{product.name}</span>
            </nav>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-headline font-bold tracking-wider border border-primary/15">
                Organic
              </span>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-headline font-bold tracking-wider border border-primary/15">
                Non-GMO
              </span>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-headline font-bold tracking-wider border border-primary/15">
                Hand-Harvested
              </span>
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-[11px] font-headline font-bold tracking-wider capitalize"
                  style={{
                    backgroundColor: `${tagColors[tag]}15`,
                    color: tagColors[tag],
                    border: `1px solid ${tagColors[tag]}30`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Name */}
            <h1 className="text-primary font-headline font-extrabold text-4xl md:text-5xl leading-tight mb-3">
              {product.name}
            </h1>

            {/* Tagline */}
            <p className="text-on-surface/50 font-headline italic text-lg mb-6">{product.tagline}</p>

            <div className="h-px w-full bg-outline-variant/30 mb-6" />

            {/* Description */}
            <p className="text-on-surface/70 text-base leading-relaxed mb-8">
              {product.longDescription}
            </p>

            {/* Size selector */}
            <div className="mb-8">
              <p className="font-headline font-semibold text-primary text-sm mb-3 tracking-wide">
                Packaging Size
              </p>
              <div className="flex flex-wrap gap-2.5">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2 rounded-full font-headline font-semibold text-sm transition-all duration-300 border ${
                      selectedSize === size
                        ? 'bg-primary text-primary-fixed border-primary shadow-md scale-105'
                        : 'bg-transparent text-on-surface/60 border-outline-variant/50 hover:border-primary/40 hover:text-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <a
                href={`mailto:hello@rawatorganics.com?subject=Product Inquiry: ${product.name} (${selectedSize})`}
                className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-fixed font-headline font-bold text-sm rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
              >
                Inquire for This Product
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>north_east</span>
              </a>
              <Link
                href={categoryHref}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary-container text-on-primary-container font-headline font-semibold text-sm rounded-full hover:bg-primary/20 transition-all duration-300"
              >
                Browse All {categoryLabel}
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: 'eco', label: 'Sustainably Sourced' },
                { icon: 'verified', label: 'Quality Assured' },
                { icon: 'local_shipping', label: 'Wholesale Available' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-on-surface/40 text-xs font-headline">
                  <span className="material-symbols-outlined text-primary/50" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Related Products ──────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="py-20 px-6 md:px-16 bg-surface-container-low">
          <div className="max-w-screen-2xl mx-auto">
            <motion.div
              className="flex items-end justify-between mb-10"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <span className="text-primary/40 font-headline font-bold tracking-[0.2em] uppercase text-xs mb-2 block">
                  Discover More
                </span>
                <h2 className="text-primary font-headline font-extrabold text-3xl">
                  You May Also <span className="font-light italic">Like</span>
                </h2>
              </div>
              <Link
                href={categoryHref}
                className="hidden md:inline-flex items-center gap-2 text-primary/60 hover:text-primary font-headline font-semibold text-sm transition-colors"
              >
                View All
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((rel, i) => (
                <motion.div
                  key={rel.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                >
                  <SpotlightCard
                    className="group h-full rounded-2xl bg-surface-container border border-outline-variant/30 hover:border-outline/50 hover:shadow-lg transition-all duration-300"
                    spotlightColor="rgba(2, 28, 16, 0.06)"
                  >
                    <Link href={`${categoryHref}/${rel.slug}`} className="flex flex-col h-full">
                      {/* Image */}
                      <div className="relative aspect-[4/3] rounded-t-2xl overflow-hidden bg-[#021c10]">
                        <Image src={rel.primaryImage} alt={rel.name} fill className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#021c10]/80 to-transparent" />
                      </div>

                      <div className="p-5 flex flex-col flex-grow">
                        <div className="w-2.5 h-2.5 rounded-full mb-3 shrink-0" style={{ backgroundColor: rel.color }} />
                        <h3 className="font-headline font-extrabold text-lg text-primary mb-2 group-hover:translate-x-0.5 transition-transform duration-300">
                          {rel.name}
                        </h3>
                        <p className="text-on-surface/50 text-xs leading-relaxed flex-grow mb-4 line-clamp-2">
                          {rel.description}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-xs font-headline font-bold text-primary/60 group-hover:text-primary group-hover:gap-2.5 transition-all duration-300">
                          View Details
                          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>arrow_forward</span>
                        </span>
                      </div>
                    </Link>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
