# Hosting Options — Wellness Platform

## Option A: VPS (Hetzner) — Self-Managed

You rent a bare Linux server. You install Docker and run `docker-compose.prod.yml` yourself.

**Pros:** Cheapest, full control, stack already Dockerized  
**Cons:** You manage server updates, SSL, backups, uptime

### Setup
```bash
# On Hetzner server (Ubuntu)
apt install docker.io docker-compose

# Copy repo + .env, then:
docker compose -f docker-compose.prod.yml up -d
```

### Cost Breakdown

| Users | Server Spec | Storage | Monthly |
|------:|-------------|---------|---------|
| 100   | 4GB RAM / 2 vCPU | 40GB SSD | $7 |
| 500   | 8GB RAM / 4 vCPU | 80GB SSD | $14 |
| 1,000 | 16GB RAM / 8 vCPU | 160GB SSD | $28 |
| 5,000 | 32GB RAM / 16 vCPU | 360GB SSD | $55 |
| 10,000 | 2× servers | — | $125 |

### With Add-on Services

| Users | Hosting | Email (Resend) | Storage (R2) | **Total** |
|------:|---------|----------------|--------------|-----------|
| 100   | $7      | Free           | Free         | **$7/mo** |
| 500   | $14     | Free           | Free         | **$14/mo** |
| 1,000 | $28     | $20            | Free         | **$48/mo** |
| 5,000 | $55     | $20            | $1           | **$76/mo** |
| 10,000 | $125   | $20            | $3           | **$148/mo** |

---

## Option B: PaaS (Railway) — Managed

You push code, Railway builds and runs it. No server management.

**Pros:** No ops, auto SSL, easy deploys, scales per service  
**Cons:** 5–10× more expensive than VPS

### Services Deployed

| Service | What it runs |
|---------|-------------|
| `api` | Hono Node.js API |
| `web` | Nuxt frontend |
| `postgres` | PostgreSQL 16 |
| `redis` | Redis 7 + BullMQ |

### Cost Breakdown

| Users | API | Web | Postgres | Redis | **Monthly** |
|------:|-----|-----|----------|-------|-------------|
| 100   | 512MB | 512MB | 1GB data | 128MB | **$38/mo** |
| 500   | 1GB | 512MB | 5GB data | 256MB | **$60/mo** |
| 1,000 | 2GB | 1GB | 10GB data | 512MB | **$95/mo** |
| 5,000 | 4GB | 2GB | 50GB data | 1GB | **$175/mo** |
| 10,000 | 8GB | 4GB | 100GB data | 2GB | **$330/mo** |

### With Add-on Services

| Users | Hosting | Email (Resend) | Storage (R2) | **Total** |
|------:|---------|----------------|--------------|-----------|
| 100   | $38     | Free           | Free         | **$38/mo** |
| 500   | $60     | Free           | Free         | **$60/mo** |
| 1,000 | $95     | $20            | Free         | **$115/mo** |
| 5,000 | $175    | $20            | $1           | **$196/mo** |
| 10,000 | $330   | $20            | $3           | **$353/mo** |

---

## Side-by-Side Summary

| Users | VPS (Hetzner) | PaaS (Railway) | Savings with VPS |
|------:|---------------|----------------|-----------------|
| 100   | $7/mo         | $38/mo         | $31/mo (81%) |
| 500   | $14/mo        | $60/mo         | $46/mo (77%) |
| 1,000 | $48/mo        | $115/mo        | $67/mo (58%) |
| 5,000 | $76/mo        | $196/mo        | $120/mo (61%) |
| 10,000 | $148/mo      | $353/mo        | $205/mo (58%) |

---

## Which to Choose

| Situation | Pick |
|-----------|------|
| Early stage, budget tight | **VPS** |
| No time for server ops | **PaaS** |
| < 500 users | **VPS** — $7/mo is hard to beat |
| Team with no DevOps | **PaaS** |
| Scaling fast, need flexibility | **VPS** → migrate later |

> **Note:** Push notifications currently disabled in code. Email reminders not yet wired to external provider.  
> Domain: +$10–15/yr. SSL: Free via Let's Encrypt (VPS) or auto-managed (Railway).
