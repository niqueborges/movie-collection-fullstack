import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchMyReviews, deleteReview, fetchMovieById } from '../services/api';
import { Star, Trash2, Mail, User as UserIcon, MessageSquare } from 'lucide-react';
import './Profile.css';

export function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);
        // fetchMyReviews returns an array of ResponseReviewDto
        const myReviews = await fetchMyReviews();
        
        // We might want to fetch movie titles if the backend doesn't populate them natively
        // Let's assume the backend provides movieId, we will fetch the movie titles to display
        const enrichedReviews = await Promise.all(
          myReviews.map(async (review) => {
            try {
              const movieData = await fetchMovieById(review.movieId);
              return { ...review, movieTitle: movieData.title };
            } catch (err) {
              return { ...review, movieTitle: 'Unknown Movie' };
            }
          })
        );
        
        setReviews(enrichedReviews);
      } catch (err) {
        setError(err.message || 'Failed to load your reviews.');
      } finally {
        setLoading(false);
      }
    }
    
    if (user) {
      loadReviews();
    }
  }, [user]);

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await deleteReview(reviewId);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (err) {
      alert(err.message || 'Failed to delete review');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  if (!user) {
    return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Please log in to view your profile.</div>;
  }

  return (
    <main className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {getInitials(user.name)}
        </div>
        <div className="profile-info">
          <h1>{user.name}</h1>
          <p><Mail size={16} /> {user.email}</p>
        </div>
      </div>

      <div className="reviews-section">
        <h2><MessageSquare size={24} /> My Reviews</h2>
        
        {loading ? (
          <p>Loading your reviews...</p>
        ) : error ? (
          <p style={{ color: '#ef4444' }}>{error}</p>
        ) : reviews.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>You haven't reviewed any movies yet.</p>
        ) : (
          <div className="reviews-grid">
            {reviews.map(review => (
              <div key={review.id} className="review-card">
                <button 
                  className="btn-delete-review"
                  onClick={() => handleDelete(review.id)}
                  title="Delete Review"
                >
                  <Trash2 size={18} />
                </button>
                
                <h3 
                  className="review-movie-title"
                  onClick={() => navigate(`/movies/${review.movieId}`)}
                >
                  {review.movieTitle}
                </h3>
                
                <div className="review-rating">
                  <Star size={16} fill="#f59e0b" />
                  <span>{Number(review.rating).toFixed(1)} / 10</span>
                </div>
                
                {review.comment && (
                  <p className="review-comment">"{review.comment}"</p>
                )}
                
                <div className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
