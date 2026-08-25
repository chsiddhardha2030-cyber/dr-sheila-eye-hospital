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
            ? 'bg-[#050912]/85 backdrop-blur-xl py-3.5 shadow-2xl'
            : 'bg-transparent py-6'
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
            className="flex items-baseline gap-2 text-brand-ivory group"
          >
            <span className="font-heading font-extrabold text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              Dr. Sheila
            </span>
            <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-brand-muted">
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
                className="font-sans text-[13px] font-medium text-brand-muted hover:text-brand-ivory transition-colors tracking-wide"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Single Clean CTA */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => handleLinkClick('#appointment')}
              className="px-5 py-2 rounded-full bg-white/10 hover:bg-white text-brand-ivory hover:text-slate-950 font-heading text-xs font-semibold tracking-wide border border-white/20 hover:border-white transition-all duration-300 backdrop-blur-sm cursor-pointer"
            >
              Book Appointment
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-brand-ivory hover:text-cyan-400 p-1.5 transition-colors cursor-pointer"
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
            className="fixed inset-x-0 top-[60px] z-40 bg-[#050912]/95 backdrop-blur-2xl border-b border-white/[0.08] p-6 flex flex-col gap-6 md:hidden shadow-2xl"
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
                  className="font-heading text-base font-medium text-brand-muted hover:text-brand-ivory transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="h-px bg-white/[0.06]" />

            <button
              onClick={() => handleLinkClick('#appointment')}
              className="w-full py-3 rounded-xl bg-white text-slate-950 font-heading font-bold text-sm tracking-wide shadow-lg transition-transform active:scale-98"
            >
              Book Appointment
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
