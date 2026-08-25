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
        className="fixed bottom-20 right-6 z-40 p-3.5 bg-white hover:bg-stone-50 text-[#1C242E] rounded-full border border-[#E8E2D8] shadow-[0_4px_20px_rgba(28,36,46,0.12)] flex items-center justify-center cursor-pointer transition-colors duration-300"
        aria-label="Toggle Hospital Assistant"
      >
        {isOpen ? <X size={20} className="text-[#1C242E]" /> : <MessageSquare size={20} className="text-[#BE185D]" />}
      </motion.button>

      {/* Minimal Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-36 right-6 z-40 w-80 sm:w-96 h-[460px] rounded-2xl overflow-hidden bg-white border border-[#E8E2D8] shadow-2xl flex flex-col font-sans text-[#1C242E]"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-[#FAF8F5] border-b border-[#E8E2D8] flex items-center justify-between">
              <div>
                <h4 className="font-heading font-bold text-sm text-[#1C242E]">Hospital Assistant</h4>
                <span className="text-[10px] text-[#BE185D] font-heading font-semibold uppercase tracking-wider">Dr. Sheila Eye Hospitals</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#5A687A] hover:text-[#1C242E] p-1 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-3 text-xs leading-relaxed bg-[#FAF8F5]/60">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-xl max-w-[88%] whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'self-end bg-[#BE185D] text-white shadow-xs'
                      : 'self-start bg-white text-stone-800 border border-[#E8E2D8] shadow-xs'
                  }`}
                >
                  {m.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-[#E8E2D8] flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend()
                }}
                placeholder="Ask about surgeons, clinics, services..."
                className="flex-grow bg-[#FAF8F5] border border-[#E8E2D8] rounded-lg px-3 py-2 text-xs text-[#1C242E] placeholder-stone-400 focus:border-[#BE185D] outline-none"
              />
              <button
                onClick={handleSend}
                className="p-2 bg-[#BE185D] hover:bg-[#9F1239] text-white rounded-lg transition-colors cursor-pointer shadow-xs"
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
