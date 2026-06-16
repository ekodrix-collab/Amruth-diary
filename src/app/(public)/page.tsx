import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/home/HeroSection'

import { HowItWorks } from '@/components/home/HowItWorks'
import { ProductsPreview } from '@/components/home/ProductsPreview'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />

        <HowItWorks />
        <ProductsPreview />
      </main>
      <Footer />
    </>
  )
}
