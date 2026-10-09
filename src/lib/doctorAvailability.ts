import type { Doctor, Branch, DoctorSchedule } from './database.types'

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number]

export const HOSPITAL_BRANCHES = ['Palasa', 'Sompeta', 'Ichapuram'] as const
export type HospitalBranchName = (typeof HOSPITAL_BRANCHES)[number]

/**
 * Default fallback weekly branch allocations if none are stored in the database.
 */
export const DEFAULT_WEEKLY_SCHEDULES: Record<number, Record<DayOfWeek, string>> = {
  1: {
    // Dr. Sheila Thangaraj
    Monday: 'Palasa',
    Tuesday: 'Palasa',
    Wednesday: 'Sompeta',
    Thursday: 'Sompeta',
    Friday: 'Ichapuram',
    Saturday: 'Palasa',
    Sunday: 'Off',
  },
  2: {
    // Dr. Tridib Gogoi
    Monday: 'Sompeta',
    Tuesday: 'Sompeta',
    Wednesday: 'Palasa',
    Thursday: 'Palasa',
    Friday: 'Palasa',
    Saturday: 'Ichapuram',
    Sunday: 'Off',
  },
}

/**
 * Converts any standard time string ("09:00 AM", "9:00 AM", "17:00", "5:00 PM") to 24-hour "HH:mm"
 * for use in standard HTML <input type="time">.
 */
export const timeStringTo24 = (
  timeStr: string | null | undefined,
  fallback: string = '09:00'
): string => {
  if (!timeStr) return fallback
  const trimmed = timeStr.trim()
  if (!trimmed) return fallback

  // Check for 12-hour pattern e.g. "9:00 AM", "09:30 PM", "05:00 PM"
  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i)
  if (match12) {
    let hours = parseInt(match12[1], 10)
    const minutes = match12[2]
    const meridiem = match12[3].toUpperCase()
    if (meridiem === 'PM' && hours < 12) hours += 12
    if (meridiem === 'AM' && hours === 12) hours = 0
    return `${hours.toString().padStart(2, '0')}:${minutes}`
  }

  // Check for 24-hour pattern e.g. "09:00", "17:00", "09:30:00"
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})/)
  if (match24) {
    const hours = parseInt(match24[1], 10)
    const minutes = match24[2]
    if (hours >= 0 && hours <= 23) {
      return `${hours.toString().padStart(2, '0')}:${minutes}`
    }
  }

  return fallback
}

/**
 * Converts 24-hour "HH:mm" string or any time string to normalized 12-hour "hh:mm AM/PM" format.
 */
export const time24ToString = (
  time24: string | null | undefined,
  fallback: string = '09:00 AM'
): string => {
  if (!time24) return fallback
  const trimmed = time24.trim()
  if (!trimmed) return fallback

  // If already in 12h format e.g. "09:00 AM", normalize it
  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i)
  if (match12) {
    const hours = parseInt(match12[1], 10)
    const minutes = match12[2]
    const meridiem = match12[3].toUpperCase()
    const hour12 = hours === 0 ? 12 : hours
    return `${hour12.toString().padStart(2, '0')}:${minutes} ${meridiem}`
  }

  // 24h format
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})/)
  if (match24) {
    const hours = parseInt(match24[1], 10)
    const minutes = match24[2]
    if (hours >= 0 && hours <= 23) {
      const period = hours >= 12 ? 'PM' : 'AM'
      const hour12 = hours % 12 === 0 ? 12 : hours % 12
      return `${hour12.toString().padStart(2, '0')}:${minutes} ${period}`
    }
  }

  return fallback
}

/**
 * Helper to parse 12-hour or 24-hour time string to total minutes from midnight (0-1439).
 */
export const parseTimeToMinutes = (timeStr: string | null | undefined): number | null => {
  if (!timeStr) return null
  const trimmed = timeStr.trim()
  if (!trimmed) return null

  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i)
  if (match12) {
    let hours = parseInt(match12[1], 10)
    const minutes = parseInt(match12[2], 10)
    const meridiem = match12[3].toUpperCase()
    if (meridiem === 'PM' && hours < 12) hours += 12
    if (meridiem === 'AM' && hours === 12) hours = 0
    return hours * 60 + minutes
  }

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

