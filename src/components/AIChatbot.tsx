import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send } from 'lucide-react'

interface Message {
  id: string
  sender: 'bot' | 'user'
  text: string
}

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello. I can assist with information regarding Dr. Sheila Eye Hospitals branches, consulting surgeons, services, and appointment inquiries.',
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const getBotResponse = (input: string): string => {
    const q = input.toLowerCase()

    if (q.includes('doctor') || q.includes('surgeon') || q.includes('sheila') || q.includes('tridib')) {
      return 'Dr. Sheila Eye Hospitals is led by our ophthalmic surgeons:\n• Dr. Sheila Thangaraj (MBBS, DO) — Ophthalmic Surgeon & Medical Director\n• Dr. Tridib Gogoi (MBBS, DO) — Ophthalmic Surgeon'
    }

    if (q.includes('branch') || q.includes('clinic') || q.includes('location') || q.includes('where') || q.includes('address')) {
      return 'We have three locations across Srikakulam:\n1. Palasa (Main Center & Surgical OT): VBR Complex, K.T. Road, Shivaji Nagar, Kasibugga, Palasa - 532222 (Phone: 08945-242442 / 9493661180)\n2. Sompeta Branch: Main Road, Town Hall Street, Sompeta - 532284 (Phone: 9493661180)\n3. Ichapuram Center: Fakhirpeta, Railway Station Road, Ichapuram - 532312 (Phone: 9493661180)'
    }

    if (q.includes('surgery') || q.includes('surgical') || q.includes('cataract') || q.includes('operation') || q.includes('ot')) {
      return 'Surgical services are performed exclusively at our Palasa Main Center, equipped with a sterile Operation Theatre complex. Procedures include Cataract surgery (Phacoemulsification and SICS), Glaucoma surgery, Trauma management, and Nd:YAG laser treatments.'
    }

    if (q.includes('service') || q.includes('diagnostic') || q.includes('test') || q.includes('outpatient')) {
      return 'Our services include:\n• Outpatient: Vision testing, Refraction & spectacle prescription, Comprehensive exams, Glaucoma & Retinal exams, Cornea care\n• Diagnostics: Slit lamp biomicroscopy, Autorefractometer, Goldmann applanation tonometry, Automated perimetry, Optical biometry, A-scan ultrasonography\n• Facilities: Day-care recovery beds, In-house optical & pharmacy units'
    }

    if (q.includes('book') || q.includes('appointment') || q.includes('schedule') || q.includes('contact') || q.includes('phone')) {
      return 'You can submit an appointment request on our website or contact our helpline directly at +91 94936 61180 / 08945-242442. Email: info@avehospital.com.'
    }

    return 'Thank you for reaching out. You may submit an appointment request online or call our hospital helpline directly at +91 94936 61180.'
  }

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputValue,
    }

    setMessages((prev) => [...prev, userMsg])
    setInputValue('')

    setTimeout(() => {
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: getBotResponse(userMsg.text),
      }
      setMessages((prev) => [...prev, botMsg])
    }, 500)
  }

  return (
    <>
      {/* Subtle Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-20 right-6 z-40 p-3.5 bg-[#07111D] hover:bg-[#0d1a2d] text-brand-ivory rounded-full border border-white/10 shadow-2xl flex items-center justify-center cursor-pointer transition-colors duration-300"
        aria-label="Toggle Hospital Assistant"
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </motion.button>

      {/* Minimal Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-36 right-6 z-40 w-80 sm:w-96 h-[460px] rounded-2xl overflow-hidden bg-[#07111D]/95 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col font-sans text-brand-ivory"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-[#050912] border-b border-white/[0.08] flex items-center justify-between">
              <div>
                <h4 className="font-heading font-bold text-sm text-white">Hospital Information Assistant</h4>
                <span className="text-[10px] text-brand-muted uppercase tracking-wider">Dr. Sheila Eye Hospitals</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-brand-muted hover:text-white p-1 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-3 text-xs leading-relaxed bg-[#050912]/40">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-xl max-w-[88%] whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'self-end bg-white/15 text-white border border-white/10'
                      : 'self-start bg-[#0d1a2d] text-slate-300 border border-white/[0.06]'
                  }`}
                >
                  {m.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-[#050912] border-t border-white/[0.08] flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend()
                }}
                placeholder="Ask about surgeons, clinics, services..."
                className="flex-grow bg-[#07111D] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-white/30 outline-none"
              />
              <button
                onClick={handleSend}
                className="p-2 bg-white text-slate-950 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <Send size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
