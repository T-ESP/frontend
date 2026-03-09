import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import Hero from './Hero';
import Features from './Features';
import Testimonials from './Testimonials';
import AISection from './AISection';
import Preview from './Preview';
import Footer from './Footer';

function GlobalBackground() {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  // Very slow spring for a soft, "living" feel
  const smx = useSpring(mx, { stiffness: 20, damping: 25 });
  const smy = useSpring(my, { stiffness: 20, damping: 25 });

  const px = useTransform(smx, (v) => `${(v * 100).toFixed(1)}%`);
  const py = useTransform(smy, (v) => `${(v * 100).toFixed(1)}%`);
  const rpx = useTransform(smx, (v) => `${((1 - v) * 100).toFixed(1)}%`);
  const rpy = useTransform(smy, (v) => `${((1 - v) * 100).toFixed(1)}%`);

  const bg = useMotionTemplate`
    radial-gradient(circle at ${px} ${py}, rgba(123,95,162,0.08) 0%, transparent 45%),
    radial-gradient(circle at ${rpx} ${rpy}, rgba(176,142,224,0.05) 0%, transparent 40%),
    #fafafc`;

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mx, my]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated Mesh */}
      <motion.div className="absolute inset-0" style={{ background: bg }} />

      {/* Dot Grid Layer 1 */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: 'radial-gradient(rgba(123,95,162,0.2) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Noise Texture for Depth */}
      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <GlobalBackground />
      <Hero />
      <Features />
      <Testimonials />
      <AISection />
      <Preview />
      <Footer />
    </main>
  );
}
