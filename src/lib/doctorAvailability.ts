import type { Doctor, Branch, DoctorSchedule } from './database.types'

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
 * Checks if a doctor is available overall.
 * Single canonical source of truth for overall doctor availability.
 */
export const isDoctorAvailable = (doc: Doctor | null | undefined): boolean => {
  if (!doc) return false
  return Boolean(doc.available)
}

/**
 * Gets the current/stationed branch of a doctor, normalized and trimmed.
 * Default fallback is 'Palasa' if none specified.
 */
export const getDoctorCurrentBranch = (doc: Doctor | null | undefined): string => {
  if (!doc || !doc.current_branch) return 'Palasa'
  const trimmed = doc.current_branch.trim()
  return trimmed || 'Palasa'
}

/**
 * Checks if a doctor is available at a specific branch based on the strict hierarchy:
 * Doctor Overall Status -> Current/Selected Branch -> Optional Branch Open Status
 *
 * Rules:
 * 1. If Doctor Status = UNAVAILABLE / OFF-DUTY:
 *    ALL branches are immediately false (Unavailable).
 * 2. If Doctor Status = AVAILABLE:
 *    ONLY the current/selected branch is true (Available). All other branches are false.
 * 3. If branches list is provided and the target branch is closed (is_open === false):
 *    Branch is false (Unavailable).
 */
export const isDoctorBranchAvailable = (
  doc: Doctor | null | undefined,
  branchName: string,
  branches?: Branch[]
): boolean => {
  if (!isDoctorAvailable(doc)) {
    return false
  }
  const currentBranch = getDoctorCurrentBranch(doc)
  if (currentBranch.toLowerCase() !== branchName.trim().toLowerCase()) {
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

export interface DoctorBranchScheduleInfo {
  is_available: boolean
  start_time: string
  end_time: string
  scheduleRow: DoctorSchedule | null
}

/**
 * Gets effective schedule details for a doctor at a given branch.
 * Timings come from doctor_schedule (or standard fallback '09:00 AM' - '05:00 PM').
 * Availability strictly obeys doctor's overall status, current branch hierarchy, and branch status.
 */
export const getDoctorBranchSchedule = (
  doctorId: number,
  branchName: string,
  doc: Doctor | null | undefined,
  schedules: DoctorSchedule[],
  branches?: Branch[]
): DoctorBranchScheduleInfo => {
  const scheduleRow =
    schedules.find(
      (s) =>
        s.doctor_id === doctorId &&
        s.branch_name.trim().toLowerCase() === branchName.trim().toLowerCase()
    ) || null

  const is_available = isDoctorBranchAvailable(doc, branchName, branches)
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
 * Gets the list of branches where the doctor is currently available for booking/consultation.
 * If Doctor is Unavailable -> returns [] (0 available branches).
 * If Doctor is Available -> returns ONLY the current branch option with its schedule (if branch is open).
 */
export const getDoctorAvailableBranches = (
  doc: Doctor | null | undefined,
  branches: Branch[],
  schedules: DoctorSchedule[]
): AvailableDoctorBranchOption[] => {
  if (!isDoctorAvailable(doc)) {
    return []
  }

  const currentBranch = getDoctorCurrentBranch(doc)
  const branchInfo =
    branches.find((b) => b.name.trim().toLowerCase() === currentBranch.toLowerCase()) || null

  // If branch is closed, doctor cannot be booked at that branch
  if (branchInfo && !branchInfo.is_open) {
    return []
  }

  const schedInfo = getDoctorBranchSchedule(doc!.id, currentBranch, doc, schedules, branches)

  return [
    {
      name: currentBranch,
      isAvailable: schedInfo.is_available,
      startTime: schedInfo.start_time,
      endTime: schedInfo.end_time,
      branchInfo,
      schedule: schedInfo.scheduleRow,
    },
  ]
}
