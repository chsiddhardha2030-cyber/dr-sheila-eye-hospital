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
    <section id="appointment" className="bg-[#050912] py-24 md:py-36 text-brand-ivory font-sans border-b border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left: Editorial Call to Action */}
          <div className="lg:col-span-4 flex flex-col">
            <span className="text-[12px] font-heading font-medium tracking-[0.25em] uppercase text-cyan-400 mb-3 block">
              Consultation Request
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-[-0.03em] leading-[1.14] mb-5">
              Book a Clinical Appointment
            </h2>
            <p className="text-brand-muted text-base leading-relaxed mb-8 font-normal">
              Schedule your outpatient consultation or surgical evaluation with our ophthalmic surgeons across Palasa, Sompeta, and Ichapuram.
            </p>

            {/* Direct Hospital Reception Card with Call Now actions */}
            <div className="p-6 rounded-2xl bg-[#07111D] border border-white/[0.08] flex flex-col gap-4 shadow-xl">
              <span className="font-heading font-semibold text-cyan-400 text-xs uppercase tracking-wider">
                Direct Hospital Reception
              </span>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">Palasa Main Hospital</span>
                    <span className="text-brand-muted">08945-242442</span>
                  </div>
                  <a
                    href="tel:08945242442"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-heading font-bold text-[11px] uppercase tracking-wider transition-colors"
                  >
                    <PhoneCall size={11} />
                    <span>Call Now</span>
                  </a>
                </div>

                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">Sompeta Branch</span>
                    <span className="text-brand-muted">08947-234108</span>
                  </div>
                  <a
                    href="tel:08947234108"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-heading font-bold text-[11px] uppercase tracking-wider transition-colors"
                  >
                    <PhoneCall size={11} />
                    <span>Call Now</span>
                  </a>
                </div>

                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">Ichapuram Branch</span>
                    <span className="text-brand-muted">08947-231261</span>
                  </div>
                  <a
                    href="tel:08947231261"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-heading font-bold text-[11px] uppercase tracking-wider transition-colors"
                  >
                    <PhoneCall size={11} />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>
              <span className="text-xs text-brand-muted pt-2 border-t border-white/[0.06]">
                Same-day walk-in consultations also available during OPD hours.
              </span>
            </div>
          </div>

          {/* Right: Comprehensive Frontend Form */}
          <div className="lg:col-span-8">
            <div className="p-6 sm:p-10 rounded-3xl bg-[#07111D] border border-white/[0.08] shadow-2xl relative overflow-hidden">
              {/* Subtle top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                
                {/* Row 1: Patient Name & Contact Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-heading font-semibold text-cyan-300 tracking-wide flex items-center gap-1.5">
                      <User size={13} className="text-cyan-400" />
                      <span>Patient Name *</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Rama Rao"
                      className="w-full bg-[#050912] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-cyan-400 outline-none transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-heading font-semibold text-cyan-300 tracking-wide flex items-center gap-1.5">
                      <Phone size={13} className="text-cyan-400" />
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
                      className={`w-full bg-[#050912] border ${
                        phoneError ? 'border-rose-500 focus:border-rose-400' : 'border-white/[0.1] focus:border-cyan-400'
                      } rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-colors`}
                    />
                    {phoneError && (
                      <span className="text-rose-400 text-xs mt-0.5">
                        {phoneError}
                      </span>
                    )}
                  </div>
                </div>

                {/* Row 2: Age & Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-heading font-semibold text-brand-muted tracking-wide">
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
                      className="w-full bg-[#050912] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-cyan-400 outline-none transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-heading font-semibold text-brand-muted tracking-wide">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`w-full bg-[#050912] border border-white/[0.1] rounded-xl px-4 py-3 text-sm ${
                        formData.gender ? 'text-white' : 'text-slate-500'
                      } focus:border-cyan-400 outline-none transition-colors cursor-pointer`}
                    >
                      <option value="" disabled className="bg-[#07111D] text-slate-500">
                        Select Gender
                      </option>
                      <option value="Male" className="bg-[#07111D] text-white">Male</option>
                      <option value="Female" className="bg-[#07111D] text-white">Female</option>
                      <option value="Other" className="bg-[#07111D] text-white">Other</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Select Branch & Select Doctor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-heading font-semibold text-cyan-300 tracking-wide flex items-center gap-1.5">
                      <MapPin size={13} className="text-cyan-400" />
                      <span>Select Branch</span>
                    </label>
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className={`w-full bg-[#050912] border border-white/[0.1] rounded-xl px-4 py-3 text-sm ${
                        formData.branch ? 'text-white' : 'text-slate-500'
                      } focus:border-cyan-400 outline-none transition-colors cursor-pointer`}
                    >
                      <option value="" disabled className="bg-[#07111D] text-slate-500">
                        Select Branch
                      </option>
                      <option value="Palasa" className="bg-[#07111D] text-white">Palasa</option>
                      <option value="Sompeta" className="bg-[#07111D] text-white">Sompeta</option>
                      <option value="Ichapuram" className="bg-[#07111D] text-white">Ichapuram</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-heading font-semibold text-cyan-300 tracking-wide flex items-center gap-1.5">
                      <Stethoscope size={13} className="text-cyan-400" />
                      <span>Select Doctor</span>
                    </label>
                    <select
                      name="doctor"
                      value={formData.doctor}
                      onChange={handleInputChange}
                      className={`w-full bg-[#050912] border border-white/[0.1] rounded-xl px-4 py-3 text-sm ${
                        formData.doctor ? 'text-white' : 'text-slate-500'
                      } focus:border-cyan-400 outline-none transition-colors cursor-pointer`}
                    >
                      <option value="" disabled className="bg-[#07111D] text-slate-500">
                        Select Doctor
                      </option>
                      <option value="Dr. Sheila Thangaraj — MBBS; DO" className="bg-[#07111D] text-white">
                        Dr. Sheila Thangaraj — MBBS; DO
                      </option>
                      <option value="Dr. Tridib Gogoi — MBBS; DO" className="bg-[#07111D] text-white">
                        Dr. Tridib Gogoi — MBBS; DO
                      </option>
                    </select>
                  </div>
                </div>

                {/* Row 4: Preferred Date & Preferred Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-heading font-semibold text-cyan-300 tracking-wide flex items-center gap-1.5">
                      <Calendar size={13} className="text-cyan-400" />
                      <span>Preferred Date</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full bg-[#050912] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-400 outline-none transition-colors cursor-pointer [color-scheme:dark]"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-heading font-semibold text-cyan-300 tracking-wide flex items-center gap-1.5">
                      <Clock size={13} className="text-cyan-400" />
                      <span>Preferred Time</span>
                    </label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className={`w-full bg-[#050912] border border-white/[0.1] rounded-xl px-4 py-3 text-sm ${
                        formData.time ? 'text-white' : 'text-slate-500'
                      } focus:border-cyan-400 outline-none transition-colors cursor-pointer`}
                    >
                      <option value="" disabled className="bg-[#07111D] text-slate-500">
                        Select Preferred Time
                      </option>
                      <option value="08:00 AM" className="bg-[#07111D] text-white">08:00 AM</option>
                      <option value="09:00 AM" className="bg-[#07111D] text-white">09:00 AM</option>
                      <option value="10:00 AM" className="bg-[#07111D] text-white">10:00 AM</option>
                      <option value="11:00 AM" className="bg-[#07111D] text-white">11:00 AM</option>
                      <option value="12:00 PM" className="bg-[#07111D] text-white">12:00 PM</option>
                      <option value="01:00 PM" className="bg-[#07111D] text-white">01:00 PM</option>
                      <option value="02:00 PM" className="bg-[#07111D] text-white">02:00 PM</option>
                      <option value="03:00 PM" className="bg-[#07111D] text-white">03:00 PM</option>
                      <option value="04:00 PM" className="bg-[#07111D] text-white">04:00 PM</option>
                      <option value="05:00 PM" className="bg-[#07111D] text-white">05:00 PM</option>
                      <option value="06:00 PM" className="bg-[#07111D] text-white">06:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Row 5: Reason / Message */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-heading font-semibold text-brand-muted tracking-wide">
                    Reason / Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="e.g. Vision checkup, cataract surgery consultation, eye irritation, glasses power check"
                    className="w-full bg-[#050912] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-cyan-400 outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-xl cursor-pointer disabled:opacity-50 mt-2"
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
            className="fixed inset-0 bg-[#050912]/90 backdrop-blur-xl z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="p-8 rounded-3xl bg-[#07111D] border border-white/10 max-w-md w-full relative shadow-2xl text-brand-ivory"
            >
              <button
                onClick={resetForm}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-950 transition-colors cursor-pointer"
                aria-label="Close Confirmation"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Check size={22} />
                </div>

                <div>
                  <h3 className="font-heading font-bold text-2xl text-white mb-1">
                    Appointment Request Received
                  </h3>
                  <p className="text-cyan-400 text-xs font-mono">
                    Reference ID: {bookingId}
                  </p>
                </div>

                <div className="w-full p-4 rounded-2xl bg-[#050912] border border-white/[0.06] text-xs text-left flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Patient:</span>
                    <span className="text-white font-medium">{formData.name}</span>
                  </div>
                  {formData.branch && (
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Branch:</span>
                      <span className="text-white font-medium">{formData.branch}</span>
                    </div>
                  )}
                  {formData.doctor && (
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Doctor:</span>
                      <span className="text-white font-medium">{formData.doctor.split('—')[0]}</span>
                    </div>
                  )}
                  {formData.time && (
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Time:</span>
                      <span className="text-white font-medium">{formData.time}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-brand-muted leading-relaxed">
                  Our hospital reception will contact you at <strong className="text-white">{formData.phone}</strong> to confirm your consultation schedule.
                </p>

                <button
                  onClick={resetForm}
                  className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-heading font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
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
