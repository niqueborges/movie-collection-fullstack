import React from 'react';
import { Star, Clock, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import './MovieCard.css';

export function MovieCard({ movie }) {
  // Format duration from seconds to hrs/mins
  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="movie-card glass">
      <div className="card-image">
        <div className="image-placeholder">🎬</div>
        <div className="card-rating">
          <Star size={14} fill="#f59e0b" color="#f59e0b" />
          <span>{movie.averageRating > 0 ? Number(movie.averageRating).toFixed(1) : 'NEW'}</span>
        </div>
      </div>
      
      <div className="card-content">
        <div className="card-header">
          <h3 className="movie-title">{movie.title}</h3>
          <span className="movie-year">{movie.releaseYear || 'N/A'}</span>
        </div>
        
        <div className="movie-meta">
          <span className="genre-badge">{movie.genre || 'Uncategorized'}</span>
          <span className="duration">
            <Clock size={12} />
            {formatDuration(movie.durationSeconds)}
          </span>
        </div>
        
        <p className="movie-synopsis">
          {movie.description || movie.synopsis || 'No synopsis available for this movie.'}
        </p>
        
        <div className="card-actions">
          <Link to={`/movies/${movie.id}`} className="btn-details" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            <Info size={16} />
            More Details
          </Link>
        </div>
      </div>
    </div>
  );
}
