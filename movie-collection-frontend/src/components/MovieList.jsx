import React from 'react';
import { SearchX, Film } from 'lucide-react';
import { MovieCard } from './MovieCard';
import './MovieList.css';

export function MovieList({ movies, loading, error, searchQuery = '' }) {
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
      <div className="state-container empty-state glass">
        {searchQuery ? (
          <>
            <SearchX size={48} className="empty-icon" strokeWidth={1.5} />
            <h3>No results found</h3>
            <p>We couldn't find any movies matching "{searchQuery}".</p>
          </>
        ) : (
          <>
            <Film size={48} className="empty-icon" strokeWidth={1.5} />
            <h3>Your collection is empty</h3>
            <p>Start adding some amazing movies to your catalog!</p>
          </>
        )}
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
