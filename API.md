# Wellness Platform API

**Base URL:** `http://localhost:3001`
**Auth:** `Authorization: Bearer <token>` on all protected routes.
**Roles:** `member` | `instructor` | `admin`
**Token expiry:** 7 days

---

## Errors

All errors return:
```json
{ "error": "message" }
```

| Code | Meaning |
|------|---------|
| 400 | Bad request or business rule violation |
| 401 | Missing or invalid token |
| 403 | Wrong role |
| 404 | Not found |
| 409 | Conflict |

---

## Health

### GET /health
No auth. Check server and DB status.

```json
{ "status": "ok", "db": "connected" }
```

---

## Auth

### POST /auth/register
No auth. Create member account.

**Body**
```json
{
  "email": "alice@example.com",
  "password": "secret1234",
  "firstName": "Alice",
  "lastName": "Smith",
  "phone": "+1234567890"
}
```
`phone` is optional.

**201**
```json
{ "user": { "id": "uuid", "email": "alice@example.com", "role": "member" } }
```

**400** Email already registered.

---

### POST /auth/login
No auth. Returns JWT.

**Body**
```json
{ "email": "alice@example.com", "password": "secret1234" }
```

**200**
```json
{
  "token": "<jwt>",
  "user": { "id": "uuid", "email": "alice@example.com", "role": "member" }
}
```

**401** Wrong credentials.

---

## Sessions

All routes require auth.

Session types: `group_class` | `personal_training` | `medical_consult` | `open_facility`

**SessionResponse shape**
```json
{
  "id": "uuid",
  "title": "Morning Yoga",
  "type": "group_class",
  "trainerId": "uuid or null",
  "zoneId": "uuid",
  "startsAt": "2026-04-10T08:00:00.000Z",
  "endsAt": "2026-04-10T09:00:00.000Z",
  "capacity": 20,
  "spotsLeft": 14
}
```

---

### GET /sessions
Any role. List all upcoming sessions.

**200** Array of SessionResponse.

---

### GET /sessions/:id
Any role. Get one session.

**200** SessionResponse.
**404** Session not found.

---

### POST /sessions
Admin or instructor. Create session.

Instructors do not send `trainerId` -- it is set to their own ID automatically.

**Body**
```json
{
  "title": "Morning Yoga",
  "type": "group_class",
  "trainerId": "uuid",
  "zoneId": "uuid",
  "startsAt": "2026-04-10T08:00:00.000Z",
  "endsAt": "2026-04-10T09:00:00.000Z",
  "capacity": 20
}
```
`trainerId` optional, admin only.

**201** SessionResponse.
**403** Unauthorized.

---

### PATCH /sessions/:id
Admin or instructor (own sessions only). Update session. All fields optional.

**Body** Any subset of POST /sessions fields.

**200** Updated SessionResponse.
**403** Unauthorized.
**404** Session not found.

---

### DELETE /sessions/:id
Admin only. Delete session. Fails if active bookings exist.

**204** No body.
**403** Unauthorized.
**409** Active bookings exist.

---

### GET /sessions/:id/bookings
Admin (any session) or instructor (own sessions only). List enrolled members.

**200**
```json
[
  {
    "id": "uuid",
    "sessionId": "uuid",
    "userId": "uuid",
    "status": "confirmed",
    "standbyPosition": null,
    "createdAt": "2026-04-08T10:00:00.000Z",
    "user": {
      "id": "uuid",
      "firstName": "Alice",
      "lastName": "Smith",
      "email": "alice@example.com"
    }
  }
]
```
**403** Unauthorized.
**404** Session not found.

---

## Zones

All routes require auth.

**ZoneResponse shape**
```json
{
  "id": "uuid",
  "name": "Cardio Floor",
  "description": "Treadmills and bikes",
  "capacity": 30,
  "isActive": true
}
```

---

### GET /zones
Any role. List all zones.

**200** Array of ZoneResponse.

---

### POST /zones
Admin only. Create zone.

**Body**
```json
{
  "name": "Cardio Floor",
  "description": "...",
  "capacity": 30
}
```
`description` optional.

