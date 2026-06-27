import React from 'react';
import { Search, User, Film, LogOut, Bookmark } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header glass">
      <div className="header-container">
        
        <Link to="/" className="logo-container" style={{ textDecoration: 'none' }}>
          <Film className="logo-icon" size={28} strokeWidth={2.5} />
          <h1 className="logo">MovieCollection</h1>
        </Link>
        
        <div className="search-bar">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search movies, genres or directors..." 
            className="search-input"
          />
        </div>

        <nav className="nav-actions">
          {isAuthenticated ? (
            <>
              <Link to="/watchlist" className="btn-secondary" style={{ textDecoration: 'none', display: 'flex', gap: '0.5rem', alignItems: 'center', marginRight: '1rem' }}>
                <Bookmark size={18} />
                Watchlist
              </Link>
              <div className="user-profile">
                <div className="avatar">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="user-name">{user?.name}</span>
              </div>
              <button className="btn-secondary" onClick={handleLogout} title="Sign Out">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="btn-secondary" style={{ textDecoration: 'none', display: 'flex' }}>
                Sign Up
              </Link>
              <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>
                <User size={18} strokeWidth={2.5} />
                Sign In
              </Link>
            </>
          )}
        </nav>

      </div>
    </header>
  );
}
