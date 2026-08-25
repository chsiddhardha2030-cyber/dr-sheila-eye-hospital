import React from 'react'
import { motion } from 'framer-motion'
import { Award, Stethoscope } from 'lucide-react'

export const Doctors: React.FC = () => {
  const doctors = [
    {
      name: 'Dr. Sheila Thangaraj',
      qualification: 'MBBS; DO',
      title: 'Ophthalmic Surgeon & Medical Director',
      image: '/optimized/doctors/DSC_8246.webp',
      alt: 'Dr. Sheila Thangaraj portrait',
    },
    {
      name: 'Dr. Tridib Gogoi',
      qualification: 'MBBS; DO',
      title: 'Ophthalmic Surgeon',
      image: '/optimized/doctors/DSC_8206.webp',
      alt: 'Dr. Tridib Gogoi portrait',
    },
  ]

  return (
    <section
      id="doctors"
      className="bg-[#FAF8F5] pt-14 pb-8 md:py-28 text-[#1C242E] font-sans border-b border-[#E8E2D8] relative"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-10 md:mb-16">
          <span className="text-[12px] font-heading font-semibold tracking-[0.25em] uppercase text-[#BE185D] mb-3 block">
            Medical Leadership
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#1C242E] tracking-[-0.03em] leading-[1.15] mb-4">
            Experienced Ophthalmic Surgeons
          </h2>
          <p className="text-[#5A687A] text-sm max-w-md font-normal leading-relaxed">
            Leading clinical precision, microsurgical care, and dedicated patient treatment across Srikakulam.
          </p>
        </div>

        {/* Compact & Elegant Doctor Presentation with Small Circular Portraits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {doctors.map((doctor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E8E2D8] hover:border-[#BE185D]/40 transition-all duration-300 shadow-[0_4px_20px_-2px_rgba(28,36,46,0.03)] hover:shadow-[0_12px_30px_-4px_rgba(190,24,93,0.08)] group flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative overflow-hidden"
            >
              {/* Subtle top accent gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#BE185D]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Small Clean Circular Portrait */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-br from-stone-200 via-rose-100 to-stone-100 group-hover:from-rose-400 group-hover:to-[#BE185D] transition-all duration-500 shadow-md">
                  <img
                    src={doctor.image}
                    alt={doctor.alt}
                    className="w-full h-full rounded-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-rose-200 flex items-center justify-center text-[#BE185D] shadow-sm">
                  <Stethoscope size={13} />
                </div>
              </div>

              {/* Doctor Details */}
              <div className="flex flex-col flex-grow justify-center">
                <div className="inline-flex items-center justify-center sm:justify-start gap-2 mb-1.5">
                  <span className="text-[11px] font-heading font-semibold tracking-wider text-[#BE185D] uppercase bg-[#FDF2F4] px-2.5 py-0.5 rounded-full border border-[#FCE7F3]">
                    {doctor.qualification}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-2xl text-[#1C242E] tracking-tight group-hover:text-[#BE185D] transition-colors mb-1">
                  {doctor.name}
                </h3>

                <p className="text-[#5A687A] text-sm font-medium mb-3">
                  {doctor.title}
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-[#8A96A6]">
                  <Award size={13} className="text-[#BE185D] shrink-0" />
                  <span>Comprehensive Clinical &amp; Surgical Eye Care</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
