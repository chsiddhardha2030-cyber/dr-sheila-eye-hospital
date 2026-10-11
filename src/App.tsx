import { useState, useEffect, useCallback } from 'react'
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
import { FloatingAppointmentButton } from './components/FloatingAppointmentButton'
import { AdminPortal } from './admin/AdminPortal'
import { AuthProvider } from './context/AuthContext'
import { HospitalDataProvider } from './context/HospitalDataContext'

type RouteState =
  | { type: 'admin' }
  | { type: 'not-found' }
  | { type: 'home' }

function parseCurrentRoute(): RouteState {
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/'
  const hash = window.location.hash.toLowerCase()

  if (path.startsWith('/admin') || hash === '#admin') {
    return { type: 'admin' }
  }
  if (path === '/' || path === '') {
    return { type: 'home' }
  }
  return { type: 'not-found' }
}

function MainContent() {
  const [route, setRoute] = useState<RouteState>(() => parseCurrentRoute())

  const navigateTo = useCallback((targetPath: string) => {
    const [, hashPart] = targetPath.split('#')

    window.history.pushState({}, '', targetPath)
    const newRoute = parseCurrentRoute()
    setRoute(newRoute)

    if (hashPart) {
      setTimeout(() => {
        const el = document.getElementById(hashPart)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 80)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(parseCurrentRoute())
    }

    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
    }
  }, [])

  // Restore homepage SEO metadata when on home route
  useEffect(() => {
    if (route.type === 'home') {
      document.title = 'Dr Sheilas Eye Hospitals | Eye Care in Srikakulam District'
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'Dr Sheilas Eye Hospitals provides expert cataract surgery, glaucoma care, diabetic retinopathy treatment, and advanced ophthalmic diagnostics across Palasa, Sompeta, and Ichapuram in Srikakulam district.'
        )
      }
      const canonical = document.querySelector('link[rel="canonical"]')
      if (canonical) {
        canonical.setAttribute('href', 'https://www.drsheilaseyehospitals.com/')
      }
      const metaRobots = document.querySelector('meta[name="robots"]')
      if (metaRobots) {
        metaRobots.setAttribute(
          'content',
          'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        )
      }
    } else if (route.type === 'not-found') {
      document.title = 'Page Not Found | Dr Sheilas Eye Hospitals'
      const metaRobots = document.querySelector('meta[name="robots"]')
      if (metaRobots) {
        metaRobots.setAttribute('content', 'noindex, nofollow')
      }
    }
  }, [route])

  if (route.type === 'admin') {
    return <AdminPortal onBackToPublic={() => navigateTo('/')} />
  }

  if (route.type === 'not-found') {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#1C242E] font-sans selection:bg-rose-500/20 selection:text-[#BE185D] flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6 py-32">
          <div className="max-w-lg w-full bg-white border border-[#E8E2D8] rounded-3xl p-8 sm:p-12 text-center shadow-[0_4px_20px_-2px_rgba(28,36,46,0.03)]">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#FDF2F4] border border-[#FCE7F3] text-[#BE185D] text-xs font-heading font-semibold uppercase tracking-wider mb-4">
              Error 404
            </span>
            <h1 className="font-heading font-bold text-5xl text-[#1C242E] tracking-tight mb-2">
              404
            </h1>
            <h2 className="font-heading font-bold text-xl text-[#1C242E] tracking-tight mb-4">
              Page Not Found
            </h2>
            <p className="text-[#5A687A] text-sm leading-relaxed mb-8">
              The page you are looking for does not exist or has been retired. Return to our homepage to explore ophthalmic services, surgeons, and clinic information.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigateTo('/')}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#BE185D] hover:bg-[#9F1239] text-white font-heading font-semibold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
              >
                Return to Home
              </button>
              <button
                onClick={() => navigateTo('/#contact')}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-[#1C242E] font-heading font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer border border-[#E8E2D8]"
              >
                Contact Hospital
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C242E] font-sans selection:bg-rose-500/20 selection:text-[#BE185D]">
      {/* Floating Navbar */}
      <Navbar />

      {/* 1. Video Background Hero with verified brand headline & ticker */}
      <Hero />

      {/* 2. Ophthalmic Surgeons with Dynamic Supabase Status */}
      <Doctors />

      {/* 3. Editorial About: Mission, Vision, Philosophy */}
      <Introduction />

      {/* 4. Tests & Surgery Section: OT, Diagnostics, Lasers */}
      <TestsAndSurgery />

      {/* 5. Outpatient & Clinical Care Services */}
      <Services />

      {/* 6. Three Clinical Centers Showcase with links to dedicated landing pages */}
      <Clinics />

      {/* 7. Community Eye Care & Outreach */}
      <CommunityCare />

      {/* 8. Facility Gallery */}
      <Gallery />

      {/* 9. Consultation Request CTA */}
      <AppointmentCTA />

      {/* 10. Footer with crawlable navigation & contact */}
      <Footer />

      {/* Minimal Floating Actions */}
      <WhatsAppButton />
      <FloatingAppointmentButton />
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
