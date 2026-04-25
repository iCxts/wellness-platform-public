# Wellness Platform API

**Base URL:** `http://localhost:3001`
**Auth:** `Authorization: Bearer <token>` on all protected routes.
**Roles:** `member` | `instructor` | `admin`
**Token expiry:** 7 days (HS256 JWT)

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
| 403 | Wrong role or resource ownership mismatch |
| 404 | Not found |
| 409 | Conflict (e.g. duplicate booking, session has active bookings) |
| 500 | Unexpected server error |

---

## Health

### GET /health
No auth.

**200**
```json
{ "status": "ok", "db": "connected" }
```

---

## Auth

### POST /auth/register
No auth. All new accounts are created with role `member` regardless of input.

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
`phone` optional.

**201**
```json
{ "user": { "id": "uuid", "email": "alice@example.com", "role": "member" } }
```
**400** Email already registered.

---

### POST /auth/login
No auth.

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

## Users

All routes require auth.

**UserResponse shape**
```json
{
  "id": "uuid",
  "email": "alice@example.com",
  "firstName": "Alice",
  "lastName": "Smith",
  "phone": null,
  "role": "member",
  "avatarUrl": null,
  "parqCleared": false,
  "fitnessInterests": null,
  "createdAt": "2026-04-10T08:00:00.000Z"
}
```

---

### GET /users/me
Any auth. Get own profile.

**200** UserResponse.

---

### PATCH /users/me
Any auth. Update own profile.

**Body** (all optional)
```json
{
  "firstName": "Alice",
  "lastName": "Smith",
  "phone": "+1234567890"
}
```

**200** Updated UserResponse.

---

### POST /users/me/avatar
Any auth. Upload profile avatar. Send as `multipart/form-data` with a `file` field (jpeg/png/webp, max 10 MB).

**200** Updated UserResponse with `avatarUrl` set.
**400** Missing file or invalid type/size.

---

### GET /users/me/qr
Member only. Generate a short-lived QR token (5 min expiry) for instructor check-in scan.

**200**
```json
{
  "token": "<jwt>",
  "expiresAt": "2026-04-10T08:05:00.000Z"
}
```
Regenerate on the client when `expiresAt` is reached.

---

### GET /users/me/checkin/latest
Member only. Get details of the most recent check-in.

**200**
```json
{
  "id": "uuid",
  "sessionId": "uuid",
  "className": "Morning Yoga",
  "checkInTime": "2026-04-10T08:03:00.000Z"
}
```
**404** No check-in found.

---

### GET /users/:memberId
Instructor or admin. View a member's profile.

**200** UserResponse.
**403** Unauthorized.

---

### GET /users/:memberId/progress
Instructor or admin. View a member's progress stats.

**200**
```json
{
  "totalSessions": 12,
  "totalDays": 10,
  "currentStreak": 3
}
```
**403** Unauthorized.

---

## Sessions

All routes require auth.

Session types: `group_class` | `personal_training` | `medical_consult` | `open_facility`

Session levels: `beginner` | `pre_intermediate` | `intermediate` | `advanced`

Session focuses: `neck_shoulders` | `hips_opener` | `breathing_flow` | `lower_back_care` | `core_strength` | `posture_reset` | `stress_release` | `brain_refresh`

**SessionResponse shape**
```json
{
  "id": "uuid",
  "title": "Morning Yoga",
  "type": "group_class",
  "level": null,
  "focus": null,
  "description": null,
  "imageUrl": null,
  "roomName": null,
  "placeDescription": null,
  "trainerId": "uuid",
  "zoneId": "uuid",
  "startsAt": "2026-04-10T08:00:00.000Z",
  "endsAt": "2026-04-10T09:00:00.000Z",
  "capacity": 20,
  "spotsLeft": 14
}
```

---

### GET /sessions
Any auth. List all upcoming sessions (startsAt >= now).

**Query params** (all optional)

| Param | Example | Description |
|-------|---------|-------------|
| `focus` | `core_strength` | Filter by focus tag |
| `day` | `2026-04-10` | Filter to sessions on a specific date (YYYY-MM-DD) |

**200** Array of SessionResponse.

---

### GET /sessions/:id
Any auth.

**200** SessionResponse.
**404** Session not found.

---

### POST /sessions
Admin only. Create session.

**Body**
```json
{
  "title": "Morning Yoga",
  "type": "group_class",
  "trainerId": "uuid",
  "zoneId": "uuid",
  "startsAt": "2026-04-10T08:00:00.000Z",
  "endsAt": "2026-04-10T09:00:00.000Z",
  "capacity": 20,
  "level": "beginner",
  "focus": ["core_strength", "breathing_flow"],
  "description": "...",
  "roomName": "Studio A",
  "placeDescription": "Ground floor, turn left"
}
```
Required: `title`, `type`, `zoneId`, `startsAt`, `endsAt`, `capacity`.
Optional: `trainerId`, `level`, `focus`, `description`, `roomName`, `placeDescription`.

