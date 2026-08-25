import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Calendar, Clock, User, Phone, MapPin, Stethoscope, PhoneCall } from 'lucide-react'

export const AppointmentCTA: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    branch: '',
    doctor: '',
    date: '',
    time: '',
    message: '',
  })

  const [phoneError, setPhoneError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [bookingId, setBookingId] = useState('')

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value
    // Allow only numeric digits, max 10
    const digitsOnly = rawVal.replace(/\D/g, '').slice(0, 10)
    setFormData((prev) => ({ ...prev, phone: digitsOnly }))

    if (digitsOnly.length > 0 && digitsOnly.length < 10) {
      setPhoneError('Please enter a valid 10-digit phone number.')
    } else {
      setPhoneError('')
    }
  }

  const handlePhoneBlur = () => {
    if (formData.phone.length > 0 && formData.phone.length < 10) {
      setPhoneError('Please enter a valid 10-digit phone number.')
    } else if (formData.phone.length === 10) {
      setPhoneError('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.phone.length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number.')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      const mockId = 'SH-' + Math.floor(100000 + Math.random() * 900000)
      setBookingId(mockId)
      setShowSuccess(true)
    }, 800)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      gender: '',
      phone: '',
      branch: '',
      doctor: '',
      date: '',
      time: '',
      message: '',
    })
    setPhoneError('')
    setShowSuccess(false)
  }

  return (
    <section id="appointment" className="bg-[#FFFFFF] py-24 md:py-36 text-[#1C242E] font-sans border-b border-[#E8E2D8] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left: Editorial Call to Action */}
          <div className="lg:col-span-4 flex flex-col">
            <span className="text-[12px] font-heading font-semibold tracking-[0.25em] uppercase text-[#BE185D] mb-3 block">
              Consultation Request
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#1C242E] tracking-[-0.03em] leading-[1.14] mb-5">
              Book a Clinical Appointment
            </h2>
            <p className="text-[#5A687A] text-base leading-relaxed mb-8 font-normal">
              Schedule your outpatient consultation or surgical evaluation with our ophthalmic surgeons across Palasa, Sompeta, and Ichapuram.
            </p>

            {/* Direct Hospital Reception Card with Call Now actions */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] flex flex-col gap-4 shadow-sm">
              <span className="font-heading font-semibold text-[#BE185D] text-xs uppercase tracking-wider">
                Direct Hospital Reception
              </span>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex flex-col">
                    <span className="text-[#1C242E] font-medium">Palasa Main Hospital</span>
                    <span className="text-[#5A687A]">08945-242442</span>
                  </div>
                  <a
                    href="tel:08945242442"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#BE185D] hover:bg-[#9F1239] text-white font-heading font-bold text-[11px] uppercase tracking-wider transition-colors shadow-xs"
                  >
                    <PhoneCall size={11} />
                    <span>Call Now</span>
                  </a>
                </div>

                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex flex-col">
                    <span className="text-[#1C242E] font-medium">Sompeta Branch</span>
                    <span className="text-[#5A687A]">08947-234108</span>
                  </div>
                  <a
                    href="tel:08947234108"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#BE185D] hover:bg-[#9F1239] text-white font-heading font-bold text-[11px] uppercase tracking-wider transition-colors shadow-xs"
                  >
                    <PhoneCall size={11} />
                    <span>Call Now</span>
                  </a>
                </div>

                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex flex-col">
                    <span className="text-[#1C242E] font-medium">Ichapuram Branch</span>
                    <span className="text-[#5A687A]">08947-231261</span>
                  </div>
                  <a
                    href="tel:08947231261"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#BE185D] hover:bg-[#9F1239] text-white font-heading font-bold text-[11px] uppercase tracking-wider transition-colors shadow-xs"
                  >
                    <PhoneCall size={11} />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>
              <span className="text-xs text-[#8A96A6] pt-2 border-t border-[#E8E2D8]">
                Same-day walk-in consultations also available during OPD hours.
              </span>
            </div>
          </div>

          {/* Right: Comprehensive Frontend Form */}
          <div className="lg:col-span-8">
            <div className="p-6 sm:p-10 rounded-3xl bg-[#FAF8F5] border border-[#E8E2D8] shadow-[0_8px_30px_rgba(28,36,46,0.05)] relative overflow-hidden">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#BE185D]/50 to-transparent" />

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                
                {/* Row 1: Patient Name & Contact Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-heading font-semibold text-[#1C242E] tracking-wide flex items-center gap-1.5">
                      <User size={13} className="text-[#BE185D]" />
                      <span>Patient Name *</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Rama Rao"
                      className="w-full bg-white border border-[#E8E2D8] rounded-xl px-4 py-3 text-sm text-[#1C242E] placeholder-stone-400 focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] outline-none transition-colors shadow-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-heading font-semibold text-[#1C242E] tracking-wide flex items-center gap-1.5">
                      <Phone size={13} className="text-[#BE185D]" />
                      <span>Phone Number *</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      onBlur={handlePhoneBlur}
                      maxLength={10}
                      required
                      placeholder="e.g. 9876543210"
                      className={`w-full bg-white border ${
                        phoneError ? 'border-rose-500 focus:border-rose-400' : 'border-[#E8E2D8] focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D]'
                      } rounded-xl px-4 py-3 text-sm text-[#1C242E] placeholder-stone-400 outline-none transition-colors shadow-xs`}
                    />
                    {phoneError && (
                      <span className="text-rose-600 text-xs mt-0.5">
                        {phoneError}
                      </span>
                    )}
                  </div>
                </div>

                {/* Row 2: Age & Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-heading font-semibold text-[#1C242E] tracking-wide">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      min="1"
                      max="120"
                      placeholder="e.g. 45"
                      className="w-full bg-white border border-[#E8E2D8] rounded-xl px-4 py-3 text-sm text-[#1C242E] placeholder-stone-400 focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] outline-none transition-colors shadow-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-heading font-semibold text-[#1C242E] tracking-wide">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`w-full bg-white border border-[#E8E2D8] rounded-xl px-4 py-3 text-sm ${
                        formData.gender ? 'text-[#1C242E]' : 'text-stone-400'
                      } focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] outline-none transition-colors cursor-pointer shadow-xs`}
                    >
                      <option value="" disabled>
                        Select Gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Select Branch & Select Doctor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-heading font-semibold text-[#1C242E] tracking-wide flex items-center gap-1.5">
                      <MapPin size={13} className="text-[#BE185D]" />
                      <span>Select Branch</span>
                    </label>
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className={`w-full bg-white border border-[#E8E2D8] rounded-xl px-4 py-3 text-sm ${
                        formData.branch ? 'text-[#1C242E]' : 'text-stone-400'
                      } focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] outline-none transition-colors cursor-pointer shadow-xs`}
                    >
                      <option value="" disabled>
                        Select Branch
                      </option>
                      <option value="Palasa">Palasa</option>
                      <option value="Sompeta">Sompeta</option>
                      <option value="Ichapuram">Ichapuram</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-heading font-semibold text-[#1C242E] tracking-wide flex items-center gap-1.5">
                      <Stethoscope size={13} className="text-[#BE185D]" />
                      <span>Select Doctor</span>
                    </label>
                    <select
                      name="doctor"
                      value={formData.doctor}
                      onChange={handleInputChange}
                      className={`w-full bg-white border border-[#E8E2D8] rounded-xl px-4 py-3 text-sm ${
                        formData.doctor ? 'text-[#1C242E]' : 'text-stone-400'
                      } focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] outline-none transition-colors cursor-pointer shadow-xs`}
                    >
                      <option value="" disabled>
                        Select Doctor
                      </option>
                      <option value="Dr. Sheila Thangaraj — MBBS; DO">
                        Dr. Sheila Thangaraj — MBBS; DO
                      </option>
                      <option value="Dr. Tridib Gogoi — MBBS; DO">
                        Dr. Tridib Gogoi — MBBS; DO
                      </option>
                    </select>
                  </div>
                </div>

                {/* Row 4: Preferred Date & Preferred Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-heading font-semibold text-[#1C242E] tracking-wide flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#BE185D]" />
                      <span>Preferred Date</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#E8E2D8] rounded-xl px-4 py-3 text-sm text-[#1C242E] focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] outline-none transition-colors cursor-pointer shadow-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-heading font-semibold text-[#1C242E] tracking-wide flex items-center gap-1.5">
                      <Clock size={13} className="text-[#BE185D]" />
                      <span>Preferred Time</span>
                    </label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className={`w-full bg-white border border-[#E8E2D8] rounded-xl px-4 py-3 text-sm ${
                        formData.time ? 'text-[#1C242E]' : 'text-stone-400'
                      } focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] outline-none transition-colors cursor-pointer shadow-xs`}
                    >
                      <option value="" disabled>
                        Select Preferred Time
                      </option>
                      <option value="08:00 AM">08:00 AM</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Row 5: Reason / Message */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-heading font-semibold text-[#1C242E] tracking-wide">
                    Reason / Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="e.g. Vision checkup, cataract surgery consultation, eye irritation, glasses power check"
                    className="w-full bg-white border border-[#E8E2D8] rounded-xl px-4 py-3 text-sm text-[#1C242E] placeholder-stone-400 focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] outline-none transition-colors resize-none shadow-xs"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#BE185D] hover:bg-[#9F1239] text-white font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isSubmitting ? 'Processing Request...' : 'Submit Appointment Request'}
                </button>

              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="p-8 rounded-3xl bg-white border border-[#E8E2D8] max-w-md w-full relative shadow-2xl text-[#1C242E]"
            >
              <button
                onClick={resetForm}
                className="absolute top-6 right-6 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                aria-label="Close Confirmation"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FDF2F4] border border-[#FCE7F3] flex items-center justify-center text-[#BE185D]">
                  <Check size={22} />
                </div>

                <div>
                  <h3 className="font-heading font-bold text-2xl text-[#1C242E] mb-1">
                    Appointment Request Received
                  </h3>
                  <p className="text-[#BE185D] text-xs font-mono font-semibold">
                    Reference ID: {bookingId}
                  </p>
                </div>

                <div className="w-full p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] text-xs text-left flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-[#5A687A]">Patient:</span>
                    <span className="text-[#1C242E] font-medium">{formData.name}</span>
                  </div>
                  {formData.branch && (
                    <div className="flex justify-between">
                      <span className="text-[#5A687A]">Branch:</span>
                      <span className="text-[#1C242E] font-medium">{formData.branch}</span>
                    </div>
                  )}
                  {formData.doctor && (
                    <div className="flex justify-between">
                      <span className="text-[#5A687A]">Doctor:</span>
                      <span className="text-[#1C242E] font-medium">{formData.doctor.split('—')[0]}</span>
                    </div>
                  )}
                  {formData.time && (
                    <div className="flex justify-between">
                      <span className="text-[#5A687A]">Time:</span>
                      <span className="text-[#1C242E] font-medium">{formData.time}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-[#5A687A] leading-relaxed">
                  Our hospital reception will contact you at <strong className="text-[#1C242E]">{formData.phone}</strong> to confirm your consultation schedule.
                </p>

                <button
                  onClick={resetForm}
                  className="w-full py-3 rounded-xl bg-[#1C242E] hover:bg-stone-800 text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
