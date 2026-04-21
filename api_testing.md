# API Testing Commands

Base URL: `http://localhost:3001`

## Start Server
```bash
docker compose up -d && lsof -ti:3001 | xargs kill -9 2>/dev/null; npm run dev --workspace=apps/api
```

---

## Health
```bash
curl http://localhost:3001/health
```

---

## Auth

### Register
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","name":"Test User","role":"member"}'
```

### Login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

### Save token
```bash
TOKEN="<paste token here>"
```

---

## Sessions

```bash
# List upcoming sessions
curl http://localhost:3001/sessions -H "Authorization: Bearer $TOKEN"

# Get session by ID
curl http://localhost:3001/sessions/<id> -H "Authorization: Bearer $TOKEN"

# Get session bookings (admin/instructor)
curl http://localhost:3001/sessions/<id>/bookings -H "Authorization: Bearer $TOKEN"

# Create session (admin/instructor)
curl -X POST http://localhost:3001/sessions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Yoga","type":"group","trainerId":"<uuid>","startsAt":"2026-04-20T10:00:00Z","endsAt":"2026-04-20T11:00:00Z","capacity":10}'

# Update session (admin/instructor)
curl -X PATCH http://localhost:3001/sessions/<id> \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"capacity":15}'

# Delete session (admin)
curl -X DELETE http://localhost:3001/sessions/<id> -H "Authorization: Bearer $TOKEN"
```

---

## Bookings

```bash
# Create booking
curl -X POST http://localhost:3001/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"<uuid>"}'

# List my bookings
curl http://localhost:3001/bookings/me -H "Authorization: Bearer $TOKEN"

# Filter by status
curl "http://localhost:3001/bookings/me?status=confirmed" -H "Authorization: Bearer $TOKEN"

# Show past bookings
curl "http://localhost:3001/bookings/me?past=true" -H "Authorization: Bearer $TOKEN"

# Cancel booking
curl -X DELETE http://localhost:3001/bookings/<id> -H "Authorization: Bearer $TOKEN"
```

---

## Check-in / Check-out

```bash
# Check in (session must be today, booking must be confirmed)
curl -X POST http://localhost:3001/checkin \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"<uuid>"}'

# Check out (booking must be attended)
curl -X POST http://localhost:3001/checkout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"<uuid>"}'
```

---

## Zones (GYM Access)

```bash
# List zones
curl http://localhost:3001/zones -H "Authorization: Bearer $TOKEN"

# Enter zone
curl -X POST http://localhost:3001/zones/<id>/enter -H "Authorization: Bearer $TOKEN"

# Exit zone
curl -X POST http://localhost:3001/zones/<id>/exit -H "Authorization: Bearer $TOKEN"
```

---

## Notifications

```bash
# List my notifications
curl http://localhost:3001/notifications/me -H "Authorization: Bearer $TOKEN"

# Mark one read
curl -X PATCH http://localhost:3001/notifications/<id>/read -H "Authorization: Bearer $TOKEN"

# Mark all read
curl -X PATCH http://localhost:3001/notifications/read-all -H "Authorization: Bearer $TOKEN"
```

---

## Progress

```bash
# Get my progress stats
curl http://localhost:3001/progress/me -H "Authorization: Bearer $TOKEN"
```