Auto-enqueues `no-show-tagger` (at `endsAt`) and `reminder` jobs (24h and 1h before `startsAt`).

**201** SessionResponse.
**403** Unauthorized.

---

### PATCH /sessions/:id
Admin or instructor (own sessions only). Update session. All fields optional.

**Body** Any subset of POST /sessions body fields.

**200** Updated SessionResponse.
**403** Unauthorized.
**404** Session not found.

---

### DELETE /sessions/:id
Admin only. Fails if session has `confirmed` or `standby` bookings. Cancelled/attended bookings do not block deletion.

**204** No body.
**403** Unauthorized.
**409** `"Cannot delete a session with existing bookings"`

---

### POST /sessions/:id/image
Admin or instructor (own sessions only). Upload session cover image. Send as `multipart/form-data` with a `file` field (jpeg/png/webp, max 10 MB).

**200** SessionResponse with `imageUrl` set to full URL.
**400** Missing file or invalid type/size.
**403** Unauthorized.
**404** Session not found.

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
Any auth. List all zones.

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
Any auth. Record zone entry using JWT identity.

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
Any auth. Close the open visit for this user in this zone.

**No body required.**

**200** ZoneVisitResponse with `exitedAt` set.
**404** No active visit found.

---

## Bookings

All routes require auth.

Booking statuses: `confirmed` | `standby` | `pending_confirmation` | `cancelled` | `attended` | `no_show`

**BookingResponse shape** (raw — no session details)
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

**BookingWithSessionResponse shape** (enriched — returned by `?tab` and `GET /bookings/:id`)
```json
{
  "bookingId": "uuid",
  "sessionId": "uuid",
  "title": "Morning Yoga",
  "type": "group_class",
  "imageUrl": null,
  "startsAt": "2026-04-10T08:00:00.000Z",
  "endsAt": "2026-04-10T09:00:00.000Z",
  "status": "confirmed",
  "standbyPosition": null,
  "createdAt": "2026-04-08T10:00:00.000Z"
}
```

---

### GET /bookings
Admin only. List all bookings.

**Query params** (all optional)

| Param | Values | Description |
|-------|--------|-------------|
| `sessionId` | uuid | Filter by session |
| `status` | booking status | Filter by status |

**200** Array of objects with `bookingId`, `status`, `standbyPosition`, `createdAt`, nested `session` and `member`.

---

### GET /bookings/me
Any auth. List own bookings.

**Tab mode** (preferred — returns enriched data with session details):

| `?tab` | Returns |
|--------|---------|
| `upcoming` | Confirmed bookings, future sessions, soonest first |
| `history` | All statuses, past sessions, newest first |
| `waitlist` | Standby bookings, soonest first |

**200** Array of BookingWithSessionResponse.

**Legacy mode** (plain BookingResponse):

| Param | Values |
|-------|--------|
| `status` | booking status |
| `past` | `true` |

---

### GET /bookings/:id
Any auth. Get one booking with full session and instructor details.

**200**
```json
{
  "bookingId": "uuid",
  "status": "confirmed",
  "standbyPosition": null,
  "createdAt": "2026-04-08T10:00:00.000Z",
  "session": {
    "id": "uuid",
    "title": "Morning Yoga",
    "type": "group_class",
    "level": null,
    "focus": null,
    "description": null,
    "imageUrl": null,
    "roomName": null,
    "startsAt": "2026-04-10T08:00:00.000Z",
    "endsAt": "2026-04-10T09:00:00.000Z",
    "capacity": 20,
    "spotsLeft": 14,
    "zoneName": "Studio A"
  },
  "instructor": {
    "id": "uuid",
    "firstName": "Bob",
    "lastName": "Trainer",
    "avatarUrl": null
  }
}
```
**404** Booking not found.

---

### POST /bookings
Any auth. Book a session.

If spots available → status `confirmed`. If full → status `standby` with queue position.

**Body**
```json
{ "sessionId": "uuid" }
```

**201** BookingResponse.
**400** Session not found or already booked.

---

### PATCH /bookings/:id/confirm
Any auth (booking owner only). Confirm own booking when status is `pending_confirmation`.

`pending_confirmation` is set by the standby promotion job when the member ahead cancels. The member must confirm within a reasonable window.

**200** BookingResponse with status `confirmed`.
**400** Booking is not pending confirmation.
**403** Booking belongs to another user.
**404** Booking not found.

---

### DELETE /bookings/:id
Any auth (booking owner only). Cancel own booking.

If cancelled booking was `confirmed`, the next `standby` member is promoted to `pending_confirmation` and notified.

**204** No body.
**400** Already cancelled.
**403** Booking belongs to another user.
**404** Booking not found.

