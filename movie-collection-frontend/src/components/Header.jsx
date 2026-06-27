import React, { useState } from 'react';
import { Search, User, Film, LogOut, Bookmark, PlusCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      if (searchTerm.trim()) {
        navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
      } else {
        navigate('/');
      }
    }
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
            placeholder="Search movies..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        <nav className="nav-actions">
          {isAuthenticated ? (
            <>
              <Link to="/movies/new" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', gap: '0.5rem', alignItems: 'center', marginRight: '0.5rem' }}>
                <PlusCircle size={18} />
                Add Movie
              </Link>
              <Link to="/watchlist" className="btn-secondary" style={{ textDecoration: 'none', display: 'flex', gap: '0.5rem', alignItems: 'center', marginRight: '0.5rem' }}>
                <Bookmark size={18} />
                Watchlist
              </Link>
              <Link to="/profile" className="btn-secondary" style={{ textDecoration: 'none', display: 'flex', gap: '0.5rem', alignItems: 'center', marginRight: '1rem' }}>
                <User size={18} />
                Profile
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
