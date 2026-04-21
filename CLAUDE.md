# Wellness Platform — Claude Context

## What This Is
A full-stack wellness platform with member booking, class scheduling, QR check-ins, standby queues, progress tracking, and in-app notifications.
Monorepo using npm workspaces. No Turborepo.

## Operational Phases
- **Strategy** → scheduling & resource allocation
- **Engage** → marketing, onboarding & booking
- **Execute** → service delivery, QR check-ins/check-outs
- **Optimize** → analytics, no-show rates, iteration

## Services
- 1-on-1 personal training & medical wellness consults
- Structured group classes (yoga, pilates, zumba, meditation)
- Open facility access (cardio, weights, machines) with zone-based entry/exit tracking

## Tech Stack

### Web (`apps/web`)
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS + shadcn/ui
- Zustand (local state) + TanStack Query (server state)
- React Hook Form + Zod (forms & validation)

### API (`apps/api`)
- Node.js 22 + TypeScript
- Hono (HTTP framework) + @hono/node-server
- Drizzle ORM (PostgreSQL) via `@wellness/db`
- BullMQ (background jobs — standby promotion, no-show tagging, absence alerts, reminders)
- Redis (queue backend + cache)
- bcryptjs (password hashing) + jose (JWT signing/verification)
- dotenv (env loading) + zod (env + input validation)

### Infrastructure
- PostgreSQL 16 (primary DB)
- Redis 7 (queues + cache)
- Docker + Docker Compose

### Shared
- `packages/db` — Drizzle schema & migrations (used by API)
- `packages/types` — shared TypeScript types (used by web + api)

## Current Build Status
| Layer | Status | Notes |
|---|---|---|
| Docker infra | ✅ Done | postgres, redis, pgadmin via docker-compose |
| Monorepo setup | ✅ Done | npm workspaces, root package.json |
| `packages/db` | ✅ Done | schema for users, zones, sessions, bookings, zone_visits, notifications |
| DB migrations | ✅ Done | all 6 tables live in PostgreSQL |
| API server | ✅ Done | Hono on :3001, /health route |
| Auth | ✅ Done | POST /auth/register, POST /auth/login; logout is client-side (delete JWT) |
| `packages/types` | ✅ Done | shared enums + DTOs |
| Sessions service | ✅ Done | listSessions, getSession, createSession, updateSession, deleteSession, getSessionBookings |
| Sessions routes | ✅ Done | all 5 routes + GET /:id/bookings; admin + instructor(own) guards |
| Zones routes + service | ✅ Done | listZones, createZone, enterZone, exitZone; mounted |
| Bookings routes + service | ✅ Done | createBooking, cancelBooking, listMyBookings (with ?past + ?status filters), standby logic |
| Check-in route | ✅ Done | POST /checkin, any auth, station QR model, today-only validation |
| Checkout route | ✅ Done | POST /checkout, any auth, station QR model, sets checkedOutAt |
| Zone visits (GYM) | ✅ Done | POST /zones/:id/enter + /zones/:id/exit, zone_visits table |
| Notifications (in-app) | ✅ Done | notifications table, GET /notifications/me, PATCH read/read-all |
| Progress tracking | ✅ Done | GET /progress/me — attendance stats + streak from bookings + zone_visits |
| BullMQ jobs | ✅ Done | standby-promotion, no-show-tagger, absence-checker, reminder; worker wired |
| Web app | ⏳ Pending | Next.js — not scaffolded yet |

## Dev Commands
```bash
# Start infrastructure (postgres, redis, pgadmin)
docker compose up -d

# Run all apps
npm run dev

# Run individual apps
npm run dev --workspace=apps/web
npm run dev --workspace=apps/api

# Database
npm run db:generate --workspace=apps/api   # generate migration from schema changes
npm run db:migrate --workspace=apps/api    # apply migrations to PostgreSQL
npm run db:studio --workspace=apps/api     # open Drizzle Studio UI

# Build all
npm run build

# Type check all
npm run typecheck
```

## Ports
| Service  | Port |
|----------|------|
| Web      | 3000 |
| API      | 3001 |
| Postgres | 5432 |
| Redis    | 6379 |
| pgAdmin  | 5050 |

## Key Conventions
- All route handlers live in `apps/api/src/routes/`
- Business logic lives in `apps/api/src/services/` — routes are thin
- Background jobs (BullMQ) live in `apps/api/src/jobs/`
- Drizzle schema lives in `packages/db/src/schema/` — one file per domain entity
- Next.js uses route groups for role-based layouts: `(auth)`, `(member)`, `(admin)`, `(instructor)`
- Shared types (DTOs, enums) go in `packages/types` — never duplicate between apps
- Use Zod schemas for all API input validation
- `.env` is never committed — use `.env.example` as template
- `env.ts` in apps/api validates all env vars at startup using Zod — import `env` from there, never `process.env` directly

## Database
- ORM: Drizzle
- Schema lives in `packages/db/src/schema/` — one file per domain entity
- Client is created via `createClient(DATABASE_URL)` from `packages/db`
- Migrations: `drizzle-kit` — always generate migrations, never edit the DB directly
- Migration files live in `apps/api/drizzle/`
- Connection string: `DATABASE_URL` env var