---

## Check-in

**Model:** Member opens app → shows QR → instructor scans it with their device.

- Member QR token: `GET /users/me/qr` → 5-min JWT
- Instructor/admin sends `{ sessionId, memberToken }` to `POST /checkin`

### POST /checkin
Instructor or admin only.

Rules:
- `memberToken` must be a valid QR JWT (`type: qr_checkin`)
- Member must have a `confirmed` booking for that session
- Session must be today (UTC date)

**Body**
```json
{ "sessionId": "uuid", "memberToken": "<qr jwt>" }
```

**200**
```json
{
  "checkInTime": "2026-04-10T08:03:00.000Z",
  "className": "Morning Yoga",
  "memberName": "Alice Smith"
}
```
**400** Session not today, booking not confirmed, or invalid token.
**403** Unauthorized role.
**404** Session or booking not found.

---

## Check-out

### POST /checkout
Any auth. Member checks out of a session they attended.

Rules:
- Caller's booking for that session must be `attended`

**Body**
```json
{ "sessionId": "uuid" }
```

**200** BookingResponse (status `attended`, `checkedOutAt` recorded).
**400** Booking not attended.
**404** Booking not found.

---

## Notifications

All routes require auth. In-app only — no email or SMS.

Notification types: `standby_promoted` | `no_show_tagged` | `absence_warning` | `feedback_request` | `reminder`

**NotificationResponse shape**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "type": "standby_promoted",
  "title": "You got a spot!",
  "body": "Your standby booking has been confirmed.",
  "isRead": false,
  "metadata": { "sessionId": "uuid", "bookingId": "uuid" },
  "createdAt": "2026-04-08T10:00:00.000Z"
}
```
`metadata` is a JSON object with context-specific fields, or `null`.

---

### GET /notifications/me
Any auth. List own notifications, newest first.

**Query params** (optional)

| Param | Values | Description |
|-------|--------|-------------|
| `unread` | `true` | Only unread notifications |

**200** Array of NotificationResponse.

---

### PATCH /notifications/read-all
Any auth. Mark all own notifications as read.

**200** `{ "success": true }`

---

### PATCH /notifications/:id/read
Any auth. Mark one notification as read.

**200** `{ "success": true }`
**403** Notification belongs to another user.
**404** Notification not found.

---

## Progress

All routes require auth.

### GET /progress/me
Any auth. Returns attendance stats for the authenticated user.

Stats derived from attended bookings + zone visits.

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

---

## Dashboard

### GET /dashboard/me
Any auth. Single endpoint for main dashboard — all data in one call.

**200**
```json
{
  "profile": {
    "firstName": "Alice",
    "avatarUrl": null
  },
  "upcomingClass": {
    "bookingId": "uuid",
    "sessionId": "uuid",
    "title": "Morning Yoga",
    "imageUrl": null,
    "startsAt": "2026-04-10T08:00:00.000Z",
    "endsAt": "2026-04-10T09:00:00.000Z",
    "startsInMs": 3600000
  },
  "progress": {
    "currentStreak": 3,
    "totalSessionsAttended": 12,
    "totalZoneVisits": 5
  },
  "schedule": [
    {
      "id": "uuid",
      "title": "Morning Yoga",
      "type": "group_class",
      "imageUrl": null,
      "startsAt": "2026-04-10T08:00:00.000Z",
      "endsAt": "2026-04-10T09:00:00.000Z",
      "spotsLeft": 14,
      "bookingStatus": "confirmed",
      "bookingId": "uuid"
    }
  ],
  "myBookings": [
    {
      "bookingId": "uuid",
      "sessionId": "uuid",
      "title": "Morning Yoga",
      "imageUrl": null,
      "startsAt": "2026-04-10T08:00:00.000Z",
      "endsAt": "2026-04-10T09:00:00.000Z",
      "status": "confirmed",
      "standbyPosition": null
    }
  ]
}
```

| Field | Description |
|-------|-------------|
| `upcomingClass` | Next confirmed booking with `startsInMs` until start; `null` if none |
| `schedule` | All sessions in next 7 days; `bookingStatus`/`bookingId` null if not booked |
| `myBookings` | Upcoming confirmed + standby bookings |

---

## Background Jobs

Managed by BullMQ. Enqueued automatically — no API endpoints.

| Job | Trigger | Action |
|-----|---------|--------|
| `standby-promotion` | Booking cancelled | Promotes next standby to `pending_confirmation`; sends `standby_promoted` notification |
| `no-show-tagger` | Session `endsAt` | Marks remaining `confirmed` bookings as `no_show`; sends `no_show_tagged` notifications |
| `absence-checker` | Daily `0 0 * * *` | Sends `absence_warning` if member has no activity in last 2 days |
| `reminder` | 24h and 1h before `startsAt` | Sends `reminder` notifications to all confirmed bookings |
