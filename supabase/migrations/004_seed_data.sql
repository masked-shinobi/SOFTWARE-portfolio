-- =============================================================================
-- Migration: 004_seed_data.sql
-- Description: Add skills UNIQUE constraint + Seed profile, 18 projects, 29 skills
-- Target: Supabase PostgreSQL (Stage A5)
-- Created: 2026-09-11
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. PRE-REQUISITE: Add UNIQUE constraint on skills.name
--    Required for ON CONFLICT (name) to work in the skills seed below.
-- ---------------------------------------------------------------------------
ALTER TABLE public.skills ADD CONSTRAINT skills_name_unique UNIQUE (name);

-- ---------------------------------------------------------------------------
-- 1. PROFILE SEED
-- ---------------------------------------------------------------------------
INSERT INTO public.profile (
  id,
  full_name,
  headline,
  short_bio,
  long_bio,
  avatar_url,
  social_links,
  resume_url
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Sanjay Baskar',
  'Design Engineer • Cloud & Security Developer',
  'Design Engineer building digital products that blend creativity with robust engineering. Non-linear thinking for a linear world.',
  'I''m a Design Engineer and 3rd-year Computer Science student at SRM Institute of Science and Technology (SRM IST), Chennai, maintaining a CGPA of 9.88 with Merit Scholarship. I specialize in building digital experiences at the intersection of creative frontends, scalable cloud platforms, and AI-driven intelligence. My experience spans AI/ML research at King Faisal University, web engineering at CJ Network, and Python software development at Infosys.',
  'portfolio/avatar/avatar.png',
  '{"github": "https://github.com/masked-shinobi", "linkedin": "https://www.linkedin.com/in/masked-shinobi-30a289377/", "email": "mailto:maskedprogrammer.in@gmail.com", "website": "https://github.com/masked-shinobi", "other": "https://app.notion.com/p/dsa-spreadsheet-sanjaybaskar/73b3a11dd45d8250922601672faf0c8c?v=8d43a11dd45d822db96b08a00fbbd6ef&source=copy_link"}'::jsonb,
  'https://drive.google.com/file/d/1QGokMLQhPTLxFkUjbR9Es9ofhuaZsnsl/view?usp=drive_link'
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  headline = EXCLUDED.headline,
  short_bio = EXCLUDED.short_bio,
  long_bio = EXCLUDED.long_bio,
  avatar_url = EXCLUDED.avatar_url,
  social_links = EXCLUDED.social_links,
  resume_url = EXCLUDED.resume_url;

-- ---------------------------------------------------------------------------
-- 2. PROJECTS SEED (18 projects)
-- ---------------------------------------------------------------------------
INSERT INTO public.projects (
  title, slug, tagline, description, tech_stack, live_url, github_url, thumbnail_url, images, featured, published, display_order
) VALUES
(
  'AI Resume Analyzer',
  'ai-resume-analyzer',
  'AI-powered resume parsing and analysis tool',
  'Intelligent resume parsing and evaluation platform that extracts structured insights, computes skill-job alignment scores, and provides actionable optimization feedback.',
  ARRAY['React', 'Node.js', 'JavaScript'],
  NULL,
  'https://github.com/masked-shinobi/AI-RESUME-ANALYSER',
  NULL,
  '{}',
  true, true, 1
),
(
  'Advanced RAG — Resembler',
  'advanced-rag-resembler',
  'Advanced RAG with semantic similarity search',
  'Production-ready retrieval-augmented generation pipeline integrating LangChain and FAISS vector embeddings to deliver precise, citation-grounded semantic search across proprietary document corpuses.',
  ARRAY['Python', 'LangChain', 'FAISS'],
  NULL,
  'https://github.com/masked-shinobi/MinorProject_resembler',
  NULL,
  '{}',
  true, true, 2
),
(
  'RAG Architecture',
  'rag-architecture',
  'Modular retrieval-augmented generation pipeline',
  'Core modular retrieval-augmented generation pipeline implemented in Python with optimized chunking, vector retrieval, and prompt synthesis workflows.',
  ARRAY['Python'],
  NULL,
  'https://github.com/masked-shinobi/minor_rag_architecture',
  NULL,
  '{}',
  false, true, 3
),
(
  'MCQ Master',
  'mcq-master',
  'Interactive MCQ test builder and assessment platform',
  'Full-stack exam management application supporting dynamic quiz generation, instant automated grading, question bank management, and real-time student analytics backed by Supabase.',
  ARRAY['React', 'Supabase', 'JavaScript'],
  NULL,
  'https://github.com/masked-shinobi/MCQ_test_Maker_website',
  NULL,
  '{}',
  true, true, 4
),
(
  'Shinobi Black VS Code Theme',
  'shinobi-black-theme',
  'OLED true-black VS Code theme with vibrant syntax highlighting',
  'Published VS Code extension crafted specifically for OLED screens, featuring high-contrast neon accents, refined token scoping, and reduced eye strain during extended programming sessions.',
  ARRAY['VS Code', 'JSON', 'JavaScript'],
  'https://marketplace.visualstudio.com/items?itemName=SanjayBaskar.shinobi-black-theme',
  'https://marketplace.visualstudio.com/items?itemName=SanjayBaskar.shinobi-black-theme',
  NULL,
  '{}',
  true, true, 5
),
(
  'CyberSecurity Web Centinel',
  'cybersecurity-web-centinel',
  'Animated cybersecurity showcase and monitoring website',
  'Interactive, highly choreographed web portfolio highlighting real-time threat intelligence patterns, interactive vulnerability counters, and fluid GSAP animation sequences.',
  ARRAY['JavaScript', 'GSAP', 'CSS'],
  NULL,
  'https://github.com/masked-shinobi/CyberSecurity_Web_Centinel',
  NULL,
  '{}',
  false, true, 6
),
(
  'GSAP 3D Website',
  'gsap-3d-website',
  'Immersive 3D web experience with GSAP and Three.js',
  'Creative engineering experiment exploring spatial canvas navigation, 3D mesh rendering, lighting models, and camera path choreography driven by GSAP timeline controls.',
  ARRAY['GSAP', 'Three.js', 'JavaScript'],
  NULL,
  'https://github.com/masked-shinobi/GSAP-website-3d',
  NULL,
  '{}',
  false, true, 7
),
(
  'Ecommerce Devin',
  'ecommerce-devin',
  'AI-assisted e-commerce workflow automation',
  'Modern e-commerce platform incorporating autonomous AI developer workflows for product catalog synchronization, cart flows, and reactive UI state management.',
  ARRAY['JavaScript', 'HTML', 'CSS'],
  NULL,
  'https://github.com/masked-shinobi/Ecommerce-devin-ai-workflow',
  NULL,
  '{}',
  false, true, 8
),
(
  'DevOps WebApp Cloud',
  'devops-webapp-cloud',
  'Cloud-deployed web application with automated CI/CD pipeline',
  'Production-grade cloud native web application deployment demonstrating immutable build pipelines, automated container testing, Docker image packaging, and cloud release automation.',
  ARRAY['CI/CD', 'Cloud', 'Docker'],
  NULL,
  'https://github.com/masked-shinobi/devops_webapp_cloud',
  NULL,
  '{}',
  true, true, 9
),
(
  'Tic Tac Toe Docker',
  'tic-tac-toe-docker',
  'Containerized game deployment with Docker',
  'Zero-dependency containerized micro-application packaged with minimal Docker multi-stage builds and isolated environment provisioning.',
  ARRAY['Docker', 'Linux', 'JavaScript'],
  NULL,
  'https://github.com/masked-shinobi/Tic-Tac-Toe-Docker',
  NULL,
  '{}',
  false, true, 10
),
(
  'Food Delivery App',
  'food-delivery-app',
  'Cross-platform mobile food ordering & delivery application',
  'Mobile application developed with React Native delivering responsive restaurant feeds, customized meal selections, cart persistence, and simulated order tracking.',
  ARRAY['React Native', 'JavaScript', 'Mobile'],
  NULL,
  'https://github.com/masked-shinobi/Food-delivery-app-reactnative',
  NULL,
  '{}',
  true, true, 11
),
(
  'Android File Manager',
  'android-file-manager',
  'Native Android file management application in Kotlin',
  'Native Android application written in Kotlin following modern Jetpack principles, featuring file system tree traversal, MIME type resolution, and storage permission management.',
  ARRAY['Kotlin', 'Android SDK'],
  NULL,
  'https://github.com/masked-shinobi/file-manager-app',
  NULL,
  '{}',
  false, true, 12
),
(
  'Organ Donation Platform',
  'organ-donation-platform',
  'Decentralized organ donor registry on Ethereum blockchain',
  'Decentralized biomedical application leveraging Solidity smart contracts to guarantee immutable donor consent, cryptographic confidentiality, and transparent recipient prioritization without intermediary tampering.',
  ARRAY['Solidity', 'Blockchain', 'Ethereum'],
  NULL,
  'https://github.com/masked-shinobi/Organ-Donation-Platform-BlockChain',
  NULL,
  '{}',
  true, true, 13
),
(
  'Email Simulator',
  'email-simulator',
  'Simulates SMTP/POP3 email protocols from scratch',
  'Computer networks implementation modeling email transfer protocols (SMTP/POP3) from sockets up, simulating packet exchanges, connection handshakes, and mailbox architectures.',
  ARRAY['Networking', 'Python', 'Sockets'],
  NULL,
  'https://github.com/masked-shinobi/email-simulator-CN',
  NULL,
  '{}',
  false, true, 14
),
(
  'DSA in C++',
  'dsa-in-cpp',
  'Data structures implemented in C++ with unit tests',
  'Robust, templated C++ implementations of linear and non-linear data structures alongside algorithmic solutions, fully verified through comprehensive Google Test (GTest) test suites.',
  ARRAY['C++', 'GTest', 'Algorithms'],
  NULL,
  'https://github.com/masked-shinobi/DSA-C-with-gtest',
  NULL,
  '{}',
  false, true, 15
),
(
  'PTS Algorithm',
  'pts-algorithm',
  'Custom algorithm design and optimization implementation',
  'Deep-dive algorithmic exploration exploring pattern transformation and computational search space minimization with formal performance benchmarking.',
  ARRAY['Algorithm Design', 'C++', 'Python'],
  NULL,
  'https://github.com/masked-shinobi/PTS-Algorithm',
  NULL,
  '{}',
  false, true, 16
),
(
  'Python Unit Testing',
  'python-unit-testing',
  'Unit testing patterns and best practices in Python',
  'Comprehensive reference suite showcasing clean code test strategies, boundary value analysis, mocking patterns, and automated test runners using Python unittest.',
  ARRAY['Python', 'unittest'],
  NULL,
  'https://github.com/masked-shinobi/code-unit-testing',
  NULL,
  '{}',
  false, true, 17
),
(
  'SRM Placement Compass',
  'srm-placement-compass',
  'Placement preparation guide & roadmap for SRM students',
  'Structured repository containing recruitment roadmaps, technical interview question breakdowns, system design notes, and coding practice curricula for SRM university engineering students.',
  ARRAY['Resource Hub', 'DSA', 'Markdown'],
  NULL,
  'https://github.com/masked-shinobi/srm-placement-compass',
  NULL,
  '{}',
  false, true, 18
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  tech_stack = EXCLUDED.tech_stack,
  live_url = EXCLUDED.live_url,
  github_url = EXCLUDED.github_url,
  thumbnail_url = EXCLUDED.thumbnail_url,
  images = EXCLUDED.images,
  featured = EXCLUDED.featured,
  published = EXCLUDED.published,
  display_order = EXCLUDED.display_order;

-- ---------------------------------------------------------------------------
-- 3. SKILLS SEED (29 skills)
-- ---------------------------------------------------------------------------
INSERT INTO public.skills (
  name, category, proficiency, icon_name, display_order
) VALUES
-- Languages
('TypeScript', 'Languages', 90, 'typescript', 1),
('JavaScript', 'Languages', 95, 'javascript', 2),
('Python', 'Languages', 92, 'python', 3),
('C++', 'Languages', 88, 'cplusplus', 4),
('Java', 'Languages', 82, 'java', 5),
('Kotlin', 'Languages', 78, 'kotlin', 6),
('Solidity', 'Languages', 74, 'solidity', 7),
-- Frameworks
('React', 'Frameworks', 92, 'react', 8),
('Next.js', 'Frameworks', 85, 'nextjs', 9),
('Node.js', 'Frameworks', 88, 'nodejs', 10),
('React Native', 'Frameworks', 80, 'react', 11),
('GSAP', 'Frameworks', 86, 'greensock', 12),
('Three.js', 'Frameworks', 76, 'threedotjs', 13),
('LangChain', 'Frameworks', 84, 'langchain', 14),
-- Databases
('PostgreSQL', 'Databases', 88, 'postgresql', 15),
('Supabase', 'Databases', 90, 'supabase', 16),
('FAISS', 'Databases', 80, 'faiss', 17),
-- Cloud & DevOps
('Docker', 'Cloud & DevOps', 84, 'docker', 18),
('Google Cloud Platform', 'Cloud & DevOps', 80, 'googlecloud', 19),
('CI/CD & GitHub Actions', 'Cloud & DevOps', 85, 'githubactions', 20),
('Kubernetes', 'Cloud & DevOps', 75, 'kubernetes', 21),
-- Tools
('Git & GitHub', 'Tools', 92, 'git', 22),
('VS Code', 'Tools', 95, 'vscode', 23),
('Linux', 'Tools', 86, 'linux', 24),
('Google Test (GTest)', 'Tools', 80, 'googletest', 25),
-- Other
('RAG Architecture', 'Other', 88, 'openai', 26),
('Data Structures & Algorithms', 'Other', 90, 'cplusplus', 27),
('Unit Testing & TDD', 'Other', 85, 'pytest', 28),
('Blockchain & Smart Contracts', 'Other', 78, 'ethereum', 29)
ON CONFLICT (name) DO UPDATE SET
  category = EXCLUDED.category,
  proficiency = EXCLUDED.proficiency,
  icon_name = EXCLUDED.icon_name,
  display_order = EXCLUDED.display_order;

-- ---------------------------------------------------------------------------
-- Done! Seeded:
--   - 1 profile row (Sanjay Baskar)
--   - 18 projects (with slugs, tech stacks, descriptions)
--   - 29 skills (across 6 categories)
--   - Project thumbnails/images set to NULL (to be added later)
-- ---------------------------------------------------------------------------
