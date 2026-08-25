import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'

interface BranchGalleryItem {
  src: string
  title: string
  subtitle: string
}

interface BranchGallery {
  id: string
  name: string
  tag: string
  description: string
  images: BranchGalleryItem[]
}

export const Gallery: React.FC = () => {
  const [activeBranchId, setActiveBranchId] = useState<string>('palasa')
  const [mobileSlideIdx, setMobileSlideIdx] = useState<number>(0)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const branchGalleries: BranchGallery[] = [
    {
      id: 'palasa',
      name: 'Palasa Center',
      tag: 'Main Surgical Hospital',
      description:
        'Our primary ophthalmic hospital and microsurgical center featuring sterile operation theatres, advanced diagnostic suites, in-house pharmacy, optical center, and day-care recovery areas.',
      images: [
        {
          src: '/optimized/clinics/palasa/DSC_8211.webp',
          title: 'Consultation & Slit Lamp Suite',
          subtitle: 'Doctor Examination & Diagnostics',
        },
        {
          src: '/optimized/clinics/palasa/DSC_8279.webp',
          title: 'Sterile Microsurgical OT',
          subtitle: 'Phacoemulsification & Cataract Care',
        },
        {
          src: '/optimized/clinics/palasa/DSC_8224.webp',
          title: 'Ophthalmic Diagnostics Lab',
          subtitle: 'Automated Measurement & Imaging',
        },
        {
          src: '/optimized/clinics/palasa/DSC_8320.webp',
          title: 'Reception & Patient Lounge',
          subtitle: 'Welcoming Registration & Triage',
        },
        {
          src: '/optimized/clinics/palasa/SPD_6977.webp',
          title: 'Main Hospital Building',
          subtitle: 'VBR Complex · Palasa',
        },
      ],
    },
    {
      id: 'sompeta',
      name: 'Sompeta Branch',
      tag: 'Comprehensive Outpatient Clinic',
      description:
        'Modern outpatient facility providing comprehensive vision screening, slit lamp evaluations, Nd:YAG laser treatments, and prescription eyewear dispensing.',
      images: [
        {
          src: '/optimized/clinics/sompeta/DSC_8324.webp',
          title: 'Clinic Reception & Waiting',
          subtitle: 'Patient Care & Registration',
        },
        {
          src: '/optimized/clinics/sompeta/DSC_8325.webp',
          title: 'Laser & Diagnostic Chamber',
          subtitle: 'Nd:YAG Laser & Retinal Evaluation',
        },
        {
          src: '/optimized/clinics/sompeta/DSC_8332.webp',
          title: 'Slit Lamp Biomicroscopy',
          subtitle: 'Anterior Segment Examination',
        },
        {
          src: '/optimized/clinics/sompeta/DSC_8345.webp',
          title: 'Doctor Consultation Chamber',
          subtitle: 'Clinical Counseling & Care',
        },
      ],
    },
    {
      id: 'ichapuram',
      name: 'Ichapuram Branch',
      tag: 'Outpatient Clinic & Community Health',
      description:
        'Dedicated clinical center delivering accessible eye exams, refractive vision testing, and direct surgical referral coordination for patients in northern Srikakulam.',
      images: [
        {
          src: '/optimized/clinics/ichapuram/DSC_8512.webp',
          title: 'Ichapuram Clinic Entrance',
          subtitle: 'Outpatient Center & Triage',
        },
        {
          src: '/optimized/clinics/ichapuram/DSC_8518.webp',
          title: 'Diagnostic & Refraction Area',
          subtitle: 'Vision Assessment & Power Checks',
        },
        {
          src: '/optimized/clinics/ichapuram/DSC_8521.webp',
          title: 'Patient Examination Station',
          subtitle: 'Clinical Ocular Evaluation',
        },
        {
          src: '/optimized/clinics/ichapuram/DSC_8535.webp',
          title: 'Optical & Patient Service Desk',
          subtitle: 'Eyewear & Dispensing Support',
        },
      ],
    },
  ]

  const currentGallery =
    branchGalleries.find((b) => b.id === activeBranchId) || branchGalleries[0]
  const currentImages = currentGallery.images
  const totalMobileSlides = currentImages.length

  const handleBranchChange = (id: string) => {
    setActiveBranchId(id)
    setMobileSlideIdx(0)
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
    if (Math.abs(delta) > 35) {
      if (delta > 0) {
        setMobileSlideIdx((prev) => (prev < totalMobileSlides - 1 ? prev + 1 : 0))
      } else {
        setMobileSlideIdx((prev) => (prev > 0 ? prev - 1 : totalMobileSlides - 1))
      }
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  const handleLightboxNext = () => {
    if (lightboxIdx === null) return
    setLightboxIdx((lightboxIdx + 1) % currentImages.length)
  }

  const handleLightboxPrev = () => {
    if (lightboxIdx === null) return
    setLightboxIdx((lightboxIdx - 1 + currentImages.length) % currentImages.length)
  }

  return (
    <section
      id="gallery"
      className="bg-[#07111D] py-24 md:py-36 text-brand-ivory font-sans border-b border-white/[0.06] relative"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 md:mb-14">
          <span className="text-[12px] font-heading font-medium tracking-[0.25em] uppercase text-cyan-400 mb-3 block">
            Clinical Environment &amp; Facilities
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-[-0.03em] leading-[1.12] mb-4">
            Explore Our Hospital Facilities
          </h2>
          <p className="text-brand-muted text-base sm:text-lg font-normal leading-relaxed">
            Select a branch to view its clinical environment, diagnostic suites, and patient care areas.
          </p>
        </div>

        {/* Branch Selector Tabs (Choose a branch -> see its environment) */}
        <div className="flex flex-wrap items-center gap-2.5 pb-6 border-b border-white/[0.08] mb-8">
          {branchGalleries.map((branch) => {
            const isActive = branch.id === activeBranchId
            return (
              <button
                key={branch.id}
                onClick={() => handleBranchChange(branch.id)}
                className={`px-5 py-2.5 rounded-full font-heading text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-400 text-slate-950 shadow-lg font-bold'
                    : 'bg-white/[0.04] text-brand-muted hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                }`}
              >
                {branch.name}
              </button>
            )
          })}
        </div>

        {/* Branch Context Description */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-brand-muted">
          <div>
            <span className="text-xs font-heading font-semibold uppercase tracking-widest text-cyan-400 block mb-1">
              {currentGallery.tag}
            </span>
            <p className="text-brand-muted text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
              {currentGallery.description}
            </p>
          </div>
          <span className="text-xs font-medium text-brand-subtle shrink-0">
            {currentImages.length} Photographs Available
          </span>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            DESKTOP PRESENTATION: Visually Rich Image Composition & Grid
        ══════════════════════════════════════════════════════════════════ */}
        <div className="hidden md:grid md:grid-cols-12 gap-5">
          {/* Main Featured Photograph */}
          <motion.div
            key={`desktop-main-${currentGallery.id}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            onClick={() => setLightboxIdx(0)}
            className="col-span-7 relative rounded-3xl overflow-hidden bg-[#050912] border border-white/[0.08] group cursor-pointer aspect-[16/11] shadow-2xl"
          >
            <img
              src={currentImages[0].src}
              alt={currentImages[0].title}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050912]/85 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 group-hover:text-cyan-400 group-hover:scale-110 transition-all">
              <Maximize2 size={15} />
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-[11px] font-heading font-semibold uppercase tracking-widest text-cyan-400 block mb-1">
                  {currentImages[0].subtitle}
                </span>
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-white">
                  {currentImages[0].title}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-heading font-medium text-white/80">
                {currentGallery.name}
              </span>
            </div>
          </motion.div>

          {/* Supporting Images Column / Grid */}
          <div className="col-span-5 grid grid-cols-2 gap-5">
            {currentImages.slice(1, 5).map((item, idx) => (
              <motion.div
                key={`desktop-sub-${currentGallery.id}-${idx}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (idx + 1) * 0.08 }}
                onClick={() => setLightboxIdx(idx + 1)}
                className="relative rounded-2xl overflow-hidden bg-[#050912] border border-white/[0.08] group cursor-pointer aspect-square shadow-xl"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050912]/80 via-transparent to-transparent opacity-85 group-hover:opacity-95 transition-opacity pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-cyan-400 block">
                    {item.subtitle}
                  </span>
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-white truncate">
                    {item.title}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            MOBILE PRESENTATION: Single-Card Touch/Swipeable Carousel
            (Reduces vertical scrolling; shows ONE prominent image at a time)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="block md:hidden">
          <div
            className="relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {(() => {
              const item = currentImages[mobileSlideIdx]
              return (
                <div
                  onClick={() => setLightboxIdx(mobileSlideIdx)}
                  className="relative rounded-3xl overflow-hidden bg-[#050912] border border-white/[0.1] shadow-2xl aspect-[4/3] group cursor-pointer"
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050912]/90 via-transparent to-transparent pointer-events-none" />

                  {/* Tap to zoom hint */}
                  <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10 text-[10px] font-heading font-medium text-white/80 flex items-center gap-1">
                    <Maximize2 size={11} className="text-cyan-400" />
                    <span>Zoom</span>
                  </div>

                  {/* Minimal & Elegant Caption */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[11px] font-heading font-semibold uppercase tracking-wider text-cyan-400 block mb-0.5">
                      {item.subtitle}
                    </span>
                    <h3 className="font-heading font-bold text-lg text-white">
                      {item.title}
                    </h3>
                  </div>
                </div>
              )
            })()}
          </div>

          {/* Mobile Carousel Controls & Pagination Dots */}
          <div className="flex items-center justify-between mt-4 px-1">
            <button
              onClick={() =>
                setMobileSlideIdx((prev) => (prev > 0 ? prev - 1 : totalMobileSlides - 1))
              }
              aria-label="Previous Photo"
              className="w-9 h-9 rounded-full border border-white/[0.12] bg-white/[0.04] active:bg-white/[0.12] flex items-center justify-center text-white cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Dots Indicator */}
            <div className="flex items-center gap-2">
              {currentImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setMobileSlideIdx(idx)}
                  aria-label={`Go to photo ${idx + 1}`}
                  className="cursor-pointer p-1"
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      idx === mobileSlideIdx
                        ? 'w-6 h-1.5 bg-cyan-400'
                        : 'w-1.5 h-1.5 bg-white/25'
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                setMobileSlideIdx((prev) => (prev < totalMobileSlides - 1 ? prev + 1 : 0))
              }
              aria-label="Next Photo"
              className="w-9 h-9 rounded-full border border-white/[0.12] bg-white/[0.04] active:bg-white/[0.12] flex items-center justify-center text-white cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>

      {/* Lightbox Modal (Desktop & Mobile) */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#050912]/95 backdrop-blur-2xl z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <button
              onClick={() => setLightboxIdx(null)}
              className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-950 transition-colors cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X size={18} />
            </button>

            <div className="relative max-w-5xl max-h-[85vh] flex items-center justify-center gap-4 w-full">
              <button
                onClick={handleLightboxPrev}
                className="p-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-950 transition-colors cursor-pointer hidden sm:flex shrink-0"
                aria-label="Previous Image"
              >
                <ChevronLeft size={22} />
              </button>

              <div className="flex flex-col items-center max-w-full">
                <img
                  src={currentImages[lightboxIdx].src}
                  alt={currentImages[lightboxIdx].title}
                  className="max-w-[90vw] max-h-[70vh] object-contain rounded-2xl border border-white/10 shadow-2xl"
                />
                <div className="text-center mt-4">
                  <h4 className="font-heading font-bold text-lg text-white">
                    {currentImages[lightboxIdx].title}
                  </h4>
                  <span className="text-cyan-400 text-xs font-heading font-semibold uppercase tracking-wider">
                    {currentImages[lightboxIdx].subtitle} &bull; {currentGallery.name}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLightboxNext}
                className="p-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-950 transition-colors cursor-pointer hidden sm:flex shrink-0"
                aria-label="Next Image"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
