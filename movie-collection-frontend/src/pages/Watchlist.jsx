import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Film } from 'lucide-react';
import { fetchWatchlist } from '../services/api';
import { MovieList } from '../components/MovieList';
import './Watchlist.css';

export function Watchlist() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchWatchlist();
        
        // Extract movies from the watchlist items
        let extractedMovies = [];
        const items = data.data || data.items || data;
        
        if (Array.isArray(items)) {
          extractedMovies = items.map(item => {
            // If the API returns a nested movie object, use it. Otherwise, assume the item IS the movie.
            if (item.movie) return item.movie;
            return item;
          });
        }
        
        setMovies(extractedMovies);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <main className="watchlist-container">
      <div className="watchlist-header">
        <h1><Bookmark size={28} color="#a5b4fc" /> My Watchlist</h1>
        <span>{movies.length} {movies.length === 1 ? 'Movie' : 'Movies'}</span>
      </div>

      {!loading && !error && movies.length === 0 ? (
        <div className="watchlist-empty glass">
          <Film size={48} color="#64748b" style={{ marginBottom: '1rem' }} />
          <h2>Your watchlist is empty</h2>
          <p>Discover great movies and add them to your list.</p>
          <Link to="/" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Browse Movies
          </Link>
        </div>
      ) : (
        <MovieList movies={movies} loading={loading} error={error} />
      )}
    </main>
  );
}
