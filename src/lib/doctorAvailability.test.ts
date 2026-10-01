import {
  isDoctorAvailable,
  getDoctorCurrentBranch,
  isDoctorBranchAvailable,
  getDoctorBranchSchedule,
  getDoctorAvailableBranches,
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

const schedules: DoctorSchedule[] = [
  { id: 1, doctor_id: 1, branch_name: 'Palasa', is_available: true, start_time: '09:00 AM', end_time: '01:00 PM', created_at: '' },
  { id: 2, doctor_id: 1, branch_name: 'Sompeta', is_available: false, start_time: '02:00 PM', end_time: '05:00 PM', created_at: '' },
  { id: 3, doctor_id: 1, branch_name: 'Ichapuram', is_available: false, start_time: '09:30 AM', end_time: '04:30 PM', created_at: '' },
]

function runTests() {
  console.log('--- Running Doctor Availability & Time Conversion Verification Tests ---')

  // Test 1: Doctor Status -> Unavailable, Current Branch -> Palasa
  console.log('\n--- Test 1: Doctor Unavailable, Current Branch Palasa ---')
  const doc1: Doctor = { id: 1, name: 'Dr. Sheila Thangaraj', available: false, current_branch: 'Palasa' }
  console.assert(isDoctorAvailable(doc1) === false, 'Doctor overall must be false')
  console.assert(isDoctorBranchAvailable(doc1, 'Palasa') === false, 'Palasa must be false')
  console.assert(isDoctorBranchAvailable(doc1, 'Sompeta') === false, 'Sompeta must be false')
  console.assert(isDoctorBranchAvailable(doc1, 'Ichapuram') === false, 'Ichapuram must be false')
  console.assert(getDoctorAvailableBranches(doc1, branches, schedules).length === 0, 'Booking must have 0 branches')
  console.log('✓ Test 1 Passed')

  // Test 2: Doctor Status -> Available, Current Branch -> Palasa
  console.log('\n--- Test 2: Doctor Available, Current Branch Palasa ---')
  const doc2: Doctor = { id: 1, name: 'Dr. Sheila Thangaraj', available: true, current_branch: 'Palasa' }
  console.assert(isDoctorAvailable(doc2) === true, 'Doctor overall must be true')
  console.assert(isDoctorBranchAvailable(doc2, 'Palasa') === true, 'Palasa must be true')
  console.assert(isDoctorBranchAvailable(doc2, 'Sompeta') === false, 'Sompeta must be false')
  console.assert(isDoctorBranchAvailable(doc2, 'Ichapuram') === false, 'Ichapuram must be false')
  const avail2 = getDoctorAvailableBranches(doc2, branches, schedules)
  console.assert(avail2.length === 1 && avail2[0].name === 'Palasa', 'Booking must show only Palasa')
  console.log('✓ Test 2 Passed')

  // Test 3: Change Current Branch -> Sompeta
  console.log('\n--- Test 3: Doctor Available, Current Branch Sompeta ---')
  const doc3: Doctor = { id: 1, name: 'Dr. Sheila Thangaraj', available: true, current_branch: 'Sompeta' }
  console.assert(isDoctorAvailable(doc3) === true, 'Doctor overall must be true')
  console.assert(isDoctorBranchAvailable(doc3, 'Palasa') === false, 'Palasa must be false')
  console.assert(isDoctorBranchAvailable(doc3, 'Sompeta') === true, 'Sompeta must be true')
  console.assert(isDoctorBranchAvailable(doc3, 'Ichapuram') === false, 'Ichapuram must be false')
  const avail3 = getDoctorAvailableBranches(doc3, branches, schedules)
  console.assert(avail3.length === 1 && avail3[0].name === 'Sompeta', 'Booking must show only Sompeta')
  console.log('✓ Test 3 Passed')

  // Test 4: Change Current Branch -> Ichapuram
  console.log('\n--- Test 4: Doctor Available, Current Branch Ichapuram ---')
  const doc4: Doctor = { id: 1, name: 'Dr. Sheila Thangaraj', available: true, current_branch: 'Ichapuram' }
  console.assert(isDoctorAvailable(doc4) === true, 'Doctor overall must be true')
  console.assert(isDoctorBranchAvailable(doc4, 'Palasa') === false, 'Palasa must be false')
  console.assert(isDoctorBranchAvailable(doc4, 'Sompeta') === false, 'Sompeta must be false')
  console.assert(isDoctorBranchAvailable(doc4, 'Ichapuram') === true, 'Ichapuram must be true')
  const avail4 = getDoctorAvailableBranches(doc4, branches, schedules)
  console.assert(avail4.length === 1 && avail4[0].name === 'Ichapuram', 'Booking must show only Ichapuram')
  console.log('✓ Test 4 Passed')

  // Test 5: While doctor is Available, change overall Doctor Status -> Unavailable
  console.log('\n--- Test 5: Doctor changed to Unavailable ---')
  const doc5: Doctor = { id: 1, name: 'Dr. Sheila Thangaraj', available: false, current_branch: 'Ichapuram' }
  console.assert(isDoctorAvailable(doc5) === false, 'Doctor overall must be false')
  console.assert(isDoctorBranchAvailable(doc5, 'Palasa') === false, 'Palasa must be false')
  console.assert(isDoctorBranchAvailable(doc5, 'Sompeta') === false, 'Sompeta must be false')
  console.assert(isDoctorBranchAvailable(doc5, 'Ichapuram') === false, 'Ichapuram must be false')
  const avail5 = getDoctorAvailableBranches(doc5, branches, schedules)
  console.assert(avail5.length === 0, 'Booking must show 0 branches')
  console.log('✓ Test 5 Passed')

  // Test 6: Branch closed check
  console.log('\n--- Test 6: Doctor Available, but Branch is Closed ---')
  const branchesWithClosed: Branch[] = [
    { id: 1, name: 'Palasa', is_open: true, opening_time: '09:00 AM', closing_time: '08:00 PM', whatsapp_number: null },
    { id: 2, name: 'Sompeta', is_open: false, opening_time: '09:00 AM', closing_time: '08:00 PM', whatsapp_number: null },
    { id: 3, name: 'Ichapuram', is_open: true, opening_time: '09:00 AM', closing_time: '08:00 PM', whatsapp_number: null },
  ]
  const docSompeta: Doctor = { id: 1, name: 'Dr. Sheila Thangaraj', available: true, current_branch: 'Sompeta' }
  console.assert(isDoctorBranchAvailable(docSompeta, 'Sompeta', branchesWithClosed) === false, 'Must be unavailable if Sompeta branch is closed')
  console.assert(getDoctorAvailableBranches(docSompeta, branchesWithClosed, schedules).length === 0, 'Booking branches must be empty if branch is closed')
  console.log('✓ Test 6 Passed')

  // Test 7: Time conversion and validation
  console.log('\n--- Test 7: Time Conversion & Validation ---')
  console.assert(timeStringTo24('09:00 AM') === '09:00', '09:00 AM -> 09:00')
  console.assert(timeStringTo24('05:00 PM') === '17:00', '05:00 PM -> 17:00')
  console.assert(timeStringTo24('08:30 PM') === '20:30', '08:30 PM -> 20:30')
  console.assert(time24ToString('09:00') === '09:00 AM', '09:00 -> 09:00 AM')
  console.assert(time24ToString('17:00') === '05:00 PM', '17:00 -> 05:00 PM')
  console.assert(time24ToString('20:30') === '08:30 PM', '20:30 -> 08:30 PM')
  console.assert(isValidTimeString('09:00 AM') === true, '09:00 AM must be valid')
  console.assert(isValidTimeString('17:00') === true, '17:00 must be valid')
  console.assert(isValidTimeString('abcd') === false, 'abcd must be invalid')
  console.assert(isValidTimeString('10abc') === false, '10abc must be invalid')
  // Test 8: getDoctorCurrentBranch and getDoctorBranchSchedule
  console.log('\n--- Test 8: Schedule and Branch Helpers ---')
  console.assert(getDoctorCurrentBranch(docSompeta) === 'Sompeta', 'Current branch should be Sompeta')
  const sched = getDoctorBranchSchedule(1, 'Palasa', doc2, schedules, branches)
  console.assert(sched.is_available === true, 'Palasa schedule is available')
  console.assert(sched.start_time === '09:00 AM', 'Start time is 09:00 AM')
  console.log('✓ Test 8 Passed')

  console.log('\n=========================================')
  console.log('ALL 8 AVAILABILITY & TIME TESTS PASSED!')
  console.log('=========================================')
}

runTests()

