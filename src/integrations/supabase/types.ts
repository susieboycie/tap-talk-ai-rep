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
      activations_data: {
        Row: {
          "Activation Name": string | null
          "Activation Status": string | null
          "Date Activated": string | null
          "Outlet Name": string | null
          "Ship To": number | null
        }
        Insert: {
          "Activation Name"?: string | null
          "Activation Status"?: string | null
          "Date Activated"?: string | null
          "Outlet Name"?: string | null
          "Ship To"?: number | null
        }
        Update: {
          "Activation Name"?: string | null
          "Activation Status"?: string | null
          "Date Activated"?: string | null
          "Outlet Name"?: string | null
          "Ship To"?: number | null
        }
        Relationships: []
      }
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
      contract_management_beer_data: {
        Row: {
          "Agreement Type": string | null
          "Contract End Date": string | null
          "Contract Record Type": string | null
          "Contract Start Date": string | null
          Duration: number | null
          "Forecast Volume": number | null
          "Outlet Name": string | null
          "Overall Investment(incl. Indirect Inv)": number | null
          "Payment Frequency": string | null
          "Product growth-driver": string | null
          "Product Name": string | null
          "Rate/UoM": string | null
          "Ship To": number | null
          Status: string | null
        }
        Insert: {
          "Agreement Type"?: string | null
          "Contract End Date"?: string | null
          "Contract Record Type"?: string | null
          "Contract Start Date"?: string | null
          Duration?: number | null
          "Forecast Volume"?: number | null
          "Outlet Name"?: string | null
          "Overall Investment(incl. Indirect Inv)"?: number | null
          "Payment Frequency"?: string | null
          "Product growth-driver"?: string | null
          "Product Name"?: string | null
          "Rate/UoM"?: string | null
          "Ship To"?: number | null
          Status?: string | null
        }
        Update: {
          "Agreement Type"?: string | null
          "Contract End Date"?: string | null
          "Contract Record Type"?: string | null
          "Contract Start Date"?: string | null
          Duration?: number | null
          "Forecast Volume"?: number | null
          "Outlet Name"?: string | null
          "Overall Investment(incl. Indirect Inv)"?: number | null
          "Payment Frequency"?: string | null
          "Product growth-driver"?: string | null
          "Product Name"?: string | null
          "Rate/UoM"?: string | null
          "Ship To"?: number | null
          Status?: string | null
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
      daily_weather: {
        Row: {
          created_at: string
          date: string
          description: string | null
          id: string
          outlet_name: string | null
          precipitation: number | null
          temperature_max: number | null
          temperature_min: number | null
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          id?: string
          outlet_name?: string | null
          precipitation?: number | null
          temperature_max?: number | null
          temperature_min?: number | null
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          outlet_name?: string | null
          precipitation?: number | null
          temperature_max?: number | null
          temperature_min?: number | null
        }
        Relationships: []
      }
      direct_on_trade: {
        Row: {
          "Fiscal year/period": string | null
          Outlet: string | null
          "PRDHA L5 Individual Variant": string | null
          "Volume HL": number | null
        }
        Insert: {
          "Fiscal year/period"?: string | null
          Outlet?: string | null
          "PRDHA L5 Individual Variant"?: string | null
          "Volume HL"?: number | null
        }
        Update: {
          "Fiscal year/period"?: string | null
          Outlet?: string | null
          "PRDHA L5 Individual Variant"?: string | null
          "Volume HL"?: number | null
        }
        Relationships: []
      }
      outlet_data: {
        Row: {
          City: string | null
          "Cluster Number": string | null
          Clustered: string | null
          "Consumer Segmentation": string | null
          "Credit terms": string | null
          "Geo-Region": string | null
          "Global Outlet Channel": string | null
          "Global Outlet Segment": string | null
          "Global Outlet Sub Segment": string | null
          "Local Outlet-Segment1": string | null
          "NI or ROI": string | null
          "Outlet Name": string | null
          "Outlet Visit Prioritisation": string | null
          "Primary Sales Area": string | null
          "Salesforce Record ID": string | null
          "Ship To": number | null
        }
        Insert: {
          City?: string | null
          "Cluster Number"?: string | null
          Clustered?: string | null
          "Consumer Segmentation"?: string | null
          "Credit terms"?: string | null
          "Geo-Region"?: string | null
          "Global Outlet Channel"?: string | null
          "Global Outlet Segment"?: string | null
          "Global Outlet Sub Segment"?: string | null
          "Local Outlet-Segment1"?: string | null
          "NI or ROI"?: string | null
          "Outlet Name"?: string | null
          "Outlet Visit Prioritisation"?: string | null
          "Primary Sales Area"?: string | null
          "Salesforce Record ID"?: string | null
          "Ship To"?: number | null
        }
        Update: {
          City?: string | null
          "Cluster Number"?: string | null
          Clustered?: string | null
          "Consumer Segmentation"?: string | null
          "Credit terms"?: string | null
          "Geo-Region"?: string | null
          "Global Outlet Channel"?: string | null
          "Global Outlet Segment"?: string | null
          "Global Outlet Sub Segment"?: string | null
          "Local Outlet-Segment1"?: string | null
          "NI or ROI"?: string | null
          "Outlet Name"?: string | null
          "Outlet Visit Prioritisation"?: string | null
          "Primary Sales Area"?: string | null
          "Salesforce Record ID"?: string | null
          "Ship To"?: number | null
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
      sales_volume_data: {
        Row: {
          "Carlsberg (Lager)": number | null
          "Carlsberg Non Alc (Non Alc Lager)": number | null
          fiscal_year: string | null
          "Guinness Draught (Stout)": number | null
          "Guinness Non Alc (Non Alc Stout)": number | null
          "Harp (Lager)": number | null
          "Hop House 13": number | null
          "Kilkenny Draught (Ale)": number | null
          "Macardles Traditional (Ale)": number | null
          "OGB Citra IPA (Ale)": number | null
          "Outlet Name": string | null
          "Rockshore (Lager)": number | null
          "Rockshore Apple Cider": number | null
          "Rockshore Light (Lager)": number | null
          "Ship To": number | null
          "Smithwick's (Ale)": number | null
          "Smithwick's Pale Ale (Ale)": number | null
          "Total Volume (HL)": number | null
          "Tuborg (Lager)": number | null
        }
        Insert: {
          "Carlsberg (Lager)"?: number | null
          "Carlsberg Non Alc (Non Alc Lager)"?: number | null
          fiscal_year?: string | null
          "Guinness Draught (Stout)"?: number | null
          "Guinness Non Alc (Non Alc Stout)"?: number | null
          "Harp (Lager)"?: number | null
          "Hop House 13"?: number | null
          "Kilkenny Draught (Ale)"?: number | null
          "Macardles Traditional (Ale)"?: number | null
          "OGB Citra IPA (Ale)"?: number | null
          "Outlet Name"?: string | null
          "Rockshore (Lager)"?: number | null
          "Rockshore Apple Cider"?: number | null
          "Rockshore Light (Lager)"?: number | null
          "Ship To"?: number | null
          "Smithwick's (Ale)"?: number | null
          "Smithwick's Pale Ale (Ale)"?: number | null
          "Total Volume (HL)"?: number | null
          "Tuborg (Lager)"?: number | null
        }
        Update: {
          "Carlsberg (Lager)"?: number | null
          "Carlsberg Non Alc (Non Alc Lager)"?: number | null
          fiscal_year?: string | null
          "Guinness Draught (Stout)"?: number | null
          "Guinness Non Alc (Non Alc Stout)"?: number | null
          "Harp (Lager)"?: number | null
          "Hop House 13"?: number | null
          "Kilkenny Draught (Ale)"?: number | null
          "Macardles Traditional (Ale)"?: number | null
          "OGB Citra IPA (Ale)"?: number | null
          "Outlet Name"?: string | null
          "Rockshore (Lager)"?: number | null
          "Rockshore Apple Cider"?: number | null
          "Rockshore Light (Lager)"?: number | null
          "Ship To"?: number | null
          "Smithwick's (Ale)"?: number | null
          "Smithwick's Pale Ale (Ale)"?: number | null
          "Total Volume (HL)"?: number | null
          "Tuborg (Lager)"?: number | null
        }
        Relationships: []
      }
      target_tiering_data: {
        Row: {
          "Casa Ach": number | null
          "Casa Target": number | null
          "Compliance Ach": number | null
          "CPD Ach": number | null
          "CPD Target": number | null
          "DIT Ach": number | null
          "DIT Target": number | null
          "GNS 0.0 Ach": number | null
          "GNS 0.0 Target": number | null
          "Rep ID": string | null
          "RS WAVE Ach": number | null
          "RS WAVE Target": number | null
          "RSL Activations": number | null
          "SMICE Ach": number | null
          "SMICE Target": number | null
        }
        Insert: {
          "Casa Ach"?: number | null
          "Casa Target"?: number | null
          "Compliance Ach"?: number | null
          "CPD Ach"?: number | null
          "CPD Target"?: number | null
          "DIT Ach"?: number | null
          "DIT Target"?: number | null
          "GNS 0.0 Ach"?: number | null
          "GNS 0.0 Target"?: number | null
          "Rep ID"?: string | null
          "RS WAVE Ach"?: number | null
          "RS WAVE Target"?: number | null
          "RSL Activations"?: number | null
          "SMICE Ach"?: number | null
          "SMICE Target"?: number | null
        }
        Update: {
          "Casa Ach"?: number | null
          "Casa Target"?: number | null
          "Compliance Ach"?: number | null
          "CPD Ach"?: number | null
          "CPD Target"?: number | null
          "DIT Ach"?: number | null
          "DIT Target"?: number | null
          "GNS 0.0 Ach"?: number | null
          "GNS 0.0 Target"?: number | null
          "Rep ID"?: string | null
          "RS WAVE Ach"?: number | null
          "RS WAVE Target"?: number | null
          "RSL Activations"?: number | null
          "SMICE Ach"?: number | null
          "SMICE Target"?: number | null
        }
        Relationships: []
      }
      trade_terms_data: {
        Row: {
          "Fiscal year/period": string | null
          "Outlet Name": string | null
          "PRDHA L5 Individual Variant": string | null
          "Ship To": number | null
          "Volume HL": number | null
        }
        Insert: {
          "Fiscal year/period"?: string | null
          "Outlet Name"?: string | null
          "PRDHA L5 Individual Variant"?: string | null
          "Ship To"?: number | null
          "Volume HL"?: number | null
        }
        Update: {
          "Fiscal year/period"?: string | null
          "Outlet Name"?: string | null
          "PRDHA L5 Individual Variant"?: string | null
          "Ship To"?: number | null
          "Volume HL"?: number | null
        }
        Relationships: []
      }
      trax_data: {
        Row: {
          "Outlet Name": string | null
          "Price Tier Split_Luxury_#": number | null
          "Price Tier Split_Luxury_%": number | null
          "Price Tier Split_Premium_#": number | null
          "Price Tier Split_Premium_%": number | null
          "Price Tier Split_Standard_#": number | null
          "Price Tier Split_Standard_%": number | null
          "Price Tier Split_Super Premium_#": number | null
          "Price Tier Split_Super Premium_%": number | null
          "Price Tier Split_Ultra Premium_#": number | null
          "Price Tier Split_Ultra Premium_%": number | null
          "Price Tier Split_Value_#": number | null
          "Price Tier Split_Value_%": number | null
          "Share of LAD vs. RTD. Vs. Spirits_LAD_#": number | null
          "Share of LAD vs. RTD. Vs. Spirits_LAD_%": number | null
          "Share of LAD vs. RTD. Vs. Spirits_RTD_#": number | null
          "Share of LAD vs. RTD. Vs. Spirits_RTD_%": number | null
          "Share of LAD vs. RTD. Vs. Spirits_Sprits_#": number | null
          "Share of LAD vs. RTD. Vs. Spirits_Sprits_%": number | null
          "Share of Lager_Ale_#": number | null
          "Share of Lager_Ale_%": number | null
          "Share of Lager_Cider_#": number | null
          "Share of Lager_Cider_%": number | null
          "Share of Lager_Lager_#": number | null
          "Share of Lager_Lager_%": number | null
          "Share of Lager_Stout_#": number | null
          "Share of Lager_Stout_%": number | null
          "Share of Packaged_Beer Taps_#": number | null
          "Share of Packaged_Beer Taps_%": number | null
          "Share of Packaged_Packaged_#": number | null
          "Share of Packaged_Packaged_%": number | null
          "Ship To": number | null
          "Total Facings": number | null
        }
        Insert: {
          "Outlet Name"?: string | null
          "Price Tier Split_Luxury_#"?: number | null
          "Price Tier Split_Luxury_%"?: number | null
          "Price Tier Split_Premium_#"?: number | null
          "Price Tier Split_Premium_%"?: number | null
          "Price Tier Split_Standard_#"?: number | null
          "Price Tier Split_Standard_%"?: number | null
          "Price Tier Split_Super Premium_#"?: number | null
          "Price Tier Split_Super Premium_%"?: number | null
          "Price Tier Split_Ultra Premium_#"?: number | null
          "Price Tier Split_Ultra Premium_%"?: number | null
          "Price Tier Split_Value_#"?: number | null
          "Price Tier Split_Value_%"?: number | null
          "Share of LAD vs. RTD. Vs. Spirits_LAD_#"?: number | null
          "Share of LAD vs. RTD. Vs. Spirits_LAD_%"?: number | null
          "Share of LAD vs. RTD. Vs. Spirits_RTD_#"?: number | null
          "Share of LAD vs. RTD. Vs. Spirits_RTD_%"?: number | null
          "Share of LAD vs. RTD. Vs. Spirits_Sprits_#"?: number | null
          "Share of LAD vs. RTD. Vs. Spirits_Sprits_%"?: number | null
          "Share of Lager_Ale_#"?: number | null
          "Share of Lager_Ale_%"?: number | null
          "Share of Lager_Cider_#"?: number | null
          "Share of Lager_Cider_%"?: number | null
          "Share of Lager_Lager_#"?: number | null
          "Share of Lager_Lager_%"?: number | null
          "Share of Lager_Stout_#"?: number | null
          "Share of Lager_Stout_%"?: number | null
          "Share of Packaged_Beer Taps_#"?: number | null
          "Share of Packaged_Beer Taps_%"?: number | null
          "Share of Packaged_Packaged_#"?: number | null
          "Share of Packaged_Packaged_%"?: number | null
          "Ship To"?: number | null
          "Total Facings"?: number | null
        }
        Update: {
          "Outlet Name"?: string | null
          "Price Tier Split_Luxury_#"?: number | null
          "Price Tier Split_Luxury_%"?: number | null
          "Price Tier Split_Premium_#"?: number | null
          "Price Tier Split_Premium_%"?: number | null
          "Price Tier Split_Standard_#"?: number | null
          "Price Tier Split_Standard_%"?: number | null
          "Price Tier Split_Super Premium_#"?: number | null
          "Price Tier Split_Super Premium_%"?: number | null
          "Price Tier Split_Ultra Premium_#"?: number | null
          "Price Tier Split_Ultra Premium_%"?: number | null
          "Price Tier Split_Value_#"?: number | null
          "Price Tier Split_Value_%"?: number | null
          "Share of LAD vs. RTD. Vs. Spirits_LAD_#"?: number | null
          "Share of LAD vs. RTD. Vs. Spirits_LAD_%"?: number | null
          "Share of LAD vs. RTD. Vs. Spirits_RTD_#"?: number | null
          "Share of LAD vs. RTD. Vs. Spirits_RTD_%"?: number | null
          "Share of LAD vs. RTD. Vs. Spirits_Sprits_#"?: number | null
          "Share of LAD vs. RTD. Vs. Spirits_Sprits_%"?: number | null
          "Share of Lager_Ale_#"?: number | null
          "Share of Lager_Ale_%"?: number | null
          "Share of Lager_Cider_#"?: number | null
          "Share of Lager_Cider_%"?: number | null
          "Share of Lager_Lager_#"?: number | null
          "Share of Lager_Lager_%"?: number | null
          "Share of Lager_Stout_#"?: number | null
          "Share of Lager_Stout_%"?: number | null
          "Share of Packaged_Beer Taps_#"?: number | null
          "Share of Packaged_Beer Taps_%"?: number | null
          "Share of Packaged_Packaged_#"?: number | null
          "Share of Packaged_Packaged_%"?: number | null
          "Ship To"?: number | null
          "Total Facings"?: number | null
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
