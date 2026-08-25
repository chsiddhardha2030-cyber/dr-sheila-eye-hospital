import React from 'react'
import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa6'

export const WhatsAppButton: React.FC = () => {
  const whatsappNumber = '919493661180'
  const message = 'Hello Dr. Sheila Eye Hospital, I would like to inquire about appointments and clinic consultations.'

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <motion.button
      onClick={handleWhatsAppClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-6 right-6 z-40 p-3.5 bg-[#0a1b14] hover:bg-[#0f281e] text-emerald-400 rounded-full border border-emerald-500/30 shadow-2xl flex items-center justify-center cursor-pointer transition-colors duration-300"
      aria-label="Contact on WhatsApp"
    >
      <FaWhatsapp className="w-5 h-5 text-emerald-400" />
    </motion.button>
  )
}
