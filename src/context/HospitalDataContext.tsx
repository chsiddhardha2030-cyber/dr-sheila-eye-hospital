import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
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

      if (data && data.length > 0) {
        setDoctors((prev) =>
          prev.map((doc) => (doc.id === id ? { ...doc, ...(data[0] as Doctor) } : doc))
        )
      } else {
        setDoctors((prev) =>
          prev.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc))
        )
      }
      return { success: true }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update doctor'
      return { success: false, error: msg }
    }
  }

  const updateBranch = async (id: number, updates: BranchUpdate) => {
    try {
      const { data, error: updateErr } = await supabase
        .from('branches')
        .update(updates)
        .eq('id', id)
        .select()

      if (updateErr) throw updateErr

      if (data && data.length > 0) {
        setBranches((prev) =>
          prev.map((br) => (br.id === id ? { ...br, ...(data[0] as Branch) } : br))
        )
      } else {
        setBranches((prev) =>
          prev.map((br) => (br.id === id ? { ...br, ...updates } : br))
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
      const existing = schedules.find(
        (s) => s.doctor_id === doctorId && s.branch_name.toLowerCase() === branchName.toLowerCase()
      )

      if (existing) {
        const { data, error: updateErr } = await supabase
          .from('doctor_schedule')
          .update(updates)
          .eq('id', existing.id)
          .select()

        if (updateErr) throw updateErr

        if (data && data.length > 0) {
          setSchedules((prev) =>
            prev.map((s) => (s.id === existing.id ? { ...s, ...(data[0] as DoctorSchedule) } : s))
          )
        } else {
          setSchedules((prev) =>
            prev.map((s) => (s.id === existing.id ? { ...s, ...updates } : s))
          )
        }
      } else {
        const newRow: DoctorScheduleInsert = {
          doctor_id: doctorId,
          branch_name: branchName,
          is_available: updates.is_available ?? false,
          start_time: updates.start_time ?? '09:00 AM',
          end_time: updates.end_time ?? '05:00 PM',
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
