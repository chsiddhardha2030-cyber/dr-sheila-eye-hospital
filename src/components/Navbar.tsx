import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Doctors', href: '#doctors' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Tests', href: '#tests' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ]

  const handleLinkClick = (href: string) => {
    setIsOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#FAF8F5]/90 backdrop-blur-xl py-3.5 shadow-[0_2px_15px_-3px_rgba(28,36,46,0.06)] border-b border-[#E8E2D8]/80'
            : 'bg-[#FAF8F5]/60 backdrop-blur-md py-5 border-b border-[#E8E2D8]/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Minimal Wordmark */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault()
              handleLinkClick('#hero')
            }}
            className="flex items-baseline gap-2 group cursor-pointer"
          >
            <span className="font-heading font-extrabold text-xl tracking-tight text-[#1C242E] group-hover:text-[#BE185D] transition-colors">
              Dr. Sheila
            </span>
            <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#5A687A]">
              Eye Hospitals
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-9">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleLinkClick(link.href)
                }}
                className="font-sans text-[13px] font-medium tracking-wide text-[#5A687A] hover:text-[#1C242E] transition-colors cursor-pointer"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Single Clean CTA */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => handleLinkClick('#appointment')}
              className="px-5 py-2 rounded-full font-heading text-xs font-semibold tracking-wide bg-[#BE185D] hover:bg-[#9F1239] text-white shadow-sm hover:shadow transition-all duration-300 cursor-pointer"
            >
              Book Appointment
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-1.5 text-[#1C242E] hover:text-[#BE185D] transition-colors cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[60px] z-40 bg-[#FAF8F5]/98 backdrop-blur-2xl border-b border-[#E8E2D8] p-6 flex flex-col gap-6 md:hidden shadow-xl"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleLinkClick(link.href)
                  }}
                  className="font-heading text-base font-medium text-[#5A687A] hover:text-[#1C242E] transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="h-px bg-[#E8E2D8]" />

            <button
              onClick={() => handleLinkClick('#appointment')}
              className="w-full py-3 rounded-xl bg-[#BE185D] hover:bg-[#9F1239] text-white font-heading font-bold text-sm tracking-wide shadow-md transition-transform active:scale-98 cursor-pointer"
            >
              Book Appointment
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
