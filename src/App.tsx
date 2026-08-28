import { useState, useEffect } from 'react'
import './App.css'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Doctors } from './components/Doctors'
import { Introduction } from './components/Introduction'
import { Services } from './components/Services'
import { TestsAndSurgery } from './components/TestsAndSurgery'
import { Clinics } from './components/Clinics'
import { CommunityCare } from './components/CommunityCare'
import { Gallery } from './components/Gallery'
import { AppointmentCTA } from './components/AppointmentCTA'
import { Footer } from './components/Footer'
import { WhatsAppButton } from './components/WhatsAppButton'
import { AIChatbot } from './components/AIChatbot'
import { AdminPortal } from './admin/AdminPortal'
import { AuthProvider } from './context/AuthContext'
import { HospitalDataProvider } from './context/HospitalDataContext'

function MainContent() {
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    return (
      window.location.pathname.toLowerCase().startsWith('/admin') ||
      window.location.hash.toLowerCase() === '#admin'
    )
  })

  useEffect(() => {
    const handleLocationChange = () => {
      const isAdmin =
        window.location.pathname.toLowerCase().startsWith('/admin') ||
        window.location.hash.toLowerCase() === '#admin'
      setIsAdminRoute(isAdmin)
    }

    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
    }
  }, [])

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path)
    const isAdmin = path.toLowerCase().startsWith('/admin') || path.toLowerCase() === '#admin'
    setIsAdminRoute(isAdmin)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isAdminRoute) {
    return <AdminPortal onBackToPublic={() => navigateTo('/')} />
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C242E] font-sans selection:bg-rose-500/20 selection:text-[#BE185D]">
      {/* Ultra-Minimal Floating Navbar with 7 Defined Links & Book CTA */}
      <Navbar />

      {/* 1. Full-Bleed Video Background Hero */}
      <Hero />

      {/* 2. Ophthalmic Surgeons (Compact Circular Portraits - Dr. Sheila & Dr. Tridib) with Dynamic Supabase Status */}
      <Doctors />

      {/* 3. Editorial About: Introduction, Mission, Vision, Philosophy */}
      <Introduction />

      {/* 4. Outpatient Clinical Services */}
      <Services />

      {/* 5. Dedicated Tests & Surgery Section (Diagnostics, Lasers, Surgery & Palasa OT) */}
      <TestsAndSurgery />

      {/* 6. Three Clinical Centers Showcase (Palasa, Sompeta, Ichapuram) with Dynamic Supabase Hours & Status */}
      <Clinics />

      {/* 7. Community Eye Care & Outreach (Schools, Diabetes, Village Camps) */}
      <CommunityCare />

      {/* 8. Editorial Visual Tour */}
      <Gallery />

      {/* 9. Consultation Request CTA */}
      <AppointmentCTA />

      {/* 10. Editorial Footer & Contact */}
      <Footer />

      {/* Minimal Floating Actions */}
      <WhatsAppButton />
      <AIChatbot />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <HospitalDataProvider>
        <MainContent />
      </HospitalDataProvider>
    </AuthProvider>
  )
}

export default App
