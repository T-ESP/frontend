// src/pages/DisplaySite/index.tsx

import Hero from './Hero';
import Features from './Features';
import Testimonials from './Testimonials';
import AISection from './AISection';

export default function DisplaySite() {
  return (
    <main className="display-site">
      <Hero />
      <Features />
      <Testimonials />
      <AISection />
    </main>
  );
}
