import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Phone, MapPin, X, Info, PhoneCall } from 'lucide-react'

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

  const branches: ClinicBranch[] = [
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
      image: '/optimized/clinics/palasa/DSC_8320.webp',
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
      image: '/optimized/clinics/sompeta/DSC_8324.webp',
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
      image: '/optimized/clinics/ichapuram/DSC_8512.webp',
    },
  ]

  const current = branches.find((b) => b.id === activeBranch) || branches[0]

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
    <section id="clinics" className="bg-[#07111D] py-24 md:py-36 text-brand-ivory font-sans border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <span className="text-[12px] font-heading font-medium tracking-[0.25em] uppercase text-cyan-400 mb-3 block">
            Clinical Locations
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-[-0.03em] leading-[1.12] mb-4">
            Three Accessible Hospital Branches
          </h2>
          <p className="text-brand-muted text-base sm:text-lg font-normal leading-relaxed">
            Delivering trusted ophthalmic care across the Srikakulam district with dedicated clinical facilities in Palasa, Sompeta, and Ichapuram.
          </p>
        </div>

        {/* Simple Branch Selector Tabs */}
        <div className="flex flex-wrap gap-2.5 pb-6 border-b border-white/[0.08] mb-10">
          {branches.map((branch) => (
            <button
              key={branch.id}
              onClick={() => setActiveBranch(branch.id)}
              className={`px-5 py-2.5 rounded-full font-heading text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                activeBranch === branch.id
                  ? 'bg-cyan-400 text-slate-950 shadow-lg font-bold'
                  : 'bg-white/[0.04] text-brand-muted hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              {branch.town}
            </button>
          ))}
        </div>

        {/* Selected Branch Simple Editorial Presentation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
          >
            {/* Left: Branch Details & Contact */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-heading font-semibold uppercase tracking-widest text-cyan-400">
                  {current.town} Center
                </span>
                {current.surgical && (
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-medium">
                    Surgical Hospital
                  </span>
                )}
              </div>

              <h3 className="font-heading font-bold text-2xl sm:text-4xl text-white tracking-tight leading-tight mb-3">
                {current.name}
              </h3>
              
              <p className="text-brand-muted text-sm sm:text-base leading-relaxed mb-6 font-normal">
                {current.tagline}
              </p>

              <div className="w-full h-px bg-white/[0.06] mb-6" />

              {/* Address & Emergency Info */}
              <div className="flex flex-col gap-4 mb-8 w-full text-sm">
                <div className="flex items-start gap-3 text-slate-300">
                  <MapPin size={18} className="text-cyan-400 shrink-0 mt-1" />
                  <div className="flex flex-col leading-relaxed">
                    {current.addressLines.map((line, idx) => (
                      <span key={idx}>{line}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-400 text-xs sm:text-sm">
                  <Phone size={16} className="text-cyan-400/80 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <span className="text-brand-muted">
                      Emergency / Reception: {current.phone}
                    </span>
                    {current.opticals && (
                      <span className="text-brand-muted">
                        Opticals: {current.opticals}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
                <a
                  href={current.phoneHref}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-heading font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-xl cursor-pointer"
                >
                  <PhoneCall size={14} />
                  <span>Call Now</span>
                </a>

                <button
                  onClick={scrollToAppointment}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-heading font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-xl cursor-pointer"
                >
                  Book for this Branch
                </button>

                <button
                  onClick={() => handleDirectionsClick(current)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 font-heading font-medium text-xs uppercase tracking-wider transition-all cursor-pointer group"
                >
                  <span>Get Directions</span>
                  <ArrowUpRight size={15} className="text-cyan-400 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>

            {/* Right: Branch Photography */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#050912] aspect-[4/3] shadow-2xl">
                <img
                  src={current.image}
                  alt={`${current.name} facility`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050912]/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-5 right-5">
                  <span className="inline-block px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-xs font-heading font-medium text-white/90">
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
            className="fixed inset-0 bg-[#050912]/85 backdrop-blur-xl z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="p-7 sm:p-8 rounded-3xl bg-[#07111D] border border-white/10 max-w-md w-full relative shadow-2xl text-brand-ivory"
            >
              <button
                onClick={() => setShowIchapuramModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-950 transition-colors cursor-pointer"
                aria-label="Close Notice"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Info size={22} />
                </div>

                <div>
                  <h3 className="font-heading font-bold text-xl text-white mb-1.5">
                    Ichapuram Branch Directions
                  </h3>
                  <p className="text-cyan-400 text-xs font-heading font-semibold uppercase tracking-wider">
                    Dasannapeta Junction &bull; Ichapuram
                  </p>
                </div>

                <p className="text-sm text-brand-muted leading-relaxed">
                  Google Maps location is not available for this branch yet. Please contact the hospital for directions.
                </p>

                <div className="w-full p-4 rounded-xl bg-[#050912] border border-white/[0.08] flex items-center justify-between mt-1">
                  <span className="text-xs text-brand-muted font-medium">Emergency / Reception:</span>
                  <span className="font-heading font-semibold text-slate-300 text-sm">
                    08947-231261
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full mt-2">
                  <a
                    href="tel:08947231261"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-heading font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
                  >
                    <PhoneCall size={14} />
                    <span>Call Now</span>
                  </a>
                  <button
                    onClick={() => setShowIchapuramModal(false)}
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-heading font-medium text-xs uppercase tracking-wider transition-colors cursor-pointer"
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
