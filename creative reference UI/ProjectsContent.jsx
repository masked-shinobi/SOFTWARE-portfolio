import React, { useState, useRef, useCallback, useEffect } from 'react';
import useProjects from '../hooks/useProjects';

// Category filter pills
function CategoryFilter({ active, onSelect, projects, categories }) {
  return (
    <div className="bubble-category-filter">
      <button
        className={`bubble-filter-pill ${active === 'all' ? 'active' : ''}`}
        onClick={() => onSelect('all')}
      >
        All <span className="bubble-filter-count">{projects.length}</span>
      </button>
      {categories.map(cat => {
        const count = projects.filter(p => p.category === cat.id).length;
        return (
          <button
            key={cat.id}
            className={`bubble-filter-pill ${active === cat.id ? 'active' : ''}`}
            onClick={() => onSelect(cat.id)}
            style={{ '--filter-color': cat.color }}
          >
            <span className="bubble-filter-icon">{cat.icon}</span>
            {cat.name}
            <span className="bubble-filter-count">{count}</span>
          </button>
        );
      })}
    </div>
  );
}

// Desktop: Fisheye / Magnetic Bubble Grid
function BubbleGrid({ filteredProjects, onSelect, getCategory, techIcons }) {
  const gridRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [selectedProject, setSelectedProject] = useState(null);

  const handleMouseMove = useCallback((e) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: -1000, y: -1000 });
  }, []);

  const handleBubbleClick = (project) => {
    setSelectedProject(selectedProject?.id === project.id ? null : project);
    if (onSelect) onSelect(project);
  };

  // Calculate bubble positions in an organic scattered layout
  const getBubbleLayout = (count) => {
    const positions = [];
    const cols = Math.ceil(Math.sqrt(count * 1.5)) || 1;
    const rows = Math.ceil(count / cols);

    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const offsetX = row % 2 === 1 ? 40 : 0; // Stagger alternate rows
      positions.push({
        x: 60 + col * (100) + offsetX + (Math.sin(i * 2.1) * 15),
        y: 60 + row * (100) + (Math.cos(i * 1.7) * 10),
      });
    }
    return positions;
  };

  const positions = getBubbleLayout(filteredProjects.length);

  return (
    <div className="bubble-grid-wrapper">
      <div
        className="bubble-grid"
        ref={gridRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {filteredProjects.map((project, i) => {
          const cat = getCategory(project.category);
          const pos = positions[i] || { x: 50, y: 50 };

          // Fisheye calculation
          const dx = mousePos.x - pos.x;
          const dy = mousePos.y - pos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 180;
          const influence = Math.max(0, 1 - distance / maxDist);
          const scale = 1 + influence * 0.6; // Max 1.6x scale
          const pushX = influence > 0.1 ? (-dx * influence * 0.15) : 0;
          const pushY = influence > 0.1 ? (-dy * influence * 0.15) : 0;
          const isNear = distance < 120;

          return (
            <div
              key={project.id}
              className={`project-bubble ${isNear ? 'near' : ''} ${selectedProject?.id === project.id ? 'selected' : ''}`}
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: `translate(-50%, -50%) translate(${pushX}px, ${pushY}px) scale(${scale})`,
                '--bubble-gradient': cat?.gradient || 'linear-gradient(135deg, #666, #999)',
                '--bubble-color': cat?.color || '#666',
                zIndex: isNear ? 10 : 1,
                animationDelay: `${i * 0.04}s`,
              }}
              onClick={() => handleBubbleClick(project)}
            >
              <div className="bubble-inner">
                <span className="bubble-category-icon">{cat?.icon || '📁'}</span>
                <div className="bubble-tech-dots">
                  {(project.stack || []).slice(0, 3).map(t => (
                    <span
                      key={t}
                      className="bubble-tech-dot"
                      style={{ background: techIcons[t]?.color || '#888' }}
                      title={techIcons[t]?.name || t}
                    />
                  ))}
                </div>
              </div>

              {/* Hover label */}
              <div className="bubble-label">
                <span className="bubble-name">{project.name}</span>
                <span className="bubble-cat-tag">{cat?.name || project.category}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected project detail card */}
      {selectedProject && (
        <ProjectDetailCard
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          getCategory={getCategory}
          techIcons={techIcons}
        />
      )}
    </div>
  );
}

// Project detail card (appears when bubble is clicked)
function ProjectDetailCard({ project, onClose, getCategory, techIcons }) {
  const cat = getCategory(project.category);
  const projectUrl = project.url || project.github;
  const isGithubLink = projectUrl?.includes('github.com');

  return (
    <div className="project-detail-overlay" onClick={onClose}>
      <div className="project-detail-card" onClick={e => e.stopPropagation()}>
        <button className="project-detail-close" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="project-detail-header" style={{ background: cat?.gradient || 'linear-gradient(135deg, #444, #666)' }}>
          <span className="project-detail-icon">{cat?.icon || '📁'}</span>
          <span className="project-detail-category">{cat?.name || project.category}</span>
        </div>

        <div className="project-detail-body">
          {project.image_url && (
            <div style={{ marginBottom: '14px', borderRadius: '10px', overflow: 'hidden', maxHeight: '180px' }}>
              <img 
                src={project.image_url} 
                alt={project.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
          )}

          <h3 className="project-detail-name">{project.name}</h3>
          <p className="project-detail-desc">{project.description}</p>

          <div className="project-detail-stack">
            {(project.stack || []).map(t => (
              <span
                key={t}
                className="tech-pill"
                style={{
                  '--pill-color': techIcons[t]?.color || '#888',
                  '--pill-bg': techIcons[t]?.bg || 'rgba(136,136,136,0.15)',
                }}
              >
                {techIcons[t]?.name || t}
              </span>
            ))}
          </div>

          {projectUrl && (
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-detail-link"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              {isGithubLink ? 'View on GitHub →' : 'Open Project →'}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// Mobile: Card scatter layout
function MobileCardGrid({ filteredProjects, getCategory, techIcons }) {
  return (
    <div className="mobile-project-grid">
      {filteredProjects.map((project, i) => {
        const cat = getCategory(project.category);
        const projectUrl = project.url || project.github;
        return (
          <a
            key={project.id}
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-project-card"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <div className="mobile-card-top" style={{ background: cat?.gradient || 'linear-gradient(135deg, #444, #666)' }}>
              <span className="mobile-card-icon">{cat?.icon || '📁'}</span>
              <span className="mobile-card-category">{cat?.name || project.category}</span>
            </div>
            <div className="mobile-card-body">
              <h3 className="mobile-card-title">{project.name}</h3>
              <p className="mobile-card-desc">{project.description}</p>
              <div className="mobile-card-stack">
                {(project.stack || []).map(t => (
                  <span
                    key={t}
                    className="tech-pill-sm"
                    style={{ '--pill-color': techIcons[t]?.color || '#888' }}
                  >
                    {techIcons[t]?.name || t}
                  </span>
                ))}
              </div>
            </div>
            <div className="mobile-card-arrow">→</div>
          </a>
        );
      })}
    </div>
  );
}

// Main ProjectsContent
export default function ProjectsContent() {
  const { projects, categories, techIcons, getCategory } = useProjects();
  const [activeFilter, setActiveFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const visibleProjects = projects.filter(p => p.is_visible !== false);

  const filtered = activeFilter === 'all'
    ? visibleProjects
    : visibleProjects.filter(p => p.category === activeFilter);

  return (
    <div className="projects-content">
      <header className="projects-header">
        <div className="projects-header-badge">
          <span className="projects-badge-dot" />
          {visibleProjects.length} Projects · {categories.length} Categories
        </div>
        <h1 className="projects-title">Project Catalog</h1>
        <p className="projects-subtitle">
          Explore my work across AI, Web, DevOps, Mobile & more
        </p>
      </header>

      <CategoryFilter 
        active={activeFilter} 
        onSelect={setActiveFilter} 
        projects={visibleProjects} 
        categories={categories} 
      />

      {isMobile ? (
        <MobileCardGrid 
          filteredProjects={filtered} 
          getCategory={getCategory} 
          techIcons={techIcons} 
        />
      ) : (
        <BubbleGrid 
          filteredProjects={filtered} 
          getCategory={getCategory} 
          techIcons={techIcons} 
        />
      )}

      <div className="projects-footer">
        <span>Built by </span>
        <a href="https://github.com/masked-shinobi" target="_blank" rel="noopener noreferrer">
          masked-shinobi
        </a>
      </div>
    </div>
  );
}
