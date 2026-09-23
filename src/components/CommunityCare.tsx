import React, { useState, useEffect, useRef } from 'react'
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

  // Mobile emergency auto-scrolling carousel state
  const [emergencyIndex, setEmergencyIndex] = useState<number>(0)
  const [isEmergencyInView, setIsEmergencyInView] = useState<boolean>(false)
  const emergencySectionRef = useRef<HTMLDivElement>(null)

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
      image: '/optimized/clinics/sompeta/School(1).png',
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
      image: '/optimized/clinics/sompeta/DSC_9999.jpeg',
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
      image: '/optimized/clinics/ichapuram/DSC_8324.JPG',
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

  const emergencySituations = [
    {
      title: 'Sudden loss of vision',
      desc: 'Abrupt darkness, blackout, or severe drop in vision in one or both eyes.',
    },
    {
      title: 'Eye injury',
      desc: 'Blunt trauma, penetrating foreign object, corneal scratch, or laceration.',
    },
    {
      title: 'Chemical exposure',
      desc: 'Acid, alkali, detergent, pesticide, or toxic solvent splash into the eye.',
    },
    {
      title: 'Sudden flashes & floaters',
      desc: 'Shower of dark floaters or bright flashes accompanied by vision field loss.',
    },
    {
      title: 'Severe eye pain',
      desc: 'Intense throbbing pain, deep ocular ache, or extreme light intolerance.',
    },
    {
      title: 'Sudden red eye with reduced vision',
      desc: 'Acute eye redness accompanied by cloudiness, corneal haze, or reduced sight.',
    },
  ]

  // Track visibility of the emergency section
  useEffect(() => {
    const el = emergencySectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsEmergencyInView(entry.isIntersecting)
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Auto-scroll through emergency cards when in view on mobile
  useEffect(() => {
    if (!isEmergencyInView) return

    const timer = setInterval(() => {
      setEmergencyIndex((prev) => (prev + 1) % emergencySituations.length)
    }, 2800)

    return () => clearInterval(timer)
  }, [isEmergencyInView, emergencySituations.length])

  const emergencyTouchStartX = useRef<number | null>(null)
  const emergencyTouchStartY = useRef<number | null>(null)

  const handleEmergencyTouchStart = (e: React.TouchEvent) => {
    emergencyTouchStartX.current = e.touches[0].clientX
    emergencyTouchStartY.current = e.touches[0].clientY
  }

  const handleEmergencyTouchEnd = (e: React.TouchEvent) => {
    if (emergencyTouchStartX.current === null || emergencyTouchStartY.current === null) return
    const deltaX = emergencyTouchStartX.current - e.changedTouches[0].clientX
    const deltaY = emergencyTouchStartY.current - e.changedTouches[0].clientY

    // Only handle if horizontal swipe is clearly dominant
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX > 0) {
        setEmergencyIndex((prev) => (prev + 1) % emergencySituations.length)
      } else {
        setEmergencyIndex((prev) => (prev > 0 ? prev - 1 : emergencySituations.length - 1))
      }
    }
    emergencyTouchStartX.current = null
    emergencyTouchStartY.current = null
  }

  const current = initiatives[activeIndex]
  const Icon = current.icon

  return (
    <section
      id="community"
      className="bg-[#FFFFFF] py-24 md:py-32 text-[#1C242E] font-sans border-b border-[#E8E2D8] relative overflow-hidden"
    >
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
            <span className="w-1.5 h-1.5 rounded-full bg-[#BE185D]" />
            <span className="text-[12px] font-heading font-semibold tracking-[0.25em] uppercase text-[#BE185D]">
              Community Outreach &amp; Public Health
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#1C242E] tracking-[-0.03em] leading-[1.12]"
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
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-8 lg:p-12 rounded-3xl bg-[#FAF8F5] border border-[#E8E2D8] shadow-[0_4px_20px_-2px_rgba(28,36,46,0.03)] relative"
            >
              {/* Top Accent Gradient on the active card */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#BE185D]/50 to-transparent" />

              {/* Text Storytelling Column */}
              <div className="lg:col-span-7 flex flex-col justify-center text-left">
                {/* Meta Row */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-heading font-extrabold text-2xl sm:text-3xl text-[#BE185D] tracking-tighter">
                    {current.number}
                  </span>
                  <div className="h-4 w-px bg-stone-300" />
                  <span className="text-xs font-heading font-semibold text-[#8A96A6] tracking-wider uppercase">
                    {current.subtitle}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-[#1C242E] tracking-tight leading-tight mb-4">
                  {current.title}
                </h3>

                {/* Description with Read More / Read Less Interaction */}
                <div className="text-[#5A687A] text-sm sm:text-base leading-relaxed mb-6 font-normal">
                  <p>{current.preview}</p>

                  <AnimatePresence>
                    {expanded && (
                      <motion.p
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[#5A687A] text-sm sm:text-base leading-relaxed overflow-hidden"
                      >
                        {current.extended}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Clean Read More / Read Less Button */}
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-[#BE185D] hover:text-[#9F1239] mt-2.5 transition-colors cursor-pointer"
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
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-[#E8E2D8] text-xs shadow-xs">
                  <Icon size={16} className="text-[#BE185D] shrink-0" />
                  <span className="font-medium text-stone-800">{current.impact}</span>
                </div>
              </div>

              {/* Photography Column */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-[#E8E2D8] bg-stone-100 aspect-[4/3] shadow-md group">
                  <img
                    src={current.image}
                    alt={current.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C242E]/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-white">
                    <span className="font-heading font-medium text-white">
                      {current.imageCaption}
                    </span>
                    <span className="uppercase tracking-widest text-rose-200 font-semibold">
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
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1.5 rounded-full border border-[#E8E2D8]">
            {initiatives.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                aria-label={`Select initiative ${item.number}`}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full font-heading text-xs font-semibold transition-all duration-300 cursor-pointer ${
                  idx === activeIndex
                    ? 'bg-[#1C242E] text-white shadow-sm font-bold'
                    : 'text-[#5A687A] hover:text-[#1C242E]'
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
              className="w-10 h-10 rounded-full border border-[#E8E2D8] bg-white hover:bg-stone-100 active:scale-95 transition-all duration-300 flex items-center justify-center text-[#1C242E] cursor-pointer shadow-xs"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Initiative"
              className="w-10 h-10 rounded-full border border-[#E8E2D8] bg-white hover:bg-stone-100 active:scale-95 transition-all duration-300 flex items-center justify-center text-[#1C242E] cursor-pointer shadow-xs"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ── Dedicated Eye Injuries & Eye Emergency Care Area ──────────────── */}
        <motion.div
          ref={emergencySectionRef}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 sm:mt-18 rounded-3xl bg-gradient-to-b from-[#FFF5F7] via-[#FAF8F5] to-[#FFFFFF] border-2 border-rose-200/80 p-6 sm:p-9 lg:p-12 shadow-[0_8px_30px_rgba(190,24,93,0.06)] relative overflow-hidden"
        >
          {/* Top decorative accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-[#BE185D] to-rose-600" />

          {/* Emergency Area Header */}
          <div className="max-w-3xl mb-8 sm:mb-10 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/80 border border-rose-300/80 text-[#BE185D] text-[11px] font-heading font-bold uppercase tracking-wider mb-3.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#BE185D] animate-ping" />
              <span>Eye Emergency &amp; Acute Care</span>
            </div>
            <h3 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-[#1C242E] tracking-tight mb-3">
              Eye Injuries &amp; Urgent Ophthalmic Emergencies
            </h3>
            <p className="text-[#5A687A] text-sm sm:text-base leading-relaxed font-normal">
              Timely medical intervention is critical to prevent permanent vision impairment. If you or someone nearby experience any of the emergency situations below, seek prompt ophthalmic care without delay.
            </p>
          </div>

          {/* Grid: 6 Emergency Situations (Left/Top) + Medical Visual & Emergency CTA (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Column: 6 Emergency Situations */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              {/* Desktop View: 2-column grid of 6 emergency cards */}
              <div className="hidden sm:grid sm:grid-cols-2 gap-3.5 sm:gap-4">
                {emergencySituations.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-rose-100 shadow-[0_2px_12px_rgba(190,24,93,0.04)] hover:border-rose-300 transition-all duration-300 flex items-start gap-3.5"
                  >
                    <span className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 text-[#BE185D] flex items-center justify-center shrink-0 font-heading font-extrabold text-xs">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-[#1C242E] leading-snug mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#5A687A] leading-relaxed font-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile View: Compact Auto-Scrolling Single Card Carousel */}
              <div
                className="block sm:hidden"
                onTouchStart={handleEmergencyTouchStart}
                onTouchEnd={handleEmergencyTouchEnd}
              >
                <div className="relative overflow-hidden min-h-[96px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={emergencyIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="p-4 rounded-2xl bg-white border border-rose-200/90 shadow-[0_2px_12px_rgba(190,24,93,0.05)] flex items-start gap-3.5"
                    >
                      <span className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 text-[#BE185D] flex items-center justify-center shrink-0 font-heading font-extrabold text-xs">
                        {emergencyIndex + 1}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-heading font-bold text-sm text-[#1C242E] leading-snug mb-1">
                          {emergencySituations[emergencyIndex].title}
                        </h4>
                        <p className="text-xs text-[#5A687A] leading-relaxed font-normal">
                          {emergencySituations[emergencyIndex].desc}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Subtle Indicator Dots */}
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  {emergencySituations.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setEmergencyIndex(idx)}
                      aria-label={`Go to emergency card ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === emergencyIndex
                          ? 'w-5 bg-[#BE185D]'
                          : 'w-1.5 bg-rose-200 hover:bg-rose-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Emergency Advisory Note */}
              <div className="mt-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs leading-relaxed flex items-start gap-3">
                <span className="font-bold shrink-0 text-amber-700 uppercase tracking-wider text-[10px] bg-amber-200/60 px-2 py-0.5 rounded-md">
                  First Aid Tip
                </span>
                <span>
                  For chemical splashes, flush the eye immediately with continuous clean water for 15 minutes before transport. Do not rub the eye or apply pressure on suspected globe injuries.
                </span>
              </div>
            </div>

            {/* Right Column: Visual + Emergency Contact CTA */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-5">
              {/* Clinical Visual */}
              <div className="relative rounded-2xl overflow-hidden border border-rose-200 bg-stone-100 shadow-md aspect-[16/10] group">
                <img
                  src="/Images/Eye-injury-image.png"
                  alt="Clinical Visual of Ophthalmic Emergency Care and Eye Injury"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C242E]/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="font-heading font-semibold text-white">
                    Acute Ocular Trauma &amp; Emergency Evaluation
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-rose-300">
                    Emergency
                  </span>
                </div>
              </div>

              {/* Emergency Contact CTA Box */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#1C242E] text-white shadow-xl flex flex-col justify-between">
                <div className="mb-4">
                  <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-rose-400 block mb-1">
                    Direct Emergency Assistance
                  </span>
                  <h4 className="font-heading font-bold text-lg text-white">
                    Need Immediate Eye Care?
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Contact our emergency desk or head directly to our Palasa surgical center.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <a
                    href="tel:+919493661180"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#BE185D] hover:bg-[#9F1239] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer"
                  >
                    <span>Call Helpline: 9493661180</span>
                  </a>
                  <a
                    href="tel:08945242442"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-heading font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
                  >
                    <span>Palasa: 08945-242442</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Redesigned Compact & Premium CTA ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 sm:mt-12 p-6 sm:p-7 md:p-8 rounded-2xl md:rounded-3xl bg-[#FAF8F5] border border-[#E8E2D8] shadow-[0_4px_20px_-2px_rgba(28,36,46,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden"
        >
          {/* Left: Icon, Heading & Compact Description */}
          <div className="flex items-start sm:items-center gap-4 z-10">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FDF2F4] border border-[#FCE7F3] flex items-center justify-center text-[#BE185D] shrink-0 mt-0.5 sm:mt-0 shadow-xs">
              <Users size={20} />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base sm:text-lg text-[#1C242E] leading-snug">
                Committed to District-Wide Blindness Prevention
              </h4>
              <p className="text-xs sm:text-sm text-[#5A687A] mt-1 font-normal leading-relaxed">
                Connecting rural communities to dedicated ophthalmic diagnosis and surgical intervention.
              </p>
            </div>
          </div>

          {/* Right: Clean Button */}
          <div className="w-full md:w-auto shrink-0 z-10 mt-1 md:mt-0">
            <a
              href="#appointment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#BE185D] hover:bg-[#9F1239] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer group"
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
