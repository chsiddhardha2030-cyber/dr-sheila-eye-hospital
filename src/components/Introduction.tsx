import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/* ─────────────────────────────────────────────────────────────────────────────
   Premium inline SVG icons — minimal, medical, consistent with warm light theme
───────────────────────────────────────────────────────────────────────────── */

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
    <line x1="14" y1="7.5" x2="15.5" y2="6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.6"/>
    <line x1="8.5" y1="7" x2="7.2" y2="5.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.4"/>
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

const aboutSlides = [
  {
    image: '/optimized/about/DSC_8300.webp',
    alt: 'Dr. Sheilas Eye Hospital Clinical Facility',
    caption: 'Comprehensive Eye Care & Modern Facility',
    tag: 'Clinical Excellence',
  },
  {
    image: '/optimized/about/Sheilas Eye Hospital Palasa Branch Image.webp',
    alt: 'Dr. Sheilas Eye Hospital – Palasa Branch',
    caption: 'Sheilas Eye Hospital · Palasa Branch',
    tag: 'Main Surgical Hospital',
  },
  {
    image: '/optimized/about/IMG_5837.webp',
    alt: 'Dr. Sheilas Eye Hospital Facility',
    caption: 'Modern Clinical Facility & Patient Care',
    tag: 'Advanced Infrastructure',
  },
  {
    image: '/optimized/about/IMG_5842.webp',
    alt: 'Dr. Sheilas Eye Hospital Diagnostic Suite',
    caption: 'Comprehensive Eye Examination Suite',
    tag: 'Diagnostic Care',
  },
  {
    image: '/optimized/about/IMG_5844.webp',
    alt: 'Dr. Sheilas Eye Hospital Ophthalmic Tech',
    caption: 'Sterile OT & Surgical Precision Equipment',
    tag: 'Palasa OT Complex',
  },
  {
    image: '/optimized/about/IMG_5845.webp',
    alt: 'Dr. Sheilas Eye Hospital Consultation Area',
    caption: 'Dedicated Consultation & Optical Dispensary',
    tag: 'Patient-First Environment',
  },
]

