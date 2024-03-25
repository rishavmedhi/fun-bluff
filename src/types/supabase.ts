export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      game: {
        Row: {
          created_at: string
          id: number
          room_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          room_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          room_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_game_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room"
            referencedColumns: ["id"]
          },
        ]
      }
      game_question_mapping: {
        Row: {
          created_at: string
          game_id: number | null
          id: number
          question_id: number | null
        }
        Insert: {
          created_at?: string
          game_id?: number | null
          id?: number
          question_id?: number | null
        }
        Update: {
          created_at?: string
          game_id?: number | null
          id?: number
          question_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_game_question_mapping_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "game"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_game_question_mapping_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          created_at: string
          id: number
          question: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          question?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          question?: string | null
        }
        Relationships: []
      }
      room: {
        Row: {
          created_at: string
          id: number
          room_code: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          room_code?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          room_code?: string | null
        }
        Relationships: []
      }
      room_user_mapping: {
        Row: {
          created_at: string
          id: number
          room_id: number | null
          user_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          room_id?: number | null
          user_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          room_id?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_room_user_mapping_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_room_user_mapping_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      user: {
        Row: {
          created_at: string
          device_id: string
          id: number
          user_name: string
        }
        Insert: {
          created_at?: string
          device_id: string
          id?: number
          user_name: string
        }
        Update: {
          created_at?: string
          device_id?: string
          id?: number
          user_name?: string
        }
        Relationships: []
      }
      user_answers: {
        Row: {
          created_at: string
          id: number
          option_id: number | null
          question_id: number | null
          user_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          option_id?: number | null
          question_id?: number | null
          user_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          option_id?: number | null
          question_id?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_user_answers_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "user_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_user_answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      user_options: {
        Row: {
          created_at: string
          game_id: number | null
          id: number
          ques_id: number | null
          user_id: number | null
          user_option: string | null
        }
        Insert: {
          created_at?: string
          game_id?: number | null
          id?: number
          ques_id?: number | null
          user_id?: number | null
          user_option?: string | null
        }
        Update: {
          created_at?: string
          game_id?: number | null
          id?: number
          ques_id?: number | null
          user_id?: number | null
          user_option?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_user_options_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "game"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_user_options_ques_id_fkey"
            columns: ["ques_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_user_options_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
