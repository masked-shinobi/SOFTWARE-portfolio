// =============================================================================
// Database Types — Hand-written from SCHEMA_BLUEPRINT.md
// Matches the Supabase schema created by 001_core_schema.sql
// =============================================================================

// ---------------------------------------------------------------------------
// JSON Shapes
// ---------------------------------------------------------------------------

/** Social links stored as JSONB in the profile table */
export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
  website?: string;
  leetcode?: string;
  devto?: string;
  [key: string]: string | undefined; // Allow additional platforms
}

// ---------------------------------------------------------------------------
// Row Types (what SELECT returns)
// ---------------------------------------------------------------------------

export interface Profile {
  id: string;
  full_name: string;
  headline: string;
  short_bio: string | null;
  long_bio: string | null;
  avatar_url: string | null;
  social_links: SocialLinks;
  resume_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
  thumbnail_url: string | null;
  images: string[];
  featured: boolean;
  published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number | null;
  icon_name: string | null;
  display_order: number;
  created_at: string;
}

export type MediaType = 'image' | 'video' | 'document';

export interface Media {
  id: string;
  storage_path: string;
  public_url: string;
  alt_text: string | null;
  type: MediaType;
  filename: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Insert Types (what INSERT expects — omit auto-generated fields)
// ---------------------------------------------------------------------------

export type ProfileInsert = Omit<Profile, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type SkillInsert = Omit<Skill, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type MediaInsert = Omit<Media, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

// ---------------------------------------------------------------------------
// Update Types (all fields optional except id)
// ---------------------------------------------------------------------------

export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
export type ProjectUpdate = Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>;
export type SkillUpdate = Partial<Omit<Skill, 'id' | 'created_at'>>;
export type MediaUpdate = Partial<Omit<Media, 'id' | 'created_at'>>;

// ---------------------------------------------------------------------------
// Database Interface (for Supabase client generic typing)
// ---------------------------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      profile: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      projects: {
        Row: Project;
        Insert: ProjectInsert;
        Update: ProjectUpdate;
      };
      skills: {
        Row: Skill;
        Insert: SkillInsert;
        Update: SkillUpdate;
      };
      media: {
        Row: Media;
        Insert: MediaInsert;
        Update: MediaUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
