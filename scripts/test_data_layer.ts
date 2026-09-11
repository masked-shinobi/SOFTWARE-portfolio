// =============================================================================
// Verification Script — Data Access Layer (Stage A6)
// =============================================================================
// Run: npx tsx scripts/test_data_layer.ts
//
// Proves that all fetch functions work against the live Supabase instance
// and return the expected row counts.
// =============================================================================

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Load .env.local manually (no Next.js runtime available)
// ---------------------------------------------------------------------------
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    process.env[key] = value;
  }
}

loadEnv();

// ---------------------------------------------------------------------------
// Import types (using relative paths since @/ alias isn't available outside Next.js)
// ---------------------------------------------------------------------------
import type { Database, Profile, Project, Skill, Media, MediaType } from '../src/types/database.types';

// ---------------------------------------------------------------------------
// Create Supabase client
// ---------------------------------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// ---------------------------------------------------------------------------
// Replicate data access functions using the standalone client
// (We can't import the src/lib/data/ functions directly because they use
// the @/ path alias which isn't configured outside of Next.js)
// ---------------------------------------------------------------------------

async function getProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error('[getProfile] Error:', error.message);
    return null;
  }
  return data as Profile;
}

async function getProjects(): Promise<Project[]> {
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

async function getFeaturedProjects(): Promise<Project[]> {
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

async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`[getProjectBySlug] Error for "${slug}":`, error.message);
    return null;
  }
  return data as Project;
}

async function getSkills(): Promise<Skill[]> {
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

async function getSkillsByCategory(): Promise<Record<string, Skill[]>> {
  const skills = await getSkills();
  return skills.reduce<Record<string, Skill[]>>((grouped, skill) => {
    if (!grouped[skill.category]) grouped[skill.category] = [];
    grouped[skill.category].push(skill);
    return grouped;
  }, {});
}

async function getMedia(): Promise<Media[]> {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getMedia] Error:', error.message);
    return [];
  }
  return (data ?? []) as Media[];
}

async function getMediaByType(type: MediaType): Promise<Media[]> {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`[getMediaByType] Error for "${type}":`, error.message);
    return [];
  }
  return (data ?? []) as Media[];
}

// ---------------------------------------------------------------------------
// Test Runner
// ---------------------------------------------------------------------------

interface TestResult {
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function assert(name: string, condition: boolean, details: string) {
  results.push({ name, passed: condition, details });
  const icon = condition ? '✅' : '❌';
  console.log(`  ${icon} ${name} — ${details}`);
}

async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('  DATA ACCESS LAYER — VERIFICATION');
  console.log('='.repeat(60));
  console.log(`  Supabase URL: ${supabaseUrl}`);
  console.log('='.repeat(60) + '\n');

  // -------------------------------------------------------------------------
  // 1. getProfile()
  // -------------------------------------------------------------------------
  console.log('📋 Profile');
  const profile = await getProfile();
  assert(
    'getProfile() returns data',
    profile !== null,
    profile ? `full_name: "${profile.full_name}"` : 'null'
  );
  if (profile) {
    assert(
      'Profile has expected fields',
      !!(profile.full_name && profile.headline && profile.social_links),
      `headline: "${profile.headline}"`
    );
  }
  console.log('');

  // -------------------------------------------------------------------------
  // 2. getProjects()
  // -------------------------------------------------------------------------
  console.log('📦 Projects');
  const projects = await getProjects();
  assert(
    'getProjects() returns 18 rows',
    projects.length === 18,
    `got ${projects.length} rows`
  );
  if (projects.length > 0) {
    assert(
      'Projects are ordered by display_order',
      projects[0].display_order <= projects[projects.length - 1].display_order,
      `first: ${projects[0].display_order}, last: ${projects[projects.length - 1].display_order}`
    );
    assert(
      'First project has expected fields',
      !!(projects[0].title && projects[0].slug),
      `title: "${projects[0].title}", slug: "${projects[0].slug}"`
    );
  }

  // getFeaturedProjects()
  const featured = await getFeaturedProjects();
  assert(
    'getFeaturedProjects() returns subset',
    featured.length > 0 && featured.length <= projects.length,
    `got ${featured.length} featured projects`
  );
  assert(
    'All featured projects have featured=true',
    featured.every(p => p.featured === true),
    `all ${featured.length} have featured=true`
  );

  // getProjectBySlug()
  if (projects.length > 0) {
    const testSlug = projects[0].slug;
    const bySlug = await getProjectBySlug(testSlug);
    assert(
      `getProjectBySlug("${testSlug}") returns match`,
      bySlug !== null && bySlug.slug === testSlug,
      bySlug ? `title: "${bySlug.title}"` : 'null'
    );
  }

  const nonexistent = await getProjectBySlug('this-slug-does-not-exist-12345');
  assert(
    'getProjectBySlug() returns null for missing slug',
    nonexistent === null,
    nonexistent ? 'unexpectedly found data' : 'correctly returned null'
  );
  console.log('');

  // -------------------------------------------------------------------------
  // 3. getSkills()
  // -------------------------------------------------------------------------
  console.log('🛠️  Skills');
  const skills = await getSkills();
  assert(
    'getSkills() returns 29 rows',
    skills.length === 29,
    `got ${skills.length} rows`
  );

  // getSkillsByCategory()
  const grouped = await getSkillsByCategory();
  const categories = Object.keys(grouped);
  assert(
    'getSkillsByCategory() returns 6 categories',
    categories.length === 6,
    `got ${categories.length} categories: ${categories.join(', ')}`
  );
  const totalGrouped = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);
  assert(
    'Grouped skills total matches flat count',
    totalGrouped === skills.length,
    `grouped total: ${totalGrouped}, flat total: ${skills.length}`
  );
  console.log('');

  // -------------------------------------------------------------------------
  // 4. getMedia()
  // -------------------------------------------------------------------------
  console.log('🖼️  Media');
  const media = await getMedia();
  assert(
    'getMedia() returns 9 rows',
    media.length === 9,
    `got ${media.length} rows`
  );
  if (media.length > 0) {
    assert(
      'Media entries have public_url',
      media.every(m => m.public_url && m.public_url.startsWith('http')),
      `all ${media.length} have valid public URLs`
    );
  }

  // getMediaByType()
  const images = await getMediaByType('image');
  assert(
    'getMediaByType("image") returns images only',
    images.length > 0 && images.every(m => m.type === 'image'),
    `got ${images.length} images`
  );
  console.log('');

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  console.log('='.repeat(60));
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;

  if (failed === 0) {
    console.log(`  🎉 ALL ${total} TESTS PASSED`);
  } else {
    console.log(`  ⚠️  ${passed}/${total} passed, ${failed} failed`);
    console.log('  Failed tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`    ❌ ${r.name} — ${r.details}`);
    });
  }
  console.log('='.repeat(60) + '\n');

  // Exit with error code if any test failed
  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
