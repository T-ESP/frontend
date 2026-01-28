// src/pages/DisplaySite/index.tsx

import Hero from './Hero';
import Features from './Features';
import Testimonials from './Testimonials';
import AISection from './AISection';
import Preview from './Preview';

export default function HomePage() {
  return (
    <main className="display-site">
      <Hero />
      <Features />
      <Testimonials />
      <AISection />
      <Preview />
    </main>
  );
}
