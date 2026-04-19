'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SpotlightCard from './ui/SpotlightCard'

const categories = [
  {
    title: 'Whole Spices',
    description:
      'Unground and aromatic, our whole spices are preserved in their natural form — offering intense, authentic flavors and maximum shelf life.',
    imgSrc: '/products/coriander.png',
    imgAlt: 'Organic coriander whole spices',
    badge: 'Best Sellers',
    badgeIcon: 'star',
    href: '/whole-spices',
    bg: 'bg-amber-950/10',
  },
  {
    title: 'Powder Spices',
    description:
      'Finely ground, vibrant, and potent — our spice powders blend seamlessly to create bold color and deep flavor in every dish.',
    imgSrc: '/products/turmeric.png',
    imgAlt: 'Turmeric and powder spices',
    badge: 'Premium',
    badgeIcon: 'workspace_premium',
    href: '/product',
    bg: 'bg-yellow-950/10',
  },
  {
    title: 'Seeds & Grains',
    description:
      'Heirloom seeds harvested at peak potency — rich in nutrition and bursting with the earthy vitality of regenerative soil.',
    imgSrc: '/products/fennel.png',
    imgAlt: 'Fennel seeds and heritage grains',
    badge: 'Heritage',
    badgeIcon: 'eco',
    href: '/product',
    bg: 'bg-green-950/10',
  },
  {
    title: 'Blends & Mixes',
    description:
      'Expertly crafted spice blends born from generations of culinary tradition, balanced for perfection in every pinch.',
    imgSrc: '/products/spice-mix.png',
    imgAlt: 'Curated spice blends and mixes',
    badge: 'New Arrival',
    badgeIcon: 'new_releases',
    href: '/product',
    bg: 'bg-rose-950/10',
  },
]

export default function CollectionSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="py-32 bg-surface-container-low" id="collection" ref={ref}>
      <div className="max-w-screen-2xl mx-auto px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-secondary font-headline font-bold tracking-[0.2em] uppercase text-sm mb-4 block">
              Our Collections
            </span>
            <h2 className="text-primary font-headline font-extrabold text-4xl md:text-6xl leading-tight">
              Curated{' '}
              <span className="font-light italic">Botanicals</span>
            </h2>
          </motion.div>
          <motion.a
            href="/product"
            className="inline-flex items-center gap-2 text-primary font-headline font-bold border-b-2 border-primary pb-1 hover:gap-4 transition-all duration-300 text-sm self-start md:self-end"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            View All Products
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              arrow_forward
            </span>
          </motion.a>
        </div>

        {/* Grid — 2 rows of 2, first card is tall */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -4 }}
              className="h-full"
            >
              <SpotlightCard
                className="h-full rounded-[2rem]"
                spotlightColor="rgba(2, 28, 16, 0.07)"
              >
              <Link
                href={cat.href}
                className="group flex flex-col h-full relative overflow-hidden rounded-[2rem] bg-surface-container-lowest editorial-shadow hover:shadow-2xl transition-shadow duration-500"
              >
                {/* Image */}
                <div className={`relative overflow-hidden ${cat.bg}`} style={{ aspectRatio: '4/3' }}>
                  <Image
                    src={cat.imgSrc}
                    alt={cat.imgAlt}
                    fill
                    className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Gradient overlay on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/30 to-transparent" />
                  {/* Badge */}
                  <div className="absolute top-5 left-5 bg-primary/85 backdrop-blur-sm text-primary-fixed px-4 py-1.5 rounded-full text-xs font-headline font-bold tracking-wider flex items-center gap-1.5 shadow-lg">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: '13px', fontVariationSettings: "'FILL' 1" }}
                    >
                      {cat.badgeIcon}
                    </span>
                    {cat.badge}
                  </div>
                </div>

                {/* Body */}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-primary font-headline font-extrabold text-2xl leading-tight">
                      {cat.title}
                    </h3>
                    <span
                      className="material-symbols-outlined text-outline-variant/0 group-hover:text-secondary/70 -translate-x-3 group-hover:translate-x-0 transition-all duration-500 ease-out shrink-0 ml-2 mt-1"
                      style={{ fontSize: '20px' }}
                    >
                      north_east
                    </span>
                  </div>
                  <p className="text-on-surface/60 text-sm leading-relaxed flex-grow mb-6">
                    {cat.description}
                  </p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center gap-2 px-7 py-3 bg-primary-container text-on-primary-container rounded-full font-headline font-semibold text-sm transition-all duration-300 group-hover:bg-primary group-hover:text-on-primary">
                      Explore
                      <span
                        className="material-symbols-outlined opacity-60 group-hover:opacity-100 transition-opacity"
                        style={{ fontSize: '16px' }}
                      >
                        arrow_forward
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
