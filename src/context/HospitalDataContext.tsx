import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { time24ToString } from '../lib/doctorAvailability'
import type {
  Doctor,
  Branch,
  DoctorSchedule,
  DoctorUpdate,
  BranchUpdate,
  DoctorScheduleUpdate,
  DoctorScheduleInsert,
} from '../lib/database.types'

interface HospitalDataContextType {
  doctors: Doctor[]
  branches: Branch[]
  schedules: DoctorSchedule[]
  loading: boolean
  error: string | null
  refreshData: () => Promise<void>
  updateDoctor: (id: number, updates: DoctorUpdate) => Promise<{ success: boolean; error?: string }>
  updateBranch: (id: number, updates: BranchUpdate) => Promise<{ success: boolean; error?: string }>
  saveDoctorSchedule: (
    doctorId: number,
    branchName: string,
    updates: DoctorScheduleUpdate
  ) => Promise<{ success: boolean; error?: string }>
  saveDoctorAndSchedule: (
    doctorId: number,
    branchName: string,
    doctorUpdates: { available: boolean; current_branch: string },
    scheduleUpdates: { start_time: string; end_time: string }
  ) => Promise<{ success: boolean; error?: string }>
}

const HospitalDataContext = createContext<HospitalDataContextType | undefined>(undefined)

