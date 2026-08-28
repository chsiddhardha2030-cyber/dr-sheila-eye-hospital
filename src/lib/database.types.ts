export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      doctors: {
        Row: {
          id: number
          name: string
          current_branch: string | null
          available: boolean
        }
        Insert: {
          id?: number
          name: string
          current_branch?: string | null
          available?: boolean
        }
        Update: {
          id?: number
          name?: string
          current_branch?: string | null
          available?: boolean
        }
        Relationships: []
      }
      branches: {
        Row: {
          id: number
          name: string
          is_open: boolean
          opening_time: string | null
          closing_time: string | null
          whatsapp_number: string | null
        }
        Insert: {
          id?: number
          name: string
          is_open?: boolean
          opening_time?: string | null
          closing_time?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          id?: number
          name?: string
          is_open?: boolean
          opening_time?: string | null
          closing_time?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      doctor_schedule: {
        Row: {
          id: number
          created_at: string
          doctor_id: number
          branch_name: string
          is_available: boolean
          start_time: string | null
          end_time: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          doctor_id: number
          branch_name: string
          is_available?: boolean
          start_time?: string | null
          end_time?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          doctor_id?: number
          branch_name?: string
          is_available?: boolean
          start_time?: string | null
          end_time?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Doctor = Database['public']['Tables']['doctors']['Row']
export type Branch = Database['public']['Tables']['branches']['Row']
export type DoctorSchedule = Database['public']['Tables']['doctor_schedule']['Row']
export type DoctorUpdate = Database['public']['Tables']['doctors']['Update']
export type BranchUpdate = Database['public']['Tables']['branches']['Update']
export type DoctorScheduleUpdate = Database['public']['Tables']['doctor_schedule']['Update']
export type DoctorScheduleInsert = Database['public']['Tables']['doctor_schedule']['Insert']
