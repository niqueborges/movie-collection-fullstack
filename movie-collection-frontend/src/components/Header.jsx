import React from 'react';
import { Search, User, Film } from 'lucide-react';
import './Header.css';

export function Header() {
  return (
    <header className="header glass">
      <div className="header-container">
        
        <div className="logo-container">
          <Film className="logo-icon" size={28} strokeWidth={2.5} />
          <h1 className="logo">MovieCollection</h1>
        </div>
        
        <div className="search-bar">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search movies, genres or directors..." 
            className="search-input"
          />
        </div>

        <nav className="nav-actions">
          <button className="btn-secondary">Sign Up</button>
          <button className="btn-primary">
            <User size={18} strokeWidth={2.5} />
            Sign In
          </button>
        </nav>

      </div>
    </header>
  );
}
