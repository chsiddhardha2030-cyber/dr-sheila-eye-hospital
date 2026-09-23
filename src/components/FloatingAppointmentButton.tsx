import React from 'react'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'

export const FloatingAppointmentButton: React.FC = () => {
  const handleScrollToAppointment = () => {
    const el = document.querySelector('#appointment')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.button
      onClick={handleScrollToAppointment}
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-20 right-6 z-40 px-4 py-2.5 bg-[#BE185D] hover:bg-[#9F1239] text-white rounded-full border border-white/20 shadow-[0_4px_20px_rgba(190,24,93,0.35)] flex items-center gap-2 text-xs font-heading font-semibold tracking-wide cursor-pointer transition-colors duration-300 group"
      aria-label="Book Appointment"
    >
      <Calendar size={14} className="text-rose-100 group-hover:scale-110 transition-transform" />
      <span>Book Appointment</span>
    </motion.button>
  )
}
