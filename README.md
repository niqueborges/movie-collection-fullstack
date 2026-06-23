# Movie Collection API

API REST para gerenciamento de filmes, listas pessoais e avaliacoes de usuarios.

- **Stack**: NestJS + TypeScript + PostgreSQL + TypeORM + JWT
- **Entrega**: 29/06/2026 ate as 17:30
- **Requisitos completos**: [docs/requirements.md](./docs/requirements.md)

---

## Sumario

- [Requisitos](#requisitos)
- [Instalacao](#instalacao)
- [Configuracao](#configuracao)
- [Executando o projeto](#executando-o-projeto)
- [Endpoints implementados](#endpoints-implementados)
- [Proximos passos](#proximos-passos)
- [Estrutura do projeto](#estrutura-do-projeto)

---

## Requisitos

- Node.js v18 ou superior
- npm v8 ou superior
- Docker Desktop

---

## Instalacao

```bash
git clone https://github.com/niqueborges/movie-collection-api2.git
cd movie-collection-api2
npm install
```

---

## Configuracao

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Preencha os valores no `.env`:

```env
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=movie_api
DATABASE_USER=postgres
DATABASE_PASSWORD=sua_senha_aqui

JWT_SECRET=uma_string_longa_e_aleatoria
JWT_EXPIRATION=1d
```

---

## Executando o projeto

### 1. Subir o banco de dados

```bash
docker compose up -d
```

Verifica se subiu:

```bash
docker ps
```

O container `movie_api_db` deve aparecer com status `Up`.

### 2. Iniciar a API

```bash
# Desenvolvimento (watch mode)
npm run start:dev

# Producao
npm run build
npm run start:prod
```

A API estara disponivel em `http://localhost:3000/api`.

### 3. Executar testes

```bash
npm run test          # unit tests
npm run test:cov      # com cobertura
```

### 4. Documentacao (Swagger)

A API possui documentacao interativa gerada automaticamente.
Apos iniciar o projeto localmente, acesse:
**[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

> Para testar no Postman/Insomnia, voce pode importar o arquivo `docs/swagger.json` que ja contem as rotas e DTOs mapeados.

---

## Endpoints implementados

> Base URL: `http://localhost:3000/api`
>
> Endpoints protegidos requerem o header: `Authorization: Bearer <token>`

### Autenticacao

| Metodo | Rota | Protegido | Descricao |
|---|---|---|---|
| POST | `/auth/register` | Nao | Cadastro de usuario |
| POST | `/auth/login` | Nao | Login, retorna JWT |

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

### Usuarios

| Metodo | Rota | Protegido | Descricao |
|---|---|---|---|
| GET | `/users/me` | JWT | Perfil do usuario autenticado |
| PATCH | `/users/me` | JWT | Atualizar nome do perfil |

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

### Filmes

| Metodo | Rota | Protegido | Descricao |
|---|---|---|---|
| POST | `/movies` | JWT | Cadastrar filme |
| GET | `/movies` | Nao | Listar filmes com paginacao e filtros |
| GET | `/movies/:id` | Nao | Detalhes do filme |
| PUT | `/movies/:id` | JWT | Atualizar informacoes de um filme |
| DELETE | `/movies/:id` | JWT | Deletar um filme |

---

## Proximos passos

### feature/movies (Pessoa 2) - CONCLUIDO

- [x] Entidade `Movie` (titulo, descricao, ano, genero, duracao em segundos)
- [x] `POST /movies` — cadastrar filme
- [x] `GET /movies` — listar com paginacao, busca por titulo, filtro por genero/ano, ordenacao
- [x] `GET /movies/:id` — detalhes + nota media + total de avaliacoes (publico)
- [x] `PUT /movies/:id` — atualizar filme
- [x] `DELETE /movies/:id` — deletar filme (remove de listas e avaliacoes em cascata)

### feature/watchlist (Pessoa 3)

- [ ] Entidade `WatchlistItem`
- [ ] `POST /watchlist` — adicionar filme a lista pessoal
- [ ] `GET /watchlist` — listar filmes da lista (paginado, com dados completos do filme)
- [ ] `DELETE /watchlist/:movieId` — remover filme da lista

### feature/reviews (Pessoa 4)

- [ ] Entidade `Review` (nota de 0 a 10, decimal)
- [ ] `POST /reviews` — avaliar filme (ou atualizar se ja existir)
- [ ] `GET /reviews` — listar avaliacoes do usuario autenticado (paginado)
- [ ] `PATCH /reviews/:id` — atualizar nota (recalcula media do filme)
- [ ] `DELETE /reviews/:id` — excluir avaliacao (recalcula media do filme)

### Integracao final (todos)

- [ ] Logs de entrada, saida e erro em controllers e services
- [ ] Testes unitarios (`UsersService`, `AuthService`, `MoviesService`, `ReviewsService`)
- [ ] Dockerfile
- [ ] README final com todos os endpoints
- [x] Swagger (documentacao interativa e exportacao JSON configurada)
- [ ] Merge de todas as branches em `develop`
- [ ] Merge `develop` → `main`
- [ ] Tag `v1.0.0`

---

## Estrutura do projeto

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
  watchlist/          # a implementar — feature/watchlist
  reviews/            # a implementar — feature/reviews
  app.module.ts
  main.ts
docs/
  guide-movies.md
  guide-reviews.md
  guide-watchlist.md
  requirements.md     # requisitos originais do bootcamp
  swagger.json        # exportacao da doc para importacao facil
docker-compose.yml
.env.example
```

---

## Variaveis de ambiente

| Variavel | Descricao | Exemplo |
|---|---|---|
| `PORT` | Porta da API | `3000` |
| `DATABASE_HOST` | Host do banco | `localhost` |
| `DATABASE_PORT` | Porta do banco | `5432` |
| `DATABASE_NAME` | Nome do banco | `movie_api` |
| `DATABASE_USER` | Usuario do banco | `postgres` |
| `DATABASE_PASSWORD` | Senha do banco | `sua_senha` |
| `JWT_SECRET` | Chave secreta do JWT | string longa e aleatoria |
| `JWT_EXPIRATION` | Expiracao do token | `1d`, `7d`, `12h` |