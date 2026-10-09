import React, { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Calendar } from 'lucide-react'

export const FloatingAppointmentButton: React.FC = () => {
  const prefersReducedMotion = useReducedMotion()
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion) return

    const interval = setInterval(() => {
      setIsCompact((prev) => !prev)
    }, 2000)

    return () => clearInterval(interval)
  }, [prefersReducedMotion])

  const handleScrollToAppointment = () => {
    const el = document.querySelector('#appointment')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.button
      layout
      onClick={handleScrollToAppointment}
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
        scale: { duration: 0.2 },
        opacity: { duration: 0.3 },
      }}
      className="fixed bottom-[84px] right-6 z-40 px-3.5 sm:px-4 py-2.5 bg-[#BE185D] hover:bg-[#9F1239] text-white rounded-full border border-white/20 shadow-[0_4px_20px_rgba(190,24,93,0.35)] flex items-center gap-2 text-xs font-heading font-semibold tracking-wide cursor-pointer transition-colors duration-300 group overflow-hidden"
      aria-label="Book Appointment"
    >
      <Calendar size={14} className="shrink-0 text-rose-100 group-hover:scale-110 transition-transform" />
      <motion.span
        key={isCompact ? 'compact' : 'full'}
        initial={{ opacity: 0, x: isCompact ? -4 : 4 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: isCompact ? 4 : -4 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="whitespace-nowrap font-medium"
      >
        {isCompact ? 'Book' : 'Book Appointment'}
      </motion.span>
    </motion.button>
  )
}

