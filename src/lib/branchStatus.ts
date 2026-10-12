import type { Branch } from './database.types'
import type { DayOfWeek } from './doctorAvailability'

export const INDIA_TIMEZONE = 'Asia/Kolkata'

export interface IndiaDateParts {
  year: number
  month: number
  day: number
  weekday: DayOfWeek
  hour: number
  minute: number
  second: number
  dateString: string
}

/**
 * Extracts date parts in India Standard Time (Asia/Kolkata).
 * Works regardless of the visitor's local system timezone.
 */
export const getKolkataDateParts = (
  dateInput?: Date | string | number | null
): IndiaDateParts => {
  let dateObj: Date
  if (dateInput instanceof Date) {
    dateObj = dateInput
  } else if (typeof dateInput === 'string' || typeof dateInput === 'number') {
    dateObj = new Date(dateInput)
  } else {
    dateObj = new Date()
  }

  // Fallback if invalid date
  if (isNaN(dateObj.getTime())) {
    dateObj = new Date()
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: INDIA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const parts = formatter.formatToParts(dateObj)
  const partMap: Record<string, string> = {}
  for (const part of parts) {
    partMap[part.type] = part.value
  }

  const year = parseInt(partMap.year || '2026', 10)
  const month = parseInt(partMap.month || '01', 10)
  const day = parseInt(partMap.day || '01', 10)
  const weekday = (partMap.weekday || 'Monday') as DayOfWeek
  const hour = parseInt(partMap.hour || '0', 10)
  const minute = parseInt(partMap.minute || '0', 10)
  const second = parseInt(partMap.second || '0', 10)

  return {
    year,
    month,
    day,
    weekday,
    hour,
    minute,
    second,
    dateString: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  }
}

/**
 * Checks whether the specified instant is Sunday in India Standard Time (Asia/Kolkata).
 */
export const isSundayInIndia = (
  dateInput?: Date | string | number | null
): boolean => {
  const { weekday } = getKolkataDateParts(dateInput)
  return weekday === 'Sunday'
}

/**
 * Returns the current day of the week in India Standard Time (Asia/Kolkata).
 */
export const getIndiaDayOfWeek = (
  dateInput?: Date | string | number | null
): DayOfWeek => {
  return getKolkataDateParts(dateInput).weekday
}

/**
 * Calculates whether a branch is open on a given date/time in India Standard Time.
 * 
 * Rules:
 * 1. Every Sunday from 12:00 AM to 11:59:59 PM (IST), ALL branches are automatically closed ("Closed today").
 * 2. On Mondays through Saturdays, branch status derives from the branch's configured status (branch.is_open).
 * 3. Does not permanently modify database records or alter weekday/Saturday schedules.
 */
export const isBranchOpenToday = (
  branch: Branch | null | undefined,
  dateInput?: Date | string | number | null
): boolean => {
  if (!branch) return false

  // All branches are closed automatically on Sundays in Asia/Kolkata
  if (isSundayInIndia(dateInput)) {
    return false
  }

  // On weekdays and Saturdays, respect configured branch status (and manual admin control)
  return Boolean(branch.is_open)
}

export interface BranchDisplayStatus {
  isOpen: boolean
  statusText: string
  badgeText: string
  timing: string
  displayFull: string
}

/**
 * Reusable helper providing uniform display text, timings, and open/closed state.
 */
export const getBranchDisplayStatus = (
  branch: Branch | null | undefined,
  defaultHours: string = '09:00 AM – 05:00 PM',
  dateInput?: Date | string | number | null
): BranchDisplayStatus => {
  const isOpen = isBranchOpenToday(branch, dateInput)

  const openTime = branch?.opening_time || '09:00 AM'
  const closeTime = branch?.closing_time || (branch?.name?.toLowerCase() === 'sompeta' ? '10:00 PM' : '05:00 PM')
  const timing = branch?.opening_time && branch?.closing_time
    ? `${openTime} – ${closeTime}`
    : defaultHours

  if (!isOpen) {
    return {
      isOpen: false,
      statusText: 'Closed today',
      badgeText: 'Closed today',
      timing,
      displayFull: 'Closed today',
    }
  }

  return {
    isOpen: true,
    statusText: 'Open today',
    badgeText: 'Open today',
    timing,
    displayFull: `Open today • ${timing}`,
  }
}
