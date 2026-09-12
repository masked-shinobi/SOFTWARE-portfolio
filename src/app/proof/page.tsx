// =============================================================================
// Stage B2 — Prove Data Connection
// =============================================================================
// This is a CHECKPOINT page, not a feature. It proves:
//   1. Server Components can fetch data from Supabase via the data access layer
//   2. TypeScript types flow end-to-end (no `any` casts needed)
//   3. Seeded data renders correctly
// This page will be removed after B2 is verified.
// =============================================================================

import { createClient } from '@/lib/supabase/server';
import { getProfile, getProjects, getSkillsByCategory, getMedia } from '@/lib/data';
import type { Profile, Project, Skill, Media } from '@/types/database.types';
import { RlsWriteTest } from './rls-write-test';

export const dynamic = 'force-dynamic'; // Always fetch fresh data, never cache

export default async function ProofPage() {
  // Create server-side Supabase client
  const supabase = await createClient();

  // Fetch all data using the typed data access layer with the server client
  const profile: Profile | null = await getProfile(supabase);
  const projects: Project[] = await getProjects(supabase);
  const skillsByCategory: Record<string, Skill[]> = await getSkillsByCategory(supabase);
  const media: Media[] = await getMedia(supabase);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
        ✅ Stage B2 — Prove Data Connection
      </h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        This page proves that data flows from Supabase → Data Access Layer → Server Component.
        All data below is fetched server-side using the typed fetch functions.
      </p>

      {/* ── Profile Section ── */}
      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>👤 Profile</h2>
        {profile ? (
          <div>
            <p><strong>Name:</strong> {profile.full_name}</p>
            <p><strong>Headline:</strong> {profile.headline}</p>
            <p><strong>Short Bio:</strong> {profile.short_bio ?? '(none)'}</p>
            <p><strong>Avatar URL:</strong> {profile.avatar_url ? '✅ Present' : '❌ Missing'}</p>
            <p><strong>Resume URL:</strong> {profile.resume_url ? '✅ Present' : '❌ Missing'}</p>
            <p><strong>Social Links:</strong> {Object.keys(profile.social_links).length} platforms</p>
            <p style={{ fontSize: '0.85rem', color: '#888' }}>
              TypeScript type: <code>Profile</code> — id: <code>{profile.id.slice(0, 8)}…</code>
            </p>
          </div>
        ) : (
          <p style={{ color: 'red' }}>❌ No profile found — check Supabase connection</p>
        )}
      </section>

      {/* ── Projects Section ── */}
      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
          📂 Projects ({projects.length} published)
        </h2>
        {projects.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {projects.map((project: Project) => (
              <li key={project.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
                <strong>{project.title}</strong>
                <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                  — {project.tagline ?? '(no tagline)'}
                </span>
                <br />
                <span style={{ fontSize: '0.85rem', color: '#888' }}>
                  slug: <code>{project.slug}</code> |
                  tech: {project.tech_stack.join(', ')} |
                  featured: {project.featured ? '⭐' : '—'} |
                  order: {project.display_order}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: 'red' }}>❌ No projects returned — check RLS / seed data</p>
        )}
      </section>

      {/* ── Skills Section ── */}
      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
          🛠️ Skills ({Object.values(skillsByCategory).flat().length} total)
        </h2>
        {Object.keys(skillsByCategory).length > 0 ? (
          Object.entries(skillsByCategory).map(([category, skills]: [string, Skill[]]) => (
            <div key={category} style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{category}</h3>
              <p style={{ color: '#555' }}>
                {skills.map((s: Skill) => s.name).join(', ')}
              </p>
            </div>
          ))
        ) : (
          <p style={{ color: 'red' }}>❌ No skills returned — check seed data</p>
        )}
      </section>

      {/* ── Media Section ── */}
      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
          🖼️ Media ({media.length} items)
        </h2>
        {media.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {media.map((item: Media) => (
              <li key={item.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
                <strong>{item.filename}</strong>
                <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                  — {item.type} | {item.alt_text ?? '(no alt)'}
                </span>
                <br />
                <span style={{ fontSize: '0.85rem', color: '#888' }}>
                  path: <code>{item.storage_path}</code> |
                  size: {item.size_bytes ? `${(item.size_bytes / 1024).toFixed(1)} KB` : '?'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: 'red' }}>❌ No media returned — check seed data</p>
        )}
      </section>

      {/* ── RLS Write Test (Client Component) ── */}
      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
          🔒 RLS Write Test (Client-Side)
        </h2>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Click the button below to attempt an INSERT from the browser using the anon key.
          This should be <strong>blocked by RLS</strong>.
        </p>
        <RlsWriteTest />
      </section>

      {/* ── Type Proof Summary ── */}
      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px', background: '#f8fff8' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
          🧪 Type Proof Summary
        </h2>
        <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem' }}>
          <li>
            <code>getProfile(supabase)</code> → <code>Profile | null</code>
            {profile ? ' ✅' : ' ❌'}
          </li>
          <li>
            <code>getProjects(supabase)</code> → <code>Project[]</code>
            {projects.length > 0 ? ` ✅ (${projects.length} rows)` : ' ❌'}
          </li>
          <li>
            <code>getSkillsByCategory(supabase)</code> → <code>{'Record<string, Skill[]>'}</code>
            {Object.keys(skillsByCategory).length > 0 ? ` ✅ (${Object.keys(skillsByCategory).length} categories)` : ' ❌'}
          </li>
          <li>
            <code>getMedia(supabase)</code> → <code>Media[]</code>
            {media.length > 0 ? ` ✅ (${media.length} rows)` : ' ❌'}
          </li>
          <li>
            Server client: <code>createClient()</code> from <code>@/lib/supabase/server</code> ✅
          </li>
          <li>
            All types from <code>@/types/database.types</code> — no <code>any</code> casts ✅
          </li>
        </ul>
      </section>
    </main>
  );
}
