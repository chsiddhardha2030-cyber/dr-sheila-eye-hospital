import React, { useState } from 'react'
import {
  Stethoscope,
  Building2,
  LogOut,
  Globe,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Save,
  Check,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useHospitalData } from '../context/HospitalDataContext'
import type { Doctor, Branch } from '../lib/database.types'
import {
  DAYS_OF_WEEK,
  getDayOfWeek,
  getDoctorWeeklySchedule,
  getDoctorBranchForDate,
  getDoctorBranchSchedule,
  timeStringTo24,
  time24ToString,
  isValidTimeString,
  HOSPITAL_BRANCHES,
} from '../lib/doctorAvailability'
import type { DayOfWeek } from '../lib/doctorAvailability'

// Helper to get doctor portrait image from existing project assets
const getDoctorPortrait = (docName: string): string | null => {
  const normalized = docName.toLowerCase()
  if (normalized.includes('sheila') || normalized.includes('thangaraj')) {
    return '/optimized/doctors/DSC_8246.webp'
  }
  if (normalized.includes('tridib') || normalized.includes('gogoi')) {
    return '/optimized/doctors/Tridib-Doctor-portrait.png'
  }
  return null
}

interface AdminDashboardProps {
  onGoToPublic: () => void
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onGoToPublic }) => {
  const { logout } = useAuth()
  const {
    doctors,
    branches,
    schedules,
    loading,
    error,
    refreshData,
    updateDoctor,
    updateBranch,
    saveDoctorSchedule,
    saveWeeklySchedule,
  } = useHospitalData()

  const [activeTab, setActiveTab] = useState<'doctors' | 'branches'>('doctors')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Doctor status saving and error states
  const [doctorStatusSaving, setDoctorStatusSaving] = useState<{ [id: number]: boolean }>({})
  const [doctorStatusError, setDoctorStatusError] = useState<{ [id: number]: string | null }>({})

  // Local state for weekly schedule editing per doctor
  const [weeklyStates, setWeeklyStates] = useState<{
    [docId: number]: Record<DayOfWeek, string>
  }>({})

  // Weekly saving states
  const [weeklySaving, setWeeklySaving] = useState<{ [docId: number]: boolean }>({})
  const [weeklyStatus, setWeeklyStatus] = useState<{
    [docId: number]: 'idle' | 'saved' | 'error'
  }>({})
  const [weeklyError, setWeeklyError] = useState<{ [docId: number]: string | null }>({})

  // Local state for doctor consultation timings per doctor & branch
  const [doctorTimingStates, setDoctorTimingStates] = useState<{
    [docId: number]: {
      [branchName: string]: {
        start_time: string
        end_time: string
        saving: boolean
        status: 'idle' | 'saved' | 'error'
        errorMsg?: string
      }
    }
  }>({})

  // Local state for branches form editing
  const [branchStates, setBranchStates] = useState<{
    [id: number]: {
      is_open: boolean
      opening_time: string
      closing_time: string
      whatsapp_number: string
      saving: boolean
      status: 'idle' | 'saved' | 'error'
      errorMsg?: string
    }
  }>({})

  const todayDay = getDayOfWeek()

  // Helper to get or initialize doctor weekly schedule state
  const getDoctorWeeklyState = (doc: Doctor): Record<DayOfWeek, string> => {
    if (weeklyStates[doc.id]) return weeklyStates[doc.id]
    return getDoctorWeeklySchedule(doc.id, schedules)
  }

  // Helper to get or initialize doctor consultation timing state for a specific branch
  const getDoctorTimingState = (docId: number, branchName: string) => {
    if (doctorTimingStates[docId]?.[branchName]) {
      return doctorTimingStates[docId][branchName]
    }
    const schedRow = schedules.find(
      (s) =>
        s.doctor_id === docId &&
        s.branch_name.trim().toLowerCase() === branchName.trim().toLowerCase()
    )
    return {
      start_time: time24ToString(schedRow?.start_time, '09:00 AM'),
      end_time: time24ToString(schedRow?.end_time, '05:00 PM'),
      saving: false,
      status: 'idle' as const,
    }
  }

  // Helper to get or initialize branch state
  const getBranchState = (branch: Branch) => {
    if (branchStates[branch.id]) return branchStates[branch.id]
    return {
      is_open: branch.is_open,
      opening_time: time24ToString(branch.opening_time, '09:00 AM'),
      closing_time: time24ToString(branch.closing_time, '05:00 PM'),
      whatsapp_number: branch.whatsapp_number || '',
      saving: false,
      status: 'idle' as const,
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshData()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  // Handle Automatic Doctor Status Toggle Save (Available / Off-Duty)
  const handleToggleDoctorStatus = async (doc: Doctor) => {
    const nextAvailable = !doc.available

    setDoctorStatusSaving((prev) => ({ ...prev, [doc.id]: true }))
    setDoctorStatusError((prev) => ({ ...prev, [doc.id]: null }))

    const res = await updateDoctor(doc.id, {
      available: nextAvailable,
    })

    setDoctorStatusSaving((prev) => ({ ...prev, [doc.id]: false }))

    if (!res.success) {
      setDoctorStatusError((prev) => ({
        ...prev,
        [doc.id]: res.error || 'Failed to update status. Please try again.',
      }))
    }
  }

  // Handle day assignment change in weekly schedule
  const handleDayAssignmentChange = (docId: number, day: DayOfWeek, branch: string) => {
    setWeeklyStates((prev) => {
      const currentDocSchedule = prev[docId] || getDoctorWeeklySchedule(docId, schedules)
      return {
        ...prev,
        [docId]: {
          ...currentDocSchedule,
          [day]: branch,
        },
      }
    })
    // Reset saved status if changed
    setWeeklyStatus((prev) => ({ ...prev, [docId]: 'idle' }))
  }

  // Save Weekly Doctor Schedule
  const handleSaveWeeklySchedule = async (docId: number) => {
    const currentSchedule = weeklyStates[docId] || getDoctorWeeklySchedule(docId, schedules)

    setWeeklySaving((prev) => ({ ...prev, [docId]: true }))
    setWeeklyStatus((prev) => ({ ...prev, [docId]: 'idle' }))
    setWeeklyError((prev) => ({ ...prev, [docId]: null }))

    const res = await saveWeeklySchedule(docId, currentSchedule)

    setWeeklySaving((prev) => ({ ...prev, [docId]: false }))
    setWeeklyStatus((prev) => ({ ...prev, [docId]: res.success ? 'saved' : 'error' }))

    if (!res.success) {
      setWeeklyError((prev) => ({
        ...prev,
        [docId]: res.error || 'Failed to save weekly schedule',
      }))
    } else {
      setTimeout(() => {
        setWeeklyStatus((prev) => ({ ...prev, [docId]: 'idle' }))
      }, 3000)
    }
  }

  // Handle Doctor Timing field change
  const handleDoctorTimingChange = (
    docId: number,
    branchName: string,
    field: 'start_time' | 'end_time',
    val24: string
  ) => {
    const val12 = time24ToString(val24, field === 'start_time' ? '09:00 AM' : '05:00 PM')
    setDoctorTimingStates((prev) => {
      const docTimings = prev[docId] || {}
      const currentBranchTiming =
        docTimings[branchName] || getDoctorTimingState(docId, branchName)
      return {
        ...prev,
        [docId]: {
          ...docTimings,
          [branchName]: {
            ...currentBranchTiming,
            [field]: val12,
            status: 'idle',
          },
        },
      }
    })
  }

  // Save Doctor Consultation Timings for a specific branch
  const handleSaveDoctorTiming = async (docId: number, branchName: string) => {
    const current = getDoctorTimingState(docId, branchName)

    if (!isValidTimeString(current.start_time) || !isValidTimeString(current.end_time)) {
      setDoctorTimingStates((prev) => ({
        ...prev,
        [docId]: {
          ...(prev[docId] || {}),
          [branchName]: {
            ...current,
            saving: false,
            status: 'error',
            errorMsg: 'Please enter valid start and end times (e.g. 09:00 AM, 05:00 PM).',
          },
        },
      }))
      return
    }

    setDoctorTimingStates((prev) => ({
      ...prev,
      [docId]: {
        ...(prev[docId] || {}),
        [branchName]: { ...current, saving: true, status: 'idle', errorMsg: undefined },
      },
    }))

    const res = await saveDoctorSchedule(docId, branchName, {
      start_time: current.start_time,
      end_time: current.end_time,
    })

    setDoctorTimingStates((prev) => ({
      ...prev,
      [docId]: {
        ...(prev[docId] || {}),
        [branchName]: {
          ...current,
          saving: false,
          status: res.success ? 'saved' : 'error',
          errorMsg: res.error,
        },
      },
    }))

    if (res.success) {
      setTimeout(() => {
        setDoctorTimingStates((prev) => ({
          ...prev,
          [docId]: {
            ...(prev[docId] || {}),
            [branchName]: {
              ...(prev[docId]?.[branchName] || current),
              status: 'idle',
            },
          },
        }))
      }, 3000)
    }
  }

  // Save Branch details with validated time inputs
  const handleSaveBranch = async (branchId: number) => {
    const br = branches.find((b) => b.id === branchId)
    if (!br) return
    const current = getBranchState(br)

    // Validate times
    const validOpening = isValidTimeString(current.opening_time)
    const validClosing = isValidTimeString(current.closing_time)

    if (!validOpening || !validClosing) {
      setBranchStates((prev) => ({
        ...prev,
        [branchId]: {
          ...current,
          saving: false,
          status: 'error',
          errorMsg: 'Please enter valid opening and closing times (e.g. 09:00 AM, 05:00 PM).',
        },
      }))
      return
    }

    setBranchStates((prev) => ({
      ...prev,
      [branchId]: { ...current, saving: true, status: 'idle' },
    }))

    const res = await updateBranch(branchId, {
      is_open: current.is_open,
      opening_time: time24ToString(current.opening_time, '09:00 AM'),
      closing_time: time24ToString(current.closing_time, '05:00 PM'),
      whatsapp_number: current.whatsapp_number,
    })

    setBranchStates((prev) => ({
      ...prev,
      [branchId]: {
        ...current,
        saving: false,
        status: res.success ? 'saved' : 'error',
        errorMsg: res.error,
      },
    }))

    if (res.success) {
      setTimeout(() => {
        setBranchStates((prev) => ({
          ...prev,
          [branchId]: { ...(prev[branchId] || current), status: 'idle' },
        }))
      }, 3000)
    }
  }

  const activeDoctorsCount = doctors.filter((d) => d.available).length
  const openBranchesCount = branches.filter((b) => b.is_open).length

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C242E] font-sans selection:bg-rose-500/20 selection:text-[#BE185D]">
      {/* ── Top Administrative Header ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E8E2D8] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand & Portal Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#BE185D] text-white flex items-center justify-center font-heading font-extrabold text-base shadow-sm">
              S
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-sm sm:text-base text-[#1C242E] leading-none">
                  Dr. Sheilas Eye Hospitals
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-heading font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <ShieldCheck size={11} />
                  Admin Portal
                </span>
              </div>
              <span className="text-[11px] text-[#5A687A] mt-0.5 hidden sm:block">
                Weekly Doctor Branch Scheduling &amp; Consultation Timings
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              title="Refresh Data from Supabase"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={onGoToPublic}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-[#E8E2D8] text-[#1C242E] font-heading font-semibold text-xs transition-colors cursor-pointer shadow-xs"
            >
              <Globe size={14} className="text-[#BE185D]" />
              <span className="hidden sm:inline">View Website</span>
            </button>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-heading font-semibold text-xs transition-colors cursor-pointer shadow-xs"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Dashboard Content ─────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metric Overview Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-heading font-semibold uppercase tracking-wider text-[#5A687A]">
                Doctors on Duty
              </span>
              <span className="font-heading font-bold text-2xl text-[#1C242E] mt-1">
                {activeDoctorsCount}{' '}
                <span className="text-sm font-normal text-[#8A96A6]">/ {doctors.length}</span>
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Stethoscope size={20} />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-heading font-semibold uppercase tracking-wider text-[#5A687A]">
                Open Hospital Branches
              </span>
              <span className="font-heading font-bold text-2xl text-[#1C242E] mt-1">
                {openBranchesCount}{' '}
                <span className="text-sm font-normal text-[#8A96A6]">/ {branches.length}</span>
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-[#BE185D] flex items-center justify-center border border-rose-100">
              <Building2 size={20} />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-heading font-semibold uppercase tracking-wider text-[#5A687A]">
                Single Source of Truth
              </span>
              <span className="font-heading font-bold text-sm text-emerald-700 flex items-center gap-1.5 mt-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Supabase Sync
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center border border-stone-200">
              <CheckCircle2 size={20} />
            </div>
          </div>
        </div>

        {/* Global Error Notice if any */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
            <AlertCircle size={18} className="shrink-0 text-rose-600" />
            <span>Database communication notice: {error}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-[#E8E2D8] pb-4 mb-8">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-heading text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === 'doctors'
                ? 'bg-[#1C242E] text-white shadow-sm'
                : 'bg-white text-[#5A687A] hover:text-[#1C242E] border border-[#E8E2D8]'
            }`}
          >
            <Calendar
              size={16}
              className={activeTab === 'doctors' ? 'text-rose-400' : 'text-[#BE185D]'}
            />
            <span>Doctor Schedules &amp; Consultation Timings ({doctors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('branches')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-heading text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === 'branches'
                ? 'bg-[#1C242E] text-white shadow-sm'
                : 'bg-white text-[#5A687A] hover:text-[#1C242E] border border-[#E8E2D8]'
            }`}
          >
            <Building2
              size={16}
              className={activeTab === 'branches' ? 'text-rose-400' : 'text-[#BE185D]'}
            />
            <span>Hospital Branch Management ({branches.length})</span>
          </button>
        </div>

        {/* ── TAB 1: DOCTOR SCHEDULES & CONSULTATION TIMINGS ──────────────────── */}
        {activeTab === 'doctors' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-heading font-bold text-xl text-[#1C242E]">
                  Doctor Branch Schedules &amp; Consultation Timings
                </h2>
                <p className="text-xs sm:text-sm text-[#5A687A] mt-0.5">
                  Configure weekly branch assignments (where doctors consult each day) and branch consultation timings (what time they consult).
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                <Sparkles size={13} className="text-amber-600" />
                <span>Today is {todayDay}</span>
              </div>
            </div>

            {loading && doctors.length === 0 ? (
              <div className="p-12 text-center text-sm text-[#5A687A]">
                Loading doctor schedule data from Supabase...
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8">
                {doctors.map((doc) => {
                  const portraitSrc = getDoctorPortrait(doc.name)
                  const isDocAvail = Boolean(doc.available)
                  const isSavingStatus = Boolean(doctorStatusSaving[doc.id])
                  const statusErrMsg = doctorStatusError[doc.id]

                  const weeklySchedule = getDoctorWeeklyState(doc)
                  const todayBranch = getDoctorBranchForDate(doc, new Date(), schedules)
                  const isTodayOff = todayBranch.toLowerCase() === 'off'
                  const todaySchedInfo = !isTodayOff
                    ? getDoctorBranchSchedule(doc.id, todayBranch, doc, schedules, branches)
                    : null

                  const isSavingWeekly = Boolean(weeklySaving[doc.id])
                  const weeklySaveStatus = weeklyStatus[doc.id] || 'idle'
                  const weeklySaveErrMsg = weeklyError[doc.id]

                  return (
                    <div
                      key={doc.id}
                      className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                      {/* Top status accent bar */}
                      <div
                        className={`absolute top-0 left-0 right-0 h-1.5 ${
                          isDocAvail
                            ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500'
                            : 'bg-stone-300'
                        }`}
                      />

                      {/* Doctor Profile & Overall Status Controls */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E8E2D8]">
                        {/* Left: Doctor Portrait & Live Today Station */}
                        <div className="flex items-start sm:items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-[#FDF2F4] border border-[#E8E2D8] flex items-center justify-center text-[#BE185D] font-bold text-lg shrink-0 overflow-hidden shadow-xs">
                            {portraitSrc ? (
                              <img
                                src={portraitSrc}
                                alt={doc.name}
                                className="w-full h-full object-cover object-top"
                              />
                            ) : (
                              <span>{doc.name.replace('Dr. ', '').charAt(0)}</span>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <h3 className="font-heading font-bold text-xl text-[#1C242E]">
                                {doc.name}
                              </h3>
                              <span
                                className={`text-[11px] font-heading font-semibold px-2.5 py-0.5 rounded-full border ${
                                  isDocAvail
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-stone-100 text-stone-600 border-stone-200'
                                }`}
                              >
                                {isDocAvail ? '● Available' : '○ Off-Duty (Global)'}
                              </span>
                            </div>

                            <p className="text-xs text-[#5A687A] mt-1 flex items-center gap-1.5 flex-wrap">
                              <MapPin size={12} className="text-[#BE185D]" />
                              <span>
                                Today ({todayDay}):{' '}
                                <strong className="text-[#1C242E]">
                                  {isDocAvail
                                    ? isTodayOff
                                      ? 'Scheduled Off'
                                      : `${todayBranch} Hospital`
                                    : 'Off-Duty'}
                                </strong>
                              </span>
                              {isDocAvail && !isTodayOff && todaySchedInfo?.start_time && (
                                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                                  OPD: {todaySchedInfo.start_time} – {todaySchedInfo.end_time || '05:00 PM'}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Right: Global Availability Toggle */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-4 bg-[#FAF8F5] p-3.5 sm:p-4 rounded-2xl border border-[#E8E2D8]">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-heading font-semibold text-[#1C242E]">
                                Global Status:
                              </span>
                              <button
                                type="button"
                                onClick={() => handleToggleDoctorStatus(doc)}
                                disabled={isSavingStatus}
                                aria-label={`Toggle availability for ${doc.name}`}
                                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-60 ${
                                  isDocAvail ? 'bg-emerald-500' : 'bg-stone-300'
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                    isDocAvail ? 'translate-x-7' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-xs font-bold ${
                                    isDocAvail ? 'text-emerald-700' : 'text-stone-500'
                                  }`}
                                >
                                  {isDocAvail ? 'Available' : 'Unavailable'}
                                </span>
                                {isSavingStatus && (
                                  <span className="text-[11px] text-[#5A687A] flex items-center gap-1">
                                    <RefreshCw size={11} className="animate-spin text-[#BE185D]" />
                                    <span>Saving...</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {statusErrMsg && (
                            <div className="text-[11px] text-rose-600 font-medium px-1 flex items-center gap-1">
                              <AlertCircle size={12} />
                              <span>{statusErrMsg}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Doctor Global Off-Duty Notice */}
                      {!isDocAvail && (
                        <div className="mt-4 p-3 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 text-xs flex items-center gap-2">
                          <AlertCircle size={14} className="shrink-0 text-stone-500" />
                          <span>
                            <strong>Notice:</strong> When doctor status is set to Unavailable, the
                            doctor will not appear as an available senior specialist at any branch
                            for any day until marked Available again.
                          </span>
                        </div>
                      )}

                      {/* ── SECTION A: WEEKLY DAY-BY-DAY BRANCH ASSIGNMENT ── */}
                      <div className="pt-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={15} className="text-[#BE185D]" />
                            <span className="text-xs font-heading font-semibold uppercase tracking-wider text-[#1C242E]">
                              A. Weekly Doctor Branch Schedule
                            </span>
                          </div>
                          <span className="text-[11px] text-[#8A96A6]">
                            Select the hospital branch where the doctor is assigned for each day of the week.
                          </span>
                        </div>

                        <div className="flex lg:grid lg:grid-cols-7 gap-3 overflow-x-auto max-w-full pb-2 pt-1 scrollbar-thin">
                          {DAYS_OF_WEEK.map((day) => {
                            const isCurrentDay = day === todayDay
                            const assignedBranch = weeklySchedule[day] || 'Off'

                            return (
                              <div
                                key={day}
                                className={`min-w-[150px] sm:min-w-[160px] lg:min-w-0 flex-1 shrink-0 lg:shrink p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                                  isCurrentDay
                                    ? 'bg-rose-50/40 border-[#BE185D]/40 ring-1 ring-[#BE185D]/20 shadow-xs'
                                    : 'bg-[#FAF8F5] border-[#E8E2D8] hover:border-stone-300'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-heading font-bold text-xs text-[#1C242E]">
                                      {day}
                                    </span>
                                    {isCurrentDay && (
                                      <span className="text-[9px] font-heading font-extrabold uppercase px-1.5 py-0.2 bg-[#BE185D] text-white rounded-md tracking-wider">
                                        Today
                                      </span>
                                    )}
                                  </div>

                                  <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-semibold text-[#8A96A6] tracking-wider block">
                                      Branch
                                    </label>
                                    <select
                                      value={assignedBranch}
                                      onChange={(e) =>
                                        handleDayAssignmentChange(doc.id, day, e.target.value)
                                      }
                                      className={`w-full bg-white border rounded-xl px-2.5 py-2 text-xs font-semibold outline-none transition-all cursor-pointer shadow-2xs ${
                                        assignedBranch === 'Off'
                                          ? 'text-stone-400 border-stone-200'
                                          : 'text-[#1C242E] border-[#E8E2D8] focus:border-[#BE185D]'
                                      }`}
                                    >
                                      {HOSPITAL_BRANCHES.map((bName) => (
                                        <option key={bName} value={bName}>
                                          {bName}
                                        </option>
                                      ))}
                                      <option value="Off">No consultation / Off</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="mt-2.5 pt-2 border-t border-[#E8E2D8]/60 text-[10px] text-[#5A687A]">
                                  {assignedBranch === 'Off' ? (
                                    <span className="text-stone-400">Off-duty</span>
                                  ) : (
                                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                                      {assignedBranch}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        {/* Save Weekly Schedule Action */}
                        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E8E2D8]/60">
                          <div className="text-xs text-[#5A687A]">
                            {weeklySaveErrMsg && (
                              <span className="text-rose-600 font-medium flex items-center gap-1">
                                <AlertCircle size={13} />
                                <span>{weeklySaveErrMsg}</span>
                              </span>
                            )}
                            {weeklySaveStatus === 'saved' && (
                              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                <CheckCircle2 size={14} className="text-emerald-600" />
                                <span>Weekly schedule saved and synchronized!</span>
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSaveWeeklySchedule(doc.id)}
                            disabled={isSavingWeekly}
                            className={`px-6 py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-xs disabled:opacity-60 text-white ${
                              weeklySaveStatus === 'saved'
                                ? 'bg-emerald-600'
                                : weeklySaveStatus === 'error'
                                ? 'bg-rose-600'
                                : 'bg-[#BE185D] hover:bg-[#9F1239]'
                            }`}
                          >
                            {isSavingWeekly ? (
                              <>
                                <RefreshCw size={13} className="animate-spin" />
                                <span>Saving Schedule...</span>
                              </>
                            ) : weeklySaveStatus === 'saved' ? (
                              <>
                                <Check size={13} />
                                <span>Schedule Saved</span>
                              </>
                            ) : (
                              <>
                                <Save size={13} />
                                <span>Save Weekly Schedule</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* ── SECTION B: DOCTOR CONSULTATION TIMINGS (PER BRANCH) ── */}
                      <div className="pt-8 mt-8 border-t border-[#E8E2D8]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                          <div className="flex items-center gap-2">
                            <Clock size={15} className="text-[#BE185D]" />
                            <span className="text-xs font-heading font-semibold uppercase tracking-wider text-[#1C242E]">
                              B. Doctor Consultation Timings (Branch Timings)
                            </span>
                          </div>
                          <span className="text-[11px] text-[#8A96A6]">
                            Configure OPD consultation start and end times for {doc.name} at each hospital branch.
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {HOSPITAL_BRANCHES.map((branchName) => {
                            const timingState = getDoctorTimingState(doc.id, branchName)
                            const assignedDays = DAYS_OF_WEEK.filter(
                              (day) => (weeklySchedule[day] || '').toLowerCase() === branchName.toLowerCase()
                            )

                            return (
                              <div
                                key={branchName}
                                className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D8]/60 mb-3">
                                    <div className="flex items-center gap-2">
                                      <MapPin size={13} className="text-[#BE185D]" />
                                      <span className="font-heading font-bold text-xs text-[#1C242E]">
                                        {branchName} Center
                                      </span>
                                    </div>
                                    <span className="text-[10px] font-medium text-[#5A687A]">
                                      {assignedDays.length > 0
                                        ? `${assignedDays.length} day${assignedDays.length > 1 ? 's' : ''}/wk`
                                        : 'Not scheduled'}
                                    </span>
                                  </div>

                                  {assignedDays.length > 0 && (
                                    <div className="mb-3 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-1 rounded-lg">
                                      Assigned: <strong>{assignedDays.join(', ')}</strong>
                                    </div>
                                  )}

                                  <div className="space-y-2.5">
                                    <div>
                                      <div className="flex items-center justify-between mb-1">
                                        <label className="text-[11px] font-medium text-[#5A687A]">
                                          Start Time:
                                        </label>
                                        <span className="text-[11px] font-semibold text-[#1C242E]">
                                          {timingState.start_time}
                                        </span>
                                      </div>
                                      <input
                                        type="time"
                                        value={timeStringTo24(timingState.start_time, '09:00')}
                                        onChange={(e) =>
                                          handleDoctorTimingChange(
                                            doc.id,
                                            branchName,
                                            'start_time',
                                            e.target.value
                                          )
                                        }
                                        className="w-full bg-white border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#BE185D] cursor-pointer"
                                      />
                                    </div>

                                    <div>
                                      <div className="flex items-center justify-between mb-1">
                                        <label className="text-[11px] font-medium text-[#5A687A]">
                                          End Time:
                                        </label>
                                        <span className="text-[11px] font-semibold text-[#1C242E]">
                                          {timingState.end_time}
                                        </span>
                                      </div>
                                      <input
                                        type="time"
                                        value={timeStringTo24(timingState.end_time, '17:00')}
                                        onChange={(e) =>
                                          handleDoctorTimingChange(
                                            doc.id,
                                            branchName,
                                            'end_time',
                                            e.target.value
                                          )
                                        }
                                        className="w-full bg-white border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#BE185D] cursor-pointer"
                                      />
                                    </div>
                                  </div>

                                  {timingState.errorMsg && (
                                    <div className="text-[10px] text-rose-600 font-medium mt-2 flex items-center gap-1">
                                      <AlertCircle size={11} />
                                      <span>{timingState.errorMsg}</span>
                                    </div>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleSaveDoctorTiming(doc.id, branchName)}
                                  disabled={timingState.saving}
                                  className={`w-full py-2 rounded-xl font-heading font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-60 text-white mt-3.5 ${
                                    timingState.status === 'saved'
                                      ? 'bg-emerald-600'
                                      : timingState.status === 'error'
                                      ? 'bg-rose-600'
                                      : 'bg-[#BE185D] hover:bg-[#9F1239]'
                                  }`}
                                >
                                  {timingState.saving ? (
                                    <>
                                      <RefreshCw size={11} className="animate-spin" />
                                      <span>Saving...</span>
                                    </>
                                  ) : timingState.status === 'saved' ? (
                                    <>
                                      <Check size={11} />
                                      <span>Timings Saved</span>
                                    </>
                                  ) : (
                                    <>
                                      <Save size={11} />
                                      <span>Save {branchName} Timings</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: BRANCH MANAGEMENT ────────────────────────────────────────── */}
        {activeTab === 'branches' && (
          <div className="space-y-8">
            <div className="flex flex-col gap-1">
              <h2 className="font-heading font-bold text-xl text-[#1C242E]">
                Hospital Branch Management
              </h2>
              <p className="text-xs sm:text-sm text-[#5A687A]">
                Configure operating status, OPD timings, and official WhatsApp reception contact
                numbers for Palasa, Sompeta, and Ichapuram.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {branches.map((branch) => {
                const state = getBranchState(branch)

                return (
                  <div
                    key={branch.id}
                    className="bg-white rounded-3xl border border-[#E8E2D8] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* Branch Header */}
                      <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8] mb-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#BE185D] flex items-center justify-center font-bold">
                            <Building2 size={16} />
                          </div>
                          <div>
                            <h3 className="font-heading font-bold text-base text-[#1C242E]">
                              {branch.name} Center
                            </h3>
                            <span className="text-[11px] text-[#5A687A]">
                              {branch.name} Hospital
                            </span>
                          </div>
                        </div>

                        {/* Status badge */}
                        <span
                          className={`text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded-full border ${
                            state.is_open
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {state.is_open ? '● Open' : '○ Closed'}
                        </span>
                      </div>

                      {/* Branch Open/Closed Toggle */}
                      <div className="flex items-center justify-between bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E8E2D8] mb-4">
                        <span className="text-xs font-heading font-semibold text-[#1C242E]">
                          Hospital Center Open:
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setBranchStates((prev) => ({
                              ...prev,
                              [branch.id]: {
                                ...state,
                                is_open: !state.is_open,
                              },
                            }))
                          }}
                          className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            state.is_open ? 'bg-emerald-500' : 'bg-stone-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              state.is_open ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Timings */}
                      <div className="space-y-3 mb-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-medium text-[#5A687A]">
                              Opening Time:
                            </label>
                            <span className="text-[11px] font-semibold text-[#1C242E]">
                              {state.opening_time}
                            </span>
                          </div>
                          <input
                            type="time"
                            value={timeStringTo24(state.opening_time, '09:00')}
                            onChange={(e) => {
                              const new12 = time24ToString(e.target.value, '09:00 AM')
                              setBranchStates((prev) => ({
                                ...prev,
                                [branch.id]: {
                                  ...state,
                                  opening_time: new12,
                                },
                              }))
                            }}
                            className="w-full bg-white border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#BE185D] cursor-pointer"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-medium text-[#5A687A]">
                              Closing Time:
                            </label>
                            <span className="text-[11px] font-semibold text-[#1C242E]">
                              {state.closing_time}
                            </span>
                          </div>
                          <input
                            type="time"
                            value={timeStringTo24(state.closing_time, '17:00')}
                            onChange={(e) => {
                              const new12 = time24ToString(e.target.value, '05:00 PM')
                              setBranchStates((prev) => ({
                                ...prev,
                                [branch.id]: {
                                  ...state,
                                  closing_time: new12,
                                },
                              }))
                            }}
                            className="w-full bg-white border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#BE185D] cursor-pointer"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-medium text-[#5A687A] mb-1 block">
                            WhatsApp Reception Number:
                          </label>
                          <input
                            type="tel"
                            value={state.whatsapp_number}
                            onChange={(e) => {
                              const val = e.target.value
                              setBranchStates((prev) => ({
                                ...prev,
                                [branch.id]: {
                                  ...state,
                                  whatsapp_number: val,
                                },
                              }))
                            }}
                            placeholder="e.g. 08945-242442 or 919876543210"
                            className="w-full bg-white border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#BE185D]"
                          />
                        </div>
                      </div>

                      {state.errorMsg && (
                        <div className="text-[11px] text-rose-600 font-medium mb-3 flex items-center gap-1">
                          <AlertCircle size={12} />
                          <span>{state.errorMsg}</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSaveBranch(branch.id)}
                      disabled={state.saving}
                      className={`w-full py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-60 text-white mt-2 ${
                        state.status === 'saved'
                          ? 'bg-emerald-600'
                          : state.status === 'error'
                          ? 'bg-rose-600'
                          : 'bg-[#BE185D] hover:bg-[#9F1239]'
                      }`}
                    >
                      {state.saving ? (
                        <>
                          <RefreshCw size={12} className="animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : state.status === 'saved' ? (
                        <>
                          <Check size={12} />
                          <span>Branch Saved</span>
                        </>
                      ) : (
                        <>
                          <Save size={12} />
                          <span>Save Branch Settings</span>
                        </>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