/**
 * Converts minutes from midnight (0-1439) to 24-hour "HH:mm" string.
 */
export const minutesToTime24 = (mins: number): string => {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

/**
 * Formats any time string or 24h string into clean 12-hour format with AM/PM.
 */
export const formatTimeTo12Hour = (timeStr: string | null | undefined, fallback: string = ''): string => {
  if (!timeStr) return fallback
  return time24ToString(timeStr, fallback)
}

export interface BranchTimeBounds {
  openingMins: number
  closingMins: number
  formattedOpen: string
  formattedClose: string
}

/**
 * Dynamically resolves opening and closing time bounds.
 * - When a specific branch is selected: uses that branch's configured opening and closing times.
 * - When no branch is selected: uses the earliest opening time and the latest closing time across all branches.
 */
export const getBranchTimeBounds = (
  branch: Branch | null | undefined,
  allBranches: Branch[]
): BranchTimeBounds => {
  if (branch) {
    const openingMins = parseTimeToMinutes(branch.opening_time) ?? 540 // Default 09:00 AM
    const closingMins = parseTimeToMinutes(branch.closing_time) ?? 1020 // Default 05:00 PM
    return {
      openingMins,
      closingMins,
      formattedOpen: time24ToString(minutesToTime24(openingMins), '09:00 AM'),
      formattedClose: time24ToString(minutesToTime24(closingMins), '05:00 PM'),
    }
  }

  // When no branch is selected:
  // Consider open branches if any are open, otherwise all branches in DB
  const candidateBranches =
    allBranches && allBranches.length > 0
      ? allBranches.filter((b) => b.is_open).length > 0
        ? allBranches.filter((b) => b.is_open)
        : allBranches
      : []

  if (candidateBranches.length > 0) {
    const openings = candidateBranches.map((b) => parseTimeToMinutes(b.opening_time) ?? 540)
    const closings = candidateBranches.map((b) => parseTimeToMinutes(b.closing_time) ?? 1020)
    const minOpen = Math.min(...openings)
    const maxClose = Math.max(...closings)

    return {
      openingMins: minOpen,
      closingMins: maxClose,
      formattedOpen: time24ToString(minutesToTime24(minOpen), '09:00 AM'),
      formattedClose: time24ToString(minutesToTime24(maxClose), '10:00 PM'),
    }
  }

  return {
    openingMins: 540,
    closingMins: 1320, // 10:00 PM
    formattedOpen: '09:00 AM',
    formattedClose: '10:00 PM',
  }
}

export interface TimeSlotOption {
  value: string
  label: string
  isPast: boolean
}

/**
 * Generates 30-minute interval time slots in 12-hour AM/PM format
 * between the given opening and closing bounds.
 * Past slots for today are flagged with `isPast: true`.
 */
export const generateAvailableTimeSlots = (
  bounds: BranchTimeBounds,
  date: string,
  todayString: string,
  currentMinutes?: number
): TimeSlotOption[] => {
  const slots: TimeSlotOption[] = []
  const isToday = date === todayString
  const now = new Date()
  const nowMins = currentMinutes !== undefined ? currentMinutes : now.getHours() * 60 + now.getMinutes()

  for (let m = bounds.openingMins; m <= bounds.closingMins; m += 30) {
    const time12 = time24ToString(minutesToTime24(m))
    const isPast = isToday && m < nowMins
    slots.push({
      value: time12,
      label: isPast ? `${time12} (Passed)` : time12,
      isPast,
    })
  }

  return slots
}

/**
 * Validates whether a time string is a valid 12-hour or 24-hour time representation.
 */
export const isValidTimeString = (timeStr: string | null | undefined): boolean => {
  if (!timeStr) return false
  const trimmed = timeStr.trim()
  if (!trimmed) return false

  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i)
  if (match12) {
    const hours = parseInt(match12[1], 10)
    const mins = parseInt(match12[2], 10)
    return hours >= 1 && hours <= 12 && mins >= 0 && mins <= 59
  }

  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/)
  if (match24) {
    const hours = parseInt(match24[1], 10)
    const mins = parseInt(match24[2], 10)
    return hours >= 0 && hours <= 23 && mins >= 0 && mins <= 59
  }

  return false
}

