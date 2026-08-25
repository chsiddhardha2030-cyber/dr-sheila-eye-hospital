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

function App() {
  return (
    <div className="min-h-screen bg-[#050912] text-[#F5F7FA] font-sans selection:bg-cyan-500/20 selection:text-white">
      {/* Ultra-Minimal Floating Navbar with 7 Defined Links & Book CTA */}
      <Navbar />

      {/* 1. Full-Bleed Video Background Hero */}
      <Hero />

      {/* 2. Ophthalmic Surgeons (Compact Circular Portraits - Dr. Sheila & Dr. Tridib) */}
      <Doctors />

      {/* 3. Editorial About: Introduction, Mission, Vision, Philosophy */}
      <Introduction />

      {/* 4. Outpatient Clinical Services */}
      <Services />

      {/* 5. Dedicated Tests & Surgery Section (Diagnostics, Lasers, Surgery & Palasa OT) */}
      <TestsAndSurgery />

      {/* 6. Three Clinical Centers Showcase (Palasa, Sompeta, Ichapuram) */}
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

export default App
