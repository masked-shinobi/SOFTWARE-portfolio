/**
 * upload_images.mjs
 * Uploads local portfolio images to Supabase Storage (portfolio bucket).
 * Uses the service_role key to bypass RLS.
 *
 * Usage: node scripts/upload_images.mjs
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// ── Supabase config ──────────────────────────────────────────────────────────
// Read from .env.local manually (no dotenv dependency needed)
const envPath = path.join(PROJECT_ROOT, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      envVars[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
    }
  }
});

const SUPABASE_URL = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const SERVICE_ROLE_KEY = envVars['SUPABASE_SERVICE_ROLE_KEY'];

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const BUCKET = 'portfolio';

// ── File mapping: local path → storage path ──────────────────────────────────
const IMAGE_MAP = [
  {
    localPath: 'public/images/Hero-anime.png',
    storagePath: 'avatar/avatar.png',
    altText: 'Sanjay Baskar - Anime Character Avatar',
    type: 'image',
  },
  {
    localPath: 'public/images/Hero-image.png',
    storagePath: 'assets/Hero-image.png',
    altText: 'Hero section light sticker',
    type: 'image',
  },
  {
    localPath: 'public/images/Hero-image-dark.png',
    storagePath: 'assets/Hero-image-dark.png',
    altText: 'Hero section dark sticker',
    type: 'image',
  },
  {
    localPath: 'public/images/Chat-image.png',
    storagePath: 'assets/Chat-image.png',
    altText: 'Sanjay AI Mascot Avatar',
    type: 'image',
  },
  {
    localPath: 'public/images/Contact-logo.png',
    storagePath: 'assets/Contact-logo.png',
    altText: 'Contact card logo',
    type: 'image',
  },
  {
    localPath: 'public/images/floating-stickers/image.png',
    storagePath: 'stickers/shinobi-theme.png',
    altText: 'Shinobi Black VS Code Theme banner sticker',
    type: 'image',
  },
  {
    localPath: 'public/images/floating-stickers/sticker-1.png',
    storagePath: 'stickers/sticker-1.png',
    altText: 'Floating decorative sticker 1',
    type: 'image',
  },
  {
    localPath: 'public/images/floating-stickers/sticker-2.png',
    storagePath: 'stickers/sticker-2.png',
    altText: 'Floating decorative sticker 2',
    type: 'image',
  },
  {
    localPath: 'public/images/floating-stickers/sticker-3.png',
    storagePath: 'stickers/sticker-3.png',
    altText: 'Floating decorative sticker 3',
    type: 'image',
  },
];

// ── Helper: get MIME type from extension ──────────────────────────────────────
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeMap = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
  };
  return mimeMap[ext] || 'application/octet-stream';
}

// ── Upload a single file ─────────────────────────────────────────────────────
async function uploadFile(item) {
  const absolutePath = path.join(PROJECT_ROOT, item.localPath);

  if (!fs.existsSync(absolutePath)) {
    console.error(`  ❌ File not found: ${item.localPath}`);
    return null;
  }

  const fileBuffer = fs.readFileSync(absolutePath);
  const mimeType = getMimeType(absolutePath);
  const fileStats = fs.statSync(absolutePath);

  console.log(`  📤 Uploading: ${item.localPath} → ${BUCKET}/${item.storagePath} (${(fileStats.size / 1024).toFixed(1)} KB)`);

  // Upload with upsert to allow re-runs
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(item.storagePath, fileBuffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) {
    console.error(`  ❌ Upload failed: ${error.message}`);
    return null;
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(item.storagePath);

  const publicUrl = urlData.publicUrl;
  console.log(`  ✅ Uploaded → ${publicUrl}`);

  return {
    storage_path: `${BUCKET}/${item.storagePath}`,
    public_url: publicUrl,
    alt_text: item.altText,
    type: item.type,
    filename: path.basename(item.localPath),
    mime_type: mimeType,
    size_bytes: fileStats.size,
  };
}

// ── Generate media seed SQL ──────────────────────────────────────────────────
function generateMediaSQL(mediaRecords) {
  const header = `-- =============================================================================
-- Migration: 005_seed_media.sql
-- Description: Seed media table with uploaded image metadata
-- Generated: ${new Date().toISOString().slice(0, 10)}
-- =============================================================================

INSERT INTO public.media (
  storage_path, public_url, alt_text, type, filename, mime_type, size_bytes
) VALUES`;

  const values = mediaRecords.map((r, i) => {
    const comma = i < mediaRecords.length - 1 ? ',' : '';
    return `(
  '${r.storage_path}',
  '${r.public_url}',
  '${r.alt_text.replace(/'/g, "''")}',
  '${r.type}',
  '${r.filename}',
  '${r.mime_type}',
  ${r.size_bytes}
)${comma}`;
  }).join('\n');

  const footer = `
ON CONFLICT DO NOTHING;
`;

  return header + '\n' + values + footer;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║  Portfolio Image Upload → Supabase Storage                  ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log(`\n📂 Bucket: ${BUCKET}`);
  console.log(`🔗 Supabase: ${SUPABASE_URL}`);
  console.log(`📁 Files to upload: ${IMAGE_MAP.length}\n`);

  const results = [];
  let successCount = 0;
  let failCount = 0;

  for (const item of IMAGE_MAP) {
    const result = await uploadFile(item);
    if (result) {
      results.push(result);
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n────────────────────────────────────────────────────');
  console.log(`✅ Uploaded: ${successCount} / ${IMAGE_MAP.length}`);
  if (failCount > 0) console.log(`❌ Failed: ${failCount}`);

  // Generate and save media seed SQL
  if (results.length > 0) {
    const mediaSql = generateMediaSQL(results);
    const sqlPath = path.join(PROJECT_ROOT, 'supabase', 'migrations', '005_seed_media.sql');
    fs.writeFileSync(sqlPath, mediaSql, 'utf-8');
    console.log(`\n📝 Generated media seed SQL: supabase/migrations/005_seed_media.sql`);
    console.log('   → Run this SQL in the Supabase SQL Editor to seed the media table.');
  }

  // Verify one image loads
  if (results.length > 0) {
    console.log(`\n🔍 Verification URL (avatar):`);
    const avatar = results.find(r => r.filename === 'Hero-anime.png');
    if (avatar) {
      console.log(`   ${avatar.public_url}`);
    }
  }

  console.log('\n🎉 Done!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
