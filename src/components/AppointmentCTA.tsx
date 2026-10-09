import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  Stethoscope,
  PhoneCall,
  AlertCircle,
  CheckCircle2,
  Info,
} from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa6'
import { useHospitalData } from '../context/HospitalDataContext'
import type { Branch } from '../lib/database.types'
import {
  HOSPITAL_BRANCHES,
  getDayOfWeek,
  getAvailableDoctorsForBranchAndDate,
  getDoctorBranchSchedule,
  parseTimeToMinutes,
  minutesToTime24,
  formatTimeTo12Hour,
  getBranchTimeBounds,
  generateAvailableTimeSlots,
} from '../lib/doctorAvailability'

const formatDateClean = (dateStr: string): string => {
  if (!dateStr) return ''
  try {
    const parts = dateStr.split('-')
    if (parts.length !== 3) return dateStr
    const year = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1
    const day = parseInt(parts[2], 10)
    const d = new Date(year, month, day)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

const getCleanWhatsAppNumber = (raw: string | null | undefined): string => {
  if (!raw) return ''
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 10) {
    return `91${digits}`
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return `91${digits.slice(1)}`
  }
  if (digits.length >= 11 && digits.startsWith('91')) {
    return digits
  }
  return digits
}

const BRANCH_CONSULTATION_VALUE = 'branch_duty_doctor'

export const AppointmentCTA: React.FC = () => {
  const { doctors, branches, schedules } = useHospitalData()

  // Compute today's date string YYYY-MM-DD
  const todayString = useMemo(() => {
    const d = new Date()
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  }, [])

  const [formData, setFormData] = useState({
    branch: '', // Select Branch * (No default selection)
    doctorId: '', // Select Doctor * (No default selection)
    name: '', // Patient Name *
    phone: '', // Phone Number *
    age: '', // Age
    gender: '', // Gender
    date: todayString, // Preferred Date * (Always today's date)
    time: '', // Preferred Time * (No default time)
    message: '', // Reason for Visit / Message (Optional)
  })

  const [phoneError, setPhoneError] = useState<string>('')
  const [ageError, setAgeError] = useState<string>('')
  const [timeError, setTimeError] = useState<string>('')
  const [generalError, setGeneralError] = useState<string>('')

  // Day of week of the selected date
  const selectedDayOfWeek = useMemo(() => {
    return getDayOfWeek(formData.date)
  }, [formData.date])

  // Selected branch object from Supabase branches table
  const selectedBranchObj = useMemo(() => {
    if (!formData.branch) return null
    return (
      branches.find(
        (b) => b.name.trim().toLowerCase() === formData.branch.trim().toLowerCase()
      ) || null
    )
  }, [branches, formData.branch])

  // Doctors available at the selected branch on the selected date
  const availableSeniorDoctors = useMemo(() => {
    if (!formData.branch) return []
    return getAvailableDoctorsForBranchAndDate(
      formData.branch,
      formData.date,
      doctors,
      schedules,
      branches
    )
  }, [formData.branch, formData.date, doctors, schedules, branches])

  // Validate and maintain selected doctor when branch/date changes (without forcing default selection)
  useEffect(() => {
    if (!formData.branch) {
      if (formData.doctorId) {
        setFormData((prev) => ({ ...prev, doctorId: '' }))
      }
      return
    }

    if (formData.doctorId) {
      if (formData.doctorId === BRANCH_CONSULTATION_VALUE) {
        return
      }
      const isStillAvailable = availableSeniorDoctors.some(
        (d) => String(d.id) === String(formData.doctorId)
      )
      if (!isStillAvailable) {
        // Reset doctor selection if currently selected doctor is not available at this branch/date
        setFormData((prev) => ({ ...prev, doctorId: '' }))
      }
    }
  }, [formData.branch, formData.date, availableSeniorDoctors, formData.doctorId])

  // Find currently selected senior doctor object (if a specific doctor is selected)
  const selectedDoctorObj = useMemo(() => {
    if (!formData.doctorId || formData.doctorId === BRANCH_CONSULTATION_VALUE) return null
    return doctors.find((d) => String(d.id) === String(formData.doctorId)) || null
  }, [doctors, formData.doctorId])

  // Active doctor schedule info
  const activeDoctorSchedule = useMemo(() => {
    if (!selectedDoctorObj || !formData.branch) return null
    return getDoctorBranchSchedule(
      selectedDoctorObj.id,
      formData.branch,
      selectedDoctorObj,
      schedules,
      branches,
      formData.date
    )
  }, [selectedDoctorObj, formData.branch, schedules, branches, formData.date])

  // Dynamically resolve branch opening & closing bounds:
  // - If a branch is selected: uses that branch's configured hours from the Admin Panel / DB
  // - If no branch is selected: uses earliest opening and latest closing time across all branches
  const timeBounds = useMemo(() => {
    return getBranchTimeBounds(selectedBranchObj, branches)
  }, [selectedBranchObj, branches])

  // Generate clean 30-minute time slots in 12-hour AM/PM format
  const availableTimeSlots = useMemo(() => {
    return generateAvailableTimeSlots(timeBounds, formData.date, todayString)
  }, [timeBounds, formData.date, todayString])

  // Branch-wise opening and closing hours summary
  const branchHoursSummary = useMemo(() => {
    const list = HOSPITAL_BRANCHES.map((bName) => {
      const bObj = branches.find(
        (b) => b.name.trim().toLowerCase() === bName.trim().toLowerCase()
      )
      const isOpen = bObj ? bObj.is_open : true
      const defaultClose = bName.toLowerCase() === 'palasa' ? '10:00 PM' : '05:00 PM'
      const openTime = bObj?.opening_time
        ? formatTimeTo12Hour(bObj.opening_time, '09:00 AM')
        : '09:00 AM'
      const closeTime = bObj?.closing_time
        ? formatTimeTo12Hour(bObj.closing_time, defaultClose)
        : defaultClose
      const isSelected =
        Boolean(formData.branch) &&
        formData.branch.trim().toLowerCase() === bName.trim().toLowerCase()

      return {
        name: bName,
        isOpen,
        openTime,
        closeTime,
        isSelected,
      }
    })

    // If a branch is selected, place the selected branch first in the list
    if (formData.branch) {
      return [
        ...list.filter((b) => b.isSelected),
        ...list.filter((b) => !b.isSelected),
      ]
    }
    return list
  }, [branches, formData.branch])

  // If a time was selected but falls outside the current time bounds after branch/date change, clear it
  useEffect(() => {
    if (!formData.time) return
    const userMins = parseTimeToMinutes(formData.time)
    if (userMins === null) {
      setFormData((prev) => ({ ...prev, time: '' }))
      return
    }
    if (userMins < timeBounds.openingMins || userMins > timeBounds.closingMins) {
      setFormData((prev) => ({ ...prev, time: '' }))
    }
  }, [timeBounds.openingMins, timeBounds.closingMins, formData.time])

  // Time validation function
  const validateTimeSelection = useCallback(
    (timeVal: string, dateVal: string, branchObj: Branch | null): string => {
      if (!timeVal) return ''

      const userMins = parseTimeToMinutes(timeVal)
      if (userMins === null) return 'Please enter a valid appointment time.'

      if (branchObj) {
        const openMins = parseTimeToMinutes(branchObj.opening_time) ?? 540
        const closeMins = parseTimeToMinutes(branchObj.closing_time) ?? 1020
        const openStr = formatTimeTo12Hour(minutesToTime24(openMins))
        const closeStr = formatTimeTo12Hour(minutesToTime24(closeMins))

        if (userMins < openMins) {
          return `Selected time (${formatTimeTo12Hour(
            timeVal
          )}) is before opening time (${openStr}). Operating hours are ${openStr} – ${closeStr}.`
        }

        if (userMins > closeMins) {
          return `Selected time (${formatTimeTo12Hour(
            timeVal
          )}) is after closing time (${closeStr}). Operating hours are ${openStr} – ${closeStr}.`
        }

        if (dateVal === todayString) {
          const now = new Date()
          const nowMins = now.getHours() * 60 + now.getMinutes()
          if (nowMins >= closeMins) {
            return `Operating hours for today at ${branchObj.name} Center have ended (${openStr} – ${closeStr}). Please choose a future date.`
          }
          if (userMins < nowMins) {
            return `Selected time (${formatTimeTo12Hour(
              timeVal
            )}) has already passed for today. Please select an upcoming time.`
          }
        }
      } else {
        if (dateVal === todayString) {
          const now = new Date()
          const nowMins = now.getHours() * 60 + now.getMinutes()
          if (userMins < nowMins) {
            return `Selected time (${formatTimeTo12Hour(
              timeVal
            )}) has already passed for today. Please select an upcoming time.`
          }
        }
      }

      return ''
    },
    [todayString]
  )

  // Re-evaluate time error whenever time, date, or branch changes
  useEffect(() => {
    if (formData.time) {
      const err = validateTimeSelection(formData.time, formData.date, selectedBranchObj)
      setTimeError(err)
    } else {
      setTimeError('')
    }
  }, [formData.time, formData.date, selectedBranchObj, validateTimeSelection])

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextBranch = e.target.value
    setGeneralError('')
    setFormData((prev) => ({
      ...prev,
      branch: nextBranch,
      // Do not automatically select doctor when branch changes
    }))
  }

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const docId = e.target.value
    setGeneralError('')
    setFormData((prev) => ({
      ...prev,
      doctorId: docId,
    }))
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextDate = e.target.value
    setGeneralError('')
    setFormData((prev) => ({
      ...prev,
      date: nextDate,
    }))
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setGeneralError('')
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setGeneralError('')
    setFormData((prev) => ({ ...prev, age: val }))

    if (!val.trim()) {
      setAgeError('')
      return
    }

    const num = Number(val)
    if (isNaN(num) || num < 0 || num > 100 || !Number.isInteger(num)) {
      setAgeError('Please enter a valid age between 0 and 100.')
    } else {
      setAgeError('')
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value
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
    setGeneralError('')

    // 1. Validate Branch (Required)
    if (!formData.branch) {
      setGeneralError('Please select a hospital branch.')
      return
    }

    const targetBranch = branches.find(
      (b) => b.name.toLowerCase() === formData.branch.toLowerCase()
    )

    if (!targetBranch) {
      setGeneralError('Please select a valid branch location.')
      return
    }

    // 2. Validate Doctor / Consultation Type
    if (!formData.doctorId) {
      setGeneralError('Please select a doctor or consultation type.')
      return
    }

    // 3. Validate Patient Name
    if (!formData.name.trim()) {
      setGeneralError('Please enter the patient name.')
      return
    }

    // 4. Validate Phone Number
    if (formData.phone.length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number.')
      return
    }

    // 5. Validate Age
    if (formData.age.trim()) {
      const ageNum = Number(formData.age)
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 100 || !Number.isInteger(ageNum)) {
        setAgeError('Please enter a valid age between 0 and 100.')
        setGeneralError('Please enter a valid age between 0 and 100.')
        return
      }
    }

    if (ageError) {
      setGeneralError(ageError)
      return
    }

    // 6. Validate Preferred Date & Time
    if (!formData.date) {
      setGeneralError('Please select a preferred appointment date.')
      return
    }

    if (!formData.time) {
      setGeneralError('Please select a preferred appointment time.')
      return
    }

    if (timeError) {
      setGeneralError(timeError)
      return
    }

    const timeValidationResult = validateTimeSelection(formData.time, formData.date, targetBranch)
    if (timeValidationResult) {
      setTimeError(timeValidationResult)
      setGeneralError(timeValidationResult)
      return
    }

    // 7. Find branch WhatsApp reception contact number
    const cleanPhone = getCleanWhatsAppNumber(targetBranch.whatsapp_number)

    if (!cleanPhone || cleanPhone.length < 10) {
      setGeneralError(
        `WhatsApp reception contact number is not configured for the ${formData.branch} branch. Please call hospital reception directly.`
      )
      return
    }

    const formattedDate = formatDateClean(formData.date)
    const formattedTime = formatTimeTo12Hour(formData.time)

    // 8. Determine doctor/consultation line
    const doctorConsultationLine =
      selectedDoctorObj != null
        ? `${selectedDoctorObj.name} (Senior Specialist)`
        : 'General Consultation Doctor'

    // 9. Construct formatted WhatsApp message
    const messageLines = [
      'Hello Dr. Sheilas Eye Hospital, I would like to request an appointment.',
      '',
      `Branch: ${formData.branch} Hospital`,
      `Doctor / Consultation: ${doctorConsultationLine}`,
      `Patient Name: ${formData.name.trim()}`,
    ]

    if (formData.age.trim()) {
      messageLines.push(`Age: ${formData.age.trim()}`)
    }

    if (formData.gender.trim()) {
      messageLines.push(`Gender: ${formData.gender.trim()}`)
    }

    messageLines.push(`Phone Number: ${formData.phone}`)
    messageLines.push(`Preferred Date: ${formattedDate}`)
    messageLines.push(`Preferred Time: ${formattedTime}`)

    if (formData.message.trim()) {
      messageLines.push(`Reason for Visit: ${formData.message.trim()}`)
    }

    messageLines.push('')
    messageLines.push('Please confirm the appointment.')

    const finalMessage = messageLines.join('\n')
    const encodedText = encodeURIComponent(finalMessage)
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`

    // 10. Immediately open WhatsApp for the selected branch reception number
    window.open(whatsappUrl, '_blank')
  }

  // Branch contact helpers for left reception card
  const palasaBranch = branches.find((b) => b.name.toLowerCase() === 'palasa')
  const sompetaBranch = branches.find((b) => b.name.toLowerCase() === 'sompeta')
  const ichapuramBranch = branches.find((b) => b.name.toLowerCase() === 'ichapuram')

  const palasaPhone = palasaBranch?.whatsapp_number || '08945-242442'
  const sompetaPhone = sompetaBranch?.whatsapp_number || '08947-234108'
  const ichapuramPhone = ichapuramBranch?.whatsapp_number || '08947-231261'

  return (
    <section
      id="appointment"
      className="bg-[#FFFFFF] py-20 md:py-32 text-[#1C242E] font-sans border-b border-[#E8E2D8] relative"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Editorial Call to Action */}
          <div className="lg:col-span-4 flex flex-col">
            <span className="text-[12px] font-heading font-semibold tracking-[0.25em] uppercase text-[#BE185D] mb-3 block">
              Consultation Request
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#1C242E] tracking-[-0.03em] leading-[1.14] mb-5">
              Book a Clinical Appointment
            </h2>
            <p className="text-[#5A687A] text-sm sm:text-base leading-relaxed mb-8 font-normal">
              Select your preferred hospital branch, specialist doctor, and convenient date. All 3
              centers in Palasa, Sompeta, and Ichapuram provide experienced ophthalmic care.
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
                    <span className="text-[#5A687A]">{palasaPhone}</span>
                  </div>
                  <a
                    href={`tel:${palasaPhone.replace(/\D/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#BE185D] hover:bg-[#9F1239] text-white font-heading font-bold text-[11px] uppercase tracking-wider transition-colors shadow-xs"
                  >
                    <PhoneCall size={11} />
                    <span>Call</span>
                  </a>
                </div>

                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex flex-col">
                    <span className="text-[#1C242E] font-medium">Sompeta Branch</span>
                    <span className="text-[#5A687A]">{sompetaPhone}</span>
                  </div>
                  <a
                    href={`tel:${sompetaPhone.replace(/\D/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#BE185D] hover:bg-[#9F1239] text-white font-heading font-bold text-[11px] uppercase tracking-wider transition-colors shadow-xs"
                  >
                    <PhoneCall size={11} />
                    <span>Call</span>
                  </a>
                </div>

                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex flex-col">
                    <span className="text-[#1C242E] font-medium">Ichapuram Branch</span>
                    <span className="text-[#5A687A]">{ichapuramPhone}</span>
                  </div>
                  <a
                    href={`tel:${ichapuramPhone.replace(/\D/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#BE185D] hover:bg-[#9F1239] text-white font-heading font-bold text-[11px] uppercase tracking-wider transition-colors shadow-xs"
                  >
                    <PhoneCall size={11} />
                    <span>Call</span>
                  </a>
                </div>
              </div>
              <span className="text-xs text-[#8A96A6] pt-2 border-t border-[#E8E2D8]">
                Same-day walk-in consultations are also available during OPD hours.
              </span>
            </div>
          </div>

          {/* Right: Branch-First Form */}
          <div className="lg:col-span-8">
            <div className="p-6 sm:p-10 rounded-3xl bg-[#FAF8F5] border border-[#E8E2D8] shadow-[0_8px_30px_rgba(28,36,46,0.05)] relative overflow-hidden">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#BE185D]/50 to-transparent" />

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* ── ROW 1: SELECT BRANCH * & SELECT DOCTOR * ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Branch Selection (Always Selectable for all 3 branches) */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-heading font-semibold text-[#1C242E] tracking-wide flex items-center gap-1.5">
                      <MapPin size={13} className="text-[#BE185D]" />
                      <span>Select Branch *</span>
                    </label>
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleBranchChange}
                      required
                      className={`w-full bg-white border border-[#E8E2D8] rounded-xl px-4 py-3 text-sm font-semibold ${
                        formData.branch ? 'text-[#1C242E]' : 'text-stone-400'
                      } focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] outline-none transition-colors cursor-pointer shadow-xs`}
                    >
                      <option value="" disabled className="text-stone-400">
                        Select Branch
                      </option>
                      {HOSPITAL_BRANCHES.map((bName) => (
                        <option key={bName} value={bName} className="text-[#1C242E] bg-white font-medium">
                          {bName} Hospital
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Doctor / Consultation Selection (Dynamically Resolved based on Branch + Date) */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-heading font-semibold text-[#1C242E] tracking-wide flex items-center gap-1.5">
                      <Stethoscope size={13} className="text-[#BE185D]" />
                      <span>Select Doctor *</span>
                    </label>
                    <select
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleDoctorChange}
                      required
                      disabled={!formData.branch}
                      className={`w-full bg-white border border-[#E8E2D8] rounded-xl px-4 py-3 text-sm font-medium ${
                        formData.doctorId ? 'text-[#1C242E]' : 'text-stone-400'
                      } focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] outline-none transition-colors cursor-pointer shadow-xs disabled:bg-stone-50 disabled:cursor-not-allowed`}
                    >
                      <option value="" disabled className="text-stone-400">
                        Select Doctor
                      </option>
                      {formData.branch && availableSeniorDoctors.length > 0 ? (
                        <>
                          {availableSeniorDoctors.map((doc) => (
                            <option
                              key={doc.id}
                              value={String(doc.id)}
                              className="text-[#1C242E] bg-white font-medium"
                            >
                              {doc.name} (Senior Specialist)
                            </option>
                          ))}
                          <option
                            value={BRANCH_CONSULTATION_VALUE}
                            className="text-[#5A687A] bg-white font-medium"
                          >
                            General Consultation Doctor
                          </option>
                        </>
                      ) : formData.branch ? (
                        <option
                          value={BRANCH_CONSULTATION_VALUE}
                          className="text-[#1C242E] bg-white font-medium"
                        >
                          General Consultation Doctor
                        </option>
                      ) : null}
                    </select>
                  </div>
                </div>

                {/* Dynamic Doctor Availability Notice when a senior doctor is selected */}
                {availableSeniorDoctors.length > 0 && selectedDoctorObj && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                      <span>
                        <strong>{selectedDoctorObj.name}</strong> is available for consultation at{' '}
                        <strong>{formData.branch} Center</strong> on {selectedDayOfWeek}.
                      </span>
                    </div>
                    {activeDoctorSchedule?.start_time && (
                      <span className="hidden sm:inline-block font-semibold text-emerald-800 shrink-0">
                        OPD: {activeDoctorSchedule.start_time} –{' '}
                        {activeDoctorSchedule.end_time || '05:00 PM'}
                      </span>
                    )}
                  </div>
                )}

                {/* Professional Fallback Notice when senior doctors are not consulting at this branch on the selected date */}
                {formData.branch && availableSeniorDoctors.length === 0 && (
                  <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5 leading-relaxed">
                    <Info size={16} className="shrink-0 text-amber-700 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <span className="font-heading font-bold text-amber-900">
                        Clinical Consultation Available at {formData.branch} Center
                      </span>
                      <span>
                        Our senior specialists may not be available at this centre today. However, experienced ophthalmic doctors are available to assess your condition and provide appropriate care. If your condition requires specialist intervention, our clinical team will coordinate your consultation with our senior specialists.
                      </span>
                    </div>
                  </div>
                )}

                {/* ── ROW 2: PATIENT NAME * & PHONE NUMBER * ── */}
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
                        phoneError
                          ? 'border-rose-500 focus:border-rose-400'
                          : 'border-[#E8E2D8] focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D]'
                      } rounded-xl px-4 py-3 text-sm text-[#1C242E] placeholder-stone-400 outline-none transition-colors shadow-xs`}
                    />
                    {phoneError && (
                      <span className="text-rose-600 text-xs mt-0.5">{phoneError}</span>
                    )}
                  </div>
                </div>

                {/* ── ROW 3: AGE & GENDER ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-heading font-semibold text-[#1C242E] tracking-wide">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleAgeChange}
                      min="0"
                      max="100"
                      step="1"
                      placeholder="e.g. 45"
                      className={`w-full bg-white border ${
                        ageError
                          ? 'border-rose-500 focus:border-rose-400'
                          : 'border-[#E8E2D8] focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D]'
                      } rounded-xl px-4 py-3 text-sm text-[#1C242E] placeholder-stone-400 outline-none transition-colors shadow-xs`}
                    />
                    {ageError && <span className="text-rose-600 text-xs mt-0.5">{ageError}</span>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-heading font-semibold text-[#1C242E] tracking-wide">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`w-full bg-white border border-[#E8E2D8] rounded-xl px-4 py-3 text-sm font-medium ${
                        formData.gender ? 'text-[#1C242E]' : 'text-stone-400'
                      } focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] outline-none transition-colors cursor-pointer shadow-xs`}
                    >
                      <option value="" className="text-stone-400 bg-[#FAF8F5]">
                        Select Gender
                      </option>
                      <option value="Male" className="text-[#1C242E] bg-white font-medium">
                        Male
                      </option>
                      <option value="Female" className="text-[#1C242E] bg-white font-medium">
                        Female
                      </option>
                      <option value="Other" className="text-[#1C242E] bg-white font-medium">
                        Other
                      </option>
                    </select>
                  </div>
                </div>

                {/* ── ROW 4: PREFERRED DATE * & PREFERRED TIME * ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-heading font-semibold text-[#1C242E] tracking-wide flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#BE185D]" />
                      <span>Preferred Date *</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      min={todayString}
                      onChange={handleDateChange}
                      required
                      className="w-full bg-white border border-[#E8E2D8] rounded-xl px-4 py-3 text-sm text-[#1C242E] focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] outline-none transition-colors cursor-pointer shadow-xs font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="preferred-time-select"
                      className="text-xs font-heading font-semibold text-[#1C242E] tracking-wide flex items-center gap-1.5"
                    >
                      <Clock size={13} className="text-[#BE185D]" />
                      <span>Preferred Time *</span>
                    </label>
                    <select
                      id="preferred-time-select"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className={`w-full bg-white border ${
                        timeError
                          ? 'border-rose-500 focus:border-rose-400'
                          : 'border-[#E8E2D8] focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D]'
                      } rounded-xl px-4 py-3 text-sm font-medium ${
                        formData.time ? 'text-[#1C242E]' : 'text-stone-400'
                      } outline-none transition-colors cursor-pointer shadow-xs`}
                    >
                      <option value="" className="text-stone-400 bg-[#FAF8F5]">
                        Select Preferred Time
                      </option>
                      {availableTimeSlots.map((slot) => (
                        <option
                          key={slot.value}
                          value={slot.value}
                          disabled={slot.isPast}
                          className={`${
                            slot.isPast ? 'text-stone-400 bg-stone-100' : 'text-[#1C242E] bg-white'
                          } font-medium`}
                        >
                          {slot.label}
                        </option>
                      ))}
                    </select>
                    {timeError && <span className="text-rose-600 text-xs mt-0.5">{timeError}</span>}

                    {/* Dynamic Branch-Wise Operating & Closing Hours Guide */}
                    <div className="mt-1 p-3 rounded-xl bg-white border border-[#E8E2D8] text-xs shadow-xs">
                      {formData.branch ? (
                        <div className="flex items-center gap-1.5 font-semibold text-[#BE185D] text-[11px] mb-2 pb-1.5 border-b border-[#E8E2D8]/70">
                          <MapPin size={12} className="shrink-0 text-[#BE185D]" />
                          <span>
                            Selected branch: <strong>{formData.branch}</strong>
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 font-semibold text-[#1C242E] text-[11px] mb-2 pb-1.5 border-b border-[#E8E2D8]/70">
                          <Clock size={12} className="shrink-0 text-[#BE185D]" />
                          <span>Branch Operating Hours:</span>
                        </div>
                      )}

                      <div className="flex flex-col gap-1.5 text-[11px]">
                        {branchHoursSummary.map((bh) => (
                          <div
                            key={bh.name}
                            className={`flex items-center justify-between py-1 px-2 rounded-lg transition-colors ${
                              bh.isSelected
                                ? 'bg-rose-50 border border-[#BE185D]/20 text-[#BE185D]'
                                : 'text-[#5A687A]'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  bh.isOpen
                                    ? bh.isSelected
                                      ? 'bg-[#BE185D]'
                                      : 'bg-emerald-500'
                                    : 'bg-rose-400'
                                }`}
                              />
                              <span
                                className={
                                  bh.isSelected
                                    ? 'text-[#BE185D] font-bold'
                                    : 'text-[#1C242E] font-medium'
                                }
                              >
                                {bh.name}:
                              </span>
                            </span>
                            <span
                              className={`tabular-nums ${
                                bh.isSelected ? 'text-[#BE185D] font-bold' : 'text-[#5A687A]'
                              }`}
                            >
                              {bh.isOpen ? `${bh.openTime} – ${bh.closeTime}` : 'Closed'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── ROW 5: REASON FOR VISIT / MESSAGE (OPTIONAL) ── */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-heading font-semibold text-[#1C242E] tracking-wide">
                    Reason for Visit / Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="e.g. Vision checkup, cataract surgery evaluation, eye irritation, refractive power check"
                    className="w-full bg-white border border-[#E8E2D8] rounded-xl px-4 py-3 text-sm text-[#1C242E] placeholder-stone-400 focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] outline-none transition-colors resize-none shadow-xs"
                  />
                </div>

                {/* General Error Display */}
                {generalError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0 text-rose-600" />
                    <span>{generalError}</span>
                  </div>
                )}

                {/* ── SUBMIT APPOINTMENT REQUEST ── */}
                <button
                  type="submit"
                  disabled={Boolean(timeError) || Boolean(ageError) || Boolean(phoneError)}
                  className="w-full py-4 rounded-xl bg-[#BE185D] hover:bg-[#9F1239] text-white font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2.5"
                >
                  <FaWhatsapp className="w-5 h-5 text-white" />
                  <span>Submit Appointment Request</span>
                </button>

                <p className="text-[11px] text-[#8A96A6] text-center mt-1">
                  Submitting will instantly open WhatsApp to the reception at {formData.branch || 'the selected'}{' '}
                  Center with your appointment request.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
