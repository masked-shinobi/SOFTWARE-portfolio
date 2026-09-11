// =============================================================================
// Data Access — Barrel Export
// =============================================================================
// Clean imports: import { getProfile, getProjects, getSkills } from '@/lib/data';
// =============================================================================

// Profile
export { getProfile } from './profile';

// Projects
export { getProjects, getFeaturedProjects, getProjectBySlug } from './projects';

// Skills
export { getSkills, getSkillsByCategory } from './skills';

// Media
export { getMedia, getMediaByType } from './media';

// Re-export types for convenience
export type {
  Profile,
  Project,
  Skill,
  Media,
  MediaType,
  SocialLinks,
  Database,
} from '@/types/database.types';
