# Movie Collection API

REST API for managing movies, personal watchlists, and user reviews.

- **Stack**: NestJS + TypeScript + PostgreSQL + TypeORM + JWT
- **Deadline**: 06/29/2026 by 5:30 PM
- **Status**: In Progress (Auth and Movies completed)
- **Full Requirements**: [docs/requirements.md](./docs/requirements.md)

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
git clone https://github.com/niqueborges/movie-collection-api2.git
cd movie-collection-api2
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

### 2. Start the API

```bash
# Development (watch mode)
npm run start:dev

# Production
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000/api`.

### 3. Run tests

```bash
npm run test          # unit tests
npm run test:cov      # with coverage
```

### 4. Documentation (Swagger)

The API has auto-generated interactive documentation.
After starting the project locally, access:
**[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

> To test in Postman/Insomnia, you can import the `docs/swagger.json` file which already contains the mapped routes and DTOs.

---

## Implemented endpoints

> Base URL: `http://localhost:3000/api`
>
> Protected endpoints require the header: `Authorization: Bearer <token>`

### Authentication

| Method | Route | Protected | Description |
|---|---|---|---|
| POST | `/auth/register` | No | User registration |
| POST | `/auth/login` | No | Login, returns JWT |

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

| Method | Route | Protected | Description |
|---|---|---|---|
| GET | `/users/me` | JWT | Authenticated user profile |
| PATCH | `/users/me` | JWT | Update profile name |

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

| Method | Route | Protected | Description |
|---|---|---|---|
| POST | `/movies` | JWT | Register movie |
| GET | `/movies` | No | List movies with pagination and filters |
| GET | `/movies/:id` | No | Movie details |
| PUT | `/movies/:id` | JWT | Update movie information |
| DELETE | `/movies/:id` | JWT | Delete a movie |

---

## Next steps

### feature/auth (Person 1) - COMPLETED

- [x] User Entity and JWT authentication
- [x] `POST /auth/register` — user registration
- [x] `POST /auth/login` — user login
- [x] `GET /users/me` — authenticated user profile
- [x] `PATCH /users/me` — update user profile

### feature/movies (Person 2) - COMPLETED

- [x] `Movie` Entity (title, description, year, genre, duration in seconds)
- [x] `POST /movies` — register movie
- [x] `GET /movies` — list with pagination, search by title, filter by genre/year, sorting
- [x] `GET /movies/:id` — details + average rating + total reviews (public)
- [x] `PUT /movies/:id` — update movie
- [x] `DELETE /movies/:id` — delete movie (removes from lists and reviews in cascade)

### feature/watchlist (Person 3) - COMPLETED

- [x] `WatchlistItem` Entity
- [x] `POST /watchlist` — add movie to personal watchlist
- [x] `GET /watchlist` — list movies from the watchlist (paginated, with full movie data)
- [x] `DELETE /watchlist/:movieId` — remove movie from the watchlist

### feature/reviews (Person 4)

- [x] `Review` Entity (rating from 0 to 10, decimal)
- [ ] `POST /reviews` — rate a movie (or update if it already exists)
- [ ] `GET /reviews` — list reviews of the authenticated user (paginated)
- [ ] `PATCH /reviews/:id` — update rating (recalculates movie average)
- [ ] `DELETE /reviews/:id` — delete review (recalculates movie average)

### Final integration (everyone)

- [x] Input, output and error logs in controllers and services
- [ ] Unit tests (`UsersService`, `AuthService`, `MoviesService`, `ReviewsService`)
- [x] Dockerfile
- [ ] Final README with all endpoints
- [x] Swagger (interactive documentation and JSON export configured)
- [ ] Merge of all branches into `develop`
- [ ] Merge `develop` → `main`
- [ ] Tag `v1.0.0`

---

## Project structure

```
src/
  auth/
    dto/              # LoginDto, RegisterDto
    guards/           # JwtAuthGuard
    strategies/       # JwtStrategy
    auth.controller.ts
    auth.module.ts
    auth.service.ts
  users/
    dto/              # CreateUserDto, UpdateUserDto
    entities/         # User
    users.controller.ts
    users.module.ts
    users.service.ts
  movies/
    dto/
    entities/
    movies.controller.ts
    movies.module.ts
    movies.service.ts
  common/
    interceptors/     # LoggingInterceptor
  watchlist/
    dto/
    entities/
    watchlist.controller.ts
    watchlist.module.ts
    watchlist.service.ts
  reviews/
    dto/
    entities/
    mappers/
    reviews.controller.ts
    reviews.module.ts
    reviews.service.ts
  app.controller.ts
  app.module.ts
  app.service.ts
  main.ts
docs/
  guide-movies.md
  guide-reviews.md
  guide-watchlist.md
  requirements.md     # original bootcamp requirements
  swagger.json        # documentation export for easy importing
docker-compose.yml
.env.example
```

---

## Environment variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | API Port | `3000` |
| `DATABASE_HOST` | Database host | `localhost` |
| `DATABASE_PORT` | Database port | `5432` |
| `DATABASE_NAME` | Database name | `movie_api` |
| `DATABASE_USER` | Database user | `postgres` |
| `DATABASE_PASSWORD` | Database password | `your_password` |
| `JWT_SECRET` | JWT secret key | long and random string |
| `JWT_EXPIRATION` | Token expiration | `1d`, `7d`, `12h` |