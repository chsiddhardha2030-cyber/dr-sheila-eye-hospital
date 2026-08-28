import React from 'react'
import { MapPin, Stethoscope, Lock } from 'lucide-react'
import { useHospitalData } from '../context/HospitalDataContext'

interface TopStatusBarProps {
  onNavigateToAdmin?: () => void
}

export const TopStatusBar: React.FC<TopStatusBarProps> = ({ onNavigateToAdmin }) => {
  const { branches, doctors } = useHospitalData()

  return (
    <aside aria-label="Hospital Branch & Doctor Availability" className="w-full bg-[#1C242E] text-white/90 text-[11px] sm:text-xs py-2 px-4 sm:px-8 border-b border-stone-800 relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1.5 gap-x-4">
        
        {/* Left: Branch Open/Closed Statuses */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="font-heading font-bold uppercase tracking-wider text-rose-300 text-[10px] sm:text-[11px] flex items-center gap-1">
            <MapPin size={12} className="text-rose-400" />
            <span>Branches OPD:</span>
          </span>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {branches.length > 0 ? (
              branches.map((branch) => (
                <div key={branch.id} className="flex items-center gap-1.5 font-medium">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      branch.is_open ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                    }`}
                  />
                  <span className="text-white font-semibold">{branch.name}:</span>
                  <span className={branch.is_open ? 'text-emerald-300 font-medium' : 'text-stone-400'}>
                    {branch.is_open
                      ? `${branch.opening_time || '09:00 AM'} – ${branch.closing_time || '08:00 PM'}`
                      : 'Closed'}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-stone-400">Loading branch hours...</span>
            )}
          </div>
        </div>

        {/* Right: Active Doctors on Duty + Admin Portal Link */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          {/* Active doctors ticker */}
          <div className="hidden lg:flex items-center gap-3 text-stone-300">
            <Stethoscope size={13} className="text-rose-400" />
            <div className="flex items-center gap-3">
              {doctors.map((doc) => (
                <span key={doc.id} className="inline-flex items-center gap-1">
                  <strong className="text-white">{doc.name.replace('Dr. ', 'Dr. ')}:</strong>
                  {doc.available ? (
                    <span className="text-emerald-300">
                      Available ({doc.current_branch || 'Palasa'})
                    </span>
                  ) : (
                    <span className="text-stone-400">Off-duty</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Admin shortcut button */}
          {onNavigateToAdmin && (
            <button
              onClick={onNavigateToAdmin}
              className="inline-flex items-center gap-1 text-[10px] text-stone-400 hover:text-white transition-colors cursor-pointer py-0.5 px-2 rounded-md hover:bg-stone-800"
              title="Hospital Admin Portal"
            >
              <Lock size={10} />
              <span>Admin</span>
            </button>
          )}

        </div>

      </div>
    </aside>
  )
}
