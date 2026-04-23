## Prerequisites

- [Node.js 22+](https://nodejs.org)
- [Docker + Docker Compose](https://www.docker.com)
- npm 10+

## Setup

### 1. Clone

```bash
git clone <repo-url> wellness-platform
cd wellness-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Then open `.env` and set `JWT_SECRET` to a random string (32+ chars).

### 4. Start infrastructure

```bash
docker compose up -d
```

This starts PostgreSQL (5432), Redis (6379), and pgAdmin (5050).

### 5. Run migrations

```bash
npm run db:migrate --workspace=apps/api
```

### 6. Start dev servers

```bash
npm run dev
```

- API → http://localhost:3001
- Web → http://localhost:3000
- pgAdmin → http://localhost:5050

## Services

| Service  | Port |
|----------|------|
| Web      | 3000 |
| API      | 3001 |
| Postgres | 5432 |
| Redis    | 6379 |
| pgAdmin  | 5050 |

## Useful commands

```bash
# Run individual apps
npm run dev --workspace=apps/api
npm run dev --workspace=apps/web

# Generate migration after schema changes
npm run db:generate --workspace=apps/api

# Open Drizzle Studio
npm run db:studio --workspace=apps/api

# Type check all
npm run typecheck

# Build all
npm run build
```