## Auth
- JWT-based, issued by the API (jose — HS256, 7 day expiry)
- Roles: `member`, `instructor`, `admin`
- Role + userId (sub) embedded in JWT claims
- `authMiddleware` in `apps/api/src/middleware/auth.ts` verifies token and attaches user to context
- Access user in routes via `c.get("user")` → `{ sub: string, role: string }`
- Passwords hashed with bcryptjs cost factor 12
- Logout is client-side — delete the token; no server-side blacklist

## Sessions Service (`apps/api/src/services/sessions.service.ts`)

### Helper: `getSpotCounts(sessionIds)`
Takes array of session IDs. Runs single `COUNT(*)` on bookings grouped by sessionId, filtered to `status = 'confirmed'`. Returns `Record<string, number>`. Returns `{}` early if array empty.

### `listSessions(): Promise<SessionResponse[]>`
Fetches all sessions where `startsAt >= now`. Calls `getSpotCounts` in one batch. Maps each row to `SessionResponse` with `spotsLeft = capacity - (counts[id] ?? 0)`.

### `getSession(id): Promise<SessionResponse | null>`
Fetches single session. Runs separate `COUNT(*)` on bookings for that session. Returns `null` if not found.

### `createSession(input): Promise<SessionResponse>`
Inserts session. Converts `startsAt`/`endsAt` strings to `Date`. Enqueues `no-show-tagger` and `reminder` jobs after insert.

### `updateSession(id, input): Promise<SessionResponse | null>`
Partial update — only `!== undefined` fields applied. Delegates to `getSession` for response.

### `deleteSession(id): Promise<void>`
Guards against deletion if confirmed or standby bookings exist (throws → 409).

### `getSessionBookings(sessionId, requesterId, requesterRole): Promise<BookingWithUserResponse[]>`
Admin sees any session. Instructor only sees sessions where `trainerId === requesterId`. Returns bookings joined with user info.

## Bookings Service (`apps/api/src/services/bookings.service.ts`)
- `createBooking(userId, sessionId)`: checks confirmed count vs capacity → `confirmed` if spots left, else `standby` with next position
- `cancelBooking(userId, bookingId)`: verifies ownership; if was `confirmed`, promotes lowest standby to `confirmed`; enqueues `standby-promotion` job
- `listMyBookings(userId, filters?)`: optional `status` filter and `past: true` flag

## Check-in / Check-out
- Station QR model — QR code is fixed at the location; member scans it with their app
- `POST /checkin` — any auth; payload `{ sessionId }`; looks up booking by `(userId from JWT, sessionId)`; validates `confirmed` + session is today → sets status to `attended`
- `POST /checkout` — any auth; payload `{ sessionId }`; looks up booking by `(userId from JWT, sessionId)`; must be `attended` → sets `checkedOutAt = now`

## Zone Visits (GYM Access)
- Station QR model — QR at zone entrance/exit; member scans; JWT identifies them; no body needed
- `POST /zones/:id/enter` — any auth; creates `zone_visits` row with `enteredAt = now`
- `POST /zones/:id/exit` — any auth; finds open visit (exitedAt IS NULL) for user + zone → sets `exitedAt = now`
- Used for progress tracking + absence detection

## Notifications (`apps/api/src/services/notifications.service.ts`)
- In-app only — no email/SMS
- `createNotification(userId, type, title, body)` — internal helper called by jobs/services
- `listNotifications(userId)` — newest first
- `markRead(userId, notificationId)` — verifies ownership
- `markAllRead(userId)` — bulk update
- `GET /notifications/me` — list user's notifications
- `PATCH /notifications/:id/read` — mark one read
- `PATCH /notifications/read-all` — mark all read
- Notification types: `standby_promoted | no_show_tagged | absence_warning | feedback_request | reminder`

## Progress (`apps/api/src/services/progress.service.ts`)
- `GET /progress/me` — returns:
  - `totalSessions`: count of attended bookings
  - `totalDays`: unique calendar days with any activity (attended booking or zone_visit)
  - `currentStreak`: consecutive days with activity up to today
- Same-day class + gym visit counts as 1 day (Set deduplication)

## Background Jobs (BullMQ) — `apps/api/src/jobs/`
- `queue.ts` — shared BullMQ queue + `createWorker` factory
- `worker.ts` — central dispatcher; started on server boot; routes job names to process functions
- `standby-promotion.job.ts` — enqueued on booking cancellation; promotes next standby; creates `standby_promoted` notification
- `no-show-tagger.job.ts` — scheduled at session `endsAt`; marks remaining `confirmed` bookings as `no_show`; creates `no_show_tagged` notifications
- `absence-checker.job.ts` — daily repeating (`0 0 * * *`); if member has no activity in last 2 days → `absence_warning` notification
- `reminder.job.ts` — scheduled 24h and 1h before session `startsAt`; creates `reminder` notifications for all confirmed bookings

## Do Not
- Do not use `any` in TypeScript
- Do not write business logic directly in route handlers
- Do not commit `.env`
- Do not use `npm install -g` inside Dockerfiles — use local project deps
- Do not call `process.env` directly — always import from `apps/api/src/env.ts`
- Do not edit migration SQL files manually — change the schema and regenerate

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
