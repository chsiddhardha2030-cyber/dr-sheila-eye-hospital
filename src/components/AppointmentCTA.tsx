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
} from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa6'
import { useHospitalData } from '../context/HospitalDataContext'
import type { Branch } from '../lib/database.types'

// Helper to parse time strings like "10:00 AM", "10:00 PM", "10:00", "22:00", "09:30", "10:00:00", "22:00:00+05:30" to minutes from midnight
const parseTimeToMinutes = (timeStr: string | null | undefined): number | null => {
  if (!timeStr) return null
  const trimmed = timeStr.trim()
  if (!trimmed) return null

  // Match 12-hour format e.g. "10:00 AM", "09:30 PM", "9:00am", "10:15 pm", "10:00:00 AM"
  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i)
  if (match12) {
    let hours = parseInt(match12[1], 10)
    const minutes = parseInt(match12[2], 10)
    const meridiem = match12[3].toUpperCase()
    if (meridiem === 'PM' && hours < 12) hours += 12
    if (meridiem === 'AM' && hours === 12) hours = 0
    return hours * 60 + minutes
  }

  // Match 24-hour format e.g. "10:00", "22:00", "09:30", "14:15:00", "10:00:00+00", "22:00:00Z"
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})/)
  if (match24) {
    const hours = parseInt(match24[1], 10)
    const minutes = parseInt(match24[2], 10)
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return hours * 60 + minutes
    }
  }

  return null
}

