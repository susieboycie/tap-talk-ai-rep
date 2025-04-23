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
      cluster_details: {
        Row: {
          consumption_behavior: string | null
          id: string | null
          key_occasions: string | null
          location_type: string | null
          name: string
          nsv_percent: string | null
          price_tier: string | null
          product_focus: string | null
          universe_percent: string | null
          venue_description: string | null
        }
        Insert: {
          consumption_behavior?: string | null
          id?: string | null
          key_occasions?: string | null
          location_type?: string | null
          name: string
          nsv_percent?: string | null
          price_tier?: string | null
          product_focus?: string | null
          universe_percent?: string | null
          venue_description?: string | null
        }
        Update: {
          consumption_behavior?: string | null
          id?: string | null
          key_occasions?: string | null
          location_type?: string | null
          name?: string
          nsv_percent?: string | null
          price_tier?: string | null
          product_focus?: string | null
          universe_percent?: string | null
          venue_description?: string | null
        }
        Relationships: []
      }
      daily_sales_volume: {
        Row: {
          Calendar_day: string | null
          Calendar_Year: number | null
          "Carlsberg_0.0_In_Keg_MTD_Billed": number | null
          Carlsberg_Lager_In_Keg_MTD_Billed: number | null
          Cluster: string | null
          Country: string | null
          "Guinness_Draught_0.0_in_Keg_MTD_Billed": number | null
          Guinness_Draught_In_Keg_MTD_Billed: number | null
          Guinness_Mid_Strength_In_Keg_MTD_Billed: number | null
          Harp_In_Keg_MTD_Billed: number | null
          Hop_House_13_Lager_MTD_Billed: number | null
          Kilkenny_Draught_In_Keg_MTD_Billed: number | null
          Magners_in_Keg_MTD_Billed: number | null
          OGB_Citra_IPA_in_Keg_MTD_Billed: number | null
          Outlet: string | null
          prim_key: number | null
          Rockshore_Apple_Cider_in_Keg_MTD_Billed: number | null
          Rockshore_in_Keg_MTD_Billed: number | null
          Smithwicks_In_Keg_MTD_Billed: number | null
          Smithwicks_Pale_Ale_in_Keg_MTD_Billed: number | null
          Strongbow_In_Keg_MTD_Billed: number | null
          Tuborg_Lager_in_Keg_MTD_Billed: number | null
        }
        Insert: {
          Calendar_day?: string | null
          Calendar_Year?: number | null
          "Carlsberg_0.0_In_Keg_MTD_Billed"?: number | null
          Carlsberg_Lager_In_Keg_MTD_Billed?: number | null
          Cluster?: string | null
          Country?: string | null
          "Guinness_Draught_0.0_in_Keg_MTD_Billed"?: number | null
          Guinness_Draught_In_Keg_MTD_Billed?: number | null
          Guinness_Mid_Strength_In_Keg_MTD_Billed?: number | null
          Harp_In_Keg_MTD_Billed?: number | null
          Hop_House_13_Lager_MTD_Billed?: number | null
          Kilkenny_Draught_In_Keg_MTD_Billed?: number | null
          Magners_in_Keg_MTD_Billed?: number | null
          OGB_Citra_IPA_in_Keg_MTD_Billed?: number | null
          Outlet?: string | null
          prim_key?: number | null
          Rockshore_Apple_Cider_in_Keg_MTD_Billed?: number | null
          Rockshore_in_Keg_MTD_Billed?: number | null
          Smithwicks_In_Keg_MTD_Billed?: number | null
          Smithwicks_Pale_Ale_in_Keg_MTD_Billed?: number | null
          Strongbow_In_Keg_MTD_Billed?: number | null
          Tuborg_Lager_in_Keg_MTD_Billed?: number | null
        }
        Update: {
          Calendar_day?: string | null
          Calendar_Year?: number | null
          "Carlsberg_0.0_In_Keg_MTD_Billed"?: number | null
          Carlsberg_Lager_In_Keg_MTD_Billed?: number | null
          Cluster?: string | null
          Country?: string | null
          "Guinness_Draught_0.0_in_Keg_MTD_Billed"?: number | null
          Guinness_Draught_In_Keg_MTD_Billed?: number | null
          Guinness_Mid_Strength_In_Keg_MTD_Billed?: number | null
          Harp_In_Keg_MTD_Billed?: number | null
          Hop_House_13_Lager_MTD_Billed?: number | null
          Kilkenny_Draught_In_Keg_MTD_Billed?: number | null
          Magners_in_Keg_MTD_Billed?: number | null
          OGB_Citra_IPA_in_Keg_MTD_Billed?: number | null
          Outlet?: string | null
          prim_key?: number | null
          Rockshore_Apple_Cider_in_Keg_MTD_Billed?: number | null
          Rockshore_in_Keg_MTD_Billed?: number | null
          Smithwicks_In_Keg_MTD_Billed?: number | null
          Smithwicks_Pale_Ale_in_Keg_MTD_Billed?: number | null
          Strongbow_In_Keg_MTD_Billed?: number | null
          Tuborg_Lager_in_Keg_MTD_Billed?: number | null
        }
        Relationships: []
      }
      persona_details: {
        Row: {
          diageo_value: string | null
          goals: string | null
          id: string | null
          name: string | null
          pain_points: string | null
        }
        Insert: {
          diageo_value?: string | null
          goals?: string | null
          id?: string | null
          name?: string | null
          pain_points?: string | null
        }
        Update: {
          diageo_value?: string | null
          goals?: string | null
          id?: string | null
          name?: string | null
          pain_points?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
