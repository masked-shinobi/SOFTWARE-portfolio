// =============================================================================
// Data Access: Projects
// =============================================================================

import { createClient } from '@supabase/supabase-js';
import type { Database, Project } from '@/types/database.types';

function getSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Fetches all published projects, ordered by display_order ascending.
 * RLS enforces `published = true` for anon users automatically.
 */
export async function getProjects(
  client?: ReturnType<typeof createClient<Database>>
): Promise<Project[]> {
  const supabase = client ?? getSupabaseClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('[getProjects] Error:', error.message);
    return [];
  }

  return (data ?? []) as Project[];
}

/**
 * Fetches only featured projects (featured = true), ordered by display_order.
 */
export async function getFeaturedProjects(
  client?: ReturnType<typeof createClient<Database>>
): Promise<Project[]> {
  const supabase = client ?? getSupabaseClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('featured', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('[getFeaturedProjects] Error:', error.message);
    return [];
  }

  return (data ?? []) as Project[];
}

/**
 * Fetches a single project by its URL slug.
 * Returns null if not found or unpublished (RLS hides unpublished from anon).
 */
export async function getProjectBySlug(
  slug: string,
  client?: ReturnType<typeof createClient<Database>>
): Promise<Project | null> {
  const supabase = client ?? getSupabaseClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`[getProjectBySlug] Error for slug "${slug}":`, error.message);
    return null;
  }

  return data as Project;
}
