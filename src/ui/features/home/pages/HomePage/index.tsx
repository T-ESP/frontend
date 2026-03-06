import Hero from './Hero';
import Features from './Features';
import Testimonials from './Testimonials';
import AISection from './AISection';
import Preview from './Preview';
import Footer from './Footer';

export default function HomePage() {
  return (
    <main className="bg-white">
      <Hero />
      <Features />
      <Testimonials />
      <AISection />
      <Preview />
      <Footer />
    </main>
  );
}
