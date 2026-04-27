# Wellness Platform

Full-stack wellness booking and session management platform. Members book sessions, check in/out, get notified, and track progress. Admins manage zones, sessions, and user dashboards.

## Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| API       | Hono + Node.js (TypeScript)   |
| Web       | Next.js (TypeScript)          |
| Database  | PostgreSQL 16 + Drizzle ORM   |
| Queue     | BullMQ + Redis 7              |
| Auth      | JWT (jose) + bcrypt           |
| Monorepo  | npm workspaces                |

## Architecture

```
wellness-platform/
├── apps/
│   ├── api/          # Hono REST API (port 3001)
│   └── web/          # Next.js frontend (port 3000)
└── packages/
    ├── db/           # Drizzle schema + client (shared)
    └── types/        # Shared TypeScript types
```

### API Routes

| Prefix           | Description                    |
|------------------|--------------------------------|
| `/auth`          | Register, login, token refresh |
| `/users`         | User profiles, avatars         |
| `/sessions`      | Session CRUD                   |
| `/zones`         | Zone management                |
| `/bookings`      | Book / cancel sessions         |
| `/checkin`       | Check in to session            |
| `/checkout`      | Check out from session         |
| `/notifications` | User notifications             |
| `/progress`      | Member progress tracking       |
| `/dashboard`     | Admin dashboard stats          |
| `/health`        | DB health check                |

### Background Jobs (BullMQ)

- **Reminder** — sends booking reminders before sessions
- **Absence checker** — marks members absent after session ends
- **No-show tagger** — tags no-shows for follow-up
- **Standby promotion** — promotes standby members when slot opens

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

Edit `.env` and set `JWT_SECRET` to a random string (32+ chars).

### 4. Start infrastructure

```bash
docker compose up -d
```

Starts PostgreSQL (5432), Redis (6379), and pgAdmin (5050).

### 5. Run migrations

```bash
npm run db:migrate --workspace=apps/api
```

### 6. Start dev servers

```bash
npm run dev
```

| Service  | URL                        |
|----------|----------------------------|
| Web      | http://localhost:3000      |
| API      | http://localhost:3001      |
| pgAdmin  | http://localhost:5050      |

## Environment Variables

| Variable       | Default                                          | Description              |
|----------------|--------------------------------------------------|--------------------------|
| `NODE_ENV`     | `development`                                    |                          |
| `PORT`         | `3001`                                           | API port                 |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/wellness` | Postgres connection |
| `REDIS_URL`    | `redis://localhost:6379`                         | Redis connection         |
| `JWT_SECRET`   | *(required)*                                     | 32+ char secret          |
| `BASE_URL`     | `http://localhost:3001`                          | Public API base URL      |

## Commands

```bash
# Dev
npm run dev                                  # all apps
npm run dev --workspace=apps/api             # API only
npm run dev --workspace=apps/web             # web only

# Database
npm run db:generate --workspace=apps/api     # generate migration after schema change
npm run db:migrate --workspace=apps/api      # apply migrations
npm run db:studio --workspace=apps/api       # open Drizzle Studio

# Quality
npm run typecheck                            # type-check all packages
npm run build                                # build all packages
npm run lint                                 # lint all packages
```

## Production

```bash
docker compose -f docker-compose.prod.yml up -d
```