export const HospitalDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [docsRes, branchRes, schedRes] = await Promise.all([
        supabase.from('doctors').select('*').order('id', { ascending: true }),
        supabase.from('branches').select('*').order('id', { ascending: true }),
        supabase.from('doctor_schedule').select('*').order('id', { ascending: true }),
      ])

      if (docsRes.error) throw docsRes.error
      if (branchRes.error) throw branchRes.error
      if (schedRes.error) throw schedRes.error

      setDoctors((docsRes.data as Doctor[]) || [])
      setBranches((branchRes.data as Branch[]) || [])
      setSchedules((schedRes.data as DoctorSchedule[]) || [])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch hospital data'
      console.error('Error fetching Supabase data:', msg)
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const updateDoctor = async (id: number, updates: DoctorUpdate) => {
    try {
      const { data, error: updateErr } = await supabase
        .from('doctors')
        .update(updates)
        .eq('id', id)
        .select()

      if (updateErr) throw updateErr

      const updatedDoctor: Doctor =
        data && data.length > 0
          ? (data[0] as Doctor)
          : ({
              ...(doctors.find((d) => d.id === id) || { id, name: '', available: false, current_branch: 'Palasa' }),
              ...updates,
            } as Doctor)

      setDoctors((prev) =>
        prev.map((doc) => (doc.id === id ? updatedDoctor : doc))
      )

      // Synchronize doctor_schedule records in Supabase and local state
      const isDocAvail = Boolean(updatedDoctor.available)
      const docBranch = (updatedDoctor.current_branch || 'Palasa').trim().toLowerCase()

      // Update in Supabase for all schedules of this doctor
      const targetSchedules = schedules.filter((s) => s.doctor_id === id)
      for (const sched of targetSchedules) {
        const branchMatches = sched.branch_name.trim().toLowerCase() === docBranch
        const newSchedAvail = isDocAvail && branchMatches
        if (sched.is_available !== newSchedAvail) {
          await supabase
            .from('doctor_schedule')
            .update({ is_available: newSchedAvail })
            .eq('id', sched.id)
        }
      }

      // Update local schedules state
      setSchedules((prev) =>
        prev.map((s) => {
          if (s.doctor_id === id) {
            const branchMatches = s.branch_name.trim().toLowerCase() === docBranch
            return {
              ...s,
              is_available: isDocAvail && branchMatches,
            }
          }
          return s
        })
      )

      return { success: true }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update doctor'
      return { success: false, error: msg }
    }
  }

  const updateBranch = async (id: number, updates: BranchUpdate) => {
    try {
      const sanitizedUpdates: BranchUpdate = { ...updates }
      if (sanitizedUpdates.opening_time) {
        sanitizedUpdates.opening_time = time24ToString(sanitizedUpdates.opening_time, '09:00 AM')
      }
      if (sanitizedUpdates.closing_time) {
        sanitizedUpdates.closing_time = time24ToString(sanitizedUpdates.closing_time, '08:00 PM')
      }

      const { data, error: updateErr } = await supabase
        .from('branches')
        .update(sanitizedUpdates)
        .eq('id', id)
        .select()

      if (updateErr) throw updateErr

      if (data && data.length > 0) {
        setBranches((prev) =>
          prev.map((br) => (br.id === id ? { ...br, ...(data[0] as Branch) } : br))
        )
      } else {
        setBranches((prev) =>
          prev.map((br) => (br.id === id ? { ...br, ...sanitizedUpdates } : br))
        )
      }
      return { success: true }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update branch'
      return { success: false, error: msg }
    }
  }

  const saveDoctorSchedule = async (
    doctorId: number,
    branchName: string,
    updates: DoctorScheduleUpdate
  ) => {
    try {
      const doc = doctors.find((d) => d.id === doctorId)
      const isDocAvail = Boolean(doc && doc.available)
      const docBranch = (doc?.current_branch || 'Palasa').trim().toLowerCase()
      const branchMatches = branchName.trim().toLowerCase() === docBranch
      const effectiveAvailable = isDocAvail && branchMatches

      const existing = schedules.find(
        (s) => s.doctor_id === doctorId && s.branch_name.trim().toLowerCase() === branchName.trim().toLowerCase()
      )

      const payload: DoctorScheduleUpdate = {
        start_time: time24ToString(updates.start_time ?? existing?.start_time, '09:00 AM'),
        end_time: time24ToString(updates.end_time ?? existing?.end_time, '05:00 PM'),
        is_available: effectiveAvailable,
      }

      if (existing) {
        const { data, error: updateErr } = await supabase
          .from('doctor_schedule')
          .update(payload)
          .eq('id', existing.id)
          .select()

        if (updateErr) throw updateErr

        if (data && data.length > 0) {
          setSchedules((prev) =>
            prev.map((s) => (s.id === existing.id ? { ...s, ...(data[0] as DoctorSchedule) } : s))
          )
        } else {
          setSchedules((prev) =>
            prev.map((s) => (s.id === existing.id ? { ...s, ...payload } : s))
          )
        }
      } else {
        const newRow: DoctorScheduleInsert = {
          doctor_id: doctorId,
          branch_name: branchName,
          is_available: effectiveAvailable,
          start_time: payload.start_time ?? '09:00 AM',
          end_time: payload.end_time ?? '05:00 PM',
        }

        const { data, error: insertErr } = await supabase
          .from('doctor_schedule')
          .insert(newRow)
          .select()

        if (insertErr) throw insertErr

        if (data && data.length > 0) {
          setSchedules((prev) => [...prev, data[0] as DoctorSchedule])
        } else {
          setSchedules((prev) => [
            ...prev,
            {
              ...newRow,
              id: Date.now(),
              created_at: new Date().toISOString(),
            } as DoctorSchedule,
          ])
        }
      }

      return { success: true }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save doctor schedule'
      return { success: false, error: msg }
    }
  }

  const saveDoctorAndSchedule = async (
    doctorId: number,
    branchName: string,
    doctorUpdates: { available: boolean; current_branch: string },
    scheduleUpdates: { start_time: string; end_time: string }
  ) => {
    try {
      // 1. Update doctors table in Supabase
      const { data: docData, error: docErr } = await supabase
        .from('doctors')
        .update({
          available: doctorUpdates.available,
          current_branch: doctorUpdates.current_branch,
        })
        .eq('id', doctorId)
        .select()

      if (docErr) throw docErr

      const updatedDoc: Doctor =
        docData && docData.length > 0
          ? (docData[0] as Doctor)
          : ({
              ...(doctors.find((d) => d.id === doctorId) || { id: doctorId, name: '', available: doctorUpdates.available, current_branch: doctorUpdates.current_branch }),
              available: doctorUpdates.available,
              current_branch: doctorUpdates.current_branch,
            } as Doctor)

      setDoctors((prev) =>
        prev.map((d) => (d.id === doctorId ? updatedDoc : d))
      )

      // 2. Normalize timings
      const normalizedStart = time24ToString(scheduleUpdates.start_time, '09:00 AM')
      const normalizedEnd = time24ToString(scheduleUpdates.end_time, '05:00 PM')
      const isDocAvail = Boolean(doctorUpdates.available)
      const selectedBranch = doctorUpdates.current_branch.trim().toLowerCase()

      // 3. Update or Insert doctor_schedule for the targeted branch
      const existing = schedules.find(
        (s) => s.doctor_id === doctorId && s.branch_name.trim().toLowerCase() === branchName.trim().toLowerCase()
      )

      const targetMatchesSelected = branchName.trim().toLowerCase() === selectedBranch
      const targetSchedAvail = isDocAvail && targetMatchesSelected

      if (existing) {
        const { data: schedData, error: schedErr } = await supabase
          .from('doctor_schedule')
          .update({
            start_time: normalizedStart,
            end_time: normalizedEnd,
            is_available: targetSchedAvail,
          })
          .eq('id', existing.id)
          .select()

        if (schedErr) throw schedErr

        setSchedules((prev) =>
          prev.map((s) =>
            s.id === existing.id
              ? {
                  ...s,
                  ...((schedData && schedData[0]) || {}),
                  start_time: normalizedStart,
                  end_time: normalizedEnd,
                  is_available: targetSchedAvail,
                }
              : s
          )
        )
      } else {
        const newRow: DoctorScheduleInsert = {
          doctor_id: doctorId,
          branch_name: branchName,
          is_available: targetSchedAvail,
          start_time: normalizedStart,
          end_time: normalizedEnd,
        }

        const { data: newSchedData, error: newSchedErr } = await supabase
          .from('doctor_schedule')
          .insert(newRow)
          .select()

        if (newSchedErr) throw newSchedErr

        if (newSchedData && newSchedData.length > 0) {
          setSchedules((prev) => [...prev, newSchedData[0] as DoctorSchedule])
        } else {
          setSchedules((prev) => [
            ...prev,
            {
              ...newRow,
              id: Date.now(),
              created_at: new Date().toISOString(),
            } as DoctorSchedule,
          ])
        }
      }

      // 4. Update all other branches for this doctor to is_available: false
      const otherSchedules = schedules.filter(
        (s) => s.doctor_id === doctorId && s.branch_name.trim().toLowerCase() !== branchName.trim().toLowerCase()
      )

      for (const other of otherSchedules) {
        const isOtherAvailable = isDocAvail && other.branch_name.trim().toLowerCase() === selectedBranch
        if (other.is_available !== isOtherAvailable) {
          await supabase
            .from('doctor_schedule')
            .update({ is_available: isOtherAvailable })
            .eq('id', other.id)
        }
      }

      // Update local state for all schedules of this doctor
      setSchedules((prev) =>
        prev.map((s) => {
          if (s.doctor_id === doctorId) {
            const isStation = s.branch_name.trim().toLowerCase() === selectedBranch
            return {
              ...s,
              is_available: isDocAvail && isStation,
              ...(s.branch_name.trim().toLowerCase() === branchName.trim().toLowerCase()
                ? { start_time: normalizedStart, end_time: normalizedEnd }
                : {}),
            }
          }
          return s
        })
      )

      return { success: true }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save doctor and schedule'
      return { success: false, error: msg }
    }
  }

  return (
    <HospitalDataContext.Provider
      value={{
        doctors,
        branches,
        schedules,
        loading,
        error,
        refreshData: fetchData,
        updateDoctor,
        updateBranch,
        saveDoctorSchedule,
        saveDoctorAndSchedule,
      }}
    >
      {children}
    </HospitalDataContext.Provider>
  )
}

export const useHospitalData = () => {
  const context = useContext(HospitalDataContext)
  if (!context) {
    throw new Error('useHospitalData must be used within a HospitalDataProvider')
  }
  return context
}
