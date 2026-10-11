import React from 'react'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const handleNavClick = (pathOrAnchor: string) => {
    if (pathOrAnchor.startsWith('/')) {
      window.history.pushState({}, '', pathOrAnchor)
      window.dispatchEvent(new PopStateEvent('popstate'))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', `/${pathOrAnchor}`)
        window.dispatchEvent(new PopStateEvent('popstate'))
      } else {
        const element = document.querySelector(pathOrAnchor)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  return (
    <footer id="contact" className="bg-[#121A24] pt-24 pb-12 text-slate-400 font-sans border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          
          {/* Col 1: Hospital Brand */}
          <div className="lg:col-span-1 flex flex-col items-start">
            <span className="font-heading font-extrabold text-xl text-white tracking-tight mb-1">
              Dr Sheilas
            </span>
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-rose-400 mb-4 block">
              Eye Hospitals
            </span>
            <p className="text-xs leading-relaxed text-slate-400">
              Comprehensive ophthalmic diagnostics, sterile microsurgery, and dedicated community eye care across Srikakulam district.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="flex flex-col gap-3">
            <span className="font-heading font-semibold text-xs text-white uppercase tracking-wider mb-2">
              Navigation
            </span>
            <a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('/') }} className="text-xs text-left text-slate-400 hover:text-white transition-colors cursor-pointer">Home</a>
            <a href="/#doctors" onClick={(e) => { e.preventDefault(); handleNavClick('#doctors') }} className="text-xs text-left text-slate-400 hover:text-white transition-colors cursor-pointer">Doctors</a>
            <a href="/#about" onClick={(e) => { e.preventDefault(); handleNavClick('#about') }} className="text-xs text-left text-slate-400 hover:text-white transition-colors cursor-pointer">About Hospital</a>
            <a href="/#services" onClick={(e) => { e.preventDefault(); handleNavClick('#services') }} className="text-xs text-left text-slate-400 hover:text-white transition-colors cursor-pointer">Outpatient Services</a>
            <a href="/#tests" onClick={(e) => { e.preventDefault(); handleNavClick('#tests') }} className="text-xs text-left text-slate-400 hover:text-white transition-colors cursor-pointer">Surgery &amp; OT</a>
            <a href="/#gallery" onClick={(e) => { e.preventDefault(); handleNavClick('#gallery') }} className="text-xs text-left text-slate-400 hover:text-white transition-colors cursor-pointer">Facility Gallery</a>
          </div>

          {/* Col 3: Doctors */}
          <div className="flex flex-col gap-3">
            <span className="font-heading font-semibold text-xs text-white uppercase tracking-wider mb-2">
              Surgeons
            </span>
            <span className="text-xs text-slate-200 font-medium">Dr. Sheila Thangaraj (MBBS; DO)</span>
            <span className="text-xs text-slate-200 font-medium">Dr. Tridib Gogoi (MBBS; DO)</span>
            <a href="/#doctors" onClick={(e) => { e.preventDefault(); handleNavClick('#doctors') }} className="text-xs text-left text-rose-400 hover:text-rose-300 transition-colors mt-2 cursor-pointer">View Surgeon Profiles &rarr;</a>
          </div>

          {/* Col 4: Hospital Branches (Plain text) */}
          <div className="flex flex-col gap-3">
            <span className="font-heading font-semibold text-xs text-white uppercase tracking-wider mb-2">
              Hospital Branches
            </span>
            <span className="text-xs text-left text-slate-400">
              Palasa Main Hospital (OT)
            </span>
            <span className="text-xs text-left text-slate-400">
              Sompeta Branch (OPD &amp; Vision)
            </span>
            <span className="text-xs text-left text-slate-400">
              Ichapuram Branch (OPD Clinic)
            </span>
          </div>

          {/* Col 5: Contact & Inquiries */}
          <div className="flex flex-col gap-3">
            <span className="font-heading font-semibold text-xs text-white uppercase tracking-wider mb-2">
              Contact
            </span>
            <a
              href="tel:+918945242442"
              className="text-xs text-slate-300 hover:text-white hover:underline transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-400 rounded-sm w-fit"
            >
              Palasa: 08945-242442
            </a>
            <a
              href="tel:+918947234108"
              className="text-xs text-slate-300 hover:text-white hover:underline transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-400 rounded-sm w-fit"
            >
              Sompeta: 08947-234108
            </a>
            <a
              href="tel:+918947231261"
              className="text-xs text-slate-300 hover:text-white hover:underline transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-400 rounded-sm w-fit"
            >
              Ichapuram: 08947-231261
            </a>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <span>&copy; {currentYear} Dr Sheilas Eye Hospitals. All rights reserved.</span>
          <div className="flex gap-4">
            <span>Palasa</span>
            <span>&bull;</span>
            <span>Sompeta</span>
            <span>&bull;</span>
            <span>Ichapuram</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
