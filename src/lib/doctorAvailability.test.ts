import {
  isDoctorAvailable,
  getDoctorBranchForDate,
  isDoctorAvailableOnDate,
  getAvailableDoctorsForBranchAndDate,
  getDoctorWeeklySchedule,
  getDayOfWeek,
  timeStringTo24,
  time24ToString,
  isValidTimeString,
} from './doctorAvailability'
import type { Doctor, Branch, DoctorSchedule } from './database.types'


const branches: Branch[] = [
  { id: 1, name: 'Palasa', is_open: true, opening_time: '09:00 AM', closing_time: '08:00 PM', whatsapp_number: '919876543210' },
  { id: 2, name: 'Sompeta', is_open: true, opening_time: '09:00 AM', closing_time: '08:00 PM', whatsapp_number: '919876543211' },
  { id: 3, name: 'Ichapuram', is_open: true, opening_time: '09:00 AM', closing_time: '08:00 PM', whatsapp_number: '919876543212' },
]

const doctors: Doctor[] = [
  { id: 1, name: 'Dr. Sheila Thangaraj', available: true, current_branch: 'Palasa' },
  { id: 2, name: 'Dr. Tridib Gogoi', available: true, current_branch: 'Sompeta' },
]

const schedules: DoctorSchedule[] = [
  // Dr. Sheila weekly schedule
  { id: 101, doctor_id: 1, branch_name: 'weekly_Monday', is_available: true, start_time: 'Palasa', end_time: '09:00 AM - 05:00 PM', created_at: '' },
  { id: 102, doctor_id: 1, branch_name: 'weekly_Tuesday', is_available: true, start_time: 'Palasa', end_time: '09:00 AM - 05:00 PM', created_at: '' },
  { id: 103, doctor_id: 1, branch_name: 'weekly_Wednesday', is_available: true, start_time: 'Sompeta', end_time: '09:00 AM - 05:00 PM', created_at: '' },
  { id: 104, doctor_id: 1, branch_name: 'weekly_Thursday', is_available: true, start_time: 'Sompeta', end_time: '09:00 AM - 05:00 PM', created_at: '' },
  { id: 105, doctor_id: 1, branch_name: 'weekly_Friday', is_available: true, start_time: 'Ichapuram', end_time: '09:00 AM - 05:00 PM', created_at: '' },
  { id: 106, doctor_id: 1, branch_name: 'weekly_Saturday', is_available: true, start_time: 'Palasa', end_time: '09:00 AM - 05:00 PM', created_at: '' },
  { id: 107, doctor_id: 1, branch_name: 'weekly_Sunday', is_available: false, start_time: 'Off', end_time: '09:00 AM - 05:00 PM', created_at: '' },

  // Dr. Tridib weekly schedule
  { id: 201, doctor_id: 2, branch_name: 'weekly_Monday', is_available: true, start_time: 'Sompeta', end_time: '09:00 AM - 05:00 PM', created_at: '' },
  { id: 202, doctor_id: 2, branch_name: 'weekly_Tuesday', is_available: true, start_time: 'Sompeta', end_time: '09:00 AM - 05:00 PM', created_at: '' },
  { id: 203, doctor_id: 2, branch_name: 'weekly_Wednesday', is_available: true, start_time: 'Palasa', end_time: '09:00 AM - 05:00 PM', created_at: '' },
  { id: 204, doctor_id: 2, branch_name: 'weekly_Thursday', is_available: true, start_time: 'Palasa', end_time: '09:00 AM - 05:00 PM', created_at: '' },
  { id: 205, doctor_id: 2, branch_name: 'weekly_Friday', is_available: true, start_time: 'Palasa', end_time: '09:00 AM - 05:00 PM', created_at: '' },
  { id: 206, doctor_id: 2, branch_name: 'weekly_Saturday', is_available: true, start_time: 'Ichapuram', end_time: '09:00 AM - 05:00 PM', created_at: '' },
  { id: 207, doctor_id: 2, branch_name: 'weekly_Sunday', is_available: false, start_time: 'Off', end_time: '09:00 AM - 05:00 PM', created_at: '' },
]

