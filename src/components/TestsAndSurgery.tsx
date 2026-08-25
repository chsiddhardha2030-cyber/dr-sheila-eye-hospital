import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  Zap,
  Scissors,
  Sparkles,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  LayoutGrid,
} from 'lucide-react'

interface FacilityItem {
  name: string
  description: string
}

interface CategoryData {
  id: string
  number: string
  name: string
  shortTag: string
  icon: React.ElementType
  title: string
  subtitle: string
  palasaOnly: boolean
  scopeBadge: string
  facilityCount: string
  image: string
  imageCaption: string
  items: FacilityItem[]
}

export const TestsAndSurgery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [mobileCarouselIdx, setMobileCarouselIdx] = useState<number>(0)
  const sectionRef = useRef<HTMLElement>(null)
  const touchMobileStart = useRef<number | null>(null)
  const touchMobileEnd = useRef<number | null>(null)

  const categories: CategoryData[] = [
    {
      id: 'diagnostics',
      number: '01',
      name: 'Diagnostic Tests',
      shortTag: 'Comprehensive Diagnostics',
      icon: Activity,
      title: 'Precision Diagnostic Facilities & Eye Tests',
      subtitle:
        'Accurate clinical evaluations using calibrated ophthalmic measurement and imaging instruments across all our centers.',
      palasaOnly: false,
      scopeBadge: 'All Regional Centers',
      facilityCount: '6 Diagnostic Tests',
      image: '/optimized/clinics/palasa/DSC_8224.webp',
      imageCaption: 'Advanced Ophthalmic Diagnostic Suite',
      items: [
        {
          name: 'Slit Lamp Biomicroscopy',
          description:
            'High-magnification microscopic examination of the cornea, iris, lens, and anterior segment.',
        },
        {
          name: 'Autorefractometer & Autolensometer',
          description:
            'Automated digital measurement of refractive errors and verification of spectacle lens powers.',
        },
        {
          name: 'Goldmann Applanation Tonometry',
          description:
            'Gold-standard precision measurement of intraocular pressure (IOP) for glaucoma screening.',
        },
        {
          name: 'Automated Perimetry',
          description:
            'Computerized visual field analysis to detect visual field defects and monitor glaucoma progression.',
        },
        {
          name: 'Optical Biometry & A-Scan Ultrasonography',
          description:
            'High-accuracy axial length measurement and intraocular lens (IOL) calculation for cataract surgery.',
        },
        {
          name: 'Keratometry & Gonioscopy',
          description:
            'Corneal curvature assessment and direct angle evaluation for glaucoma classification.',
        },
      ],
    },
    {
      id: 'lasers',
      number: '02',
      name: 'Laser Treatments',
      shortTag: 'Non-Invasive Laser Therapy',
      icon: Zap,
      title: 'Nd:YAG Ophthalmic Laser Procedures',
      subtitle:
        'Non-invasive, outpatient laser therapies for secondary cataracts and angle-closure glaucoma.',
      palasaOnly: false,
      scopeBadge: 'Outpatient Laser Care',
      facilityCount: '3 Laser Procedures',
      image: '/optimized/clinics/sompeta/DSC_8325.webp',
      imageCaption: 'Nd:YAG Precision Laser System',
      items: [
        {
          name: 'Nd:YAG Laser Capsulotomy',
          description:
            'Painless outpatient laser procedure to clear posterior capsule opacification (after-cataract).',
        },
        {
          name: 'Nd:YAG Laser Peripheral Iridotomy (LPI)',
          description:
            'Preventative laser treatment creating a microscopic bypass to relieve intraocular pressure in narrow-angle glaucoma.',
        },
        {
          name: 'Post-Laser Monitoring & Follow-Up',
          description:
            'Careful intraocular pressure checks and structured recovery protocols after laser therapy.',
        },
      ],
    },
    {
      id: 'surgical',
      number: '03',
      name: 'Surgical Services',
      shortTag: 'Ophthalmic Microsurgery',
      icon: Scissors,
      title: 'Specialized Ophthalmic Microsurgery',
      subtitle:
        'Advanced microsurgical interventions performed by experienced eye surgeons with modern clinical protocols.',
      palasaOnly: true,
      scopeBadge: 'Palasa Hospital Only',
      facilityCount: '4 Surgical Specialties',
      image: '/optimized/clinics/palasa/DSC_8279.webp',
      imageCaption: 'Microsurgical Suite & Cataract Care',
      items: [
        {
          name: 'Phacoemulsification Cataract Surgery',
          description:
            'Micro-incision sutureless cataract extraction with premium foldable intraocular lens (IOL) implantation.',
        },
        {
          name: 'Small Incision Cataract Surgery (SICS)',
          description:
            'Manual sutureless small-incision cataract surgery delivering reliable visual rehabilitation.',
        },
        {
          name: 'Glaucoma Trabeculectomy',
          description:
            'Surgical filtration procedures to lower and stabilize intraocular pressure in advanced glaucoma.',
        },
        {
          name: 'Ocular Trauma & Microsurgical Repair',
          description:
            'Emergency management and meticulous microsurgical repair of ocular injuries and lacerations.',
        },
      ],
    },
    {
      id: 'theatre',
      number: '04',
      name: 'OT Facilities',
      shortTag: 'Operation Theatre & Recovery',
      icon: Sparkles,
      title: 'Operation Theatre Complex & Day-Care Care',
      subtitle:
        'Dedicated sterile surgical environment equipped for high-precision ophthalmic microsurgery.',
      palasaOnly: true,
      scopeBadge: 'Palasa Hospital Only',
      facilityCount: '4 Sterile Suites & Tech',
      image: '/optimized/clinics/palasa/DSC_8211.webp',
      imageCaption: 'Sterile Operation Theatre & CSSD',
      items: [
        {
          name: 'Ophthalmic Operating Microscope',
          description:
            'High-definition stereoscopic illumination and optics for microsurgical precision.',
        },
        {
          name: 'Advanced Phacoemulsification Machine',
          description:
            'Fluidic management and ultrasonic control systems for safe cataract extraction.',
        },
        {
          name: 'CSSD & Rigid Sterilization Protocols',
          description:
            'Dedicated sterilization unit ensuring strict aseptic conditions and surgical safety.',
        },
        {
          name: 'Day-Care Surgery & Recovery Lounge',
          description:
            'Monitored post-operative recovery area designed for patient comfort and same-day discharge.',
        },
      ],
    },
  ]

  const total = categories.length

  const handleOpenCategory = (index: number) => {
    setSelectedCategory(index)
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handlePrevCategory = () => {
    if (selectedCategory !== null) {
      setSelectedCategory((prev) => (prev! > 0 ? prev! - 1 : total - 1))
    }
  }

  const handleNextCategory = () => {
    if (selectedCategory !== null) {
      setSelectedCategory((prev) => (prev! < total - 1 ? prev! + 1 : 0))
    }
  }

  return (
    <section
      ref={sectionRef}
      id="tests"
      className="bg-[#07111D] py-24 md:py-32 text-brand-ivory font-sans border-b border-white/[0.06] relative overflow-hidden"
    >
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-cyan-500/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full bg-blue-600/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="text-[12px] font-heading font-medium tracking-[0.25em] uppercase text-cyan-400 mb-3.5 block"
          >
            Clinical Infrastructure
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-[-0.03em] leading-[1.14] mb-5"
          >
            Diagnostic & Surgical Facilities
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-brand-muted text-base sm:text-lg font-normal leading-relaxed"
          >
            Explore our specialized clinical divisions. Select a facility category below to view detailed equipment, diagnostic procedures, and surgical care capabilities.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {selectedCategory === null ? (
            /* ─────────────────────────────────────────────────────────────────
               1. INITIAL VIEW:
                  Desktop: 4 Clean, Symmetrical 2x2 Category Cards
                  Mobile: Horizontal Touch/Swipeable Carousel (1 Card at a time)
               ───────────────────────────────────────────────────────────────── */
            <motion.div
              key="category-overview"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* ── DESKTOP: Symmetrical 2x2 Grid ── */}
              <div className="hidden md:grid md:grid-cols-2 gap-6 lg:gap-8">
                {categories.map((cat, index) => {
                  const Icon = cat.icon
                  return (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.08,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      onClick={() => handleOpenCategory(index)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleOpenCategory(index)
                        }
                      }}
                      className="group relative rounded-3xl bg-[#050912] border border-white/[0.08] hover:border-cyan-500/40 p-7 sm:p-9 flex flex-col justify-between transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-950/20 cursor-pointer overflow-hidden text-left"
                    >
                      {/* Subtle background glow & gradient on hover */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/[0.03] group-hover:bg-cyan-500/[0.08] rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/0 group-hover:via-cyan-400/60 to-transparent transition-all duration-500" />

                      <div>
                        {/* Top Meta Bar */}
                        <div className="flex items-center justify-between gap-4 mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all duration-400 shadow-md">
                              <Icon size={22} />
                            </div>
                            <span className="font-heading font-extrabold text-2xl text-white/20 group-hover:text-cyan-400/50 transition-colors duration-300">
                              {cat.number}
                            </span>
                          </div>

                          {cat.palasaOnly ? (
                            <span className="text-[11px] font-heading font-semibold tracking-wider text-cyan-300 uppercase bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
                              Palasa Main OT
                            </span>
                          ) : (
                            <span className="text-[11px] font-heading font-medium tracking-wider text-brand-muted uppercase bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.08]">
                              {cat.scopeBadge}
                            </span>
                          )}
                        </div>

                        {/* Title & Tag */}
                        <span className="text-xs font-heading font-semibold uppercase tracking-widest text-cyan-400/80 mb-2 block">
                          {cat.shortTag}
                        </span>
                        <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight group-hover:text-cyan-300 transition-colors duration-300 mb-3">
                          {cat.name}
                        </h3>
                        <p className="text-brand-muted text-sm leading-relaxed font-normal mb-6">
                          {cat.subtitle}
                        </p>
                      </div>

                      {/* Bottom Action Strip */}
                      <div className="pt-5 border-t border-white/[0.06] flex items-center justify-between">
                        <span className="text-xs font-medium text-brand-muted/80">
                          {cat.facilityCount}
                        </span>
                        <div className="inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-white group-hover:text-cyan-400 transition-colors">
                          <span>Open Detailed View</span>
                          <ArrowRight
                            size={15}
                            className="transform group-hover:translate-x-1 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* ── MOBILE: Touch/Swipeable Carousel Showing ONE Card at a Time ── */}
              <div className="block md:hidden">
                <div
                  className="relative overflow-hidden"
                  onTouchStart={(e) => {
                    touchMobileStart.current = e.touches[0].clientX
                  }}
                  onTouchMove={(e) => {
                    touchMobileEnd.current = e.touches[0].clientX
                  }}
                  onTouchEnd={() => {
                    if (touchMobileStart.current === null || touchMobileEnd.current === null) return
                    const delta = touchMobileStart.current - touchMobileEnd.current
                    if (Math.abs(delta) > 35) {
                      if (delta > 0) {
                        setMobileCarouselIdx((prev) => (prev < total - 1 ? prev + 1 : 0))
                      } else {
                        setMobileCarouselIdx((prev) => (prev > 0 ? prev - 1 : total - 1))
                      }
                    }
                    touchMobileStart.current = null
                    touchMobileEnd.current = null
                  }}
                >
                  {(() => {
                    const cat = categories[mobileCarouselIdx]
                    const Icon = cat.icon
                    return (
                      <div className="group relative rounded-3xl bg-[#050912] border border-white/[0.1] p-6 flex flex-col justify-between shadow-2xl text-left">
                        {/* Top Accent Line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

                        <div>
                          {/* Image preview for mobile visual richness */}
                          <div className="relative rounded-2xl overflow-hidden aspect-[16/9] mb-5 border border-white/[0.08] bg-[#07111D]">
                            <img
                              src={cat.image}
                              alt={cat.imageCaption}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050912]/80 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px]">
                              <span className="font-heading font-medium text-white">
                                {cat.imageCaption}
                              </span>
                              {cat.palasaOnly && (
                                <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-semibold uppercase">
                                  Palasa OT
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Meta Bar */}
                          <div className="flex items-center justify-between gap-3 mb-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                                <Icon size={18} />
                              </div>
                              <span className="font-heading font-extrabold text-xl text-white/30">
                                {cat.number}
                              </span>
                            </div>
                            <span className="text-[11px] font-heading font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                              {cat.shortTag}
                            </span>
                          </div>

                          {/* Title & Subtitle */}
                          <h3 className="font-heading font-bold text-2xl text-white tracking-tight mb-2">
                            {cat.name}
                          </h3>
                          <p className="text-brand-muted text-xs sm:text-sm leading-relaxed mb-5 font-normal">
                            {cat.subtitle}
                          </p>
                        </div>

                        {/* Action Strip */}
                        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                          <span className="text-xs font-medium text-brand-muted">
                            {cat.facilityCount}
                          </span>
                          <button
                            onClick={() => handleOpenCategory(mobileCarouselIdx)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400 text-slate-950 font-heading font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-transform cursor-pointer"
                          >
                            <span>Explore Details</span>
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    )
                  })()}
                </div>

                {/* Mobile Carousel Controls & Pagination Dots */}
                <div className="flex items-center justify-between mt-5 px-1">
                  <button
                    onClick={() =>
                      setMobileCarouselIdx((prev) => (prev > 0 ? prev - 1 : total - 1))
                    }
                    aria-label="Previous Infrastructure Category"
                    className="w-9 h-9 rounded-full border border-white/[0.12] bg-white/[0.04] active:bg-white/[0.12] flex items-center justify-center text-white cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {/* Dots Indicator */}
                  <div className="flex items-center gap-2">
                    {categories.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setMobileCarouselIdx(idx)}
                        aria-label={`Go to category ${idx + 1}`}
                        className="cursor-pointer p-1"
                      >
                        <span
                          className={`block rounded-full transition-all duration-300 ${
                            idx === mobileCarouselIdx
                              ? 'w-6 h-1.5 bg-cyan-400'
                              : 'w-1.5 h-1.5 bg-white/25'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setMobileCarouselIdx((prev) => (prev < total - 1 ? prev + 1 : 0))
                    }
                    aria-label="Next Infrastructure Category"
                    className="w-9 h-9 rounded-full border border-white/[0.12] bg-white/[0.04] active:bg-white/[0.12] flex items-center justify-center text-white cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ─────────────────────────────────────────────────────────────────
               2. FOCUSED VIEW: Dedicated Large Page-Like Information Panel
               ───────────────────────────────────────────────────────────────── */
            <motion.div
              key={`focused-category-${selectedCategory}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl bg-[#050912] border border-white/[0.1] shadow-2xl p-6 sm:p-10 lg:p-12 relative overflow-hidden"
            >
              {/* Subtle top accent gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/20 via-cyan-400 to-blue-500/20" />

              {/* ── Top Controls Bar ────────────────────────────────────────── */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/[0.08] mb-8">
                {/* Back to Overview Button */}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 font-heading text-xs font-semibold tracking-wide transition-all duration-300 w-fit cursor-pointer group"
                >
                  <ArrowLeft
                    size={14}
                    className="transform group-hover:-translate-x-1 transition-transform duration-200"
                  />
                  <span>Back to All Categories</span>
                </button>

                {/* Direct Category Switcher Tabs */}
                <div className="flex flex-wrap items-center gap-2">
                  {categories.map((cat, idx) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(idx)}
                      className={`px-3.5 py-1.5 rounded-full font-heading text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                        idx === selectedCategory
                          ? 'bg-cyan-400 text-slate-950 shadow-md font-bold'
                          : 'bg-white/[0.04] text-brand-muted hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Subtle Prev / Next Navigation Controls */}
                <div className="hidden lg:flex items-center gap-2">
                  <button
                    onClick={handlePrevCategory}
                    aria-label="Previous Category"
                    className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.10] text-white border border-white/10 transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-heading font-medium text-brand-muted px-1">
                    {selectedCategory + 1} of {total}
                  </span>
                  <button
                    onClick={handleNextCategory}
                    aria-label="Next Category"
                    className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.10] text-white border border-white/10 transition-colors cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* ── Category Banner & Description ───────────────────────────── */}
              {(() => {
                const current = categories[selectedCategory]
                const Icon = current.icon

                return (
                  <div>
                    {/* Header Row: Title & Photography */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-10">
                      <div className="lg:col-span-7">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                            <Icon size={18} />
                          </div>
                          <span className="text-xs font-heading font-semibold uppercase tracking-widest text-cyan-400">
                            Category {current.number} &bull; {current.shortTag}
                          </span>
                        </div>

                        <h3 className="font-heading font-bold text-2xl sm:text-4xl text-white tracking-tight leading-tight mb-4">
                          {current.title}
                        </h3>

                        <p className="text-brand-muted text-base sm:text-lg leading-relaxed font-normal">
                          {current.subtitle}
                        </p>

                        {/* Palasa-Only Explicit Notice (Mandatory Requirement) */}
                        {current.palasaOnly && (
                          <div className="mt-6 flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-xs sm:text-sm font-medium">
                            <ShieldAlert
                              size={20}
                              className="text-cyan-400 shrink-0 mt-0.5"
                            />
                            <div>
                              <strong className="text-white font-semibold block mb-1">
                                Surgical services are available only at Palasa.
                              </strong>
                              <span>
                                All surgical procedures, sterile operating theatre admissions, and recovery facilities are conducted exclusively at the Palasa Main Hospital. Diagnostic evaluations and pre-op consultations are available at all branches.
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Supporting Clinical Photography */}
                      <div className="lg:col-span-5">
                        <div className="relative rounded-2xl overflow-hidden border border-white/[0.1] bg-[#07111D] aspect-[16/10] shadow-2xl group">
                          <img
                            src={current.image}
                            alt={current.imageCaption}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#050912]/85 via-transparent to-transparent pointer-events-none" />
                          <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-xs">
                            <span className="font-heading font-medium text-white">
                              {current.imageCaption}
                            </span>
                            <span className="text-[11px] uppercase tracking-wider text-cyan-300 font-semibold">
                              {current.scopeBadge}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section Divider */}
                    <div className="flex items-center gap-4 my-8">
                      <div className="h-px bg-white/[0.08] flex-grow" />
                      <span className="text-xs font-heading font-semibold uppercase tracking-widest text-brand-muted">
                        All {current.name} Capabilities ({current.items.length})
                      </span>
                      <div className="h-px bg-white/[0.08] flex-grow" />
                    </div>

                    {/* ── ALL RELEVANT POINTS: Spacious, Symmetrical Card Grid ───── */}
                    <div
                      className={`grid grid-cols-1 ${
                        current.items.length === 3
                          ? 'md:grid-cols-3'
                          : 'md:grid-cols-2'
                      } gap-5 sm:gap-6`}
                    >
                      {current.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-6 sm:p-7 rounded-2xl bg-[#07111D] border border-white/[0.06] hover:border-cyan-500/30 transition-all duration-300 shadow-xl flex flex-col justify-between group"
                        >
                          <div>
                            {/* Item Header */}
                            <div className="flex items-center justify-between mb-3.5">
                              <span className="font-heading font-extrabold text-lg sm:text-xl text-cyan-400/50 group-hover:text-cyan-400 transition-colors duration-300 tabular-nums">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              <div className="w-2 h-2 rounded-full bg-cyan-500/30 group-hover:bg-cyan-400 transition-colors" />
                            </div>

                            <h4 className="font-heading font-bold text-base sm:text-lg text-white tracking-tight group-hover:text-cyan-300 transition-colors mb-2.5">
                              {item.name}
                            </h4>

                            <p className="text-brand-muted text-sm leading-relaxed font-normal">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ── Bottom Panel Navigation Bar ─────────────────────────────── */}
                    <div className="mt-12 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
                      <button
                        onClick={handlePrevCategory}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.10] text-white border border-white/10 font-heading text-xs font-semibold tracking-wide transition-all cursor-pointer group"
                      >
                        <ChevronLeft
                          size={16}
                          className="transform group-hover:-translate-x-1 transition-transform"
                        />
                        <span>
                          Previous:{' '}
                          {
                            categories[
                              selectedCategory > 0
                                ? selectedCategory - 1
                                : total - 1
                            ].name
                          }
                        </span>
                      </button>

                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="inline-flex items-center gap-2 text-xs font-heading font-medium text-brand-muted hover:text-white transition-colors cursor-pointer py-2"
                      >
                        <LayoutGrid size={14} className="text-cyan-400" />
                        <span>View All 4 Categories</span>
                      </button>

                      <button
                        onClick={handleNextCategory}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.10] text-white border border-white/10 font-heading text-xs font-semibold tracking-wide transition-all cursor-pointer group"
                      >
                        <span>
                          Next:{' '}
                          {
                            categories[
                              selectedCategory < total - 1
                                ? selectedCategory + 1
                                : 0
                            ].name
                          }
                        </span>
                        <ChevronRight
                          size={16}
                          className="transform group-hover:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
