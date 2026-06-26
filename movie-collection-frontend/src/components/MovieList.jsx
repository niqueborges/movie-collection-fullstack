import React from 'react';
import { MovieCard } from './MovieCard';
import './MovieList.css';

export function MovieList({ movies, loading, error }) {
  if (loading) {
    return (
      <div className="state-container glass">
        <div className="spinner"></div>
        <p>Loading catalog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-container error glass">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="state-container glass">
        <p>No movies found in your collection.</p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map(movie => (
        <MovieCard key={movie.id || movie._id} movie={movie} />
      ))}
    </div>
  );
}
