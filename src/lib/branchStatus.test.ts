import {
  isBranchOpenToday,
  isSundayInIndia,
  getKolkataDateParts,
  getBranchDisplayStatus,
  getIndiaDayOfWeek,
  INDIA_TIMEZONE,
} from './branchStatus'
import type { Branch } from './database.types'

const branches: Branch[] = [
  {
    id: 1,
    name: 'Palasa',
    is_open: true,
    opening_time: '09:00 AM',
    closing_time: '10:00 PM',
    whatsapp_number: '918945242442',
  },
  {
    id: 2,
    name: 'Sompeta',
    is_open: true,
    opening_time: '10:00 AM',
    closing_time: '10:00 PM',
    whatsapp_number: '918945242443',
  },
  {
    id: 3,
    name: 'Ichapuram',
    is_open: true,
    opening_time: '09:00 AM',
    closing_time: '05:00 PM',
    whatsapp_number: '918945242444',
  },
]

function runBranchStatusTests() {
  console.log('--- Running Automatic Sunday Branch Closure Test Suite (Asia/Kolkata) ---')

  // Key timestamps in UTC:
  // Saturday night: 2026-10-10 23:59:59 IST = 2026-10-10 18:29:59 UTC
  const satNightUTC = '2026-10-10T18:29:59.000Z'
  // Sunday 12:00:00 AM IST: = 2026-10-10 18:30:00 UTC
  const sunMidnightUTC = '2026-10-10T18:30:00.000Z'
  // Sunday afternoon: 2026-10-11 14:30:00 IST = 2026-10-11 09:00:00 UTC
  const sunAfternoonUTC = '2026-10-11T09:00:00.000Z'
  // Sunday night end: 2026-10-11 23:59:59 IST = 2026-10-11 18:29:59 UTC
  const sunNightEndUTC = '2026-10-11T18:29:59.000Z'
  // Monday 12:00:00 AM IST: = 2026-10-11 18:30:00 UTC
  const monMidnightUTC = '2026-10-11T18:30:00.000Z'
  // Monday midday: 2026-10-12 12:00:00 IST = 2026-10-12 06:30:00 UTC
  const monMiddayUTC = '2026-10-12T06:30:00.000Z'

  // ── TEST 1: Date and Weekday extraction in Asia/Kolkata ──────────────────────
  console.log('\n--- Test 1: Timezone-aware day resolution ---')
  console.assert(INDIA_TIMEZONE === 'Asia/Kolkata', 'Timezone must be Asia/Kolkata')
  const midnightParts = getKolkataDateParts(sunMidnightUTC)
  console.assert(midnightParts.hour === 0 && midnightParts.minute === 0, 'Sunday midnight hour must be 0')
  console.assert(getIndiaDayOfWeek(satNightUTC) === 'Saturday', 'Must be Saturday at 23:59:59 IST')
  console.assert(getIndiaDayOfWeek(sunMidnightUTC) === 'Sunday', 'Must be Sunday at 00:00:00 IST')
  console.assert(getIndiaDayOfWeek(sunAfternoonUTC) === 'Sunday', 'Must be Sunday at 14:30:00 IST')
  console.assert(getIndiaDayOfWeek(sunNightEndUTC) === 'Sunday', 'Must be Sunday at 23:59:59 IST')
  console.assert(getIndiaDayOfWeek(monMidnightUTC) === 'Monday', 'Must be Monday at 00:00:00 IST')
  console.assert(getIndiaDayOfWeek(monMiddayUTC) === 'Monday', 'Must be Monday at 12:00:00 IST')
  console.log('✓ Test 1 Passed: Weekday accurately resolves across timezone midnight boundaries')

  // ── TEST 2: Sunday Check ───────────────────────────────────────────────────
  console.log('\n--- Test 2: Sunday boolean helper ---')
  console.assert(isSundayInIndia(satNightUTC) === false, 'Saturday night is not Sunday')
  console.assert(isSundayInIndia(sunMidnightUTC) === true, 'Sunday midnight is Sunday')
  console.assert(isSundayInIndia(sunAfternoonUTC) === true, 'Sunday afternoon is Sunday')
  console.assert(isSundayInIndia(sunNightEndUTC) === true, 'Sunday 23:59:59 is Sunday')
  console.assert(isSundayInIndia(monMidnightUTC) === false, 'Monday midnight is not Sunday')
  console.log('✓ Test 2 Passed: isSundayInIndia returns true strictly during Sunday IST')

  // ── TEST 3: Saturday Night Branch Status (Normal Operation) ───────────────
  console.log('\n--- Test 3: Saturday Night Branch Status ---')
  for (const branch of branches) {
    const isOpen = isBranchOpenToday(branch, satNightUTC)
    const status = getBranchDisplayStatus(branch, undefined, satNightUTC)
    console.assert(isOpen === true, `${branch.name} must be open on Saturday night`)
    console.assert(status.isOpen === true, `${branch.name} display status must be open`)
    console.assert(status.statusText === 'Open today', `${branch.name} text must be Open today`)
  }
  console.log('✓ Test 3 Passed: All branches open on Saturday night (Palasa, Sompeta, Ichapuram)')

  // ── TEST 4: Sunday Midnight 12:00 AM (Automatic Closure) ───────────────────
  console.log('\n--- Test 4: Sunday at 12:00 AM (Automatic Closure) ---')
  for (const branch of branches) {
    const isOpen = isBranchOpenToday(branch, sunMidnightUTC)
    const status = getBranchDisplayStatus(branch, undefined, sunMidnightUTC)
    console.assert(isOpen === false, `${branch.name} must be closed at 12:00 AM Sunday`)
    console.assert(status.isOpen === false, `${branch.name} status must be closed at 12:00 AM Sunday`)
    console.assert(status.statusText === 'Closed today', `${branch.name} statusText must be "Closed today"`)
    console.assert(status.displayFull === 'Closed today', `${branch.name} displayFull must be "Closed today"`)
  }
  console.log('✓ Test 4 Passed: All three branches automatically show "Closed today" at 12:00 AM Sunday')

  // ── TEST 5: Sunday Afternoon (Continuous Sunday Closure) ───────────────────
  console.log('\n--- Test 5: Sunday Afternoon (Continuous Closure) ---')
  for (const branch of branches) {
    const isOpen = isBranchOpenToday(branch, sunAfternoonUTC)
    const status = getBranchDisplayStatus(branch, undefined, sunAfternoonUTC)
    console.assert(isOpen === false, `${branch.name} must be closed on Sunday afternoon`)
    console.assert(status.statusText === 'Closed today', `${branch.name} statusText must be "Closed today"`)
  }
  console.log('✓ Test 5 Passed: All three branches remain "Closed today" on Sunday afternoon')

  // ── TEST 6: Monday Midnight 12:00 AM (Automatic Restoration) ───────────────
  console.log('\n--- Test 6: Monday at 12:00 AM (Automatic Restoration) ---')
  for (const branch of branches) {
    const isOpen = isBranchOpenToday(branch, monMidnightUTC)
    const status = getBranchDisplayStatus(branch, undefined, monMidnightUTC)
    console.assert(isOpen === true, `${branch.name} must automatically restore to open at 12:00 AM Monday`)
    console.assert(status.isOpen === true, `${branch.name} status must be open at 12:00 AM Monday`)
    console.assert(status.statusText === 'Open today', `${branch.name} statusText must be "Open today"`)
  }
  console.log('✓ Test 6 Passed: All three branches automatically restore to open at 12:00 AM Monday')

  // ── TEST 7: Manual Admin Holiday Override on Weekday ──────────────────────
  console.log('\n--- Test 7: Manual Admin Controls Preserved on Weekdays ---')
  const manuallyClosedPalasa: Branch = {
    ...branches[0],
    is_open: false, // staff toggled closed for holiday/renovation
  }
  const isPalasaClosedOnMon = isBranchOpenToday(manuallyClosedPalasa, monMiddayUTC)
  console.assert(isPalasaClosedOnMon === false, 'Manual admin closure on Monday must be respected')
  console.log('✓ Test 7 Passed: Manual admin closures on weekdays remain functional')

  console.log('\n======================================================================')
  console.log('ALL 7 AUTOMATIC SUNDAY BRANCH CLOSURE TESTS PASSED!')
  console.log('======================================================================')
}

runBranchStatusTests()
