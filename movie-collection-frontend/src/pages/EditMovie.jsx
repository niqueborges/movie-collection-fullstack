import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Film, Calendar, Clock, Type, AlignLeft, AlertCircle, Save, Wand2 } from 'lucide-react';
import { fetchMovieById, updateMovie, fetchOmdbData } from '../services/api';
import './CreateMovie.css'; // Reusing styles from CreateMovie

export function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [omdbLoading, setOmdbLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    releaseYear: '',
    durationMinutes: '',
    description: ''
  });

  useEffect(() => {
    async function loadMovie() {
      try {
        const movie = await fetchMovieById(id);
        setFormData({
          title: movie.title || '',
          genre: movie.genre || '',
          releaseYear: movie.releaseYear || '',
          durationMinutes: movie.durationSeconds ? Math.round(movie.durationSeconds / 60) : '',
          description: movie.description || ''
        });
      } catch (err) {
        setError(err.message || 'Failed to load movie data');
      } finally {
        setLoading(false);
      }
    }
    loadMovie();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAutoFill = async () => {
    if (!formData.title) {
      setError('Please enter a movie title to search on OMDB.');
      return;
    }
    
    setOmdbLoading(true);
    setError(null);
    try {
      const omdbData = await fetchOmdbData(formData.title);
      
      const runtimeStr = omdbData.Runtime || '0 min';
      const parsedMinutes = parseInt(runtimeStr.replace(/[^0-9]/g, ''), 10) || 0;

      setFormData(prev => ({
        ...prev,
        title: omdbData.Title || prev.title,
        genre: omdbData.Genre ? omdbData.Genre.split(',')[0].trim() : prev.genre, // take first genre
        releaseYear: omdbData.Year ? parseInt(omdbData.Year, 10) : prev.releaseYear,
        durationMinutes: parsedMinutes || prev.durationMinutes,
        description: omdbData.Plot && omdbData.Plot !== 'N/A' ? omdbData.Plot : prev.description
      }));
    } catch (err) {
      setError(err.message || 'Failed to fetch data from OMDB.');
    } finally {
      setOmdbLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      if (!formData.title || !formData.genre || !formData.releaseYear || !formData.durationMinutes || !formData.description) {
        throw new Error('Please fill in all fields');
      }

      const year = parseInt(formData.releaseYear, 10);
      const minutes = parseInt(formData.durationMinutes, 10);

      if (isNaN(year) || year < 1800 || year > new Date().getFullYear()) {
        throw new Error(`Please enter a valid year (1800 - ${new Date().getFullYear()})`);
      }

      if (isNaN(minutes) || minutes <= 0) {
        throw new Error('Please enter a valid duration in minutes');
      }

      const movieData = {
        title: formData.title,
        description: formData.description,
        genre: formData.genre,
        releaseYear: year,
        durationSeconds: minutes * 60
      };

      await updateMovie(id, movieData);
      navigate(`/movies/${id}`);
    } catch (err) {
      setError(err.message || 'An error occurred while updating the movie');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>Loading movie data...</div>;
  }

  return (
    <main className="create-movie-container">
      <div className="create-movie-card">
        
        <div className="create-movie-header">
          <h1><Film size={32} /> Edit Movie</h1>
          <p>Update information for this title.</p>
        </div>

        {error && (
          <div className="form-error" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-movie-form">
          <div className="form-group" style={{ position: 'relative' }}>
            <label htmlFor="title"><Type size={16} /> Movie Title</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Inception"
                maxLength={200}
                required
                style={{ flex: 1 }}
              />
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={handleAutoFill}
                disabled={omdbLoading}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none'
                }}
                title="Search on OMDB and auto-fill remaining fields"
              >
                <Wand2 size={16} />
                {omdbLoading ? 'Fetching...' : 'Auto-Fill'}
              </button>
            </div>
            <small style={{ color: '#94a3b8', marginTop: '0.25rem' }}>
              Type the title and click "Auto-Fill" to fetch real data from OMDB.
            </small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="genre"><Film size={16} /> Genre</label>
              <input
                type="text"
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                placeholder="e.g. Science Fiction"
                maxLength={100}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="releaseYear"><Calendar size={16} /> Release Year</label>
              <input
                type="number"
                id="releaseYear"
                name="releaseYear"
                value={formData.releaseYear}
                onChange={handleChange}
                placeholder="e.g. 2010"
                min="1800"
                max={new Date().getFullYear()}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="durationMinutes"><Clock size={16} /> Duration (minutes)</label>
            <input
              type="number"
              id="durationMinutes"
              name="durationMinutes"
              value={formData.durationMinutes}
              onChange={handleChange}
              placeholder="e.g. 148"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description"><AlignLeft size={16} /> Synopsis</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the movie's plot..."
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => navigate(`/movies/${id}`)}
              style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={saving} style={{ flex: 2, marginTop: 0 }}>
              {saving ? (
                'Saving...'
              ) : (
                <>
                  <Save size={20} />
                  Update Movie
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
