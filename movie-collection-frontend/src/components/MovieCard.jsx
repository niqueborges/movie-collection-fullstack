import React from 'react';
import './MovieCard.css';

export function MovieCard({ movie }) {
  return (
    <div className="movie-card glass">
      <div className="card-image">
        <div className="image-placeholder">🎬</div>
      </div>
      <div className="card-content">
        <h3 className="movie-title">{movie.title}</h3>
        <span className="movie-year">{movie.releaseYear || 'N/A'}</span>
        <p className="movie-synopsis">{movie.synopsis || 'Sem sinopse disponível.'}</p>
      </div>
    </div>
  );
}