/**
 * Safely extracts the day of the week (Monday - Sunday) from a Date object or "YYYY-MM-DD" string.
 */
export const getDayOfWeek = (dateInput?: string | Date | null): DayOfWeek => {
  const dayNames: DayOfWeek[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  if (!dateInput) {
    const d = new Date()
    return dayNames[d.getDay()]
  }

  if (typeof dateInput === 'string') {
    const parts = dateInput.trim().split('-')
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10) - 1
      const day = parseInt(parts[2], 10)
      const d = new Date(year, month, day)
      if (!isNaN(d.getTime())) {
        return dayNames[d.getDay()]
      }
    }
  }

  const d = new Date(dateInput)
  if (!isNaN(d.getTime())) {
    return dayNames[d.getDay()]
  }

  return dayNames[new Date().getDay()]
}

/**
 * Checks if a doctor is available overall.
 * Single canonical source of truth for overall doctor availability status.
 */
export const isDoctorAvailable = (doc: Doctor | null | undefined): boolean => {
  if (!doc) return false
  return Boolean(doc.available)
}

/**
 * Extracts a doctor's weekly branch schedule from doctor_schedule rows.
 * Falls back to DEFAULT_WEEKLY_SCHEDULES if no custom weekly rows are present.
 */
export const getDoctorWeeklySchedule = (
  doctorId: number,
  schedules: DoctorSchedule[]
): Record<DayOfWeek, string> => {
  const fallback = DEFAULT_WEEKLY_SCHEDULES[doctorId] || {
    Monday: 'Palasa',
    Tuesday: 'Palasa',
    Wednesday: 'Sompeta',
    Thursday: 'Sompeta',
    Friday: 'Ichapuram',
    Saturday: 'Palasa',
    Sunday: 'Off',
  }

  const result: Record<DayOfWeek, string> = { ...fallback }

  for (const day of DAYS_OF_WEEK) {
    const key = `weekly_${day}`.toLowerCase()
    const found = schedules.find(
      (s) => s.doctor_id === doctorId && s.branch_name.trim().toLowerCase() === key
    )
    if (found) {
      if (!found.is_available || found.start_time?.trim().toLowerCase() === 'off') {
        result[day] = 'Off'
      } else if (found.start_time) {
        result[day] = found.start_time.trim()
      }
    }
  }

  return result
}

/**
 * Gets the assigned branch of a doctor for a given date / day of the week.
 */
export const getDoctorBranchForDate = (
  doc: Doctor | null | undefined,
  date: string | Date | undefined,
  schedules: DoctorSchedule[]
): string => {
  if (!doc) return 'Palasa'
  const day = getDayOfWeek(date)
  const weekly = getDoctorWeeklySchedule(doc.id, schedules)
  return weekly[day] || doc.current_branch || 'Palasa'
}

/**
 * Gets the current/today's branch of a doctor.
 */
export const getDoctorCurrentBranch = (
  doc: Doctor | null | undefined,
  schedules?: DoctorSchedule[],
  date?: string | Date
): string => {
  if (!doc) return 'Palasa'
  if (schedules && schedules.length > 0) {
    const branchForDate = getDoctorBranchForDate(doc, date || new Date(), schedules)
    if (branchForDate && branchForDate !== 'Off') {
      return branchForDate
    }
  }
  return doc.current_branch?.trim() || 'Palasa'
}

/**
 * Checks if a doctor is available at a specific branch on a specific date.
 *
 * Rules:
 * 1. If Doctor Status = UNAVAILABLE / OFF-DUTY:
 *    Returns false for ALL branches on ALL dates.
 * 2. If Doctor Status = AVAILABLE:
 *    Returns true ONLY IF the doctor's weekly branch assignment for that date matches branchName (and is not 'Off').
 * 3. If branches list is provided and target branch is closed (is_open === false):
 *    Returns false.
 */
