import React from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ onNavigate }) {
  const handleNav = (e, target) => {
    e.preventDefault();
    if (onNavigate) onNavigate(target);
  };

  return (
    <nav id="navbar">
      <div className="nav-right">
        <ThemeToggle />
        <a href="#" id="nav-home" onClick={(e) => handleNav(e, 'home')}>Home</a>
        <a href="#" id="nav-work" onClick={(e) => handleNav(e, 'work')}>Work</a>
        <a href="#" id="nav-about" onClick={(e) => handleNav(e, 'about')}>About</a>
        <a href="#" id="nav-contact" onClick={(e) => handleNav(e, 'contact')}>Contact</a>
      </div>
    </nav>
  );
}
