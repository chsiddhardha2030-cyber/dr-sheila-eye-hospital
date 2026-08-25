import React from 'react'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const scrollTo = (id: string) => {
    const element = document.querySelector(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer id="contact" className="bg-[#050912] pt-24 pb-12 text-brand-muted font-sans border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          
          {/* Col 1: Hospital Brand */}
          <div className="lg:col-span-1 flex flex-col items-start">
            <span className="font-heading font-extrabold text-xl text-white tracking-tight mb-1">
              Dr. Sheila
            </span>
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-cyan-400 mb-4 block">
              Eye Hospitals
            </span>
            <p className="text-xs leading-relaxed text-brand-subtle">
              Comprehensive ophthalmic diagnostics and microsurgical center serving Srikakulam district.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="flex flex-col gap-3">
            <span className="font-heading font-semibold text-xs text-white uppercase tracking-wider mb-2">
              Navigation
            </span>
            <button onClick={() => scrollTo('#hero')} className="text-xs text-left hover:text-white transition-colors cursor-pointer">Home</button>
            <button onClick={() => scrollTo('#doctors')} className="text-xs text-left hover:text-white transition-colors cursor-pointer">Doctors</button>
            <button onClick={() => scrollTo('#about')} className="text-xs text-left hover:text-white transition-colors cursor-pointer">About Hospital</button>
            <button onClick={() => scrollTo('#services')} className="text-xs text-left hover:text-white transition-colors cursor-pointer">Outpatient Services</button>
            <button onClick={() => scrollTo('#tests')} className="text-xs text-left hover:text-white transition-colors cursor-pointer">Tests & Surgery</button>
            <button onClick={() => scrollTo('#gallery')} className="text-xs text-left hover:text-white transition-colors cursor-pointer">Facility Gallery</button>
          </div>

          {/* Col 3: Doctors */}
          <div className="flex flex-col gap-3">
            <span className="font-heading font-semibold text-xs text-white uppercase tracking-wider mb-2">
              Surgeons
            </span>
            <span className="text-xs text-slate-300 font-medium">Dr. Sheila Thangaraj (MBBS; DO)</span>
            <span className="text-xs text-slate-300 font-medium">Dr. Tridib Gogoi (MBBS; DO)</span>
            <button onClick={() => scrollTo('#doctors')} className="text-xs text-left text-cyan-400 hover:text-cyan-300 transition-colors mt-2 cursor-pointer">View Surgeon Profiles &rarr;</button>
          </div>

          {/* Col 4: Clinics */}
          <div className="flex flex-col gap-3">
            <span className="font-heading font-semibold text-xs text-white uppercase tracking-wider mb-2">
              Clinical Centers
            </span>
            <button onClick={() => scrollTo('#clinics')} className="text-xs text-left hover:text-white transition-colors cursor-pointer">Palasa Main Center (Surgical OT)</button>
            <button onClick={() => scrollTo('#clinics')} className="text-xs text-left hover:text-white transition-colors cursor-pointer">Sompeta Branch</button>
            <button onClick={() => scrollTo('#clinics')} className="text-xs text-left hover:text-white transition-colors cursor-pointer">Ichapuram Center</button>
          </div>

          {/* Col 5: Contact & Inquiries */}
          <div className="flex flex-col gap-3">
            <span className="font-heading font-semibold text-xs text-white uppercase tracking-wider mb-2">
              Contact
            </span>
            <span className="text-xs text-brand-muted">Palasa Main: 08945-242442</span>
            <span className="text-xs text-brand-muted">Helpline: +91 94936 61180</span>
            <span className="text-xs text-brand-muted">Direct: 9493661180</span>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-brand-subtle">
          <span>&copy; {currentYear} Dr. Sheila's Eye Hospitals. All rights reserved.</span>
          <div className="flex gap-6">
            <span>Palasa &bull; Sompeta &bull; Ichapuram</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
