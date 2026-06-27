const BASE_URL = 'http://localhost:3000/api';

// Helper to get headers with Auth token
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export async function fetchMovies(searchQuery = '') {
  try {
    const url = searchQuery 
      ? `${BASE_URL}/movies?title=${encodeURIComponent(searchQuery)}`
      : `${BASE_URL}/movies`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: Failed to fetch movies.`);
    }
    const data = await response.json();
    
    if (data && Array.isArray(data.items)) return data.items;
    if (data && Array.isArray(data.data)) return data.data;
    if (Array.isArray(data)) return data;
    
    return [];
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw new Error('Could not connect to the server. Is the API running on port 3000?');
  }
}

export async function loginUser(email, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data; // Usually returns { access_token, user }
}

export async function registerUser(name, email, password) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Collect error messages from NestJS ValidationPipe
    const errorMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
    throw new Error(errorMsg || 'Registration failed');
  }

  return data;
}

export async function fetchCurrentUser() {
  const response = await fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Session expired or invalid.');
  }

  return await response.json();
}

export async function fetchMovieById(id) {
  const response = await fetch(`${BASE_URL}/movies/${id}`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch movie details');
  return await response.json();
}

export async function fetchWatchlist() {
  const response = await fetch(`${BASE_URL}/watchlist`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch watchlist');
  return await response.json();
}

export async function addToWatchlist(movieId) {
  const response = await fetch(`${BASE_URL}/watchlist`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ movieId }),
  });
  if (!response.ok) throw new Error('Failed to add to watchlist');
  return await response.json();
}

export async function removeFromWatchlist(movieId) {
  const response = await fetch(`${BASE_URL}/watchlist/${movieId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to remove from watchlist');
  return true;
}

export async function createMovie(movieData) {
  const response = await fetch(`${BASE_URL}/movies`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(movieData),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
    throw new Error(errorMsg || 'Failed to create movie');
  }

  return data;
}

export async function updateMovie(id, movieData) {
  const response = await fetch(`${BASE_URL}/movies/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(movieData),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
    throw new Error(errorMsg || 'Failed to update movie');
  }

  return data;
}

export async function fetchOmdbData(title) {
  const apiKey = import.meta.env.VITE_OMDB_API_KEY;
  if (!apiKey) {
    throw new Error('OMDB API key is missing. Please configure VITE_OMDB_API_KEY in .env');
  }
  
  const response = await fetch(`http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`);
  const data = await response.json();
  
  if (data.Response === 'False') {
    throw new Error(data.Error || 'Movie not found on OMDB');
  }
  
  return data;
}

export async function fetchMyReviews() {
  const response = await fetch(`${BASE_URL}/reviews/me`, {
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch reviews');
  }
  
  return await response.json();
}

export async function createOrUpdateReview(reviewData) {
  const response = await fetch(`${BASE_URL}/reviews`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(reviewData),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
    throw new Error(errorMsg || 'Failed to submit review');
  }

  return data;
}

export async function deleteReview(id) {
  const response = await fetch(`${BASE_URL}/reviews/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete review');
  }

  return true;
}
