-- =============================================================================
-- Migration: 005_seed_media.sql
-- Description: Seed media table with uploaded image metadata
-- Generated: 2026-09-11
-- =============================================================================

INSERT INTO public.media (
  storage_path, public_url, alt_text, type, filename, mime_type, size_bytes
) VALUES
(
  'portfolio/avatar/avatar.png',
  'https://jhrlkrkwynsucdrodxza.supabase.co/storage/v1/object/public/portfolio/avatar/avatar.png',
  'Sanjay Baskar - Anime Character Avatar',
  'image',
  'Hero-anime.png',
  'image/png',
  3368064
),
(
  'portfolio/assets/Hero-image.png',
  'https://jhrlkrkwynsucdrodxza.supabase.co/storage/v1/object/public/portfolio/assets/Hero-image.png',
  'Hero section light sticker',
  'image',
  'Hero-image.png',
  'image/png',
  2411529
),
(
  'portfolio/assets/Hero-image-dark.png',
  'https://jhrlkrkwynsucdrodxza.supabase.co/storage/v1/object/public/portfolio/assets/Hero-image-dark.png',
  'Hero section dark sticker',
  'image',
  'Hero-image-dark.png',
  'image/png',
  2408344
),
(
  'portfolio/assets/Chat-image.png',
  'https://jhrlkrkwynsucdrodxza.supabase.co/storage/v1/object/public/portfolio/assets/Chat-image.png',
  'Sanjay AI Mascot Avatar',
  'image',
  'Chat-image.png',
  'image/png',
  810901
),
(
  'portfolio/assets/Contact-logo.png',
  'https://jhrlkrkwynsucdrodxza.supabase.co/storage/v1/object/public/portfolio/assets/Contact-logo.png',
  'Contact card logo',
  'image',
  'Contact-logo.png',
  'image/png',
  114389
),
(
  'portfolio/stickers/shinobi-theme.png',
  'https://jhrlkrkwynsucdrodxza.supabase.co/storage/v1/object/public/portfolio/stickers/shinobi-theme.png',
  'Shinobi Black VS Code Theme banner sticker',
  'image',
  'image.png',
  'image/png',
  50242
),
(
  'portfolio/stickers/sticker-1.png',
  'https://jhrlkrkwynsucdrodxza.supabase.co/storage/v1/object/public/portfolio/stickers/sticker-1.png',
  'Floating decorative sticker 1',
  'image',
  'sticker-1.png',
  'image/png',
  662544
),
(
  'portfolio/stickers/sticker-2.png',
  'https://jhrlkrkwynsucdrodxza.supabase.co/storage/v1/object/public/portfolio/stickers/sticker-2.png',
  'Floating decorative sticker 2',
  'image',
  'sticker-2.png',
  'image/png',
  928632
),
(
  'portfolio/stickers/sticker-3.png',
  'https://jhrlkrkwynsucdrodxza.supabase.co/storage/v1/object/public/portfolio/stickers/sticker-3.png',
  'Floating decorative sticker 3',
  'image',
  'sticker-3.png',
  'image/png',
  1534044
)
ON CONFLICT DO NOTHING;
