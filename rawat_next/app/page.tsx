import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import StorySection from '@/components/StorySection'
import CollectionSection from '@/components/CollectionSection'
import ValuesSection from '@/components/ValuesSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="bg-background text-on-surface">
      <Navbar />
      <HeroSection />
      <StorySection />
      <CollectionSection />
      <ValuesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
