'use client'

import { motion } from 'framer-motion'
import SpotlightCard from '@/components/ui/SpotlightCard'
import BlurText from '@/components/ui/BlurText'
import Link from 'next/link'

const wholeSpices = [
  { name: 'Cumin', desc: 'Warm, earthy seeds — the aromatic heartbeat of South Asian and Middle Eastern cuisine.', color: '#B45309' },
  { name: 'Chilli', desc: 'Sun-dried whole chillies with rich, fiery heat and deeply vibrant red color.', color: '#DC2626' },
  { name: 'Turmeric', desc: 'Golden rhizome roots with earthy depth, mild bitterness, and potent anti-inflammatory properties.', color: '#D97706' },
  { name: 'Coriander', desc: 'Light, citrusy seeds with a delicate floral undertone and warming spice.', color: '#92400E' },
  { name: 'Celery Seeds', desc: 'Small yet bold — a distinctive warm, slightly bitter flavor that elevates every dish.', color: '#4D7C0F' },
  { name: 'Ginger', desc: 'Pungent dried roots with warming spice, bright citrus notes, and digestive benefits.', color: '#D97706' },
  { name: 'Fennel', desc: 'Sweet anise-like seeds with a refreshing, licorice-forward aroma and mild sweetness.', color: '#065F46' },
  { name: 'Fenugreek', desc: 'Bitter-sweet seeds packed with nutrients and a unique maple-like finish when roasted.', color: '#78350F' },
  { name: 'Ajwain', desc: "Thyme-like, digestive seeds with intense, camphor-tinged heat — powerful in every pinch.", color: '#57534E' },
  { name: 'Asafoetida', desc: 'Pungent resin with a powerful umami character that transforms completely when cooked.', color: '#A16207' },
  { name: 'Black Pepper', desc: 'The universal spice — bold heat with citrus and woody depth. The king of spices.', color: '#374151' },
  { name: 'Green Cardamom', desc: 'Floral, sweet pods with eucalyptus notes and bright, complex aromatics. Royally fragrant.', color: '#065F46' },
  { name: 'Cassia', desc: 'Thick, robust bark with intense cinnamon-like warmth and bold, lingering spice.', color: '#78350F' },
  { name: 'Cinnamon', desc: 'Delicate, sweet quills with a refined, warm, and woody fragrance. Ceylon\'s finest.', color: '#B45309' },
  { name: 'Clove', desc: 'Intensely aromatic dried buds with numbing warmth, depth, and a bold floral note.', color: '#292524' },
  { name: 'Dill Seeds', desc: 'Herbal, slightly anise-flavored seeds with a clean, fresh, delicate finish.', color: '#4D7C0F' },
  { name: 'Garlic', desc: 'Pungent, essential dried bulbs — the irreplaceable foundation of bold, savory flavors worldwide.', color: '#78716C' },
  { name: 'Star Anise', desc: 'Star-shaped pods with a sweet, intense licorice and fennel aroma. Beautiful and bold.', color: '#92400E' },
  { name: 'Black Cardamom', desc: 'Smoky, camphor-rich pods — ideal for slow-cooked, deeply aromatic preparations.', color: '#1F2937' },
]

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function WholeSpicesPage() {
  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex items-end bg-primary overflow-hidden pt-28 pb-20 px-8">
        <div className="noise-overlay opacity-[0.04]" />
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary-container/10 blur-[120px] pointer-events-none" />

        <div className="max-w-screen-2xl mx-auto w-full relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-fixed/50 hover:text-primary-fixed text-sm font-headline mb-10 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
            Back to Home
          </Link>

          <motion.span
            className="text-primary-fixed-dim/60 font-headline font-bold tracking-[0.25em] uppercase text-xs mb-6 block"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            The Collection
          </motion.span>

          <BlurText
            text="Whole Spices"
            className="text-primary-fixed font-headline font-extrabold text-6xl md:text-8xl leading-none mb-6"
            delay={80}
            animateBy="words"
          />

          <motion.p
            className="text-primary-fixed/55 text-lg md:text-xl max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Hand-harvested and sun-dried, preserving their essential oils and vibrant aromatics.
            Nineteen botanicals in their most primal, unaltered form.
          </motion.p>

          <motion.div
            className="flex items-center gap-4 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <div className="h-px w-12 bg-primary-fixed/20" />
            <span className="text-primary-fixed/40 font-headline italic text-sm">
              {wholeSpices.length} varieties available
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── Product Grid ─────────────────────────────────────────────────── */}
      <section className="py-24 px-8 bg-surface">
        <div className="max-w-screen-2xl mx-auto">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {wholeSpices.map((spice) => (
              <motion.div key={spice.name} variants={cardVariant}>
                <SpotlightCard
                  className="group h-full rounded-2xl bg-surface-container border border-outline-variant/30 hover:border-outline/50 hover:shadow-lg transition-all duration-300"
                  spotlightColor="rgba(2, 28, 16, 0.06)"
                >
                  <div className="p-7 flex flex-col h-full min-h-[220px]">
                    {/* Color dot */}
                    <div
                      className="w-3 h-3 rounded-full mb-5 shrink-0"
                      style={{ backgroundColor: spice.color }}
                    />
                    <h3 className="font-headline font-extrabold text-xl text-primary mb-3 group-hover:translate-x-0.5 transition-transform duration-300">
                      {spice.name}
                    </h3>
                    <p className="text-on-surface/55 text-sm leading-relaxed flex-grow mb-6">
                      {spice.desc}
                    </p>
                    <a
                      href="mailto:hello@rawatorganics.com?subject=Inquiry: Whole Spices"
                      className="inline-flex items-center gap-1.5 text-xs font-headline font-bold text-primary/70 hover:text-primary hover:gap-3 transition-all duration-300"
                    >
                      Inquire
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                        arrow_forward
                      </span>
                    </a>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Quote ────────────────────────────────────────────────────── */}
      <section className="bg-primary py-28 px-8 relative overflow-hidden">
        <div className="noise-overlay opacity-[0.04]" />
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
            href="mailto:hello@rawatorganics.com?subject=Wholesale Inquiry"
            className="inline-flex items-center gap-3 px-10 py-4 bg-primary-fixed text-primary font-headline font-bold rounded-full hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Inquire for Wholesale
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>north_east</span>
          </a>
        </div>
      </section>
    </main>
  )
}
