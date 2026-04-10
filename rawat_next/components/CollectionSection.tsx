'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const categories = [
  {
    title: 'Whole Spices',
    description: 'Fresh and aromatic unground spices preserved in their natural form, offering intense, authentic flavors for your culinary masterpieces.',
    imgSrc: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80',
    imgAlt: 'Vibrant exotic whole spices',
    icon: 'grass',
    href: '/product',
  },
  {
    title: 'Powder Spices',
    description: 'Finely ground, rich, and vibrant spice powders that blend seamlessly to create bold flavor profiles and colorful dishes.',
    imgSrc: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
    imgAlt: 'Finely ground powder spices',
    icon: 'grain',
    href: '/product',
  },
]

export default function CollectionSection() {
  return (
    <section className="py-24 bg-surface-container-low" id="collection">
      <div className="max-w-screen-2xl mx-auto px-8">
        {/* Header */}
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="text-primary font-headline font-extrabold text-4xl md:text-5xl mb-4">
            Curated Collections
          </h2>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
        </motion.div>

        {/* Product grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {categories.map((category, i) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -6 }}
              className="h-full"
            >
              <Link 
                href={category.href}
                className="group flex flex-col h-full relative overflow-hidden rounded-[2rem] editorial-shadow bg-surface-container-lowest transition-shadow duration-500 hover:shadow-2xl"
              >
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden relative">
                  <Image
                    src={category.imgSrc}
                    alt={category.imgAlt}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Category badge */}
                  <div className="absolute top-4 left-4 bg-primary/80 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-headline font-bold tracking-wider flex items-center gap-1.5 shadow-lg">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                      {category.icon}
                    </span>
                    {category.title}
                  </div>
                </div>

                {/* Card body */}
                <div className="p-10 flex flex-col flex-grow">
                  <h3 className="text-primary flex items-center font-headline font-bold text-3xl mb-4 gap-2">
                    {category.title}
                    <span 
                      className="material-symbols-outlined text-secondary opacity-0 -translate-x-2 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-x-0"
                      aria-hidden="true"
                    >
                      arrow_forward
                    </span>
                  </h3>
                  <p className="text-on-surface/70 mb-8 leading-relaxed flex-grow">
                    {category.description}
                  </p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center px-8 py-3 bg-primary-container text-on-primary-container rounded-full font-headline font-bold text-sm transition-all duration-300 group-hover:bg-primary group-hover:text-on-primary active:scale-95">
                      Explore Collection
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
