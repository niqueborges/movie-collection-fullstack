import React from 'react';
import { MovieCard } from './MovieCard';
import './MovieList.css';

export function MovieList({ movies, loading, error }) {
  if (loading) {
    return (
      <div className="state-container glass">
        <div className="spinner"></div>
        <p>Carregando catálogo...</p>
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
        <p>Nenhum filme encontrado na sua coleção.</p>
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