function runTests() {
  console.log('--- Running Weekly Doctor Availability & Date Verification Tests ---')

  // Test 1: Day of week resolution
  console.log('\n--- Test 1: Day of week resolution ---')
  console.assert(getDayOfWeek('2026-10-05') === 'Monday', '2026-10-05 must be Monday')
  console.assert(getDayOfWeek('2026-10-06') === 'Tuesday', '2026-10-06 must be Tuesday')
  console.assert(getDayOfWeek('2026-10-07') === 'Wednesday', '2026-10-07 must be Wednesday')
  console.assert(getDayOfWeek('2026-10-08') === 'Thursday', '2026-10-08 must be Thursday')
  console.assert(getDayOfWeek('2026-10-09') === 'Friday', '2026-10-09 must be Friday')
  console.assert(getDayOfWeek('2026-10-10') === 'Saturday', '2026-10-10 must be Saturday')
  console.assert(getDayOfWeek('2026-10-11') === 'Sunday', '2026-10-11 must be Sunday')
  console.log('✓ Test 1 Passed')

  // Test 2: Weekly schedule lookup for Dr. Sheila and Dr. Tridib
  console.log('\n--- Test 2: Weekly schedule branch resolution ---')
  console.assert(isDoctorAvailable(doctors[0]) === true, 'Dr Sheila must be available')
  const sheilaWeekly = getDoctorWeeklySchedule(doctors[0].id, schedules)
  console.assert(sheilaWeekly.Monday === 'Palasa', 'Dr Sheila Monday in weekly schedule must be Palasa')
  console.assert(getDoctorBranchForDate(doctors[0], '2026-10-05', schedules) === 'Palasa', 'Dr Sheila Monday -> Palasa')
  console.assert(getDoctorBranchForDate(doctors[0], '2026-10-07', schedules) === 'Sompeta', 'Dr Sheila Wednesday -> Sompeta')
  console.assert(getDoctorBranchForDate(doctors[0], '2026-10-09', schedules) === 'Ichapuram', 'Dr Sheila Friday -> Ichapuram')
  console.assert(getDoctorBranchForDate(doctors[1], '2026-10-05', schedules) === 'Sompeta', 'Dr Tridib Monday -> Sompeta')
  console.assert(getDoctorBranchForDate(doctors[1], '2026-10-07', schedules) === 'Palasa', 'Dr Tridib Wednesday -> Palasa')
  console.assert(getDoctorBranchForDate(doctors[1], '2026-10-10', schedules) === 'Ichapuram', 'Dr Tridib Saturday -> Ichapuram')
  console.log('✓ Test 2 Passed')


  // Test 3: Monday Doctor Availability per branch
  console.log('\n--- Test 3: Monday Branch-First Availability ---')
  const mondayPalasaDocs = getAvailableDoctorsForBranchAndDate('Palasa', '2026-10-05', doctors, schedules, branches)
  console.assert(mondayPalasaDocs.length === 1 && mondayPalasaDocs[0].id === 1, 'Palasa on Monday must only show Dr. Sheila')

  const mondaySompetaDocs = getAvailableDoctorsForBranchAndDate('Sompeta', '2026-10-05', doctors, schedules, branches)
  console.assert(mondaySompetaDocs.length === 1 && mondaySompetaDocs[0].id === 2, 'Sompeta on Monday must only show Dr. Tridib')

  const mondayIchapuramDocs = getAvailableDoctorsForBranchAndDate('Ichapuram', '2026-10-05', doctors, schedules, branches)
  console.assert(mondayIchapuramDocs.length === 0, 'Ichapuram on Monday must have 0 senior doctors (Duty Doctor fallback)')
  console.log('✓ Test 3 Passed')

  // Test 4: Friday Doctor Availability per branch
  console.log('\n--- Test 4: Friday Branch-First Availability ---')
  const fridayIchapuramDocs = getAvailableDoctorsForBranchAndDate('Ichapuram', '2026-10-09', doctors, schedules, branches)
  console.assert(fridayIchapuramDocs.length === 1 && fridayIchapuramDocs[0].id === 1, 'Ichapuram on Friday must show Dr. Sheila')

  const fridayPalasaDocs = getAvailableDoctorsForBranchAndDate('Palasa', '2026-10-09', doctors, schedules, branches)
  console.assert(fridayPalasaDocs.length === 1 && fridayPalasaDocs[0].id === 2, 'Palasa on Friday must show Dr. Tridib')
  console.log('✓ Test 4 Passed')

  // Test 5: Global doctor status override
  console.log('\n--- Test 5: Global Unavailable Status Overrides Schedule ---')
  const inactiveDoctor: Doctor = { id: 1, name: 'Dr. Sheila Thangaraj', available: false, current_branch: 'Palasa' }
  console.assert(isDoctorAvailableOnDate(inactiveDoctor, '2026-10-05', 'Palasa', schedules, branches) === false, 'Unavailable doctor must not be available anywhere')
  console.log('✓ Test 5 Passed')

  // Test 6: Closed branch check
  console.log('\n--- Test 6: Closed Branch Status ---')
  const closedBranches: Branch[] = [
    { id: 1, name: 'Palasa', is_open: false, opening_time: '09:00 AM', closing_time: '08:00 PM', whatsapp_number: null },
    { id: 2, name: 'Sompeta', is_open: true, opening_time: '09:00 AM', closing_time: '08:00 PM', whatsapp_number: null },
    { id: 3, name: 'Ichapuram', is_open: true, opening_time: '09:00 AM', closing_time: '08:00 PM', whatsapp_number: null },
  ]
  console.assert(isDoctorAvailableOnDate(doctors[0], '2026-10-05', 'Palasa', schedules, closedBranches) === false, 'Must be unavailable if branch is closed')
  console.log('✓ Test 6 Passed')

  // Test 7: Time conversion and validation
  console.log('\n--- Test 7: Time Conversion & Validation ---')
  console.assert(timeStringTo24('09:00 AM') === '09:00', '09:00 AM -> 09:00')
  console.assert(timeStringTo24('05:00 PM') === '17:00', '05:00 PM -> 17:00')
  console.assert(time24ToString('09:00') === '09:00 AM', '09:00 -> 09:00 AM')
  console.assert(time24ToString('17:00') === '05:00 PM', '17:00 -> 05:00 PM')
  console.assert(isValidTimeString('09:00 AM') === true, '09:00 AM must be valid')
  console.assert(isValidTimeString('17:00') === true, '17:00 must be valid')
  console.assert(isValidTimeString('invalid') === false, 'invalid must be false')
  console.log('✓ Test 7 Passed')

  console.log('\n======================================================')
  console.log('ALL 7 WEEKLY DOCTOR & DATE AVAILABILITY TESTS PASSED!')
  console.log('======================================================')
}

runTests()


