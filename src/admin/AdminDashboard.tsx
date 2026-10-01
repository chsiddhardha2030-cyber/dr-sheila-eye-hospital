import React, { useState } from 'react'
import {
  Stethoscope,
  Building2,
  LogOut,
  Globe,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  MapPin,
  Save,
  Check,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useHospitalData } from '../context/HospitalDataContext'
import type { Doctor, Branch } from '../lib/database.types'
import {
  timeStringTo24,
  time24ToString,
  isValidTimeString,
} from '../lib/doctorAvailability'

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
    saveDoctorAndSchedule,
  } = useHospitalData()

  const [activeTab, setActiveTab] = useState<'doctors' | 'branches'>('doctors')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Local state for doctors form editing
  const [doctorStates, setDoctorStates] = useState<{
    [id: number]: {
      current_branch: string
      available: boolean
    }
  }>({})

  // Status saving and error states for automatic doctor status toggle
  const [doctorStatusSaving, setDoctorStatusSaving] = useState<{ [id: number]: boolean }>({})
  const [doctorStatusError, setDoctorStatusError] = useState<{ [id: number]: string | null }>({})

  // Local state for doctor schedule rows editing
  const [scheduleStates, setScheduleStates] = useState<{
    [key: string]: {
      is_available: boolean
      start_time: string
      end_time: string
      saving: boolean
      status: 'idle' | 'saved' | 'error'
      errorMsg?: string
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

  // Helper to get or initialize doctor state
  const getDoctorState = (doc: Doctor) => {
    if (doctorStates[doc.id]) return doctorStates[doc.id]
    return {
      current_branch: doc.current_branch || 'Palasa',
      available: doc.available,
    }
  }

  // Helper to get or initialize schedule state for a doctor and branch
  const getScheduleState = (docId: number, branchName: string) => {
    const key = `${docId}_${branchName}`
    if (scheduleStates[key]) return scheduleStates[key]

    const found = schedules.find(
      (s) => s.doctor_id === docId && s.branch_name.toLowerCase() === branchName.toLowerCase()
    )

    return {
      is_available: found ? found.is_available : false,
      start_time: time24ToString(found?.start_time, '09:00 AM'),
      end_time: time24ToString(found?.end_time, '05:00 PM'),
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
      closing_time: time24ToString(branch.closing_time, '08:00 PM'),
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

  // Handle Automatic Doctor Status Toggle Save
  const handleToggleDoctorStatus = async (doc: Doctor) => {
    const currentDocState = getDoctorState(doc)
    const nextAvailable = !currentDocState.available
    const prevAvailable = currentDocState.available

    // Optimistically update local state for immediate feedback
    setDoctorStates((prev) => ({
      ...prev,
      [doc.id]: {
        ...currentDocState,
        available: nextAvailable,
      },
    }))
    setDoctorStatusSaving((prev) => ({ ...prev, [doc.id]: true }))
    setDoctorStatusError((prev) => ({ ...prev, [doc.id]: null }))

    const res = await updateDoctor(doc.id, {
      available: nextAvailable,
      current_branch: currentDocState.current_branch,
    })

    setDoctorStatusSaving((prev) => ({ ...prev, [doc.id]: false }))

    if (!res.success) {
      // Revert if saving failed
      setDoctorStates((prev) => ({
        ...prev,
        [doc.id]: {
          ...currentDocState,
          available: prevAvailable,
        },
      }))
      setDoctorStatusError((prev) => ({
        ...prev,
        [doc.id]: res.error || 'Failed to update status. Reverted to previous state.',
      }))
    }
  }

  // Save specific Doctor branch schedule & consultation timings
  const handleSaveSchedule = async (docId: number, branchName: string) => {
    const doc = doctors.find((d) => d.id === docId)
    if (!doc) return
    const currentDocState = getDoctorState(doc)
    const key = `${docId}_${branchName}`
    const currentSched = getScheduleState(docId, branchName)

    // Backend/frontend enforcement: Only allow saving for the doctor's selected station when available
    const isStation = currentDocState.current_branch.trim().toLowerCase() === branchName.trim().toLowerCase()
    if (!isStation || !currentDocState.available) {
      return
    }

    setScheduleStates((prev) => ({
      ...prev,
      [key]: { ...currentSched, saving: true, status: 'idle' },
    }))

    const res = await saveDoctorAndSchedule(
      docId,
      branchName,
      {
        available: currentDocState.available,
        current_branch: currentDocState.current_branch,
      },
      {
        start_time: currentSched.start_time,
        end_time: currentSched.end_time,
      }
    )

    setScheduleStates((prev) => ({
      ...prev,
      [key]: {
        ...currentSched,
        saving: false,
        status: res.success ? 'saved' : 'error',
        errorMsg: res.error,
      },
    }))

    if (res.success) {
      setTimeout(() => {
        setScheduleStates((prev) => ({
          ...prev,
          [key]: { ...(prev[key] || currentSched), status: 'idle' },
        }))
      }, 2500)
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
          errorMsg: 'Please enter valid opening and closing times.',
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
      closing_time: time24ToString(current.closing_time, '08:00 PM'),
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
      }, 2500)
    }
  }

  // Standard branch names for schedules
  const branchNameList = branches.length > 0 ? branches.map((b) => b.name) : ['Palasa', 'Sompeta', 'Ichapuram']

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
                  Admin Panel
                </span>
              </div>
              <span className="text-[11px] text-[#5A687A] mt-0.5 hidden sm:block">
                Hospital Availability &amp; Timings Control
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
                Doctors Available
              </span>
              <span className="font-heading font-bold text-2xl text-[#1C242E] mt-1">
                {activeDoctorsCount} <span className="text-sm font-normal text-[#8A96A6]">/ {doctors.length}</span>
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Stethoscope size={20} />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-heading font-semibold uppercase tracking-wider text-[#5A687A]">
                Open Branches
              </span>
              <span className="font-heading font-bold text-2xl text-[#1C242E] mt-1">
                {openBranchesCount} <span className="text-sm font-normal text-[#8A96A6]">/ {branches.length}</span>
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-[#BE185D] flex items-center justify-center border border-rose-100">
              <Building2 size={20} />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-heading font-semibold uppercase tracking-wider text-[#5A687A]">
                Database Status
              </span>
              <span className="font-heading font-bold text-sm text-emerald-700 flex items-center gap-1.5 mt-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Supabase Connected
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
            <span>Database communication error: {error}</span>
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
            <Stethoscope size={16} className={activeTab === 'doctors' ? 'text-rose-400' : 'text-[#BE185D]'} />
            <span>1. Doctors Management ({doctors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('branches')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-heading text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === 'branches'
                ? 'bg-[#1C242E] text-white shadow-sm'
                : 'bg-white text-[#5A687A] hover:text-[#1C242E] border border-[#E8E2D8]'
            }`}
          >
            <Building2 size={16} className={activeTab === 'branches' ? 'text-rose-400' : 'text-[#BE185D]'} />
            <span>2. Branches Management ({branches.length})</span>
          </button>
        </div>

        {/* ── TAB 1: DOCTORS MANAGEMENT ──────────────────────────────────────── */}
        {activeTab === 'doctors' && (
          <div className="space-y-8">
            <div className="flex flex-col gap-1">
              <h2 className="font-heading font-bold text-xl text-[#1C242E]">
                Doctor Availability &amp; Consultation Timings
              </h2>
              <p className="text-xs sm:text-sm text-[#5A687A]">
                Select a doctor's active status and consulting station. Only the selected station's schedule is editable.
              </p>
            </div>

            {loading && doctors.length === 0 ? (
              <div className="p-12 text-center text-sm text-[#5A687A]">
                Loading doctors from Supabase...
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8">
                {doctors.map((doc) => {
                  const state = getDoctorState(doc)
                  const portraitSrc = getDoctorPortrait(doc.name)
                  const isSavingStatus = Boolean(doctorStatusSaving[doc.id])
                  const statusErrMsg = doctorStatusError[doc.id]

                  return (
                    <div
                      key={doc.id}
                      className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                      {/* Top status indicator bar */}
                      <div
                        className={`absolute top-0 left-0 right-0 h-1.5 ${
                          state.available
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : 'bg-stone-300'
                        }`}
                      />

                      {/* Doctor Header & Overall Status */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E8E2D8]">
                        
                        {/* Doctor Name, Portrait & Current Badge */}
                        <div className="flex items-start sm:items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#FDF2F4] border border-[#E8E2D8] flex items-center justify-center text-[#BE185D] font-bold text-lg shrink-0 overflow-hidden shadow-xs">
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
                                  state.available
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-stone-100 text-stone-600 border-stone-200'
                                }`}
                              >
                                {state.available ? '● Available' : '○ Unavailable'}
                              </span>
                            </div>
                            <p className="text-xs text-[#5A687A] mt-1 flex items-center gap-1.5">
                              <MapPin size={12} className="text-[#BE185D]" />
                              <span>
                                Stationed at <strong>{state.current_branch}</strong>
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Overall Doctor Controls */}
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap items-center gap-4 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E2D8]">
                            
                            {/* Availability Toggle Switch (Automatic Save) */}
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-heading font-semibold text-[#1C242E]">
                                Doctor Status:
                              </span>
                              <button
                                type="button"
                                onClick={() => handleToggleDoctorStatus(doc)}
                                disabled={isSavingStatus}
                                aria-label={`Toggle availability for ${doc.name}`}
                                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-60 ${
                                  state.available ? 'bg-emerald-500' : 'bg-stone-300'
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                    state.available ? 'translate-x-7' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold ${state.available ? 'text-emerald-700' : 'text-stone-500'}`}>
                                  {state.available ? 'Available' : 'Unavailable'}
                                </span>
                                {isSavingStatus && (
                                  <span className="text-[11px] text-[#5A687A] flex items-center gap-1">
                                    <RefreshCw size={11} className="animate-spin text-[#BE185D]" />
                                    <span>Saving...</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="h-6 w-px bg-[#E8E2D8] hidden sm:block" />

                            {/* Current Branch Dropdown (Disabled when Doctor is Unavailable) */}
                            <div className="flex items-center gap-2">
                              <label className={`text-xs font-heading font-semibold whitespace-nowrap ${state.available ? 'text-[#1C242E]' : 'text-stone-400'}`}>
                                Branch:
                              </label>
                              <select
                                value={state.current_branch}
                                disabled={!state.available}
                                onChange={(e) => {
                                  setDoctorStates((prev) => ({
                                    ...prev,
                                    [doc.id]: {
                                      ...state,
                                      current_branch: e.target.value,
                                    },
                                  }))
                                }}
                                title={
                                  !state.available
                                    ? 'Doctor is Unavailable. Switch Doctor Status to Available to change branch.'
                                    : 'Select active consulting branch'
                                }
                                className={`border rounded-xl px-3 py-1.5 text-xs font-semibold outline-none shadow-xs transition-all ${
                                  state.available
                                    ? 'bg-white border-[#E8E2D8] text-[#1C242E] focus:border-[#BE185D] cursor-pointer'
                                    : 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed opacity-75'
                                }`}
                              >
                                {branchNameList.map((bName) => (
                                  <option key={bName} value={bName}>
                                    {bName}
                                  </option>
                                ))}
                              </select>
                            </div>

                          </div>

                          {/* Status Error Display if Save Failed */}
                          {statusErrMsg && (
                            <div className="text-[11px] text-rose-600 font-medium px-1 flex items-center gap-1">
                              <AlertCircle size={12} />
                              <span>{statusErrMsg}</span>
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Branch Consultation Schedules Section */}
                      <div className="pt-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                          <span className="text-xs font-heading font-semibold uppercase tracking-wider text-[#5A687A] flex items-center gap-1.5">
                            <Clock size={13} className="text-[#BE185D]" />
                            <span>Branch Consultation Timings</span>
                          </span>

                          <span className="text-[11px] font-medium text-[#8A96A6]">
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                              Stationed at <strong>{state.current_branch}</strong>
                            </span>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {branchNameList.map((bName) => {
                            const schedState = getScheduleState(doc.id, bName)
                            const schedKey = `${doc.id}_${bName}`
                            
                            // Station rules:
                            const isSelectedStation = state.current_branch.trim().toLowerCase() === bName.trim().toLowerCase()
                            const isEditable = Boolean(state.available && isSelectedStation)

                            return (
                              <div
                                key={bName}
                                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                                  isEditable
                                    ? 'bg-[#FAF8F5] border-emerald-300 ring-2 ring-emerald-500/15 shadow-sm'
                                    : 'bg-stone-50/60 border-stone-200 opacity-75'
                                }`}
                              >
                                <div>
                                  {/* Branch Title & Status Badge */}
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-1.5">
                                      <MapPin
                                        size={13}
                                        className={isEditable ? 'text-[#BE185D]' : 'text-stone-400'}
                                      />
                                      <span className={`font-heading font-bold text-sm ${isEditable ? 'text-[#1C242E]' : 'text-stone-600'}`}>
                                        {bName}
                                      </span>
                                    </div>

                                    {/* Branch Badge */}
                                    <span
                                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold border ${
                                        isEditable
                                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                          : 'bg-stone-100 text-stone-500 border-stone-200'
                                      }`}
                                    >
                                      {isEditable ? '● Active Station' : 'Read-only'}
                                    </span>
                                  </div>

                                  {/* Timings Inputs (HTML5 controlled time inputs) */}
                                  <div className="space-y-2.5 mb-4">
                                    {/* Start Time */}
                                    <div>
                                      <div className="flex items-center justify-between mb-1">
                                        <label className={`text-[11px] font-medium ${isEditable ? 'text-[#5A687A]' : 'text-stone-400'}`}>
                                          Start Time:
                                        </label>
                                        <span className="text-[10px] font-semibold text-[#8A96A6]">
                                          {schedState.start_time}
                                        </span>
                                      </div>
                                      <input
                                        type="time"
                                        value={timeStringTo24(schedState.start_time, '09:00')}
                                        disabled={!isEditable}
                                        onChange={(e) => {
                                          const new12 = time24ToString(e.target.value, '09:00 AM')
                                          setScheduleStates((prev) => ({
                                            ...prev,
                                            [schedKey]: {
                                              ...schedState,
                                              start_time: new12,
                                            },
                                          }))
                                        }}
                                        className={`w-full rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-none border transition-colors ${
                                          isEditable
                                            ? 'bg-white border-[#E8E2D8] text-[#1C242E] focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D]/20 cursor-pointer'
                                            : 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed select-none'
                                        }`}
                                      />
                                    </div>

                                    {/* End Time */}
                                    <div>
                                      <div className="flex items-center justify-between mb-1">
                                        <label className={`text-[11px] font-medium ${isEditable ? 'text-[#5A687A]' : 'text-stone-400'}`}>
                                          End Time:
                                        </label>
                                        <span className="text-[10px] font-semibold text-[#8A96A6]">
                                          {schedState.end_time}
                                        </span>
                                      </div>
                                      <input
                                        type="time"
                                        value={timeStringTo24(schedState.end_time, '17:00')}
                                        disabled={!isEditable}
                                        onChange={(e) => {
                                          const new12 = time24ToString(e.target.value, '05:00 PM')
                                          setScheduleStates((prev) => ({
                                            ...prev,
                                            [schedKey]: {
                                              ...schedState,
                                              end_time: new12,
                                            },
                                          }))
                                        }}
                                        className={`w-full rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-none border transition-colors ${
                                          isEditable
                                            ? 'bg-white border-[#E8E2D8] text-[#1C242E] focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D]/20 cursor-pointer'
                                            : 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed select-none'
                                        }`}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Action: Save Schedule (Editable Branch) or Read-only block */}
                                {isEditable ? (
                                  <button
                                    type="button"
                                    onClick={() => handleSaveSchedule(doc.id, bName)}
                                    disabled={schedState.saving}
                                    className={`w-full py-2 rounded-xl text-white font-heading font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-60 ${
                                      schedState.status === 'saved'
                                        ? 'bg-emerald-600'
                                        : schedState.status === 'error'
                                        ? 'bg-rose-600'
                                        : 'bg-[#BE185D] hover:bg-[#9F1239]'
                                    }`}
                                  >
                                    {schedState.saving ? (
                                      <>
                                        <RefreshCw size={11} className="animate-spin" />
                                        <span>Saving...</span>
                                      </>
                                    ) : schedState.status === 'saved' ? (
                                      <>
                                        <Check size={11} />
                                        <span>Saved Successfully!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Save size={11} />
                                        <span>Save Schedule</span>
                                      </>
                                    )}
                                  </button>
                                ) : (
                                  <div className="w-full py-2 rounded-xl bg-stone-100 text-stone-500 font-heading font-semibold text-[11px] flex items-center justify-center border border-stone-200 select-none">
                                    Read-only
                                  </div>
                                )}

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

        {/* ── TAB 2: BRANCHES MANAGEMENT ─────────────────────────────────────── */}
        {activeTab === 'branches' && (
          <div className="space-y-8">
            <div className="flex flex-col gap-1">
              <h2 className="font-heading font-bold text-xl text-[#1C242E]">
                Hospital Branches &amp; OPD Timings
              </h2>
              <p className="text-xs sm:text-sm text-[#5A687A]">
                Update branch Open / Closed status, daily operating hours, and reception contact numbers.
              </p>
            </div>

            {loading && branches.length === 0 ? (
              <div className="p-12 text-center text-sm text-[#5A687A]">
                Loading branches from Supabase...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {branches.map((branch) => {
                  const state = getBranchState(branch)

                  return (
                    <div
                      key={branch.id}
                      className="bg-white rounded-3xl border border-[#E8E2D8] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
                    >
                      {/* Top status bar */}
                      <div
                        className={`absolute top-0 left-0 right-0 h-1.5 ${
                          state.is_open
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : 'bg-rose-400'
                        }`}
                      />

                      <div>
                        {/* Branch Title & Open/Closed Badge */}
                        <div className="flex items-start justify-between gap-2 mb-4">
                          <div>
                            <span className="text-[11px] font-heading font-semibold uppercase tracking-wider text-[#BE185D]">
                              Hospital Center
                            </span>
                            <h3 className="font-heading font-bold text-xl text-[#1C242E]">
                              {branch.name}
                            </h3>
                          </div>

                          <span
                            className={`text-[11px] font-heading font-bold px-2.5 py-1 rounded-full border ${
                              state.is_open
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {state.is_open ? '● Open Today' : '○ Closed'}
                          </span>
                        </div>

                        {/* Open / Closed Switch Control */}
                        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] mb-5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-heading font-semibold text-[#1C242E]">
                              Branch Status:
                            </span>
                            <div className="flex items-center gap-2">
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
                                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                  state.is_open ? 'bg-emerald-500' : 'bg-rose-400'
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                    state.is_open ? 'translate-x-7' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                              <span
                                className={`text-xs font-bold ${
                                  state.is_open ? 'text-emerald-700' : 'text-rose-600'
                                }`}
                              >
                                {state.is_open ? 'OPEN' : 'CLOSED'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Branch Form Fields with controlled HTML5 time inputs */}
                        <div className="space-y-3 mb-6">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[11px] font-heading font-semibold text-[#5A687A] flex items-center gap-1">
                                <Clock size={12} className="text-[#BE185D]" />
                                <span>Opening Time</span>
                              </label>
                              <span className="text-[10px] font-semibold text-[#8A96A6]">
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
                              className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs text-[#1C242E] font-medium outline-none focus:bg-white focus:border-[#BE185D] cursor-pointer"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[11px] font-heading font-semibold text-[#5A687A] flex items-center gap-1">
                                <Clock size={12} className="text-[#BE185D]" />
                                <span>Closing Time</span>
                              </label>
                              <span className="text-[10px] font-semibold text-[#8A96A6]">
                                {state.closing_time}
                              </span>
                            </div>
                            <input
                              type="time"
                              value={timeStringTo24(state.closing_time, '20:00')}
                              onChange={(e) => {
                                const new12 = time24ToString(e.target.value, '08:00 PM')
                                setBranchStates((prev) => ({
                                  ...prev,
                                  [branch.id]: {
                                    ...state,
                                    closing_time: new12,
                                  },
                                }))
                              }}
                              className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs text-[#1C242E] font-medium outline-none focus:bg-white focus:border-[#BE185D] cursor-pointer"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-heading font-semibold text-[#5A687A] mb-1 flex items-center gap-1">
                              <Phone size={12} className="text-[#BE185D]" />
                              <span>Reception / WhatsApp</span>
                            </label>
                            <input
                              type="text"
                              value={state.whatsapp_number}
                              onChange={(e) => {
                                setBranchStates((prev) => ({
                                  ...prev,
                                  [branch.id]: {
                                    ...state,
                                    whatsapp_number: e.target.value,
                                  },
                                }))
                              }}
                              placeholder="08945-242442"
                              className="w-full bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs text-[#1C242E] font-medium outline-none focus:bg-white focus:border-[#BE185D]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Save Branch Button */}
                      <button
                        type="button"
                        onClick={() => handleSaveBranch(branch.id)}
                        disabled={state.saving}
                        className={`w-full py-2.5 rounded-xl text-white font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-60 ${
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
                            <span>Saved Successfully!</span>
                          </>
                        ) : (
                          <>
                            <Save size={12} />
                            <span>Save Branch</span>
                          </>
                        )}
                      </button>

                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  )
}
