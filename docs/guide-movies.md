# Guia: feature/movies (Pessoa 2)

Este guia descreve o que implementar, como comecar e as regras de negocio do modulo de filmes.

---

## Setup inicial

```powershell
git checkout feature/movies
git merge develop
git push origin feature/movies
npm install
```

Suba o banco:

```powershell
docker compose up -d
npm run start:dev
```

---

## O que implementar

### Entidade `Movie`

Crie `src/movies/entities/movie.entity.ts` com os campos:

| Campo | Tipo | Regra |
|---|---|---|
| `id` | UUID | gerado automaticamente |
| `title` | varchar(200) | obrigatorio |
| `description` | text | obrigatorio |
| `releaseYear` | integer | entre 1800 e ano atual |
| `genre` | varchar(100) | obrigatorio |
| `durationSeconds` | integer | obrigatorio, em segundos |
| `createdAt` | timestamp | automatico |
| `updatedAt` | timestamp | automatico |

> A nota media nao e um campo da entidade — e calculada a partir das avaliacoes. O `MoviesService` vai precisar fazer um JOIN ou calcular via query quando buscar os detalhes.

### DTOs

**`CreateMovieDto`** — validar:
- `title`: string, nao vazio, max 200 chars
- `description`: string, nao vazio
- `releaseYear`: number, inteiro, min 1800, max ano atual (`new Date().getFullYear()`)
- `genre`: string, nao vazio
- `durationSeconds`: number, inteiro positivo

**`UpdateMovieDto`** — mesmos campos do `CreateMovieDto`, todos opcionais (`@IsOptional()`)

**`QueryMovieDto`** — para a listagem:
- `page`: number, opcional, default 1
- `limit`: number, opcional, default 10
- `title`: string, opcional (busca parcial)
- `genre`: string, opcional
- `releaseYear`: number, opcional
- `sortBy`: enum opcional (`title`, `releaseYear`, `averageRating`)
- `order`: enum opcional (`ASC`, `DESC`)

---

## Endpoints

| Metodo | Rota | Protegido | Descricao |
|---|---|---|---|
| POST | `/movies` | JWT | Cadastrar filme |
| GET | `/movies` | Nao | Listar filmes (paginado, filtros, ordenacao) |
| GET | `/movies/:id` | Nao | Detalhes do filme + nota media + total avaliacoes |
| PUT | `/movies/:id` | JWT | Atualizar filme |
| DELETE | `/movies/:id` | JWT | Deletar filme |

---

## Regras de negocio

- `GET /movies` e `GET /movies/:id` sao **publicos** — sem `JwtAuthGuard`
- `GET /movies/:id` deve retornar `averageRating` e `totalReviews`
- `DELETE /movies/:id` deve remover em cascata: configure `onDelete: 'CASCADE'` nas entidades `WatchlistItem` e `Review` (as outras branches que cuidam disso, mas o relacionamento parte do filme)
- Validar `releaseYear` no DTO com `@Min(1800)` e `@Max(new Date().getFullYear())`
- Paginacao: retornar `{ data: Movie[], total: number, page: number, limit: number }`

---

## Exemplo de resposta esperada

### GET /movies

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Inception",
      "description": "Um ladrão que rouba segredos...",
      "releaseYear": 2010,
      "genre": "Sci-Fi",
      "durationSeconds": 8880,
      "averageRating": 9.1,
      "totalReviews": 42,
      "createdAt": "2026-06-23T...",
      "updatedAt": "2026-06-23T..."
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

---

## Estrutura de arquivos sugerida

```
src/movies/
  dto/
    create-movie.dto.ts
    update-movie.dto.ts
    query-movie.dto.ts
  entities/
    movie.entity.ts
  movies.controller.ts
  movies.module.ts
  movies.service.ts
```

---

## Commits sugeridos

```
feat(movies): add Movie entity
feat(movies): add create and update DTOs with validation
feat(movies): add MoviesService with CRUD operations
feat(movies): add MoviesController with public list and detail endpoints
feat(movies): add pagination, search and filter to movie listing
```

---

## Dicas

- Importe `MoviesModule` no `AppModule` (`src/app.module.ts`)
- Para calcular `averageRating` no `GET /movies/:id`, use TypeORM com `leftJoinAndSelect` para pegar as reviews, ou use uma subquery. Pode deixar `0` como default se nao houver reviews.
- Para a busca por titulo, use `ILike('%${title}%')` do TypeORM (case-insensitive).
- O `JwtAuthGuard` ja esta pronto em `src/auth/guards/jwt-auth.guard.ts` — so importar e usar.
