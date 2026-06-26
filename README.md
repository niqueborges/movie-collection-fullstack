# Movie Collection App (Full-Stack)

A complete Full-Stack application for managing movies, personal watchlists, and user reviews.

- **Stack**: React + Vite + CSS (Frontend) | NestJS + PostgreSQL + TypeORM + JWT (Backend)
- **Status**: Active (Personal Lab)

---

## Summary

- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the project](#running-the-project)
- [Implemented endpoints](#implemented-endpoints)
- [Next steps](#next-steps)
- [Project structure](#project-structure)

---

## Requirements

- Node.js v18 or higher
- npm v8 or higher
- Docker Desktop

---

## Installation

```bash
git clone https://github.com/niqueborges/movie-collection-fullstack.git
cd movie-collection-fullstack
npm install
```

---

## Configuration

Create the `.env` file from the example:

```bash
cp .env.example .env
```

Fill in the values in `.env`:

```env
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=movie_api
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password_here

JWT_SECRET=a_long_and_random_string
JWT_EXPIRATION=1d
```

---

## Running the project

### 1. Start the database

```bash
docker compose up -d
```

Verify if it's up:

```bash
docker ps
```

The container `movie_api_db` should appear with the status `Up`.

### 2. Start the Backend API

```bash
# Development (watch mode)
npm run start:dev

# Production
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000/api`.

### 3. Start the Frontend (React)

Open a new terminal window:

```bash
cd movie-collection-frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### 4. Run tests

```bash
npm run test          # unit tests
npm run test:cov      # with coverage
```

### 4. Documentation (Swagger)

The API has auto-generated interactive documentation.
After starting the project locally, access:
`http://localhost:3000/api/docs`

> To test in Postman/Insomnia, you can import the `docs/swagger.json` file which already contains the mapped routes and DTOs.

---

## Implemented endpoints

> Base URL: `http://localhost:3000/api`
>
> Protected endpoints require the header: `Authorization: Bearer <token>`

### Authentication

| Method | Route              | Protected | Description        |
| ------ | ------------------ | --------- | ------------------ |
| POST   | `/auth/register` | No        | User registration  |
| POST   | `/auth/login`    | No        | Login, returns JWT |

#### POST /auth/register

```json
// Body
{
  "name": "Ana Silva",
  "email": "ana@email.com",
  "password": "123456"
}

// Response 201
{
  "user": {
    "id": "uuid",
    "name": "Ana Silva",
    "email": "ana@email.com"
  },
  "access_token": "eyJhbGci..."
}
```

#### POST /auth/login

```json
// Body
{
  "email": "ana@email.com",
  "password": "123456"
}

// Response 200
{
  "user": {
    "id": "uuid",
    "name": "Ana Silva",
    "email": "ana@email.com"
  },
  "access_token": "eyJhbGci..."
}
```

### Users

| Method | Route         | Protected | Description                |
| ------ | ------------- | --------- | -------------------------- |
| GET    | `/users/me` | JWT       | Authenticated user profile |
| PATCH  | `/users/me` | JWT       | Update profile name        |

#### GET /users/me

```json
// Response 200
{
  "id": "uuid",
  "name": "Ana Silva",
  "email": "ana@email.com",
  "createdAt": "2026-06-23T15:14:03.473Z",
  "updatedAt": "2026-06-23T15:14:03.473Z"
}
```

#### PATCH /users/me

```json
// Body
{
  "name": "Ana Souza"
}

// Response 200
{
  "id": "uuid",
  "name": "Ana Souza",
  "email": "ana@email.com",
  "createdAt": "2026-06-23T15:14:03.473Z",
  "updatedAt": "2026-06-23T15:30:00.000Z"
}
```

### Movies

| Method | Route           | Protected | Description                             |
| ------ | --------------- | --------- | --------------------------------------- |
| POST   | `/movies`     | JWT       | Register movie                          |
| GET    | `/movies`     | No        | List movies with pagination and filters |
| GET    | `/movies/:id` | No        | Movie details                           |
| PUT    | `/movies/:id` | JWT       | Update movie information                |
| DELETE | `/movies/:id` | JWT       | Delete a movie                          |

### Watchlist

| Method | Route                 | Protected | Description                            |
| ------ | --------------------- | --------- | -------------------------------------- |
| POST   | `/watchlist`          | JWT       | Add movie to personal watchlist        |
| GET    | `/watchlist`          | JWT       | List movies from the watchlist         |
| DELETE | `/watchlist/:movieId` | JWT       | Remove movie from the watchlist        |

#### POST /watchlist

```json
// Body
{
  "movieId": "uuid"
}

// Response 201
{
  "id": "uuid",
  "userId": "uuid",
  "movieId": "uuid",
  "createdAt": "2026-06-23T15:14:03.473Z"
}
```

### Reviews

| Method | Route           | Protected | Description                               |
| ------ | --------------- | --------- | ----------------------------------------- |
| POST   | `/reviews`      | JWT       | Rate a movie or update existing review    |
| GET    | `/reviews/me`   | JWT       | List reviews of the authenticated user    |
| PATCH  | `/reviews/:id`  | JWT       | Update your review rating/comment         |
| DELETE | `/reviews/:id`  | JWT       | Delete your review                        |

#### POST /reviews

```json
// Body
{
  "movieId": "uuid",
  "rating": 8.5,
  "comment": "Great movie!"
}

// Response 201
{
  "id": "uuid",
  "movieId": "uuid",
  "userId": "uuid",
  "rating": 8.5,
  "comment": "Great movie!",
  "createdAt": "2026-06-23T15:14:03.473Z"
}
```

---

## Features Overview

### Authentication
- User Entity and JWT authentication
- User registration and login
- Authenticated user profile and updates

### Movies
- Movie Entity (title, description, year, genre, duration in seconds)
- Register, list, update and delete movies
- Pagination, search by title, filter by genre/year, and sorting
- Movie details with average rating and total reviews (public)

### Watchlist
- WatchlistItem Entity
- Add/remove movies to personal watchlist
- List movies from the watchlist (paginated)

### Reviews
- Review Entity (rating from 0 to 10, decimal)
- Rate a movie (or update if it already exists)
- List reviews of the authenticated user
- Delete review and dynamically recalculate movie averages

### Integration & Architecture
- Centralized exception handling, logging and DTO validation
- Comprehensive Unit and End-to-End Test suites
- Containerized with Docker
- Swagger interactive documentation

---

## Project structure

```
movie-collection-frontend/  # React + Vite application
src/                        # NestJS Backend API
  auth/
    dto/              # LoginDto, RegisterDto
    guards/           # JwtAuthGuard
    strategies/       # JwtStrategy
    auth.controller.spec.ts
    auth.controller.ts
    auth.module.ts
    auth.service.spec.ts
    auth.service.ts
  users/
    dto/              # CreateUserDto, UpdateUserDto
    entities/         # User
    users.controller.spec.ts
    users.controller.ts
    users.mapper.ts
    users.module.ts
    users.service.spec.ts
    users.service.ts
  movies/
    dto/              # CreateMovieDto, QueryMovieDto, UpdateMovieDto
    entities/         # Movie
    movies.controller.spec.ts
    movies.controller.ts
    movies.mapper.ts
    movies.module.ts
    movies.service.spec.ts
    movies.service.ts
  common/
    interceptors/     # LoggingInterceptor
  watchlist/
    dto/              # CreateWatchlistDto, PaginationWatchlistDto
    entities/         # Watchlist
    watchlist.controller.spec.ts
    watchlist.controller.ts
    watchlist.mapper.ts
    watchlist.module.ts
    watchlist.service.spec.ts
    watchlist.service.ts
  reviews/
    dto/              # CreateReviewDto, ResponseReviewDto, UpdateReviewDto
    entities/         # Review
    mappers/          # ReviewMapper
    reviews.controller.ts
    reviews.module.ts
    reviews.service.spec.ts
    reviews.service.ts
  app.controller.spec.ts
  app.controller.ts
  app.module.ts
  app.service.ts
  main.ts
docs/
  requirements.md     # original bootcamp requirements
  swagger.json        # documentation export for easy importing
docker-compose.yml
.env.example
```

---

## Environment variables

| Variable              | Description       | Example                 |
| --------------------- | ----------------- | ----------------------- |
| `PORT`              | API Port          | `3000`                |
| `DATABASE_HOST`     | Database host     | `localhost`           |
| `DATABASE_PORT`     | Database port     | `5432`                |
| `DATABASE_NAME`     | Database name     | `movie_api`           |
| `DATABASE_USER`     | Database user     | `postgres`            |
| `DATABASE_PASSWORD` | Database password | `your_password`       |
| `JWT_SECRET`        | JWT secret key    | long and random string  |
| `JWT_EXPIRATION`    | Token expiration  | `1d`, `7d`, `12h` |
