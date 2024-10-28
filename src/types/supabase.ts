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
      users: {
        Row: {
          id: string
          employee_code: string
          name: string
          role: 'Doctor' | 'Nurse' | 'Admin'
          password_hash: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_code: string
          name: string
          role: 'Doctor' | 'Nurse' | 'Admin'
          password_hash: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_code?: string
          name?: string
          role?: 'Doctor' | 'Nurse' | 'Admin'
          password_hash?: string
          created_at?: string
          updated_at?: string
        }
      }
      patients: {
        Row: {
          id: string
          mrn: string
          name: string
          age: number
          gender: 'Male' | 'Female' | 'Other'
          diagnosis: string
          bed_number: string
          admission_date: string
          history: string
          examination: string
          notes: string | null
          attending_physician_id: string
          status: 'Stable' | 'Critical' | 'Discharged'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          mrn: string
          name: string
          age: number
          gender: 'Male' | 'Female' | 'Other'
          diagnosis: string
          bed_number: string
          admission_date?: string
          history: string
          examination: string
          notes?: string | null
          attending_physician_id: string
          status: 'Stable' | 'Critical' | 'Discharged'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          mrn?: string
          name?: string
          age?: number
          gender?: 'Male' | 'Female' | 'Other'
          diagnosis?: string
          bed_number?: string
          admission_date?: string
          history?: string
          examination?: string
          notes?: string | null
          attending_physician_id?: string
          status?: 'Stable' | 'Critical' | 'Discharged'
          created_at?: string
          updated_at?: string
        }
      }
      vitals: {
        Row: {
          id: string
          patient_id: string
          heart_rate: number
          blood_pressure: string
          temperature: number
          oxygen_saturation: number
          respiratory_rate: number
          recorded_by: string
          recorded_at: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          heart_rate: number
          blood_pressure: string
          temperature: number
          oxygen_saturation: number
          respiratory_rate: number
          recorded_by: string
          recorded_at?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          heart_rate?: number
          blood_pressure?: string
          temperature?: number
          oxygen_saturation?: number
          respiratory_rate?: number
          recorded_by?: string
          recorded_at?: string
          notes?: string | null
          created_at?: string
        }
      }
      medications: {
        Row: {
          id: string
          patient_id: string
          name: string
          dosage: string
          route: string
          frequency: string
          start_date: string
          end_date: string | null
          status: 'Active' | 'Discontinued' | 'Completed'
          prescribed_by: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          name: string
          dosage: string
          route: string
          frequency: string
          start_date: string
          end_date?: string | null
          status: 'Active' | 'Discontinued' | 'Completed'
          prescribed_by: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          name?: string
          dosage?: string
          route?: string
          frequency?: string
          start_date?: string
          end_date?: string | null
          status?: 'Active' | 'Discontinued' | 'Completed'
          prescribed_by?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      lab_results: {
        Row: {
          id: string
          patient_id: string
          category: string
          test_name: string
          result: string
          unit: string | null
          reference_range: string | null
          status: 'Normal' | 'Abnormal' | 'Critical'
          ordered_by: string
          resulted_at: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          category: string
          test_name: string
          result: string
          unit?: string | null
          reference_range?: string | null
          status: 'Normal' | 'Abnormal' | 'Critical'
          ordered_by: string
          resulted_at?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          category?: string
          test_name?: string
          result?: string
          unit?: string | null
          reference_range?: string | null
          status?: 'Normal' | 'Abnormal' | 'Critical'
          ordered_by?: string
          resulted_at?: string
          notes?: string | null
          created_at?: string
        }
      }
      discharges: {
        Row: {
          id: string
          patient_id: string
          discharge_date: string
          discharge_diagnosis: string
          discharge_summary: string
          discharge_medications: string | null
          follow_up_instructions: string | null
          discharge_condition: 'Improved' | 'Stable' | 'Deteriorated' | 'Deceased'
          discharged_by: string
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          discharge_date: string
          discharge_diagnosis: string
          discharge_summary: string
          discharge_medications?: string | null
          follow_up_instructions?: string | null
          discharge_condition: 'Improved' | 'Stable' | 'Deteriorated' | 'Deceased'
          discharged_by: string
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          discharge_date?: string
          discharge_diagnosis?: string
          discharge_summary?: string
          discharge_medications?: string | null
          follow_up_instructions?: string | null
          discharge_condition?: 'Improved' | 'Stable' | 'Deteriorated' | 'Deceased'
          discharged_by?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          type: 'status' | 'lab' | 'medication' | 'discharge'
          message: string
          severity: 'info' | 'warning' | 'critical'
          user_id: string | null
          patient_id: string | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          type: 'status' | 'lab' | 'medication' | 'discharge'
          message: string
          severity: 'info' | 'warning' | 'critical'
          user_id?: string | null
          patient_id?: string | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          type?: 'status' | 'lab' | 'medication' | 'discharge'
          message?: string
          severity?: 'info' | 'warning' | 'critical'
          user_id?: string | null
          patient_id?: string | null
          read?: boolean
          created_at?: string
        }
      }
    }
  }
}