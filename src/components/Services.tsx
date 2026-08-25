import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Pill, Glasses, Sparkles } from 'lucide-react'

interface ServiceGroup {
  id: string
  name: string
  icon: React.ElementType
  tagline: string
  description: string
  points: string[]
}

export const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('opd')

  /* ── Mobile carousel state ───────────────────────────────────────────── */
  const [mobileIndex, setMobileIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const serviceGroups: ServiceGroup[] = [
    {
      id: 'opd',
      name: 'Outpatient Consultations',
      icon: Eye,
      tagline: 'Comprehensive Clinical Eye Care',
      description:
        'Thorough clinical consultations and ocular assessments conducted by qualified ophthalmic surgeons for all age groups.',
      points: [
        'Registration and clinical history recording',
        'Visual acuity measurement and vision assessment',
        'Slit lamp biomicroscopy of anterior ocular segments',
        'Comprehensive eye examination for redness, pain, or irritation',
        'Cornea and ocular surface disease evaluation',
        'Uveitis and ocular inflammation assessment',
      ],
    },
    {
      id: 'vision',
      name: 'Refraction & Contact Lenses',
      icon: Glasses,
      tagline: 'Precision Vision Correction',
      description:
        'Accurate optical refraction to determine exact spectacle correction and customized contact lens fitting solutions.',
      points: [
        'Objective automated refraction via autorefractometer',
        'Subjective trial lens testing & verification',
        'Prescription for myopia, hyperopia, and astigmatism',
        'Presbyopia reading glass evaluation',
        'Contact lens assessment, fitting, and hygiene guidance',
        'Pediatric vision assessment for early refractive errors',
      ],
    },
    {
      id: 'specialist',
      name: 'Glaucoma & Retina Checks',
      icon: Sparkles,
      tagline: 'Specialized Diagnostic Assessment',
      description:
        'Early screening and ongoing monitoring for progressive sight-threatening ocular conditions.',
      points: [
        'Goldmann applanation intraocular pressure (IOP) monitoring',
        'Direct and indirect ophthalmoscopic fundus examination',
        'Diabetic eye screening & hypertensive retinopathy checks',
        'Glaucoma risk assessment and optic disc evaluation',
        'Visual field automated perimetry analysis',
        'Long-term ocular disease management & follow-up',
      ],
    },
    {
      id: 'support',
      name: 'Optical & Pharmacy Support',
      icon: Pill,
      tagline: 'In-House Convenience at All Branches',
      description:
        'Complete in-house dispensary and optical stores ensuring immediate access to prescribed ophthalmic medications and customized spectacles.',
      points: [
        'In-house pharmacy stocked with genuine ophthalmic medications',
        'Antibiotic, lubricating, and anti-glaucoma eye drops',
        'Optical dispensing unit with curated frame collections',
        'High-quality anti-reflective and blue-cut spectacle lenses',
        'Contact lens solutions and lens accessories',
        'Available consistently across Palasa, Sompeta, and Ichapuram',
      ],
    },
  ]

  const activeGroup = serviceGroups.find((s) => s.id === activeTab) || serviceGroups[0]

  /* ── Touch handlers for mobile carousel ─────────────────────────────── */
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
        const next = Math.min(mobileIndex + 1, serviceGroups.length - 1)
        setMobileIndex(next)
        setActiveTab(serviceGroups[next].id)
      } else {
        const prev = Math.max(mobileIndex - 1, 0)
        setMobileIndex(prev)
        setActiveTab(serviceGroups[prev].id)
      }
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <section
      id="services"
      className="bg-[#050912] py-28 md:py-36 text-brand-ivory font-sans border-b border-white/[0.06] relative"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ── Section Header ──────────────────────────────────────────────── */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <span className="text-[12px] font-heading font-medium tracking-[0.25em] uppercase text-cyan-400 mb-4 block">
            Outpatient &amp; Clinical Care
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-5xl text-white tracking-[-0.03em] leading-[1.12]">
            Comprehensive eye-care services delivered with clinical precision.
          </h2>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            DESKTOP LAYOUT
            Tab navigation + animated service detail (full-width)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="hidden md:block">

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2.5 pb-8 border-b border-white/[0.08] mb-10">
            {serviceGroups.map((group) => {
              const Icon = group.icon
              const isActive = activeTab === group.id
              return (
                <button
                  key={group.id}
                  onClick={() => setActiveTab(group.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-heading text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-950 shadow-xl'
                      : 'bg-white/[0.04] text-brand-muted hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                  }`}
                >
                  <Icon size={13} className={isActive ? 'text-slate-950' : 'text-cyan-400'} />
                  <span>{group.name}</span>
                </button>
              )
            })}
          </div>

          {/* Animated service detail — two-column: title+description left, points right */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeGroup.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-12 gap-10 lg:gap-14 items-start"
            >
              {/* Left: tagline + name + description */}
              <div className="col-span-5 flex flex-col">
                <span className="text-xs font-heading font-semibold uppercase tracking-widest text-cyan-400 mb-2 block">
                  {activeGroup.tagline}
                </span>
                <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight mb-4">
                  {activeGroup.name}
                </h3>
                <div className="h-px bg-white/[0.06] mb-4" />
                <p className="text-brand-muted text-base leading-relaxed font-normal">
                  {activeGroup.description}
                </p>
              </div>

              {/* Right: numbered points */}
              <div className="col-span-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeGroup.points.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-3.5">
                      <span className="shrink-0 w-5 h-5 rounded-full border border-cyan-500/40 bg-cyan-500/8 flex items-center justify-center text-[10px] font-heading font-bold text-cyan-400 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-slate-300 font-normal leading-snug">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            MOBILE LAYOUT
            Horizontal swipe service cards (no hospital photo)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="md:hidden">

          {/* Service carousel */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Category pill nav */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
              {serviceGroups.map((group, idx) => {
                const Icon = group.icon
                return (
                  <button
                    key={group.id}
                    onClick={() => { setMobileIndex(idx); setActiveTab(group.id) }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full font-heading text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer shrink-0 ${
                      mobileIndex === idx
                        ? 'bg-white text-slate-950 shadow-xl'
                        : 'bg-white/[0.05] text-brand-muted border border-white/[0.08]'
                    }`}
                  >
                    <Icon size={12} className={mobileIndex === idx ? 'text-slate-950' : 'text-cyan-400'} />
                    <span>{group.name}</span>
                  </button>
                )
              })}
            </div>

            {/* Swipeable content cards */}
            <div
              className="overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <motion.div
                animate={{ x: `-${mobileIndex * 100}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex"
              >
                {serviceGroups.map((group) => (
                  <div key={group.id} className="w-full shrink-0">
                    <div className="p-6 rounded-2xl bg-[#07111D] border border-white/[0.06] shadow-xl">
                      <span className="text-[10px] font-heading font-semibold uppercase tracking-widest text-cyan-400 mb-1.5 block">
                        {group.tagline}
                      </span>
                      <h3 className="font-heading font-bold text-xl text-white tracking-tight mb-2">
                        {group.name}
                      </h3>
                      <p className="text-brand-muted text-sm leading-relaxed mb-5 font-normal">
                        {group.description}
                      </p>
                      <div className="h-px bg-white/[0.06] mb-5" />
                      <div className="flex flex-col gap-2.5">
                        {group.points.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <span className="shrink-0 w-5 h-5 rounded-full border border-cyan-500/40 flex items-center justify-center text-[10px] font-heading font-bold text-cyan-400 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="text-sm text-slate-300 font-normal leading-snug">
                              {point}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Pagination dots */}
            <div className="flex items-center justify-center gap-2.5 mt-5">
              {serviceGroups.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => { setMobileIndex(idx); setActiveTab(serviceGroups[idx].id) }}
                  aria-label={`Go to service ${idx + 1}`}
                  className="cursor-pointer"
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      mobileIndex === idx
                        ? 'w-5 h-1.5 bg-cyan-400'
                        : 'w-1.5 h-1.5 bg-white/25'
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

