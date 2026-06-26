import React from 'react';
import './Header.css';

export function Header() {
  return (
    <header className="header glass">
      <div className="header-container">
        <h1 className="logo">🍿 Movie Collection</h1>
        <nav>
          <button className="btn-primary">Entrar</button>
        </nav>
      </div>
    </header>
  );
}
