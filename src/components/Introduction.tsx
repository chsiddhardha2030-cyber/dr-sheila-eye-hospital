import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'

/* ─────────────────────────────────────────────────────────────────────────────
   Premium inline SVG icons — minimal, medical, consistent with dark theme
───────────────────────────────────────────────────────────────────────────── */

const IconHospitalNetwork = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="1" width="10" height="20" rx="1.5" stroke="currentColor" strokeWidth="1.4" fill="none"/>
    <rect x="1" y="7" width="20" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" fill="none"/>
    <rect x="9.5" y="3.5" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.5"/>
    <rect x="9.5" y="15.5" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.5"/>
    <rect x="3.5" y="10" width="3.5" height="2" rx="0.5" fill="currentColor" opacity="0.5"/>
    <rect x="15" y="10" width="3.5" height="2" rx="0.5" fill="currentColor" opacity="0.5"/>
  </svg>
)

const IconMission = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="9.5" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="11" cy="11" r="5" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="11" cy="11" r="1.6" fill="currentColor"/>
    <line x1="11" y1="1" x2="11" y2="4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="11" y1="17.5" x2="11" y2="21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="1" y1="11" x2="4.5" y2="11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="17.5" y1="11" x2="21" y2="11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)

const IconVision = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 11C1 11 4.5 4 11 4C17.5 4 21 11 21 11C21 11 17.5 18 11 18C4.5 18 1 11 1 11Z"
      stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
    <circle cx="11" cy="11" r="3.4" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="11" cy="11" r="1.2" fill="currentColor"/>
    <line x1="14" y1="7.5" x2="15.5" y2="6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.55"/>
    <line x1="8.5" y1="7" x2="7.2" y2="5.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.38"/>
  </svg>
)

const IconPatientCare = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 19C11 19 2 13.5 2 7.5C2 5.1 3.9 3 6.5 3C8.2 3 9.7 3.9 10.5 5.2L11 6L11.5 5.2C12.3 3.9 13.8 3 15.5 3C18.1 3 20 5.1 20 7.5C20 13.5 11 19 11 19Z"
      stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
    <path d="M7.5 10.5H9.5L10.5 8.5L12 12L13 10.5H14.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const pillars = [
  {
    Icon: IconHospitalNetwork,
    label: 'Introduction',
    title: 'Hospital Network',
    description:
      'Dr. Sheila\u2019s Eye Hospitals is a dedicated regional eye care network serving the Srikakulam district through modern clinical centers in Palasa, Sompeta, and Ichapuram.',
  },
  {
    Icon: IconMission,
    label: 'Our Mission',
    title: 'Mission Statement',
    description:
      'To deliver accessible, ethical, and high-standard ophthalmic care to every patient across urban and rural communities, preventing avoidable blindness through timely intervention and clinical excellence.',
  },
  {
    Icon: IconVision,
    label: 'Our Vision',
    title: 'Vision Statement',
    description:
      'To be the regional benchmark for comprehensive eye health, combining precision microsurgical technology, clinical expertise, and compassionate care.',
  },
  {
    Icon: IconPatientCare,
    label: 'Our Core Value',
    title: 'Patient-Centered Philosophy',
    description:
      'Every patient is treated with respect, transparent clinical counsel, and empathetic attention, ensuring thorough diagnosis and supportive care throughout their treatment journey.',
  },
]

export const Introduction: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return
    const delta = touchStartX.current - touchEndX.current
    if (Math.abs(delta) > 40) {
      if (delta > 0) {
        setActiveIndex((prev) => Math.min(prev + 1, pillars.length - 1))
      } else {
        setActiveIndex((prev) => Math.max(prev - 1, 0))
      }
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <section
      id="about"
      className="bg-[#050912] pt-8 pb-20 md:py-36 text-brand-ivory font-sans border-b border-white/[0.06] relative"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header — Editorial two-column: text left, hospital image right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-12 md:mb-20">
          {/* Left: Heading + description */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col"
          >
            <span className="text-[12px] font-heading font-medium tracking-[0.25em] uppercase text-cyan-400 mb-4 block">
              About Dr. Sheila Eye Hospitals
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-[-0.03em] leading-[1.15] mb-6">
              Dedicated ophthalmic expertise rooted in genuine patient care.
            </h2>
            <p className="text-brand-muted text-base sm:text-lg leading-relaxed font-normal mb-4">
              Established to provide dependable ophthalmic care across the north-coastal region of Andhra Pradesh, Dr. Sheila&#39;s Eye Hospitals operates specialized outpatient clinics in Sompeta and Ichapuram alongside a centralized microsurgical hospital in Palasa.
            </p>
            <p className="text-sm text-brand-subtle leading-relaxed">
              Committed to preserving and restoring visual clarity through experienced surgeons, modern ophthalmic diagnostics, and community-wide public eye health initiatives.
            </p>
          </motion.div>

          {/* Right: Dr. Sheila's Eye Hospital — front-view photograph */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl aspect-[3/4] group">
              <img
                src="/optimized/clinics/palasa/SPD_6977.webp"
                alt="Dr. Sheila's Eye Hospital — Palasa Main Center, front view"
                className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
                loading="lazy"
              />
              {/* Premium dark vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050912]/75 via-[#050912]/10 to-transparent pointer-events-none" />
              {/* Caption badge */}
              <div className="absolute bottom-5 left-5 right-5">
                <span className="inline-block px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-[11px] font-heading font-medium tracking-widest uppercase text-white/80">
                  Dr. Sheila&#39;s Eye Hospital · Palasa
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── DESKTOP: 4-column grid ─────────────────────────────────────────── */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const { Icon } = pillar
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="p-7 rounded-2xl bg-[#07111D] border border-white/[0.06] hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all duration-300">
                    <Icon />
                  </div>

                  <span className="text-[11px] font-heading font-semibold uppercase tracking-widest text-cyan-400/80 mb-2 block">
                    {pillar.label}
                  </span>

                  <h3 className="font-heading font-bold text-xl text-white tracking-tight mb-3">
                    {pillar.title}
                  </h3>

                  <p className="text-brand-muted text-sm leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* ── MOBILE: Horizontal swipe carousel ─────────────────────────────── */}
        <div className="md:hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="relative overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <motion.div
                animate={{ x: `-${activeIndex * 100}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex"
              >
                {pillars.map((pillar, idx) => {
                  const { Icon } = pillar
                  return (
                    <div key={idx} className="w-full shrink-0">
                      <div className="p-7 rounded-2xl bg-[#07111D] border border-white/[0.06] flex flex-col shadow-xl min-h-[210px]">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
                          <Icon />
                        </div>
                        <span className="text-[11px] font-heading font-semibold uppercase tracking-widest text-cyan-400/80 mb-2 block">
                          {pillar.label}
                        </span>
                        <h3 className="font-heading font-bold text-xl text-white tracking-tight mb-3">
                          {pillar.title}
                        </h3>
                        <p className="text-brand-muted text-sm leading-relaxed font-normal">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            </div>

            {/* Pagination dots */}
            <div className="flex items-center justify-center gap-2.5 mt-5">
              {pillars.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to card ${idx + 1}`}
                  className="cursor-pointer"
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      activeIndex === idx
                        ? 'w-5 h-1.5 bg-cyan-400'
                        : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/45'
                    }`}
                  />
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Three Regional Centers strip intentionally removed */}
      </div>
    </section>
  )
}
