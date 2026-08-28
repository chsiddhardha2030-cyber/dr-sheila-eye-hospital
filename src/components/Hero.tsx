import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export const Hero: React.FC = () => {
  const scrollTo = (id: string) => {
    const element = document.querySelector(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="hero"
      className="relative w-full min-h-[580px] pt-32 pb-20 md:py-36 text-[#1C242E] font-sans flex items-center overflow-hidden"
      style={{ minHeight: '580px' }}
    >
      {/* ── Video Background Layer ─────────────────────────────────── */}
      {/* Desktop: 16:9 video (hidden on mobile) */}
      <video
        className="absolute inset-0 w-full h-full object-cover hidden md:block"
        src="/Images/16-9-eye-exploded-2.mp4"
        autoPlay
        muted 
        loop
        playsInline
        aria-hidden="true"
        style={{ zIndex: 0 }}
      />

      {/* Mobile: 9:16 video (hidden on desktop) */}
      <video
        className="absolute inset-0 w-full h-full object-cover block md:hidden"
        src="/Images/9-16-eye-exploded-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        style={{ zIndex: 0 }}
      />

      {/* ── Subtle Gradient Overlay for text readability ────────────── */}
      {/* Left-side fade so text remains readable over the video */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background:
            'linear-gradient(to right, rgba(250,248,245,0.88) 0%, rgba(250,248,245,0.72) 45%, rgba(250,248,245,0.10) 75%, rgba(250,248,245,0.0) 100%)',
        }}
      />
      {/* Subtle bottom fade for smooth section transition */}
      <div
        className="absolute inset-x-0 bottom-0 h-24"
        style={{
          zIndex: 1,
          background:
            'linear-gradient(to bottom, transparent, rgba(250,248,245,0.6))',
        }}
      />

      {/* ── Hero Content Layer ─────────────────────────────────────── */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-6 md:px-12 flex flex-col justify-center h-full">
        <div className="max-w-3xl flex flex-col items-start">

          {/* Large Confident Display Headline (Manrope) */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-heading font-extrabold text-5xl sm:text-7xl lg:text-8xl text-[#1C242E] tracking-[-0.035em] leading-[1.02] mb-7"
          >
            Expert Eye Care.<br />
            <span className="text-stone-700">Clearer Vision.</span>
          </motion.h1>

          {/* Clean Editorial Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-[#5A687A] text-lg sm:text-xl font-normal leading-relaxed max-w-lg mb-11"
          >
            Advanced eye care with expertise, technology and compassion.
          </motion.p>

          {/* Minimal CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="flex flex-wrap items-center gap-5 w-full sm:w-auto"
          >
            <button
              onClick={() => scrollTo('#appointment')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#BE185D] hover:bg-[#9F1239] text-white font-heading font-bold text-sm tracking-wide transition-all duration-300 shadow-md cursor-pointer"
            >
              Book an Appointment
            </button>

            <button
              onClick={() => scrollTo('#clinics')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white hover:bg-stone-50 text-[#1C242E] border border-[#E8E2D8] font-heading font-medium text-sm tracking-wide transition-all duration-300 cursor-pointer group shadow-xs"
            >
              <span>Explore Our Clinics</span>
              <ArrowUpRight size={16} className="text-[#BE185D] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
