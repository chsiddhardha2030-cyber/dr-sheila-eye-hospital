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
      className="relative w-full h-screen min-h-[640px] bg-[#050912] text-brand-ivory font-sans flex items-center overflow-hidden"
    >
      {/* 1. Full-Bleed Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          src="/Images/eye-hospital-video-ready-watermark.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center pointer-events-none select-none"
        />
      </div>

      {/* 2. Cinematic Gradient Overlay (Dark edge transitions preserving the central eye transformation) */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#050912]/90 via-[#050912]/60 to-[#050912]/30" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#050912] via-transparent to-[#050912]/60" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_50%_at_20%_50%,rgba(5,9,18,0.7),transparent_70%)]" />

      {/* 3. Editorial Typography & Content Layer */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-6 md:px-12 flex flex-col justify-center h-full pt-16">
        <div className="max-w-3xl flex flex-col items-start">



          {/* Large Confident Display Headline (Manrope) */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-heading font-extrabold text-5xl sm:text-7xl lg:text-8xl text-white tracking-[-0.035em] leading-[1.02] mb-7"
          >
            Expert Eye Care.<br />
            <span className="text-white/90">Clearer Vision.</span>
          </motion.h1>

          {/* Clean Editorial Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-brand-muted text-lg sm:text-xl font-normal leading-relaxed max-w-lg mb-11"
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
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-slate-100 text-[#050912] font-heading font-bold text-sm tracking-wide transition-all duration-300 shadow-2xl cursor-pointer"
            >
              Book an Appointment
            </button>

            <button
              onClick={() => scrollTo('#clinics')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/15 font-heading font-medium text-sm tracking-wide backdrop-blur-md transition-all duration-300 cursor-pointer group"
            >
              <span>Explore Our Clinics</span>
              <ArrowUpRight size={16} className="text-brand-muted group-hover:text-white transition-colors" />
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
