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
      profiles: {
        Row: {
          id: string
          user_id: string
          email: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          category: string
          image_url: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          category: string
          image_url: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          category?: string
          image_url?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: string
          total: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          status?: string
          total: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          total?: number
          created_at?: string
          updated_at?: string | null
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
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