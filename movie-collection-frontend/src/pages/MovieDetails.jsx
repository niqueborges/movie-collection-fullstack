import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Calendar, Film, BookmarkPlus, BookmarkMinus, ArrowLeft, Edit, MessageSquare } from 'lucide-react';
import { fetchMovieById, addToWatchlist, removeFromWatchlist, fetchWatchlist, fetchMyReviews, createOrUpdateReview } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './MovieDetails.css';

export function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Review states
  const [userReview, setUserReview] = useState(null);
  const [rating, setRating] = useState(10);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const movieData = await fetchMovieById(id);
        setMovie(movieData);
        setError(null);

        // Check if movie is in watchlist if user is logged in
        if (isAuthenticated) {
          try {
            const watchlist = await fetchWatchlist();
            // Assuming watchlist returns an array of objects that have a movieId or id
            // We need to check based on the structure returned by the API
            // For now, let's assume it returns { items: [{ movieId: '...' }] } or similar
            const items = watchlist.data || watchlist.items || watchlist;
            if (Array.isArray(items)) {
              // The watchlist from backend might return the movie relation or just IDs
              // Let's check if any item's movie ID matches our current ID
              const found = items.some(item => 
                item.movieId === id || 
                (item.movie && item.movie.id === id) || 
                item.id === id
              );
              setIsInWatchlist(found);
            }
          } catch (err) {
            console.error('Could not fetch watchlist to check status', err);
          }

          try {
            const reviews = await fetchMyReviews();
            const existingReview = reviews.find(r => r.movieId === id);
            if (existingReview) {
              setUserReview(existingReview);
              setRating(existingReview.rating);
              setComment(existingReview.comment || '');
            }
          } catch (err) {
            console.error('Could not fetch reviews', err);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, isAuthenticated]);

  const handleWatchlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setActionLoading(true);
      if (isInWatchlist) {
        await removeFromWatchlist(id);
        setIsInWatchlist(false);
      } else {
        await addToWatchlist(id);
        setIsInWatchlist(true);
      }
    } catch (err) {
      alert(err.message || 'Failed to update watchlist');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      setReviewLoading(true);
      const newReview = await createOrUpdateReview({ movieId: id, rating: Number(rating), comment });
      setUserReview(newReview);
      
      // refresh movie to get new average rating
      const updatedMovie = await fetchMovieById(id);
      setMovie(updatedMovie);
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>Carregando detalhes...</div>;
  if (error) return <div style={{ color: '#ef4444', textAlign: 'center', marginTop: '4rem' }}>{error}</div>;
  if (!movie) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Filme não encontrado.</div>;

  return (
    <main className="movie-details-container">
      <button 
        onClick={() => navigate(-1)} 
        className="btn-secondary" 
        style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="movie-details-card">
        <div className="details-header">
          <div className="details-title">
            <h1>{movie.title}</h1>
            <div className="details-meta">
              <span className="genre-badge" style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem' }}>
                {movie.genre || 'Uncategorized'}
              </span>
              <div className="details-meta-item">
                <Calendar size={16} />
                {movie.releaseYear || 'N/A'}
              </div>
              <div className="details-meta-item">
                <Clock size={16} />
                {formatDuration(movie.durationSeconds)}
              </div>
              <div className="details-meta-item rating">
                <Star size={16} fill="#f59e0b" />
                {movie.averageRating > 0 ? Number(movie.averageRating).toFixed(1) : 'NEW'}
              </div>
            </div>
          </div>
          
          <div className="details-actions" style={{ display: 'flex', gap: '1rem' }}>
            {isAuthenticated && (
              <button 
                className="btn-secondary"
                onClick={() => navigate(`/movies/${id}/edit`)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Edit size={18} />
                Edit Movie
              </button>
            )}
            
            <button 
              className={`btn-watchlist ${isInWatchlist ? 'remove' : 'add'}`}
              onClick={handleWatchlistToggle}
              disabled={actionLoading}
            >
              {actionLoading ? (
                'Processing...'
              ) : isInWatchlist ? (
                <>
                  <BookmarkMinus size={18} />
                  Remove from Watchlist
                </>
              ) : (
                <>
                  <BookmarkPlus size={18} />
                  Add to Watchlist
                </>
              )}
            </button>
          </div>
        </div>

        <div className="details-content">
          <div className="details-poster">
            🎬
          </div>
          <div className="details-info">
            <h2>Synopsis</h2>
            <p>{movie.description || movie.synopsis || 'No synopsis available for this movie.'}</p>
            
            <div className="details-info-grid">
              <div className="info-group">
                <span className="info-label">Director</span>
                <span className="info-value">{movie.director || 'Unknown'}</span>
              </div>
              <div className="info-group">
                <span className="info-label">Original Language</span>
                <span className="info-value">{movie.language || 'English'}</span>
              </div>
              <div className="info-group">
                <span className="info-label">Status</span>
                <span className="info-value">{movie.status || 'Released'}</span>
              </div>
            </div>
          </div>
        </div>

        {isAuthenticated && (
          <div className="review-section" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <MessageSquare size={20} />
              {userReview ? 'Your Review' : 'Rate this Movie'}
            </h2>
            <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(30,41,59,0.5)', padding: '1.5rem', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label htmlFor="rating" style={{ fontWeight: 'bold' }}>Rating (0 - 10):</label>
                <input 
                  type="number" 
                  id="rating"
                  min="0" 
                  max="10" 
                  step="0.1" 
                  value={rating} 
                  onChange={e => setRating(e.target.value)}
                  style={{ width: '80px', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                  required
                />
                <Star size={20} fill="#f59e0b" color="#f59e0b" />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="comment" style={{ fontWeight: 'bold' }}>Comment:</label>
                <textarea 
                  id="comment"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="What did you think of the movie?"
                  style={{ minHeight: '80px', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white', resize: 'vertical' }}
                />
              </div>

              <button 
                type="submit" 
                className="btn-submit" 
                disabled={reviewLoading}
                style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
              >
                {reviewLoading ? 'Saving...' : userReview ? 'Update Review' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
