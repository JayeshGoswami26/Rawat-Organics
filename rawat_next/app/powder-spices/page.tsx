'use client'

import { motion } from 'framer-motion'
import SpotlightCard from '@/components/ui/SpotlightCard'
import BlurText from '@/components/ui/BlurText'
import Link from 'next/link'

const powderSpices = [
  { name: 'Cumin Powder', desc: 'Deep, warm, and smoky — adds earthy backbone to curries, dals, and marinades.', color: '#B45309' },
  { name: 'Chilli Powder', desc: 'Fiery and vibrant red, delivering bold heat and rich color to any dish.', color: '#DC2626' },
  { name: 'Turmeric Powder', desc: 'Brilliant golden, earthy, and slightly bitter — a staple with powerful health benefits.', color: '#D97706' },
  { name: 'Coriander Powder', desc: 'Mild, citrusy, and subtly sweet — the gentle foundation of most spice blends.', color: '#92400E' },
  { name: 'Ginger Powder', desc: 'Sharp, warm, and bright — adds depth to both sweet and savory preparations.', color: '#CA8A04' },
  { name: 'Curry Leaves Powder', desc: 'Nutty, aromatic, and distinctive — captures the soul of South Indian cooking.', color: '#4D7C0F' },
  { name: 'Fennel Powder', desc: 'Sweet, licorice-like, and cool — beautifully aromatic in meat and vegetable dishes.', color: '#065F46' },
  { name: 'Fenugreek Powder', desc: 'Bitter-sweet with a maple finish — a complex, nutrient-rich addition to blends.', color: '#78350F' },
  { name: 'Ajwain Powder', desc: 'Intense, thyme-like, and digestive — powerful in small quantities, deeply aromatic.', color: '#57534E' },
  { name: 'Asafoetida Powder', desc: 'Pungent raw, transformative cooked — adds irreplaceable depth to vegetarian dishes.', color: '#A16207' },
  { name: 'Bay Leaves Powder', desc: 'Herbal, slightly floral and eucalyptus-like — elevates slow-cooked broths and sauces.', color: '#166534' },
  { name: 'Black Pepper Powder', desc: 'Sharp, hot, and universally essential — the most used spice in the world.', color: '#374151' },
  { name: 'Cardamom Powder', desc: 'Floral, sweet, and intensely aromatic — the queen of spices in its finest form.', color: '#065F46' },
  { name: 'Cassia Powder', desc: 'Bold, robust cinnamon-like warmth with a deeper, more intense character.', color: '#78350F' },
  { name: 'Cinnamon Powder', desc: 'Warm, sweet, and delicately woody — versatile from chai to desserts.', color: '#B45309' },
  { name: 'Clove Powder', desc: 'Intensely aromatic with numbing warmth — complex and essential to garam masala.', color: '#292524' },
  { name: 'Dill Seeds Powder', desc: 'Fresh, herbal, and anise-like — brightens pickling brines and salad dressings.', color: '#4D7C0F' },
  { name: 'Garlic Powder', desc: 'Rich, savory, and concentrated — pure garlic intensity without the moisture.', color: '#78716C' },
  { name: 'Greater Galangal', desc: 'Sharp and citrusy with pine-like notes — essential to Southeast Asian cuisine.', color: '#A16207' },
  { name: 'Mace Powder', desc: "Nutmeg's warm, slightly sweeter sister — complex, aromatic, and delicately refined.", color: '#EA580C' },
  { name: 'Nutmeg Powder', desc: 'Warm, sweet, and deeply spicy — transforms béchamel, desserts, and festive drinks.', color: '#92400E' },
  { name: 'Star Anise Powder', desc: 'Intensely licorice-like and sweet — foundational to five-spice and star broths.', color: '#78350F' },
]

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function PowderSpicesPage() {
  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex items-end bg-[#1a0a00] overflow-hidden pt-28 pb-20 px-8">
        <div className="noise-overlay opacity-[0.05]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-amber-600/10 blur-[140px] pointer-events-none" />

        <div className="max-w-screen-2xl mx-auto w-full relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-amber-100/40 hover:text-amber-100/70 text-sm font-headline mb-10 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
            Back to Home
          </Link>

          <motion.span
            className="text-amber-400/50 font-headline font-bold tracking-[0.25em] uppercase text-xs mb-6 block"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            The Collection
          </motion.span>

          <BlurText
            text="Powder Spices"
            className="text-amber-50 font-headline font-extrabold text-6xl md:text-8xl leading-none mb-6"
            delay={80}
            animateBy="words"
          />

          <motion.p
            className="text-amber-50/45 text-lg md:text-xl max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Cold-milled at low temperature to preserve volatile oils and vivid color.
            Twenty-two botanicals ground to their purest, most potent form.
          </motion.p>

          <motion.div
            className="flex items-center gap-4 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <div className="h-px w-12 bg-amber-400/20" />
            <span className="text-amber-50/30 font-headline italic text-sm">
              {powderSpices.length} varieties available
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
            {powderSpices.map((spice) => (
              <motion.div key={spice.name} variants={cardVariant}>
                <SpotlightCard
                  className="group h-full rounded-2xl bg-surface-container border border-outline-variant/30 hover:border-outline/50 hover:shadow-lg transition-all duration-300"
                  spotlightColor="rgba(180, 83, 9, 0.06)"
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
                      href="mailto:hello@rawatorganics.com?subject=Inquiry: Powder Spices"
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

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#1a0a00] py-28 px-8 relative overflow-hidden">
        <div className="noise-overlay opacity-[0.05]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <span
            className="material-symbols-outlined text-5xl text-amber-400/10 mb-8 block"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            format_quote
          </span>
          <h2 className="text-3xl md:text-5xl font-headline italic text-amber-50 leading-tight mb-8">
            &ldquo;Ground to precision, sealed at peak — every gram tells the story of the soil.&rdquo;
          </h2>
          <p className="font-headline tracking-widest uppercase text-xs text-amber-50/30 mb-12">
            — The Rawat Philosophy
          </p>
          <a
            href="mailto:hello@rawatorganics.com?subject=Wholesale Inquiry"
            className="inline-flex items-center gap-3 px-10 py-4 bg-amber-400 text-amber-950 font-headline font-bold rounded-full hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Inquire for Wholesale
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>north_east</span>
          </a>
        </div>
      </section>
    </main>
  )
}
