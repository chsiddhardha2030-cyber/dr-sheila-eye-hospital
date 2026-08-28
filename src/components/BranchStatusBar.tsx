import React from 'react'
import { MapPin } from 'lucide-react'
import { useHospitalData } from '../context/HospitalDataContext'

export const BranchStatusBar: React.FC = () => {
  const { branches, loading } = useHospitalData()

  return (
    <aside aria-label="Branch Status and OPD Timings" className="w-full bg-[#FAF8F5] border-b border-[#E8E2D8] pt-[72px] sm:pt-[76px] pb-2.5 px-4 sm:px-8 relative z-30 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-x-6 gap-y-2 text-xs sm:text-[13px]">
        
        {/* Left: Indicator Label */}
        <div className="flex items-center gap-1.5 text-[#BE185D] font-heading font-bold text-[11px] sm:text-xs uppercase tracking-wider">
          <MapPin size={13} className="shrink-0 text-[#BE185D]" />
          <span>Branch Status &amp; OPD Timings:</span>
        </div>

        {/* Dynamic Branch Status List */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-4">
          {loading && branches.length === 0 ? (
            <span className="text-xs text-[#5A687A]">Loading branches...</span>
          ) : (
            branches.map((branch) => {
              const isOpen = branch.is_open
              const openTime = branch.opening_time || '9:00 AM'
              const closeTime = branch.closing_time || '10:00 PM'

              return (
                <div
                  key={branch.id}
                  className="inline-flex items-center gap-2 bg-white border border-[#E8E2D8] px-3.5 py-1 rounded-full shadow-[0_1px_4px_rgba(28,36,46,0.03)] hover:border-[#BE185D]/40 transition-colors"
                >
                  <span className="font-heading font-bold text-[#1C242E] text-xs">
                    {branch.name}:
                  </span>

                  {isOpen ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <span>Open today &bull; {openTime} – {closeTime}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-rose-700 font-medium text-xs">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      <span>Closed today</span>
                    </span>
                  )}
                </div>
              )
            })
          )}
        </div>

      </div>
    </aside>
  )
}
