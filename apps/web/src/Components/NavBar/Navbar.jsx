import React, { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="nav-inner">
        <div className="logo">
          <span className="logo-icon">🌱</span>
          <span className="logo-text">CropAI</span>
        </div>
        
        <ul className={`nav-links ${isMobileMenuOpen ? 'nav-links-mobile' : ''}`}>
          <li className="nav-cta-mobile">
            <a href="#download" className="btn-nav">
              <span className="btn-icon"></span>
              Download Now
            </a>
          </li>
        </ul>

        <div className="nav-actions">
          <a href="#download" className="btn-nav btn-nav-desktop">
            <span className="btn-icon"></span>
            Download 
          </a>
          
          <button 
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      
      
      {isMobileMenuOpen && (
        <div 
          className="mobile-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}