// Convert minutes from midnight to "HH:mm" 24-hour string
const minutesToTime24 = (mins: number): string => {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

// Format 24-hour time "HH:mm" to "hh:mm AM/PM"
const formatTimeTo12Hour = (time24: string): string => {
  if (!time24) return ''
  if (/AM|PM/i.test(time24)) return time24
  const parts = time24.split(':')
  if (parts.length < 2) return time24
  const hour = parseInt(parts[0], 10)
  const minute = parts[1]
  if (isNaN(hour)) return time24
  const period = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${hour12.toString().padStart(2, '0')}:${minute} ${period}`
}

// Format YYYY-MM-DD to "DD MMMM YYYY" (e.g. 28 August 2026)
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
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

// Clean WhatsApp number to digits with country code
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

export const AppointmentCTA: React.FC = () => {
  const { doctors, branches, schedules, loading } = useHospitalData()

  const [formData, setFormData] = useState({
    doctorId: '',
    branch: '',
    name: '',
    phone: '',
    age: '',
    gender: '',
    date: '',
    time: '',
    message: '',
  })

  const [phoneError, setPhoneError] = useState<string>('')
  const [ageError, setAgeError] = useState<string>('')
  const [timeError, setTimeError] = useState<string>('')
  const [generalError, setGeneralError] = useState<string>('')

  // Find currently selected doctor object
  const selectedDoctor = useMemo(() => {
    if (!formData.doctorId) return null
    return doctors.find((d) => String(d.id) === String(formData.doctorId)) || null
  }, [doctors, formData.doctorId])

  // Determine available schedules for selected doctor
  const availableSchedules = useMemo(() => {
    if (!selectedDoctor) return []
    return schedules.filter(
      (s) => s.doctor_id === selectedDoctor.id && s.is_available === true
    )
  }, [schedules, selectedDoctor])

  // Determine available branches based on doctor schedule
  const availableBranches = useMemo(() => {
    return availableSchedules.map((s) => {
      const branchInfo = branches.find(
        (b) => b.name.toLowerCase() === s.branch_name.toLowerCase()
      )
      return {
        name: s.branch_name,
        schedule: s,
        branchInfo,
      }
    })
  }, [availableSchedules, branches])

  // Selected branch object from Supabase branches table
  const selectedBranchObj = useMemo(() => {
    if (!formData.branch) return null
    return branches.find(
      (b) => b.name.toLowerCase() === formData.branch.toLowerCase()
    ) || null
  }, [branches, formData.branch])

  // Automatically update branch when doctor selection changes
  useEffect(() => {
    if (!formData.doctorId) {
      setFormData((prev) => (prev.branch ? { ...prev, branch: '' } : prev))
      return
    }

    if (availableBranches.length === 1) {
      // Automatically select the single available branch
      setFormData((prev) => ({
        ...prev,
        branch: availableBranches[0].name,
      }))
    } else if (availableBranches.length > 1) {
      // If currently selected branch is still valid in available branches, keep it
      const isValid = availableBranches.some(
        (b) => b.name.toLowerCase() === formData.branch.toLowerCase()
      )
      if (!isValid) {
        setFormData((prev) => ({
          ...prev,
          branch: '',
        }))
      }
    } else {
      // 0 available branches
      setFormData((prev) => ({
        ...prev,
        branch: '',
      }))
    }
  }, [formData.doctorId, availableBranches])

  // Active schedule for selected doctor and selected branch
  const activeSchedule = useMemo(() => {
    if (!selectedDoctor || !formData.branch) return null
    return (
      schedules.find(
        (s) =>
          s.doctor_id === selectedDoctor.id &&
          s.branch_name.toLowerCase() === formData.branch.toLowerCase() &&
          s.is_available === true
      ) || null
    )
  }, [schedules, selectedDoctor, formData.branch])

  // Compute today's date string YYYY-MM-DD
  const todayString = useMemo(() => {
    const d = new Date()
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  }, [])

  // Branch opening and closing time in minutes (0-1439) from Supabase branches table
  const branchOpeningMins = useMemo(() => {
    if (!selectedBranchObj?.opening_time) return 540 // Default 09:00 AM if unspecified
    return parseTimeToMinutes(selectedBranchObj.opening_time) ?? 540
  }, [selectedBranchObj])

  const branchClosingMins = useMemo(() => {
    if (!selectedBranchObj?.closing_time) return 1200 // Default 08:00 PM if unspecified
    return parseTimeToMinutes(selectedBranchObj.closing_time) ?? 1200
  }, [selectedBranchObj])

  const formattedBranchOpen = useMemo(() => {
    return formatTimeTo12Hour(minutesToTime24(branchOpeningMins))
  }, [branchOpeningMins])

  const formattedBranchClose = useMemo(() => {
    return formatTimeTo12Hour(minutesToTime24(branchClosingMins))
  }, [branchClosingMins])

  // Compute HTML <input type="time"> min and max bounds
  const timeBounds = useMemo(() => {
    if (!selectedBranchObj) {
      return { min: '', max: '' }
    }
    const now = new Date()
    const nowMinutes = now.getHours() * 60 + now.getMinutes()
    const isSelectedToday = formData.date === todayString

    let effectiveMinMins = branchOpeningMins
    if (isSelectedToday) {
      effectiveMinMins = Math.max(branchOpeningMins, nowMinutes)
    }

    return {
      min: minutesToTime24(effectiveMinMins),
      max: minutesToTime24(branchClosingMins),
    }
  }, [selectedBranchObj, formData.date, todayString, branchOpeningMins, branchClosingMins])

  // Time validation function
  const validateTimeSelection = useCallback(
    (timeVal: string, dateVal: string, branchObj: Branch | null): string => {
      if (!branchObj) return ''
      if (!branchObj.is_open) {
        return `${branchObj.name} Center is currently marked as closed. Please select an open branch location.`
      }
      if (!timeVal) return ''

      const userMins = parseTimeToMinutes(timeVal)
      if (userMins === null) return 'Please enter a valid appointment time.'

      const openMins = parseTimeToMinutes(branchObj.opening_time) ?? 540
      const closeMins = parseTimeToMinutes(branchObj.closing_time) ?? 1200
      const openStr = formatTimeTo12Hour(minutesToTime24(openMins))
      const closeStr = formatTimeTo12Hour(minutesToTime24(closeMins))

      if (userMins < openMins) {
        return `Selected time (${formatTimeTo12Hour(timeVal)}) is before opening time (${openStr}). Operating hours are ${openStr} – ${closeStr}.`
      }

      if (userMins > closeMins) {
        return `Selected time (${formatTimeTo12Hour(timeVal)}) is after closing time (${closeStr}). Operating hours are ${openStr} – ${closeStr}.`
      }

      if (dateVal === todayString) {
        const now = new Date()
        const nowMins = now.getHours() * 60 + now.getMinutes()
        if (nowMins >= closeMins) {
          return `Operating hours for today at ${branchObj.name} Center have ended (${openStr} – ${closeStr}). Please choose a future date.`
        }
        if (userMins < nowMins) {
          return `Selected time (${formatTimeTo12Hour(timeVal)}) has already passed for today. Please select an upcoming time.`
        }
      }

      return ''
    },
    [todayString]
  )

  // Re-evaluate time error whenever time, date, or branch changes
  useEffect(() => {
    if (formData.time && selectedBranchObj) {
      const err = validateTimeSelection(formData.time, formData.date, selectedBranchObj)
      setTimeError(err)
    } else {
      setTimeError('')
    }
  }, [formData.time, formData.date, selectedBranchObj, validateTimeSelection])

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const docId = e.target.value
    setGeneralError('')
    setFormData((prev) => ({
      ...prev,
      doctorId: docId,
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

    // 1. Validate Doctor
    if (!formData.doctorId || !selectedDoctor) {
      setGeneralError('Please select a doctor.')
      return
    }

    // 2. Validate Doctor Availability
    if (availableBranches.length === 0) {
      setGeneralError(
        `Dr. ${selectedDoctor.name} is currently not scheduled or available at any branch. Please select another doctor or contact reception.`
      )
      return
    }

    // 3. Validate Branch
    if (!formData.branch) {
      setGeneralError('Please select a branch location.')
      return
    }

    const targetBranch = branches.find(
      (b) => b.name.toLowerCase() === formData.branch.toLowerCase()
    )

    if (!targetBranch) {
      setGeneralError('Please select a valid branch location.')
      return
    }

    if (!targetBranch.is_open) {
      setGeneralError(
        `${targetBranch.name} Center is currently closed according to hospital records. Please select another branch or contact reception.`
      )
      return
    }

    // 4. Validate Patient Name
    if (!formData.name.trim()) {
      setGeneralError('Please enter the patient name.')
      return
    }

    // 5. Validate Phone Number
    if (formData.phone.length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number.')
      return
    }

    // 6. Validate Age (0 through 100)
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

    // 7. Validate Preferred Date & Time
    if (!formData.date) {
      setGeneralError('Please select a preferred date.')
      return
    }

    if (!formData.time) {
      setGeneralError('Please select a preferred time.')
      return
    }

    if (timeError) {
      setGeneralError(timeError)
      return
    }

    // Check time against branch operating interval and today's schedule
    const timeValidationResult = validateTimeSelection(formData.time, formData.date, targetBranch)
    if (timeValidationResult) {
      setTimeError(timeValidationResult)
      setGeneralError(timeValidationResult)
      return
    }

    // 8. Find selected branch WhatsApp number from Supabase branches table
    const cleanPhone = getCleanWhatsAppNumber(targetBranch.whatsapp_number)

    if (!cleanPhone || cleanPhone.length < 10) {
      setGeneralError(
        `WhatsApp reception contact number is not configured for the ${formData.branch} branch. Please call hospital reception directly.`
      )
      return
    }

    const formattedDate = formatDateClean(formData.date)
    const formattedTime = formatTimeTo12Hour(formData.time)

    // 9. Construct formatted WhatsApp message
    const messageLines = [
      'Hello Dr. Sheila Eye Hospital, I would like to request an appointment.',
      '',
      `Doctor: ${selectedDoctor.name}`,
      `Branch: ${formData.branch}`,
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

  // Branch contact helpers for left card
  const palasaBranch = branches.find((b) => b.name.toLowerCase() === 'palasa')
  const sompetaBranch = branches.find((b) => b.name.toLowerCase() === 'sompeta')
  const ichapuramBranch = branches.find((b) => b.name.toLowerCase() === 'ichapuram')

  const palasaPhone = palasaBranch?.whatsapp_number || '08945-242442'
  const sompetaPhone = sompetaBranch?.whatsapp_number || '08947-234108'
  const ichapuramPhone = ichapuramBranch?.whatsapp_number || '08947-231261'

  return (
    <section
      id="appointment"
      className="bg-[#FFFFFF] py-24 md:py-36 text-[#1C242E] font-sans border-b border-[#E8E2D8] relative"
    >
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
                    <span className="text-[#5A687A]">{palasaPhone}</span>
                  </div>
                  <a
                    href={`tel:${palasaPhone.replace(/\D/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#BE185D] hover:bg-[#9F1239] text-white font-heading font-bold text-[11px] uppercase tracking-wider transition-colors shadow-xs"
                  >
                    <PhoneCall size={11} />
                    <span>Call Now</span>
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
                    <span>Call Now</span>
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
                
                {/* Row 1: Doctor (Selected First) & Branch (Dynamically Determined) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* 1. Doctor Selection */}
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
                      className={`w-full bg-white border border-[#E8E2D8] rounded-xl px-4 py-3 text-sm font-medium ${
                        formData.doctorId ? 'text-[#1C242E]' : 'text-[#8A96A6]'
                      } focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] outline-none transition-colors cursor-pointer shadow-xs`}
                    >
                      <option value="" disabled className="text-[#8A96A6] bg-[#FAF8F5]">
                        {loading && doctors.length === 0
                          ? 'Loading Doctors...'
                          : 'Select Doctor'}
                      </option>
                      {doctors.map((doc) => (
                        <option key={doc.id} value={doc.id} className="text-[#1C242E] bg-white font-medium">
                          {doc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Branch Selection (Dynamic Based on Doctor) */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-heading font-semibold text-[#1C242E] tracking-wide flex items-center gap-1.5">
                      <MapPin size={13} className="text-[#BE185D]" />
                      <span>Select Branch *</span>
                    </label>
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.doctorId || availableBranches.length === 0}
                      className={`w-full bg-white border border-[#E8E2D8] rounded-xl px-4 py-3 text-sm font-medium ${
                        formData.branch ? 'text-[#1C242E]' : 'text-[#8A96A6]'
                      } focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] outline-none transition-colors cursor-pointer shadow-xs disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed`}
                    >
                      {!formData.doctorId ? (
                        <option value="" disabled className="text-[#8A96A6] bg-[#FAF8F5]">
                          Select a Doctor first
                        </option>
                      ) : availableBranches.length === 0 ? (
                        <option value="" disabled className="text-[#8A96A6] bg-[#FAF8F5]">
                          No branch schedules available
                        </option>
                      ) : availableBranches.length === 1 ? (
                        <option value={availableBranches[0].name} className="text-[#1C242E] bg-white font-medium">
                          {availableBranches[0].name} Center (Available)
                        </option>
                      ) : (
                        <>
                          <option value="" disabled className="text-[#8A96A6] bg-[#FAF8F5]">
                            Select Available Branch ({availableBranches.length} locations)
                          </option>
                          {availableBranches.map((ab) => (
                            <option key={ab.name} value={ab.name} className="text-[#1C242E] bg-white font-medium">
                              {ab.name} Center
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  </div>

                </div>

                {/* Doctor Availability Notice / Active Hours Chip */}
                {selectedDoctor && availableBranches.length === 0 && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0 text-rose-600" />
                    <span>
                      <strong>{selectedDoctor.name}</strong> is currently unavailable for outpatient consultations at all branches. Please select another doctor or contact hospital reception.
                    </span>
                  </div>
                )}

                {activeSchedule && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
                      <span>
                        Available at <strong>{formData.branch} Center</strong>
                      </span>
                    </div>
                    {activeSchedule.start_time && (
                      <span className="font-medium text-emerald-700">
                        OPD: {activeSchedule.start_time} – {activeSchedule.end_time || '05:00 PM'}
                      </span>
                    )}
                  </div>
                )}

                {/* Row 2: Patient Name & Phone Number */}
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
                      <span className="text-rose-600 text-xs mt-0.5">
                        {phoneError}
                      </span>
                    )}
                  </div>
                </div>

                {/* Row 3: Age & Gender */}
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
                      className={`w-full bg-white border ${
                        ageError
                          ? 'border-rose-500 focus:border-rose-400'
                          : 'border-[#E8E2D8] focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D]'
                      } rounded-xl px-4 py-3 text-sm text-[#1C242E] outline-none transition-colors shadow-xs`}
                    />
                    {ageError && (
                      <span className="text-rose-600 text-xs mt-0.5">
                        {ageError}
                      </span>
                    )}
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
                        formData.gender ? 'text-[#1C242E]' : 'text-[#8A96A6]'
                      } focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] outline-none transition-colors cursor-pointer shadow-xs`}
                    >
                      <option value="" className="text-[#8A96A6] bg-[#FAF8F5]">Select Gender</option>
                      <option value="Male" className="text-[#1C242E] bg-white font-medium">Male</option>
                      <option value="Female" className="text-[#1C242E] bg-white font-medium">Female</option>
                      <option value="Other" className="text-[#1C242E] bg-white font-medium">Other</option>
                    </select>
                  </div>
                </div>

                {/* Row 4: Preferred Date & Preferred Time (Arbitrary Minute Input Bound by Branch Timings) */}
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
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white border border-[#E8E2D8] rounded-xl px-4 py-3 text-sm text-[#1C242E] focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] outline-none transition-colors cursor-pointer shadow-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-heading font-semibold text-[#1C242E] tracking-wide flex items-center gap-1.5">
                        <Clock size={13} className="text-[#BE185D]" />
                        <span>Preferred Time *</span>
                      </label>
                      {selectedBranchObj && (
                        <span className="text-[11px] text-[#5A687A] font-medium">
                          Hours: {formattedBranchOpen} – {formattedBranchClose}
                        </span>
                      )}
                    </div>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      min={timeBounds.min || undefined}
                      max={timeBounds.max || undefined}
                      step="60"
                      onChange={handleInputChange}
                      required
                      disabled={!formData.branch || (selectedBranchObj ? !selectedBranchObj.is_open : false)}
                      className={`w-full bg-white border ${
                        timeError
                          ? 'border-rose-500 focus:border-rose-400'
                          : 'border-[#E8E2D8] focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D]'
                      } rounded-xl px-4 py-3 text-sm text-[#1C242E] outline-none transition-colors cursor-pointer shadow-xs disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed`}
                    />
                    {timeError && (
                      <span className="text-rose-600 text-xs mt-0.5">
                        {timeError}
                      </span>
                    )}
                  </div>
                </div>

                {/* Row 5: Reason / Message (Optional) */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-heading font-semibold text-[#1C242E] tracking-wide">
                    Reason for Visit / Message (Optional)
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

                {/* General Error Display */}
                {generalError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0 text-rose-600" />
                    <span>{generalError}</span>
                  </div>
                )}

                {/* Submit Button (Directly opens WhatsApp) */}
                <button
                  type="submit"
                  disabled={
                    (availableBranches.length === 0 && Boolean(formData.doctorId)) ||
                    Boolean(timeError) ||
                    Boolean(ageError) ||
                    Boolean(phoneError)
                  }
                  className="w-full py-4 rounded-xl bg-[#BE185D] hover:bg-[#9F1239] text-white font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2.5"
                >
                  <FaWhatsapp className="w-5 h-5 text-white" />
                  <span>Submit Appointment Request</span>
                </button>

                <p className="text-[11px] text-[#8A96A6] text-center mt-1">
                  Submitting will instantly launch WhatsApp to the reception of the selected branch with your consultation details.
                </p>

              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