**201** ZoneResponse.
**403** Unauthorized.

---

### POST /zones/:id/enter
Any auth. Member scans QR at zone entrance. Records entry using JWT identity.

**No body required.**

**201**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "zoneId": "uuid",
  "enteredAt": "2026-04-11T09:00:00.000Z",
  "exitedAt": null,
  "createdAt": "2026-04-11T09:00:00.000Z"
}
```
**404** Zone not found.

---

### POST /zones/:id/exit
Any auth. Member scans QR at zone exit. Closes the open visit for this user.

**No body required.**

**200** ZoneVisitResponse with `exitedAt` set.
**404** No active visit found.

---

## Bookings

All routes require auth.

Booking statuses: `confirmed` | `standby` | `cancelled` | `attended` | `no_show`

**BookingResponse shape**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "sessionId": "uuid",
  "status": "confirmed",
  "standbyPosition": null,
  "createdAt": "2026-04-08T10:00:00.000Z"
}
```
`standbyPosition` is a number when status is `standby`, otherwise `null`.

---

### GET /bookings/me
Any auth. List own bookings.

**Query params** (all optional)

| Param | Values | Description |
|-------|--------|-------------|
| `status` | `confirmed` `standby` `cancelled` `attended` `no_show` | Filter by status |
| `past` | `true` | Only sessions that have already started |

**200** Array of BookingResponse.

---

### POST /bookings
Any auth. Book a session.

If spots available, status is `confirmed`. If full, status is `standby` with a queue position.

**Body**
```json
{ "sessionId": "uuid" }
```

**201** BookingResponse.
**400** Session not found or already booked.

---

### DELETE /bookings/:id
Any auth. Cancel own booking. If cancelled booking was `confirmed`, next standby is promoted automatically.

**204** No body.
**403** Booking belongs to another user.
**404** Booking not found.
**400** Already cancelled.

---

## Check-in

QR code is mounted at the class room. Member opens app, scans QR (encodes `sessionId`), app calls this endpoint. JWT identifies who the member is.

### POST /checkin
Any auth.

Rules:
- Member must have a `confirmed` booking for that session
- Session must be today (UTC)

**Body**
```json
{ "sessionId": "uuid" }
```

**200**
```json
{ "success": true }
```

**404** Session not found or booking not found.
**400** Session not today or booking not confirmed.

---

## Check-out

Same station QR model. Member scans exit QR (encodes `sessionId`).

### POST /checkout
Any auth.

Rules:
- Member must have an `attended` booking for that session

**Body**
```json
{ "sessionId": "uuid" }
```

**200** BookingResponse with `checkedOutAt` set.
**404** Booking not found.
**400** Booking not attended.

---

## Notifications

All routes require auth. In-app only, no email or SMS.

Notification types: `standby_promoted` | `no_show_tagged` | `absence_warning` | `feedback_request` | `reminder`

**NotificationResponse shape**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "type": "standby_promoted",
  "title": "You got a spot!",
  "body": "Your standby booking for Morning Yoga has been confirmed.",
  "isRead": false,
  "createdAt": "2026-04-08T10:00:00.000Z"
}
```

---

### GET /notifications/me
Any auth. List own notifications, newest first.

**200** Array of NotificationResponse.

---

### PATCH /notifications/read-all
Any auth. Mark all notifications as read.

**200**
```json
{ "success": true }
```

---

### PATCH /notifications/:id/read
Any auth. Mark one notification as read.

**200**
```json
{ "success": true }
```

**403** Notification belongs to another user.
**404** Notification not found.

---

## Progress

All routes require auth.

### GET /progress/me
Any auth. Returns attendance stats for the authenticated user.

Stats are derived from attended bookings and zone visits.

**200**
```json
{
  "totalSessions": 12,
  "totalDays": 10,
  "currentStreak": 3
}
```

| Field | Description |
|-------|-------------|
| `totalSessions` | Count of attended class bookings |
| `totalDays` | Unique calendar days with any activity (class or gym) |
| `currentStreak` | Consecutive days with activity up to today |
