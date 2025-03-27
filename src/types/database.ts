export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      crafts: {
        Row: {
          id: number;
          name: string;
          description: string;
          region: string;
          is_gi_tagged: boolean;
          historical_context: string | null;
          techniques: Json | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description: string;
          region: string;
          is_gi_tagged?: boolean;
          historical_context?: string | null;
          techniques?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string;
          region?: string;
          is_gi_tagged?: boolean;
          historical_context?: string | null;
          techniques?: Json | null;
          created_at?: string;
        };
      };
      artisans: {
        Row: {
          id: number;
          user_id: string;
          name: string;
          bio: string;
          location: string;
          craft_id: number;
          experience_years: number;
          profile_image_url: string | null;
          awards: Json | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          name: string;
          bio: string;
          location: string;
          craft_id: number;
          experience_years?: number;
          profile_image_url?: string | null;
          awards?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          name?: string;
          bio?: string;
          location?: string;
          craft_id?: number;
          experience_years?: number;
          profile_image_url?: string | null;
          awards?: Json | null;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: number;
          artisan_id: number;
          craft_id: number;
          name: string;
          description: string;
          price: number;
          image_urls: string[];
          is_available: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          artisan_id: number;
          craft_id: number;
          name: string;
          description: string;
          price: number;
          image_urls: string[];
          is_available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          artisan_id?: number;
          craft_id?: number;
          name?: string;
          description?: string;
          price?: number;
          image_urls?: string[];
          is_available?: boolean;
          created_at?: string;
        };
      };
    };
  };
}
