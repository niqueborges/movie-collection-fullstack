# Guia: feature/watchlist (Pessoa 3)

Este guia descreve o que implementar, como comecar e as regras de negocio do modulo de lista pessoal de filmes.

---

## Setup inicial

```powershell
git checkout feature/watchlist
git merge develop
git push origin feature/watchlist
npm install
```

Suba o banco:

```powershell
docker compose up -d
npm run start:dev
```

> Voce vai precisar que a branch `feature/movies` ja esteja mergeada em `develop` para ter a entidade `Movie` disponivel. Se ainda nao estiver, combine com a Pessoa 2 ou crie um stub temporario.

---

## O que implementar

### Entidade `WatchlistItem`

Crie `src/watchlist/entities/watchlist-item.entity.ts`:

| Campo | Tipo | Regra |
|---|---|---|
| `id` | UUID | gerado automaticamente |
| `userId` | UUID | FK para `users.id` |
| `movieId` | UUID | FK para `movies.id` |
| `createdAt` | timestamp | automatico |

**Restricao importante**: a combinacao `(userId, movieId)` deve ser unica — impede o mesmo filme ser adicionado duas vezes.

Use `@Unique(['userId', 'movieId'])` na entidade ou uma restricao no banco.

```typescript
@Entity('watchlist_items')
@Unique(['userId', 'movieId'])
export class WatchlistItem {
  // ...
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Movie, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;
}
```

### DTOs

**`AddWatchlistDto`**:
- `movieId`: string, UUID valido, nao vazio

**`PaginationDto`** (para listagem):
- `page`: number, opcional, default 1
- `limit`: number, opcional, default 10

---

## Endpoints

| Metodo | Rota | Protegido | Descricao |
|---|---|---|---|
| POST | `/watchlist` | JWT | Adicionar filme a lista pessoal |
| GET | `/watchlist` | JWT | Listar filmes da lista pessoal (paginado) |
| DELETE | `/watchlist/:movieId` | JWT | Remover filme da lista pessoal |

---

## Regras de negocio

- Todos os endpoints requerem autenticacao (`JwtAuthGuard`)
- O `userId` vem do token JWT (`req.user.id`) — nunca do body da requisicao
- Tentar adicionar um filme que ja esta na lista: retornar `409 Conflict`
- Tentar adicionar um filme que nao existe no catalogo: retornar `404 Not Found`
- `GET /watchlist` retorna apenas os filmes do usuario autenticado, com informacoes completas do filme (JOIN com `movies`)
- `DELETE /watchlist/:movieId` nao exclui o filme do catalogo — apenas remove o item da lista do usuario

---

## Exemplo de resposta esperada

### GET /watchlist

```json
{
  "data": [
    {
      "id": "uuid-do-item",
      "movieId": "uuid-do-filme",
      "createdAt": "2026-06-23T...",
      "movie": {
        "id": "uuid-do-filme",
        "title": "Inception",
        "description": "...",
        "releaseYear": 2010,
        "genre": "Sci-Fi",
        "durationSeconds": 8880
      }
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
src/watchlist/
  dto/
    add-watchlist.dto.ts
    pagination.dto.ts
  entities/
    watchlist-item.entity.ts
  watchlist.controller.ts
  watchlist.module.ts
  watchlist.service.ts
```

---

## Commits sugeridos

```
feat(watchlist): add WatchlistItem entity with unique constraint
feat(watchlist): add WatchlistService with add, list and remove operations
feat(watchlist): add WatchlistController with authenticated endpoints
```

---

## Dicas

- Importe `WatchlistModule` no `AppModule` (`src/app.module.ts`)
- O `JwtAuthGuard` ja esta pronto em `src/auth/guards/jwt-auth.guard.ts`
- Para pegar o `userId` do token: `@Request() req: any` → `req.user.id`
- Use `relations: ['movie']` no TypeORM para incluir os dados do filme na listagem
- Ao capturar violacao de unicidade do banco (email/UUID duplicado), o TypeScript lanca uma `QueryFailedError` — capture e lance `ConflictException` no service
