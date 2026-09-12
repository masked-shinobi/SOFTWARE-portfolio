// =============================================================================
// Entry Page (/) — Server Component
// =============================================================================
// Fetches profile data server-side, passes it to the EntryClient for the
// boot loader and choice page UI. This is the root page of the portfolio.
// =============================================================================

import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data";
import { EntryClient } from "./entry-client";

export default async function EntryPage() {
  const supabase = await createClient();
  const profile = await getProfile(supabase);

  // Fallback values in case profile hasn't been seeded
  const name = profile?.full_name ?? "Sanjay Baskar";
  const headline = profile?.headline ?? "Full Stack Developer";

  return <EntryClient name={name} headline={headline} />;
}
