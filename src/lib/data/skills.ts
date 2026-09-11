// =============================================================================
// Data Access: Skills
// =============================================================================

import { createClient } from '@supabase/supabase-js';
import type { Database, Skill } from '@/types/database.types';

function getSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Fetches all skills, ordered by category then display_order.
 */
export async function getSkills(
  client?: ReturnType<typeof createClient<Database>>
): Promise<Skill[]> {
  const supabase = client ?? getSupabaseClient();

  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('category', { ascending: true })
    .order('display_order', { ascending: true });

  if (error) {
    console.error('[getSkills] Error:', error.message);
    return [];
  }

  return (data ?? []) as Skill[];
}

/**
 * Fetches all skills and groups them by category.
 * Returns an object where keys are category names and values are arrays of skills.
 *
 * Example output:
 * ```
 * {
 *   "Languages": [{ name: "JavaScript", ... }, { name: "TypeScript", ... }],
 *   "Frameworks": [{ name: "React", ... }, { name: "Next.js", ... }],
 *   ...
 * }
 * ```
 */
export async function getSkillsByCategory(
  client?: ReturnType<typeof createClient<Database>>
): Promise<Record<string, Skill[]>> {
  const skills = await getSkills(client);

  return skills.reduce<Record<string, Skill[]>>((grouped, skill) => {
    const category = skill.category;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(skill);
    return grouped;
  }, {});
}
