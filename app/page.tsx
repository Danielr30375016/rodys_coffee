import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Attributes from '@/components/Attributes'
import Story from '@/components/Story'
import Finca from '@/components/Finca'
import Products from '@/components/Products'
import CupScore from '@/components/CupScore'
import Process from '@/components/Process'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Process />
      <Hero />
      <Attributes />
      <Story />
      <Finca />
      <Products />
      <CupScore />
      <CTA />
      <Footer />
    </main>
  )
}