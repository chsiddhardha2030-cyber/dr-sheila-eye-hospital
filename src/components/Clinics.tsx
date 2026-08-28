import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Phone, MapPin, X, Info, PhoneCall, Clock } from 'lucide-react'
import { useHospitalData } from '../context/HospitalDataContext'

interface ClinicBranch {
  id: string
  name: string
  town: string
  tagline: string
  addressLines: string[]
  phone: string
  phoneHref: string
  opticals?: string
  opticalsHref?: string
  mapUrl?: string
  surgical: boolean
  image: string
}

export const Clinics: React.FC = () => {
  const [activeBranch, setActiveBranch] = useState<string>('palasa')
  const [showIchapuramModal, setShowIchapuramModal] = useState<boolean>(false)
  const { branches: dbBranches } = useHospitalData()

  const staticBranches: ClinicBranch[] = [
    {
      id: 'palasa',
      name: 'Palasa Hospital (Main Center)',
      town: 'Palasa',
      tagline: 'Main Eye Hospital & Sterile Microsurgical OT Complex',
      addressLines: [
        'VBR Complex',
        'Near Cashewnut Statue Junction',
        'Palasa 532221',
        'Srikakulam District, Andhra Pradesh',
      ],
      phone: '08945-242442',
      phoneHref: 'tel:08945242442',
      opticals: '850077-4896',
      opticalsHref: 'tel:8500774896',
      mapUrl: 'https://maps.google.com/?q=Dr.+Sheila+Eye+Hospital+VBR+Complex+Palasa+532221',
      surgical: true,
      image: '/optimized/clinics/palasa/SPD_6961 (1).png',
    },
    {
      id: 'sompeta',
      name: 'Sompeta Branch',
      town: 'Sompeta',
      tagline: 'Comprehensive Outpatient Eye Clinic & Vision Testing',
      addressLines: [
        'Church Street',
        'Above Canara Bank',
        'Sompeta 532284',
        'Srikakulam District, Andhra Pradesh',
      ],
      phone: '08947-234108',
      phoneHref: 'tel:08947234108',
      mapUrl: 'https://maps.app.goo.gl/tdYQZC4L9GYhPY3R6',
      surgical: false,
      image: '/optimized/clinics/sompeta/Sompeta-branch-collab.png',
    },
    {
      id: 'ichapuram',
      name: 'Ichapuram Branch',
      town: 'Ichapuram',
      tagline: 'Outpatient Eye Clinic & Diagnostic Center',
      addressLines: [
        'Dasannapeta Junction',
        'Ichapuram 532312',
        'Srikakulam District, Andhra Pradesh',
      ],
      phone: '08947-231261',
      phoneHref: 'tel:08947231261',
      surgical: false,
      image: '/optimized/clinics/ichapuram/Ichapuram-branch-collab.png',
    },
  ]

  const current = staticBranches.find((b) => b.id === activeBranch) || staticBranches[0]

  // Find dynamic database record for current branch
  const currentDbBranch = dbBranches.find(
    (b) => b.name.toLowerCase() === current.town.toLowerCase()
  )

  const isOpen = currentDbBranch ? currentDbBranch.is_open : true
  const openingTime = currentDbBranch?.opening_time || '09:00 AM'
  const closingTime = currentDbBranch?.closing_time || '08:00 PM'
  const displayPhone = currentDbBranch?.whatsapp_number || current.phone
  const displayPhoneHref = `tel:${displayPhone.replace(/\D/g, '')}`

  const scrollToAppointment = () => {
    const element = document.querySelector('#appointment')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleDirectionsClick = (branch: ClinicBranch) => {
    if (branch.id === 'ichapuram' || !branch.mapUrl) {
      setShowIchapuramModal(true)
    } else {
      window.open(branch.mapUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <section id="clinics" className="bg-[#FAF8F5] py-24 md:py-36 text-[#1C242E] font-sans border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <span className="text-[12px] font-heading font-semibold tracking-[0.25em] uppercase text-[#BE185D] mb-3 block">
            Clinical Locations
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#1C242E] tracking-[-0.03em] leading-[1.12] mb-4">
            Three Accessible Hospital Branches
          </h2>
          <p className="text-[#5A687A] text-base sm:text-lg font-normal leading-relaxed">
            Delivering trusted ophthalmic care across the Srikakulam district with dedicated clinical facilities in Palasa, Sompeta, and Ichapuram.
          </p>
        </div>

        {/* Simple Branch Selector Tabs with live open/closed dots */}
        <div className="flex flex-wrap gap-2.5 pb-6 border-b border-[#E8E2D8] mb-10">
          {staticBranches.map((branch) => {
            const dbB = dbBranches.find((b) => b.name.toLowerCase() === branch.town.toLowerCase())
            const bOpen = dbB ? dbB.is_open : true

            return (
              <button
                key={branch.id}
                onClick={() => setActiveBranch(branch.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-heading text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                  activeBranch === branch.id
                    ? 'bg-[#1C242E] text-white shadow-md font-bold'
                    : 'bg-white text-[#5A687A] hover:text-[#1C242E] hover:bg-stone-50 border border-[#E8E2D8]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    bOpen ? 'bg-emerald-400' : 'bg-rose-400'
                  }`}
                />
                <span>{branch.town}</span>
              </button>
            )
          })}
        </div>

        {/* Selected Branch Editorial Card Presentation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center bg-white p-8 sm:p-12 rounded-3xl border border-[#E8E2D8] shadow-[0_4px_20px_-2px_rgba(28,36,46,0.03)]"
          >
            {/* Left: Branch Details & Contact */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="text-xs font-heading font-semibold uppercase tracking-widest text-[#BE185D]">
                  {current.town} Center
                </span>
                {current.surgical && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FDF2F4] border border-[#FCE7F3] text-[#BE185D] text-[11px] font-semibold">
                    Surgical Hospital
                  </span>
                )}
                {/* Dynamic Supabase Open/Closed Badge */}
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                    isOpen
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {isOpen ? '● Open Today' : '○ Closed Today'}
                </span>
              </div>

              <h3 className="font-heading font-bold text-2xl sm:text-4xl text-[#1C242E] tracking-tight leading-tight mb-3">
                {current.name}
              </h3>
              
              <p className="text-[#5A687A] text-sm sm:text-base leading-relaxed mb-6 font-normal">
                {current.tagline}
              </p>

              <div className="w-full h-px bg-[#E8E2D8] mb-6" />

              {/* Address, Timings & Emergency Info */}
              <div className="flex flex-col gap-4 mb-8 w-full text-sm">
                
                {/* OPD Timings from Supabase */}
                <div className="flex items-center gap-3 text-stone-700">
                  <Clock size={18} className="text-[#BE185D] shrink-0" />
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="text-[#5A687A]">Consultation Hours:</span>
                    <strong className="text-[#1C242E]">
                      {isOpen ? `${openingTime} – ${closingTime}` : 'Currently Closed'}
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-stone-700">
                  <MapPin size={18} className="text-[#BE185D] shrink-0 mt-1" />
                  <div className="flex flex-col leading-relaxed">
                    {current.addressLines.map((line, idx) => (
                      <span key={idx}>{line}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-3 text-[#5A687A] text-xs sm:text-sm">
                  <Phone size={16} className="text-[#BE185D] shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <span className="text-stone-700">
                      Emergency / Reception: <strong className="text-[#1C242E]">{displayPhone}</strong>
                    </span>
                    {current.opticals && (
                      <span className="text-stone-700">
                        Opticals: <strong className="text-[#1C242E]">{current.opticals}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
                <a
                  href={displayPhoneHref}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#BE185D] hover:bg-[#9F1239] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer"
                >
                  <PhoneCall size={14} />
                  <span>Call Now</span>
                </a>

                <button
                  onClick={scrollToAppointment}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 text-[#1C242E] font-heading font-bold text-xs uppercase tracking-wider border border-[#E8E2D8] transition-all duration-300 shadow-xs cursor-pointer"
                >
                  Book for this Branch
                </button>

                <button
                  onClick={() => handleDirectionsClick(current)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-stone-100 hover:bg-stone-200 text-[#1C242E] border border-[#E8E2D8] font-heading font-medium text-xs uppercase tracking-wider transition-all cursor-pointer group shadow-xs"
                >
                  <span>Get Directions</span>
                  <ArrowUpRight size={15} className="text-[#BE185D] group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right: Branch Photography */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-[#E8E2D8] bg-[#FAF8F5] aspect-[4/3] shadow-md">
                <img
                  src={current.image}
                  alt={`${current.name} facility`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C242E]/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-5 right-5">
                  <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/80 text-xs font-heading font-semibold text-[#1C242E] shadow-sm">
                    {current.name}
                  </span>
                </div>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>

      </div>

      {/* Ichapuram Directions Notice Modal */}
      <AnimatePresence>
        {showIchapuramModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="p-7 sm:p-8 rounded-3xl bg-white border border-[#E8E2D8] max-w-md w-full relative shadow-2xl text-[#1C242E]"
            >
              <button
                onClick={() => setShowIchapuramModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                aria-label="Close Notice"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FDF2F4] border border-[#FCE7F3] flex items-center justify-center text-[#BE185D]">
                  <Info size={22} />
                </div>

                <div>
                  <h3 className="font-heading font-bold text-xl text-[#1C242E] mb-1.5">
                    Ichapuram Branch Directions
                  </h3>
                  <p className="text-[#BE185D] text-xs font-heading font-semibold uppercase tracking-wider">
                    Dasannapeta Junction &bull; Ichapuram
                  </p>
                </div>

                <p className="text-sm text-[#5A687A] leading-relaxed">
                  Google Maps location is not available for this branch yet. Please contact the hospital for directions.
                </p>

                <div className="w-full p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] flex items-center justify-between mt-1">
                  <span className="text-xs text-[#5A687A] font-medium">Emergency / Reception:</span>
                  <span className="font-heading font-semibold text-[#1C242E] text-sm">
                    {displayPhone}
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full mt-2">
                  <a
                    href={displayPhoneHref}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#BE185D] hover:bg-[#9F1239] text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                  >
                    <PhoneCall size={14} />
                    <span>Call Now</span>
                  </a>
                  <button
                    onClick={() => setShowIchapuramModal(false)}
                    className="px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-heading font-medium text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