export const isDoctorAvailableOnDate = (
  doc: Doctor | null | undefined,
  date: string | Date | undefined,
  branchName: string,
  schedules: DoctorSchedule[],
  branches?: Branch[]
): boolean => {
  if (!isDoctorAvailable(doc)) {
    return false
  }

  const assignedBranch = getDoctorBranchForDate(doc, date, schedules)
  if (assignedBranch.toLowerCase() === 'off') {
    return false
  }

  if (assignedBranch.trim().toLowerCase() !== branchName.trim().toLowerCase()) {
    return false
  }

  if (branches && branches.length > 0) {
    const branchObj = branches.find(
      (b) => b.name.trim().toLowerCase() === branchName.trim().toLowerCase()
    )
    if (branchObj && !branchObj.is_open) {
      return false
    }
  }

  return true
}

/**
 * Checks if a doctor is available at a specific branch today (backward compatibility helper).
 */
export const isDoctorBranchAvailable = (
  doc: Doctor | null | undefined,
  branchName: string,
  branches?: Branch[],
  schedules?: DoctorSchedule[]
): boolean => {
  return isDoctorAvailableOnDate(doc, new Date(), branchName, schedules || [], branches)
}

/**
 * Returns all senior doctors who are available at a specific branch on a specific date.
 */
export const getAvailableDoctorsForBranchAndDate = (
  branchName: string,
  date: string | Date | undefined,
  doctors: Doctor[],
  schedules: DoctorSchedule[],
  branches?: Branch[]
): Doctor[] => {
  if (!branchName) return []
  return doctors.filter((doc) =>
    isDoctorAvailableOnDate(doc, date, branchName, schedules, branches)
  )
}

export interface DoctorBranchScheduleInfo {
  is_available: boolean
  start_time: string
  end_time: string
  scheduleRow: DoctorSchedule | null
}

/**
 * Gets effective schedule details for a doctor at a given branch.
 */
export const getDoctorBranchSchedule = (
  doctorId: number,
  branchName: string,
  doc: Doctor | null | undefined,
  schedules: DoctorSchedule[],
  branches?: Branch[],
  date?: string | Date
): DoctorBranchScheduleInfo => {
  const scheduleRow =
    schedules.find(
      (s) =>
        s.doctor_id === doctorId &&
        s.branch_name.trim().toLowerCase() === branchName.trim().toLowerCase()
    ) || null

  const is_available = isDoctorAvailableOnDate(
    doc,
    date || new Date(),
    branchName,
    schedules,
    branches
  )
  const rawStart = scheduleRow?.start_time?.trim() || '09:00 AM'
  const rawEnd = scheduleRow?.end_time?.trim() || '05:00 PM'

  return {
    is_available,
    start_time: time24ToString(rawStart, '09:00 AM'),
    end_time: time24ToString(rawEnd, '05:00 PM'),
    scheduleRow,
  }
}

export interface AvailableDoctorBranchOption {
  name: string
  isAvailable: boolean
  startTime: string
  endTime: string
  branchInfo: Branch | null
  schedule: DoctorSchedule | null
}

/**
 * Gets the list of branches where the doctor is available for a given date.
 */
export const getDoctorAvailableBranches = (
  doc: Doctor | null | undefined,
  branches: Branch[],
  schedules: DoctorSchedule[],
  date?: string | Date
): AvailableDoctorBranchOption[] => {
  if (!isDoctorAvailable(doc)) {
    return []
  }

  const assignedBranch = getDoctorBranchForDate(doc, date || new Date(), schedules)
  if (assignedBranch.toLowerCase() === 'off') {
    return []
  }

  const branchInfo =
    branches.find((b) => b.name.trim().toLowerCase() === assignedBranch.toLowerCase()) || null

  // If branch is closed, doctor cannot be booked at that branch
  if (branchInfo && !branchInfo.is_open) {
    return []
  }

  const schedInfo = getDoctorBranchSchedule(
    doc!.id,
    assignedBranch,
    doc,
    schedules,
    branches,
    date
  )

  return [
    {
      name: assignedBranch,
      isAvailable: schedInfo.is_available,
      startTime: schedInfo.start_time,
      endTime: schedInfo.end_time,
      branchInfo,
      schedule: schedInfo.scheduleRow,
    },
  ]
}

