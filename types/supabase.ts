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
      chat_messages: {
        Row: {
          id: string
          role: string
          content: string
          timestamp: string
          user_id: string | null
          conversation_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          role: string
          content: string
          timestamp?: string
          user_id?: string | null
          conversation_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          role?: string
          content?: string
          timestamp?: string
          user_id?: string | null
          conversation_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
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
  }
}
