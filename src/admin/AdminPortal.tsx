import React from 'react'
import { useAuth } from '../context/AuthContext'
import { AdminLogin } from './AdminLogin'
import { AdminDashboard } from './AdminDashboard'
import { Loader2 } from 'lucide-react'

interface AdminPortalProps {
  onBackToPublic: () => void
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToPublic }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center text-[#1C242E]">
        <Loader2 className="w-8 h-8 animate-spin text-[#BE185D] mb-3" />
        <span className="text-xs font-heading font-semibold uppercase tracking-widest text-[#5A687A]">
          Checking Security Session...
        </span>
      </div>
    )
  }

  if (!user) {
    return <AdminLogin onBackToPublic={onBackToPublic} />
  }

  return <AdminDashboard onGoToPublic={onBackToPublic} />
}
