# Guia: feature/reviews (Pessoa 4)

Este guia descreve o que implementar, como comecar e as regras de negocio do modulo de avaliacoes.

---

## Setup inicial

```powershell
git checkout feature/reviews
git merge develop
git push origin feature/reviews
npm install
```

Suba o banco:

```powershell
docker compose up -d
npm run start:dev
```

> Voce vai precisar que a branch `feature/movies` ja esteja mergeada em `develop` para ter a entidade `Movie` disponivel. Se ainda nao estiver, combine com a Pessoa 2.

---

## O que implementar

### Entidade `Review`

Crie `src/reviews/entities/review.entity.ts`:

| Campo | Tipo | Regra |
|---|---|---|
| `id` | UUID | gerado automaticamente |
| `userId` | UUID | FK para `users.id` |
| `movieId` | UUID | FK para `movies.id` |
| `rating` | decimal(3,1) | 0.0 a 10.0 |
| `createdAt` | timestamp | automatico |
| `updatedAt` | timestamp | automatico |

**Restricao importante**: a combinacao `(userId, movieId)` deve ser unica — cada usuario avalia cada filme no maximo uma vez.

```typescript
@Entity('reviews')
@Unique(['userId', 'movieId'])
export class Review {
  // ...
  @Column({ type: 'decimal', precision: 3, scale: 1 })
  rating: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Movie, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;
}
```

### DTOs

**`CreateReviewDto`**:
- `movieId`: string, UUID valido, nao vazio
- `rating`: number, min 0, max 10

**`UpdateReviewDto`**:
- `rating`: number, min 0, max 10

**`PaginationDto`** (para listagem):
- `page`: number, opcional, default 1
- `limit`: number, opcional, default 10

---

## Endpoints

| Metodo | Rota | Protegido | Descricao |
|---|---|---|---|
| POST | `/reviews` | JWT | Avaliar um filme |
| GET | `/reviews` | JWT | Listar avaliacoes do usuario autenticado (paginado) |
| PATCH | `/reviews/:id` | JWT | Atualizar nota de uma avaliacao |
| DELETE | `/reviews/:id` | JWT | Excluir uma avaliacao |

---

## Regras de negocio

- Todos os endpoints requerem autenticacao (`JwtAuthGuard`)
- O `userId` vem do token JWT (`req.user.id`) — nunca do body da requisicao
- **Usuario nao pode avaliar o mesmo filme duas vezes** — se ja existir uma review do usuario para aquele filme, retornar `409 Conflict` (ou implementar upsert: atualizar a nota existente)
- Filme deve existir no catalogo — retornar `404` se nao existir
- `PATCH /reviews/:id` e `DELETE /reviews/:id` — verificar que a review pertence ao usuario autenticado antes de modificar. Retornar `403 Forbidden` se nao pertencer.
- **Apos criar, atualizar ou excluir uma review**, a nota media do filme deve ser recalculada.

---

## Como recalcular a nota media do filme

Apos qualquer alteracao em reviews, atualize a entidade `Movie` com a nova media:

```typescript
// No ReviewsService, apos salvar/deletar a review:
const { avg } = await this.reviewsRepository
  .createQueryBuilder('review')
  .select('AVG(review.rating)', 'avg')
  .where('review.movieId = :movieId', { movieId })
  .getRawOne();

await this.moviesRepository.update(movieId, {
  averageRating: parseFloat(avg) || 0,
  totalReviews: count,
});
```

> Alternativa: nao armazenar `averageRating` na entidade `Movie` e calcular na hora do `GET /movies/:id`. Combine com a Pessoa 2 qual abordagem usar.

---

## Exemplo de resposta esperada

### GET /reviews

```json
{
  "data": [
    {
      "id": "uuid-da-review",
      "rating": 9.0,
      "createdAt": "2026-06-23T...",
      "updatedAt": "2026-06-23T...",
      "movie": {
        "id": "uuid-do-filme",
        "title": "Inception",
        "genre": "Sci-Fi",
        "releaseYear": 2010
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
src/reviews/
  dto/
    create-review.dto.ts
    update-review.dto.ts
    pagination.dto.ts
  entities/
    review.entity.ts
  reviews.controller.ts
  reviews.module.ts
  reviews.service.ts
```

---

## Commits sugeridos

```
feat(reviews): add Review entity with unique user-movie constraint
feat(reviews): add ReviewsService with create, list, update and delete
feat(reviews): add ReviewsController with authenticated endpoints
feat(reviews): recalculate movie average rating on review changes
```

---

## Dicas

- Importe `ReviewsModule` no `AppModule` (`src/app.module.ts`)
- O `JwtAuthGuard` ja esta pronto em `src/auth/guards/jwt-auth.guard.ts`
- Para pegar o `userId` do token: `@Request() req: any` → `req.user.id`
- Use `@Min(0) @Max(10)` com `@IsNumber()` e `@IsDecimal()` ou `@IsNumber({ maxDecimalPlaces: 1 })` no DTO para validar a nota
- Para checar autorizacao (`403`), compare `review.userId !== req.user.id` e lance `ForbiddenException`
- Coordene com a Pessoa 2 (movies) se `averageRating` e `totalReviews` serao campos da entidade `Movie` ou calculados dinamicamente
