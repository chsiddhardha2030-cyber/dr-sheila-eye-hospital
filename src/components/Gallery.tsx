import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'

interface GalleryItem {
  id: string
  src: string
  title: string
  branch: string
  branchId: 'palasa' | 'sompeta' | 'ichapuram'
}

interface FilterTab {
  id: 'all' | 'palasa' | 'sompeta' | 'ichapuram'
  label: string
}

export const Gallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'palasa' | 'sompeta' | 'ichapuram'>('all')
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [itemsPerPage, setItemsPerPage] = useState<number>(3)

  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  // 30 All High-Resolution Branch Facility Photographs (10 per branch)
  const galleryItems: GalleryItem[] = [
    // Palasa Center (10 images)
    {
      id: 'palasa-1',
      src: '/optimized/clinics/palasa/DSC_8211.webp',
      title: 'Consultation & Slit Lamp Suite',
      branch: 'Palasa Center',
      branchId: 'palasa',
    },
    {
      id: 'palasa-2',
      src: '/optimized/clinics/palasa/DSC_8279.webp',
      title: 'Phacoemulsification & Cataract OT',
      branch: 'Palasa Center',
      branchId: 'palasa',
    },
    {
      id: 'palasa-3',
      src: '/optimized/clinics/palasa/DSC_8224.webp',
      title: 'Ophthalmic Diagnostics Lab',
      branch: 'Palasa Center',
      branchId: 'palasa',
    },
    {
      id: 'palasa-4',
      src: '/optimized/clinics/palasa/DSC_8320.webp',
      title: 'Reception & Patient Lounge',
      branch: 'Palasa Center',
      branchId: 'palasa',
    },
    {
      id: 'palasa-5',
      src: '/optimized/clinics/palasa/SPD_6977.webp',
      title: 'Main Hospital Building & Entrance',
      branch: 'Palasa Center',
      branchId: 'palasa',
    },
    {
      id: 'palasa-6',
      src: '/optimized/clinics/palasa/DSC_8215.webp',
      title: 'Advanced Biomicroscopy Station',
      branch: 'Palasa Center',
      branchId: 'palasa',
    },
    {
      id: 'palasa-7',
      src: '/optimized/clinics/palasa/DSC_8228.webp',
      title: 'Refraction & Vision Testing Chamber',
      branch: 'Palasa Center',
      branchId: 'palasa',
    },
    {
      id: 'palasa-8',
      src: '/optimized/clinics/palasa/DSC_8251.webp',
      title: 'Outpatient Examination Room',
      branch: 'Palasa Center',
      branchId: 'palasa',
    },
    {
      id: 'palasa-9',
      src: '/optimized/clinics/palasa/DSC_8265.webp',
      title: 'Sterile Microsurgical Preparation Area',
      branch: 'Palasa Center',
      branchId: 'palasa',
    },
    {
      id: 'palasa-10',
      src: '/optimized/clinics/palasa/DSC_8300.webp',
      title: 'Post-Operative Recovery Care Unit',
      branch: 'Palasa Center',
      branchId: 'palasa',
    },

    // Sompeta Branch (10 images)
    {
      id: 'sompeta-1',
      src: '/optimized/clinics/sompeta/DSC_8324.webp',
      title: 'Clinic Reception & Waiting Lounge',
      branch: 'Sompeta Branch',
      branchId: 'sompeta',
    },
    {
      id: 'sompeta-2',
      src: '/optimized/clinics/sompeta/DSC_8325.webp',
      title: 'Laser & Diagnostic Chamber',
      branch: 'Sompeta Branch',
      branchId: 'sompeta',
    },
    {
      id: 'sompeta-3',
      src: '/optimized/clinics/sompeta/DSC_8332.webp',
      title: 'Slit Lamp Biomicroscopy Unit',
      branch: 'Sompeta Branch',
      branchId: 'sompeta',
    },
    {
      id: 'sompeta-4',
      src: '/optimized/clinics/sompeta/DSC_8345.webp',
      title: 'Doctor Consultation Chamber',
      branch: 'Sompeta Branch',
      branchId: 'sompeta',
    },
    {
      id: 'sompeta-5',
      src: '/optimized/clinics/sompeta/DSC_8326.webp',
      title: 'Refraction & Vision Testing Station',
      branch: 'Sompeta Branch',
      branchId: 'sompeta',
    },
    {
      id: 'sompeta-6',
      src: '/optimized/clinics/sompeta/DSC_8327.webp',
      title: 'Patient Diagnostic Station',
      branch: 'Sompeta Branch',
      branchId: 'sompeta',
    },
    {
      id: 'sompeta-7',
      src: '/optimized/clinics/sompeta/DSC_8333.webp',
      title: 'Comprehensive Eye Examination Suite',
      branch: 'Sompeta Branch',
      branchId: 'sompeta',
    },
    {
      id: 'sompeta-8',
      src: '/optimized/clinics/sompeta/DSC_8340.webp',
      title: 'Clinical Consultation Suite',
      branch: 'Sompeta Branch',
      branchId: 'sompeta',
    },
    {
      id: 'sompeta-9',
      src: '/optimized/clinics/sompeta/DSC_8342.webp',
      title: 'Ophthalmic Examination Room',
      branch: 'Sompeta Branch',
      branchId: 'sompeta',
    },
    {
      id: 'sompeta-10',
      src: '/optimized/clinics/sompeta/DSC_8350.webp',
      title: 'Diagnostic Equipment Suite',
      branch: 'Sompeta Branch',
      branchId: 'sompeta',
    },

    // Ichapuram Branch (10 images)
    {
      id: 'ichapuram-1',
      src: '/optimized/clinics/ichapuram/DSC_8512.webp',
      title: 'Ichapuram Clinic Entrance & Reception',
      branch: 'Ichapuram Branch',
      branchId: 'ichapuram',
    },
    {
      id: 'ichapuram-2',
      src: '/optimized/clinics/ichapuram/DSC_8518.webp',
      title: 'Diagnostic & Refraction Area',
      branch: 'Ichapuram Branch',
      branchId: 'ichapuram',
    },
    {
      id: 'ichapuram-3',
      src: '/optimized/clinics/ichapuram/DSC_8521.webp',
      title: 'Patient Examination Station',
      branch: 'Ichapuram Branch',
      branchId: 'ichapuram',
    },
    {
      id: 'ichapuram-4',
      src: '/optimized/clinics/ichapuram/DSC_8535.webp',
      title: 'Optical & Service Desk',
      branch: 'Ichapuram Branch',
      branchId: 'ichapuram',
    },
    {
      id: 'ichapuram-5',
      src: '/optimized/clinics/ichapuram/DSC_8513.webp',
      title: 'Outpatient Consultation Room',
      branch: 'Ichapuram Branch',
      branchId: 'ichapuram',
    },
    {
      id: 'ichapuram-6',
      src: '/optimized/clinics/ichapuram/DSC_8515.webp',
      title: 'Slit Lamp Examination Unit',
      branch: 'Ichapuram Branch',
      branchId: 'ichapuram',
    },
    {
      id: 'ichapuram-7',
      src: '/optimized/clinics/ichapuram/DSC_8516.webp',
      title: 'Patient Waiting & Reception Desk',
      branch: 'Ichapuram Branch',
      branchId: 'ichapuram',
    },
    {
      id: 'ichapuram-8',
      src: '/optimized/clinics/ichapuram/DSC_8524.webp',
      title: 'Clinical Vision Testing Chamber',
      branch: 'Ichapuram Branch',
      branchId: 'ichapuram',
    },
    {
      id: 'ichapuram-9',
      src: '/optimized/clinics/ichapuram/DSC_8525.webp',
      title: 'Diagnostic Equipment Station',
      branch: 'Ichapuram Branch',
      branchId: 'ichapuram',
    },
    {
      id: 'ichapuram-10',
      src: '/optimized/clinics/ichapuram/DSC_8530.webp',
      title: 'Comprehensive Eye Testing Station',
      branch: 'Ichapuram Branch',
      branchId: 'ichapuram',
    },
  ]

  const filterTabs: FilterTab[] = [
    { id: 'all', label: 'All Photos' },
    { id: 'palasa', label: 'Palasa Center' },
    { id: 'sompeta', label: 'Sompeta Branch' },
    { id: 'ichapuram', label: 'Ichapuram Branch' },
  ]

  // Filtered Images
  const currentImages =
    activeFilter === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.branchId === activeFilter)

  // Screen-width responsive items per page calculation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1) // Mobile: exactly 1 card
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2) // Tablet: 2 cards
      } else {
        setItemsPerPage(3) // Desktop: 3 equal cards
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Maximum slider start index
  const maxIndex = Math.max(0, currentImages.length - itemsPerPage)

  // Ensure index stays valid when filter or window size changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [activeFilter])

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex)
    }
  }, [maxIndex, currentIndex])

  // Navigation handlers
  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  // Touch Swipe for mobile/touch devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchEndX.current = null
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

  // Lightbox Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIdx === null) return
      if (e.key === 'Escape') setLightboxIdx(null)
      if (e.key === 'ArrowRight') {
        setLightboxIdx((prev) => (prev !== null ? (prev + 1) % currentImages.length : null))
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIdx((prev) =>
          prev !== null ? (prev - 1 + currentImages.length) % currentImages.length : null
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIdx, currentImages.length])

  // Calculate translate percentage
  const stepPercentage = 100 / itemsPerPage
  const translateXValue = currentIndex * stepPercentage

  return (
    <section
      id="gallery"
      className="bg-[#FAF8F5] py-20 md:py-32 text-[#1C242E] font-sans border-b border-[#E8E2D8] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header & Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <span className="text-[12px] font-heading font-semibold tracking-[0.25em] uppercase text-[#BE185D] mb-2.5 block">
              Clinic Gallery
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#1C242E] tracking-[-0.03em] leading-[1.15] mb-3">
              Explore Our Clinics
            </h2>
            <p className="text-[#5A687A] text-base sm:text-lg font-normal leading-relaxed">
              Explore our modern consultation suites, sterile microsurgical OT, and diagnostic facilities across all three hospital locations.
            </p>
          </div>

          {/* Desktop / Tablet Prev & Next Navigation Buttons */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-label="Previous image"
              className={`w-11 h-11 rounded-full border border-[#E8E2D8] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs ${
                currentIndex === 0
                  ? 'bg-stone-100 text-stone-300 border-stone-200 cursor-not-allowed opacity-50'
                  : 'bg-white text-[#1C242E] hover:bg-[#1C242E] hover:text-white hover:border-[#1C242E] active:scale-95'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              aria-label="Next image"
              className={`w-11 h-11 rounded-full border border-[#E8E2D8] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs ${
                currentIndex >= maxIndex
                  ? 'bg-stone-100 text-stone-300 border-stone-200 cursor-not-allowed opacity-50'
                  : 'bg-white text-[#1C242E] hover:bg-[#1C242E] hover:text-white hover:border-[#1C242E] active:scale-95'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Branch Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pb-6 border-b border-[#E8E2D8] mb-8 sm:mb-10">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id
            const count =
              tab.id === 'all'
                ? galleryItems.length
                : galleryItems.filter((i) => i.branchId === tab.id).length

            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-heading text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-[#1C242E] text-white shadow-md font-bold'
                    : 'bg-white text-[#5A687A] hover:text-[#1C242E] hover:bg-stone-50 border border-[#E8E2D8]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-sans ${
                    isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-[#5A687A]'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Horizontal Carousel Viewport */}
        <div
          className="relative overflow-hidden -mx-2.5 sm:-mx-3"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div
            className="flex"
            animate={{ x: `-${translateXValue}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          >
            {currentImages.map((item, idx) => (
              <div
                key={item.id}
                className="shrink-0 w-full sm:w-1/2 lg:w-1/3 px-2.5 sm:px-3"
              >
                <div
                  onClick={() => setLightboxIdx(idx)}
                  className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-[#E8E2D8] shadow-[0_4px_20px_rgba(28,36,46,0.04)] hover:shadow-xl transition-all duration-500 cursor-pointer aspect-[4/3]"
                >
                  {/* Photo */}
                  <img
                    src={item.src}
                    alt={item.branch}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />

                  {/* Subtle Zoom Badge */}
                  <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/85 backdrop-blur-md border border-white/70 flex items-center justify-center text-[#1C242E] group-hover:text-[#BE185D] group-hover:scale-110 transition-all duration-300 shadow-xs z-10">
                    <Maximize2 size={13} />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Carousel Indicators / Dots & Mobile Navigation Controls */}
        <div className="mt-8 flex items-center justify-between sm:justify-center relative">
          {/* Mobile Prev Arrow */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Previous photo"
            className={`sm:hidden w-9 h-9 rounded-full border border-[#E8E2D8] flex items-center justify-center transition-all cursor-pointer shadow-xs ${
              currentIndex === 0
                ? 'bg-stone-100 text-stone-300 border-stone-200 opacity-40'
                : 'bg-white text-[#1C242E] active:bg-stone-100'
            }`}
          >
            <ChevronLeft size={16} />
          </button>

          {/* Dots Pagination */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className="p-1.5 cursor-pointer"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-6 sm:w-7 h-2 bg-[#BE185D]'
                      : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Mobile Next Arrow */}
          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Next photo"
            className={`sm:hidden w-9 h-9 rounded-full border border-[#E8E2D8] flex items-center justify-center transition-all cursor-pointer shadow-xs ${
              currentIndex >= maxIndex
                ? 'bg-stone-100 text-stone-300 border-stone-200 opacity-40'
                : 'bg-white text-[#1C242E] active:bg-stone-100'
            }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Lightbox Modal (Desktop & Mobile) */}
      <AnimatePresence>
        {lightboxIdx !== null && currentImages[lightboxIdx] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-lg z-50 flex items-center justify-center p-4 sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxIdx(null)}
              className="absolute top-5 right-5 sm:top-6 sm:right-6 p-2.5 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#1C242E] transition-all cursor-pointer z-10"
              aria-label="Close Lightbox"
            >
              <X size={20} />
            </button>

            {/* Lightbox Content Container */}
            <div className="relative max-w-5xl w-full flex items-center justify-center gap-3 sm:gap-6">
              {/* Prev Button */}
              <button
                onClick={() =>
                  setLightboxIdx((prev) =>
                    prev !== null ? (prev - 1 + currentImages.length) % currentImages.length : null
                  )
                }
                className="hidden sm:flex p-3.5 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#1C242E] transition-all cursor-pointer shrink-0"
                aria-label="Previous Image"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="flex flex-col items-center max-w-full">
                <motion.img
                  key={currentImages[lightboxIdx].src}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  src={currentImages[lightboxIdx].src}
                  alt={currentImages[lightboxIdx].branch}
                  className="max-w-[92vw] sm:max-w-4xl max-h-[75vh] object-contain rounded-2xl border border-white/15 shadow-2xl"
                />

                {/* Branch & Photo Counter */}
                <div className="text-center mt-5">
                  <span className="text-rose-300 text-xs font-heading font-semibold uppercase tracking-wider block">
                    {currentImages[lightboxIdx].branch} &bull; Image {lightboxIdx + 1} of {currentImages.length}
                  </span>
                </div>

                {/* Mobile Navigation inside Lightbox */}
                <div className="flex sm:hidden items-center gap-6 mt-4">
                  <button
                    onClick={() =>
                      setLightboxIdx((prev) =>
                        prev !== null ? (prev - 1 + currentImages.length) % currentImages.length : null
                      )
                    }
                    className="p-2.5 rounded-full bg-white/20 text-white active:bg-white active:text-[#1C242E]"
                    aria-label="Previous Image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-white/80 text-xs font-heading">
                    {lightboxIdx + 1} / {currentImages.length}
                  </span>
                  <button
                    onClick={() =>
                      setLightboxIdx((prev) =>
                        prev !== null ? (prev + 1) % currentImages.length : null
                      )
                    }
                    className="p-2.5 rounded-full bg-white/20 text-white active:bg-white active:text-[#1C242E]"
                    aria-label="Next Image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={() =>
                  setLightboxIdx((prev) =>
                    prev !== null ? (prev + 1) % currentImages.length : null
                  )
                }
                className="hidden sm:flex p-3.5 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#1C242E] transition-all cursor-pointer shrink-0"
                aria-label="Next Image"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