export const Introduction: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [slideDirection, setSlideDirection] = useState(1)
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  /* ── Viewport Visibility Observer for Independent Slideshow ─────────────── */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.2 }
    )

    observer.observe(el)
    return () => {
      if (el) observer.unobserve(el)
    }
  }, [])

  /* ── Auto-advance slideshow only when section is visible ────────────────── */
  useEffect(() => {
    if (!isInView || isPaused) return
    const timer = setInterval(() => {
      setSlideDirection(1)
      setCurrentSlide((prev) => (prev + 1) % aboutSlides.length)
    }, 3500) // Display each image for 3.5s (> 2 seconds requirement)
    return () => clearInterval(timer)
  }, [isInView, isPaused])

  const nextSlide = () => {
    setSlideDirection(1)
    setCurrentSlide((prev) => (prev + 1) % aboutSlides.length)
  }

  const prevSlide = () => {
    setSlideDirection(-1)
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : aboutSlides.length - 1))
  }

  /* ── Touch handlers for mobile slideshow ──────────────────────────────── */
  const slideTouchStartX = useRef<number | null>(null)
  const slideTouchEndX = useRef<number | null>(null)

  const handleSlideTouchStart = (e: React.TouchEvent) => {
    slideTouchStartX.current = e.touches[0].clientX
  }

  const handleSlideTouchMove = (e: React.TouchEvent) => {
    slideTouchEndX.current = e.touches[0].clientX
  }

  const handleSlideTouchEnd = () => {
    if (slideTouchStartX.current === null || slideTouchEndX.current === null) return
    const delta = slideTouchStartX.current - slideTouchEndX.current
    if (Math.abs(delta) > 40) {
      if (delta > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }
    slideTouchStartX.current = null
    slideTouchEndX.current = null
  }

  /* ── Mobile carousel for pillars ──────────────────────────────────────── */
  const [activePillarIndex, setActivePillarIndex] = useState(0)
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
        setActivePillarIndex((prev) => Math.min(prev + 1, pillars.length - 1))
      } else {
        setActivePillarIndex((prev) => Math.max(prev - 1, 0))
      }
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-[#FFFFFF] pt-14 pb-20 md:py-36 text-[#1C242E] font-sans border-b border-[#E8E2D8] relative"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header — Editorial two-column: text left, hospital slideshow right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-14 md:mb-20">
          {/* Left: Heading + description */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col"
          >
            <span className="text-[12px] font-heading font-semibold tracking-[0.25em] uppercase text-[#BE185D] mb-4 block">
              About Dr. Sheilas Eye Hospitals
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#1C242E] tracking-[-0.03em] leading-[1.15] mb-6">
              Dedicated ophthalmic expertise rooted in genuine patient care.
            </h2>
            <p className="text-[#5A687A] text-base sm:text-lg leading-relaxed font-normal mb-4">
              Committed to preserving and restoring visual clarity through experienced surgeons, modern ophthalmic diagnostics, and community-wide public eye health initiatives.
            </p>
          </motion.div>

          {/* Right: Hospital Slideshow / Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div
              className="relative rounded-2xl overflow-hidden border border-[#E8E2D8] shadow-[0_8px_30px_rgba(28,36,46,0.06)] aspect-[3/4] bg-stone-100 group select-none"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={handleSlideTouchStart}
              onTouchMove={handleSlideTouchMove}
              onTouchEnd={handleSlideTouchEnd}
            >
              {/* Active Slide Presentation */}
              <AnimatePresence mode="wait" custom={slideDirection}>
                <motion.div
                  key={currentSlide}
                  custom={slideDirection}
                  initial={{ opacity: 0, x: slideDirection > 0 ? 30 : -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: slideDirection > 0 ? -30 : 30 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={aboutSlides[currentSlide].image}
                    alt={aboutSlides[currentSlide].alt}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
                    loading="lazy"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Subtle vignette gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C242E]/80 via-black/10 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#1C242E]/30 via-transparent to-transparent pointer-events-none" />

              {/* Top Tag & Slide Counter */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[10px] font-heading font-semibold tracking-wider uppercase text-white shadow-xs">
                  {aboutSlides[currentSlide].tag}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-mono text-white/90 font-medium border border-white/20">
                  {currentSlide + 1} / {aboutSlides.length}
                </span>
              </div>

              {/* Navigation Arrows */}
              <div className="absolute inset-y-0 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                <button
                  onClick={prevSlide}
                  aria-label="Previous Slide"
                  className="pointer-events-auto w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#1C242E] backdrop-blur-md border border-white/60 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next Slide"
                  className="pointer-events-auto w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#1C242E] backdrop-blur-md border border-white/60 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Caption & Indicators Bottom Bar */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-3">
                <div className="bg-white/90 backdrop-blur-md border border-white/80 px-3.5 py-2 rounded-xl text-left shadow-sm">
                  <span className="block text-xs font-heading font-semibold tracking-wide text-[#1C242E]">
                    {aboutSlides[currentSlide].caption}
                  </span>
                </div>

                {/* Pagination Dots */}
                <div className="flex items-center justify-center gap-1.5">
                  {aboutSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSlideDirection(idx > currentSlide ? 1 : -1)
                        setCurrentSlide(idx)
                      }}
                      aria-label={`Go to slide ${idx + 1}`}
                      className="cursor-pointer p-1"
                    >
                      <span
                        className={`block rounded-full transition-all duration-300 ${
                          currentSlide === idx
                            ? 'w-6 h-1.5 bg-[#BE185D] shadow-sm'
                            : 'w-1.5 h-1.5 bg-white/60 hover:bg-white'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── DESKTOP: 3-column evenly spaced grid ─────────────────────────── */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar, idx) => {
            const { Icon } = pillar
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="p-7 sm:p-8 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] hover:border-[#BE185D]/40 transition-all duration-300 flex flex-col justify-between group shadow-[0_4px_20px_-2px_rgba(28,36,46,0.03)] hover:shadow-[0_12px_30px_-4px_rgba(190,24,93,0.08)]"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#FDF2F4] border border-[#FCE7F3] flex items-center justify-center text-[#BE185D] mb-6 group-hover:bg-[#BE185D] group-hover:text-white transition-all duration-300 shadow-xs">
                    <Icon />
                  </div>

                  <span className="text-[11px] font-heading font-semibold uppercase tracking-widest text-[#BE185D] mb-2 block">
                    {pillar.label}
                  </span>

                  <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#1C242E] tracking-tight mb-3">
                    {pillar.title}
                  </h3>

                  <p className="text-[#5A687A] text-sm leading-relaxed font-normal">
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
                animate={{ x: `-${activePillarIndex * 100}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex"
              >
                {pillars.map((pillar, idx) => {
                  const { Icon } = pillar
                  return (
                    <div key={idx} className="w-full shrink-0">
                      <div className="p-7 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] flex flex-col shadow-[0_4px_20px_-2px_rgba(28,36,46,0.03)] min-h-[210px]">
                        <div className="w-12 h-12 rounded-xl bg-[#FDF2F4] border border-[#FCE7F3] flex items-center justify-center text-[#BE185D] mb-5">
                          <Icon />
                        </div>
                        <span className="text-[11px] font-heading font-semibold uppercase tracking-widest text-[#BE185D] mb-2 block">
                          {pillar.label}
                        </span>
                        <h3 className="font-heading font-bold text-xl text-[#1C242E] tracking-tight mb-3">
                          {pillar.title}
                        </h3>
                        <p className="text-[#5A687A] text-sm leading-relaxed font-normal">
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
                  onClick={() => setActivePillarIndex(idx)}
                  aria-label={`Go to card ${idx + 1}`}
                  className="cursor-pointer"
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      activePillarIndex === idx
                        ? 'w-5 h-1.5 bg-[#BE185D]'
                        : 'w-1.5 h-1.5 bg-stone-300 hover:bg-stone-400'
                    }`}
                  />
                </button>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
