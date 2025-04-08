'use client';

import Footer from './components/Footer';
import FeaturesSection from './components/FeatureSection';
import HeroSection from './components/HeroSection';

export default function Home() {
  
  
  return (
    <main className="min-h-screen flex flex-col">
      <HeroSection />
      <FeaturesSection/>
      <Footer/>
    </main>
  )
}
