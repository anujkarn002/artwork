export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          location: string | null;
          phone_number: string | null;
          website: string | null;
          role: "admin" | "artisan" | "customer";
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          phone_number?: string | null;
          website?: string | null;
          role?: "admin" | "artisan" | "customer";
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          phone_number?: string | null;
          website?: string | null;
          role?: "admin" | "artisan" | "customer";
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      regions: {
        Row: {
          id: string;
          name: string;
          state: string;
          description: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          state: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          state?: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      craft_categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      crafts: {
        Row: {
          id: string;
          name: string;
          description: string;
          category_id: string | null;
          region_id: string | null;
          is_gi_tagged: boolean;
          gi_tag_year: string | null;
          historical_context: string | null;
          materials: Json | null;
          techniques: Json | null;
          cultural_significance: string | null;
          featured: boolean;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          category_id?: string | null;
          region_id?: string | null;
          is_gi_tagged?: boolean;
          gi_tag_year?: string | null;
          historical_context?: string | null;
          materials?: Json | null;
          techniques?: Json | null;
          cultural_significance?: string | null;
          featured?: boolean;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          category_id?: string | null;
          region_id?: string | null;
          is_gi_tagged?: boolean;
          gi_tag_year?: string | null;
          historical_context?: string | null;
          materials?: Json | null;
          techniques?: Json | null;
          cultural_significance?: string | null;
          featured?: boolean;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      artisan_profiles: {
        Row: {
          id: string;
          craft_id: string | null;
          experience_years: number;
          awards: Json | null;
          certificates: Json | null;
          is_master_artisan: boolean;
          story: string | null;
          verification_status: "pending" | "verified" | "rejected";
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          craft_id?: string | null;
          experience_years?: number;
          awards?: Json | null;
          certificates?: Json | null;
          is_master_artisan?: boolean;
          story?: string | null;
          verification_status?: "pending" | "verified" | "rejected";
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          craft_id?: string | null;
          experience_years?: number;
          awards?: Json | null;
          certificates?: Json | null;
          is_master_artisan?: boolean;
          story?: string | null;
          verification_status?: "pending" | "verified" | "rejected";
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          artisan_id: string;
          craft_id: string | null;
          name: string;
          description: string;
          price: number;
          discount_price: number | null;
          materials: string[] | null;
          dimensions: string | null;
          weight: string | null;
          image_urls: string[] | null;
          is_available: boolean;
          is_featured: boolean;
          stock_quantity: number;
          creation_time: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          artisan_id: string;
          craft_id?: string | null;
          name: string;
          description: string;
          price: number;
          discount_price?: number | null;
          materials?: string[] | null;
          dimensions?: string | null;
          weight?: string | null;
          image_urls?: string[] | null;
          is_available?: boolean;
          is_featured?: boolean;
          stock_quantity?: number;
          creation_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          artisan_id?: string;
          craft_id?: string | null;
          name?: string;
          description?: string;
          price?: number;
          discount_price?: number | null;
          materials?: string[] | null;
          dimensions?: string | null;
          weight?: string | null;
          image_urls?: string[] | null;
          is_available?: boolean;
          is_featured?: boolean;
          stock_quantity?: number;
          creation_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cultural_documentation: {
        Row: {
          id: string;
          craft_id: string | null;
          title: string;
          content: string;
          media_urls: string[] | null;
          contributor_id: string | null;
          is_verified: boolean;
          verified_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          craft_id?: string | null;
          title: string;
          content: string;
          media_urls?: string[] | null;
          contributor_id?: string | null;
          is_verified?: boolean;
          verified_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          craft_id?: string | null;
          title?: string;
          content?: string;
          media_urls?: string[] | null;
          contributor_id?: string | null;
          is_verified?: boolean;
          verified_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_id: string | null;
          status:
            | "pending"
            | "processing"
            | "shipped"
            | "delivered"
            | "canceled";
          total_amount: number;
          shipping_address: Json;
          payment_info: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id?: string | null;
          status?:
            | "pending"
            | "processing"
            | "shipped"
            | "delivered"
            | "canceled";
          total_amount: number;
          shipping_address: Json;
          payment_info?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string | null;
          status?:
            | "pending"
            | "processing"
            | "shipped"
            | "delivered"
            | "canceled";
          total_amount?: number;
          shipping_address?: Json;
          payment_info?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          quantity: number;
          price_at_purchase: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          quantity: number;
          price_at_purchase: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          quantity?: number;
          price_at_purchase?: number;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          customer_id: string | null;
          rating: number;
          comment: string | null;
          media_urls: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          customer_id?: string | null;
          rating: number;
          comment?: string | null;
          media_urls?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          customer_id?: string | null;
          rating?: number;
          comment?: string | null;
          media_urls?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      stories: {
        Row: {
          id: string;
          title: string;
          content: string;
          author_id: string | null;
          craft_id: string | null;
          image_url: string | null;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          author_id?: string | null;
          craft_id?: string | null;
          image_url?: string | null;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          author_id?: string | null;
          craft_id?: string | null;
          image_url?: string | null;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: "admin" | "artisan" | "customer";
      order_status:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "canceled";
      verification_status: "pending" | "verified" | "rejected";
    };
  };
};

// Helpful type shortcuts
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Craft = Database["public"]["Tables"]["crafts"]["Row"];
export type ArtisanProfile =
  Database["public"]["Tables"]["artisan_profiles"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type Story = Database["public"]["Tables"]["stories"]["Row"];
export type Region = Database["public"]["Tables"]["regions"]["Row"];
export type CraftCategory =
  Database["public"]["Tables"]["craft_categories"]["Row"];
export type CulturalDocumentation =
  Database["public"]["Tables"]["cultural_documentation"]["Row"];
