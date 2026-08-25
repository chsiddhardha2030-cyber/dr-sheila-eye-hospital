import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  GraduationCap,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react'

interface InitiativeData {
  number: string
  title: string
  subtitle: string
  preview: string
  extended: string
  icon: React.ElementType
  impact: string
  image: string
  imageCaption: string
}

export const CommunityCare: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [expanded, setExpanded] = useState<boolean>(false)
  const [direction, setDirection] = useState<number>(0)

  // Touch gesture support for mobile swiping
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const initiatives: InitiativeData[] = [
    {
      number: '01',
      title: 'School Eye Health Programs',
      subtitle: 'Early Detection for Young Learners',
      preview:
        'Systematic vision screenings conducted directly in regional primary and secondary schools across Srikakulam.',
      extended:
        'Our team detects uncorrected refractive errors, amblyopia (lazy eye), and pediatric ocular conditions early to safeguard children’s learning ability and educational growth.',
      icon: GraduationCap,
      impact: 'Early vision triage & corrective spectacle distribution in schools',
      image: '/optimized/clinics/sompeta/DSC_8324.webp',
      imageCaption: 'School Screening Initiative & Pediatric Triage',
    },
    {
      number: '02',
      title: 'Diabetic Retinopathy Screening',
      subtitle: 'Preventing Avoidable Diabetic Blindness',
      preview:
        'Targeted fundus and retinal evaluation camps for diabetic individuals in semi-urban and rural areas.',
      extended:
        'Because diabetic eye changes can progress painlessly until sight is compromised, our proactive screenings ensure timely laser intervention and medical guidance before irreversible damage occurs.',
      icon: Sparkles,
      impact: 'Proactive fundus imaging & timely retinal referrals',
      image: '/optimized/clinics/palasa/DSC_8224.webp',
      imageCaption: 'Retinal Diagnostics & Fundus Evaluation Camp',
    },
    {
      number: '03',
      title: 'Village Screening Camps',
      subtitle: 'Bringing Ophthalmic Care to Doorsteps',
      preview:
        'Grassroots outreach eye checkup camps organized in remote villages and rural hamlets.',
      extended:
        'We bring diagnostic equipment, optometrists, and medical staff into communities to provide free vision testing, cataract triage, medication distribution, and structured referrals to our Palasa surgical hospital.',
      icon: MapPin,
      impact: 'Community triage, free consultations & direct surgical pathways',
      image: '/optimized/clinics/ichapuram/DSC_8512.webp',
      imageCaption: 'Rural Screening Camp & Surgical Referrals',
    },
  ]

  const total = initiatives.length

  const handleSelect = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1)
    setActiveIndex(index)
    setExpanded(false)
  }

  const handlePrev = () => {
    setDirection(-1)
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : total - 1))
    setExpanded(false)
  }

  const handleNext = () => {
    setDirection(1)
    setActiveIndex((prev) => (prev < total - 1 ? prev + 1 : 0))
    setExpanded(false)
  }

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
        handleNext()
      } else {
        handlePrev()
      }
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  const current = initiatives[activeIndex]
  const Icon = current.icon

  return (
    <section
      id="community"
      className="bg-[#050912] py-24 md:py-32 text-brand-ivory font-sans border-b border-white/[0.06] relative overflow-hidden"
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* ── Section Header ─────────────────────────────────────────────────── */}
        <div className="max-w-3xl mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2.5 mb-3.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-[12px] font-heading font-medium tracking-[0.25em] uppercase text-cyan-400">
              Community Outreach & Public Health
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-[-0.03em] leading-[1.12]"
          >
            Serving the wider community beyond hospital walls.
          </motion.h2>
        </div>

        {/* ── Slideshow Container (Desktop & Mobile) ───────────────────────── */}
        <div
          className="relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction >= 0 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction >= 0 ? -40 : 40 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-8 lg:p-12 rounded-3xl bg-[#07111D] border border-white/[0.08] shadow-2xl relative"
            >
              {/* Top Accent Gradient on the active card */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

              {/* Text Storytelling Column */}
              <div className="lg:col-span-7 flex flex-col justify-center text-left">
                {/* Meta Row */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-heading font-extrabold text-2xl sm:text-3xl text-cyan-400 tracking-tighter">
                    {current.number}
                  </span>
                  <div className="h-4 w-px bg-white/20" />
                  <span className="text-xs font-heading font-semibold text-brand-muted tracking-wider uppercase">
                    {current.subtitle}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight mb-4">
                  {current.title}
                </h3>

                {/* Description with Read More / Read Less Interaction */}
                <div className="text-brand-muted text-sm sm:text-base leading-relaxed mb-6 font-normal">
                  <p>{current.preview}</p>

                  <AnimatePresence>
                    {expanded && (
                      <motion.p
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="text-brand-muted text-sm sm:text-base leading-relaxed overflow-hidden"
                      >
                        {current.extended}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Clean Read More / Read Less Button */}
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-cyan-400 hover:text-cyan-300 mt-2.5 transition-colors cursor-pointer"
                  >
                    <span>{expanded ? 'Read Less' : 'Read More'}</span>
                    {expanded ? (
                      <ChevronUp size={14} className="mt-0.5" />
                    ) : (
                      <ChevronDown size={14} className="mt-0.5" />
                    )}
                  </button>
                </div>

                {/* Impact Highlight Badge */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-[#050912]/80 border border-white/[0.06] text-xs">
                  <Icon size={16} className="text-cyan-400 shrink-0" />
                  <span className="font-medium text-cyan-200">{current.impact}</span>
                </div>
              </div>

              {/* Photography Column */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#050912] aspect-[4/3] shadow-xl group">
                  <img
                    src={current.image}
                    alt={current.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050912]/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-brand-muted">
                    <span className="font-heading font-medium text-white">
                      {current.imageCaption}
                    </span>
                    <span className="uppercase tracking-widest text-cyan-400 font-semibold">
                      Outreach
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Symmetrical Bottom Carousel Controls (Desktop & Mobile) ────────── */}
        <div className="flex items-center justify-between mt-6 px-1">
          {/* Initiative 01 / 02 / 03 Tabs */}
          <div className="flex items-center gap-1.5 bg-white/[0.04] p-1.5 rounded-full border border-white/[0.08]">
            {initiatives.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                aria-label={`Select initiative ${item.number}`}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full font-heading text-xs font-semibold transition-all duration-300 cursor-pointer ${
                  idx === activeIndex
                    ? 'bg-cyan-400 text-slate-950 shadow-md font-bold'
                    : 'text-brand-muted hover:text-white'
                }`}
              >
                <span>{item.number}</span>
                <span className="hidden sm:inline ml-1.5 opacity-70 font-normal">
                  {idx === 0 ? 'Schools' : idx === 1 ? 'Diabetes' : 'Villages'}
                </span>
              </button>
            ))}
          </div>

          {/* Prev / Next Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              aria-label="Previous Initiative"
              className="w-10 h-10 rounded-full border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.10] hover:border-cyan-500/40 active:scale-95 transition-all duration-300 flex items-center justify-center text-white cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Initiative"
              className="w-10 h-10 rounded-full border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.10] hover:border-cyan-500/40 active:scale-95 transition-all duration-300 flex items-center justify-center text-white cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ── Redesigned Compact & Premium CTA ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 sm:mt-12 p-6 sm:p-7 md:p-8 rounded-2xl md:rounded-3xl bg-[#07111D] border border-cyan-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden"
        >
          {/* Subtle accent glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Left: Icon, Heading & Compact Description */}
          <div className="flex items-start sm:items-center gap-4 z-10">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 sm:mt-0 shadow-sm">
              <Users size={20} />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base sm:text-lg text-white leading-snug">
                Committed to District-Wide Blindness Prevention
              </h4>
              <p className="text-xs sm:text-sm text-brand-muted mt-1 font-normal leading-relaxed">
                Connecting rural communities to dedicated ophthalmic diagnosis and surgical intervention.
              </p>
            </div>
          </div>

          {/* Right: Clean, Natural Button */}
          <div className="w-full md:w-auto shrink-0 z-10 mt-1 md:mt-0">
            <a
              href="#appointment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-[#050912] font-heading font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer group"
            >
              <span>Contact Hospital Team</span>
              <ArrowRight
                size={14}
                className="transform group-hover:translate-x-1 transition-transform"
              />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
