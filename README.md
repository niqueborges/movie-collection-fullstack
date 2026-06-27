# 🎬 Movie Collection App (Full-Stack)

[![CI Pipeline](https://github.com/niqueborges/movie-collection-fullstack/actions/workflows/ci.yml/badge.svg)](https://github.com/niqueborges/movie-collection-fullstack/actions/workflows/ci.yml)

A complete Full-Stack application for managing movies, personal watchlists, and user reviews. Built as a culmination of backend challenges and extended into a fully functional frontend with a stunning UI.

- **Stack**: React + Vite + CSS (Frontend) | NestJS + PostgreSQL + TypeORM + JWT (Backend)
- **Status**: Completed (Full-Stack Lab)
- **Original Requirements**: [docs/requirements.md](./docs/requirements.md)

---

## 🌟 Highlights & Features

This project was evolved from a backend-only REST API challenge into a complete product.

### 🎨 Frontend (React + Vite)
- **Modern Glassmorphism UI**: A sleek, frosted-glass design system with responsive animations.
- **Context API Auth**: Seamless authentication state management across the app.
- **Protected Routes**: Security on the frontend using `react-router-dom` to protect sensitive views.
- **Smart Search Bar**: Instant local and API-driven filtering.
- **OMDB API Auto-fill (Magic Button 🪄)**: Automatically fetches and fills in movie details (Director, Year, Runtime, Plot, Genre) when registering or editing movies.
- **Personal Watchlist**: Manage your favorite movies easily.
- **User Profile & Reviews Panel**: Interactive 0-10 star rating system to review movies, with a dedicated user dashboard to track past ratings.

### ⚙️ Backend (NestJS)
- **Robust Architecture**: Centralized exception handling, logging, and DTO validation (`class-validator`).
- **Authentication**: JWT-based authentication with encrypted passwords (bcrypt).
- **Relational Data (PostgreSQL + TypeORM)**: Entities for Users, Movies, Watchlist, and Reviews.
- **Swagger Documentation**: Interactive API documentation generated automatically.

---

## 🚀 Installation & Setup

### Requirements
- Node.js v18+
- npm v8+
- Docker Desktop (for the database)

### 1. Clone the repository
```bash
git clone https://github.com/niqueborges/movie-collection-fullstack.git
cd movie-collection-fullstack
```

### 2. Configuration
Create the `.env` file for the backend in the root folder:
```bash
cp .env.example .env
```
*(Update `DATABASE_PASSWORD` and `JWT_SECRET` as needed).*

Create the `.env` file for the frontend:
```bash
cd movie-collection-frontend
cp .env.example .env
```
*(You will need a free API Key from [OMDB API](http://www.omdbapi.com/) to use the Auto-fill feature. Place it in `VITE_OMDB_API_KEY`).*

---

## 🖥️ Running the Project

### Step 1: Start the Database
From the root folder, run:
```bash
docker compose up -d
```
*(Wait a few seconds for the `movie_api_db` container to be fully up).*

### Step 2: Start the Backend API
From the root folder, run:
```bash
npm install
npm run start:dev
```
*The API will be available at `http://localhost:3000/api`.*
*Swagger Docs available at `http://localhost:3000/api/docs`.*

### Step 3: Start the Frontend React App
Open a new terminal window:
```bash
cd movie-collection-frontend
npm install
npm run dev
```
*The UI will be available at `http://localhost:5173`.*

---

## 📚 API Endpoints Summary

> Base URL: `http://localhost:3000/api`
> Protected endpoints require: `Authorization: Bearer <token>`

- **Auth**: `POST /auth/register`, `POST /auth/login`
- **Users**: `GET /users/me`, `PATCH /users/me`
- **Movies**: 
  - `GET /movies` (Public Catalog)
  - `GET /movies/:id` (Public Details)
  - `POST /movies`, `PUT /movies/:id`, `DELETE /movies/:id` (Protected CRUD)
- **Watchlist**: `GET /watchlist`, `POST /watchlist`, `DELETE /watchlist/:movieId`
- **Reviews**: 
  - `POST /reviews` (Create or Update your review and rating)
  - `GET /reviews/me` (List your history)
  - `DELETE /reviews/:id` (Delete review)

---

## 📂 Project Structure

```
movie-collection-fullstack/
├── movie-collection-frontend/  # React UI
│   ├── src/
│   │   ├── components/         # Reusable UI (Header, MovieCard, ProtectedRoute)
│   │   ├── contexts/           # AuthContext
│   │   ├── pages/              # Views (Home, Login, Profile, MovieDetails, etc.)
│   │   └── services/           # api.js (API Integration layer)
│   └── .env.example
├── src/                        # NestJS API Backend
│   ├── auth/                   # Authentication Module
│   ├── users/                  # Users Module
│   ├── movies/                 # Movies Catalog Module
│   ├── watchlist/              # Personal Watchlist Module
│   ├── reviews/                # Reviews & Rating Module
│   └── main.ts
├── docs/                       # Original requirements & Swagger JSON
├── docker-compose.yml          # PostgreSQL Database container
└── .env.example
```
