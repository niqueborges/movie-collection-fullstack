import React, { useState, useEffect } from 'react';
import { MovieList } from '../components/MovieList';
import { fetchMovies } from '../services/api';

export function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchMovies();
        setMovies(data);
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
    <main style={{ paddingBottom: '4rem' }}>
      <MovieList movies={movies} loading={loading} error={error} />
    </main>
  );
}
