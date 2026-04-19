import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import MarqueeStrip from '@/components/MarqueeStrip'
import StorySection from '@/components/StorySection'
import StatsSection from '@/components/StatsSection'
import CollectionSection from '@/components/CollectionSection'
import ProcessSection from '@/components/ProcessSection'
import ValuesSection from '@/components/ValuesSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="bg-background text-on-surface">
      <Navbar />
      <HeroSection />
      <MarqueeStrip />
      <StorySection />
      <StatsSection />
      <CollectionSection />
      <ProcessSection />
      <ValuesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
