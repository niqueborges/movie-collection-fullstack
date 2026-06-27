import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Calendar, Clock, Type, AlignLeft, AlertCircle, Save } from 'lucide-react';
import { createMovie } from '../services/api';
import './CreateMovie.css';

export function CreateMovie() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    releaseYear: '',
    durationMinutes: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Basic validation
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

      // Convert minutes to seconds for the API
      const movieData = {
        title: formData.title,
        description: formData.description,
        genre: formData.genre,
        releaseYear: year,
        durationSeconds: minutes * 60
      };

      await createMovie(movieData);
      
      // Navigate to Home on success
      navigate('/');
    } catch (err) {
      setError(err.message || 'An error occurred while creating the movie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-movie-container">
      <div className="create-movie-card">
        
        <div className="create-movie-header">
          <h1><Film size={32} /> Add New Movie</h1>
          <p>Expand the collection by adding a new title.</p>
        </div>

        {error && (
          <div className="form-error" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-movie-form">
          <div className="form-group">
            <label htmlFor="title"><Type size={16} /> Movie Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Inception"
              maxLength={200}
              required
            />
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
                placeholder={`e.g. 2010`}
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

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              'Saving...'
            ) : (
              <>
                <Save size={20} />
                Save Movie
              </>
            )}
          </button>
        </form>

      </div>
    </main>
  );
}
