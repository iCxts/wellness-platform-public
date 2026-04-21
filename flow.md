# Wellness Platform - Flow Reference

---

## Auth

### Register
```
User submits form (email, password, name)
        |
POST /auth/register
        |
201 -> { user: { id, email, role: "member" } }
400 -> email already exists
```

### Login
```
User submits credentials
        |
POST /auth/login
        |
200 -> { token, user }   store token in memory / httpOnly cookie
401 -> wrong credentials
```

### Logout
```
Client deletes token (no API call needed)
```

---

## Sessions

### Browse classes
```
User opens class list
        |
GET /sessions
        |
200 -> list of upcoming sessions with spotsLeft
```

### View one class
```
User taps a session
        |
GET /sessions/:id
        |
200 -> session detail + spotsLeft
404 -> not found
```

### Create class (admin)
```
Admin fills form
        |
POST /sessions { title, type, zoneId, startsAt, endsAt, capacity, trainerId? }
        |
201 -> created session
403 -> not admin
```

### Create class (instructor)
```
Instructor fills form (no trainerId needed)
        |
POST /sessions { title, type, zoneId, startsAt, endsAt, capacity }
        |
API auto-sets trainerId = instructor's own userId
        |
201 -> created session
403 -> not instructor or admin
```

### Edit class
```
Admin or instructor (own session only) edits fields
        |
PATCH /sessions/:id { ...partial fields }
        |
200 -> updated session
403 -> not owner or admin
404 -> session not found
```

### Delete class
```
Admin submits delete
        |
DELETE /sessions/:id
        |
204 -> deleted
409 -> session has active bookings, cannot delete
```

### View enrolled members
```
Instructor or admin opens session roster
        |
GET /sessions/:id/bookings
        |
200 -> list of bookings with user name + email
403 -> not instructor (own) or admin
404 -> session not found
```

---

## Zones

### List zones
```
Anyone opens zone list
        |
GET /zones
        |
200 -> list of zones with capacity and isActive
```

### Create zone
```
Admin submits zone form
        |
POST /zones { name, description?, capacity }
        |
201 -> created zone
403 -> not admin
```

---

## Bookings

### Book a class
```
Member taps "Book" on a session
        |
POST /bookings { sessionId }
        |
spotsLeft > 0 -> status: "confirmed"   201
spotsLeft = 0 -> status: "standby"     201, standbyPosition assigned
400 -> session not found or already booked
```

### View my bookings
```
Member opens bookings tab
        |
GET /bookings/me
GET /bookings/me?status=confirmed
GET /bookings/me?past=true
        |
200 -> filtered list of BookingResponse
```

### Cancel a booking
```
Member taps "Cancel"
        |
DELETE /bookings/:id
        |
204 -> cancelled
        |
If booking was "confirmed" -> next standby auto-promoted to "confirmed"
                              + standby_promoted notification sent
403 -> not your booking
404 -> booking not found
400 -> already cancelled
```

---

## Check-in (class)

QR code is fixed at the class room. Member scans with app.

```
Member arrives at class room
        |
App scans station QR -> decodes sessionId
        |
POST /checkin { sessionId }   (JWT = member identity)
        |
API checks:
  - session exists and is today
  - member has a "confirmed" booking for that session
        |
200 -> { success: true }   booking status set to "attended"
404 -> session or booking not found
400 -> session not today / booking not confirmed
```

---

## Check-out (class)

QR code at class room exit. Member scans when leaving.

```
Member leaves class
        |
App scans exit QR -> decodes sessionId
        |
POST /checkout { sessionId }   (JWT = member identity)
        |
API checks:
  - member has an "attended" booking for that session
        |
200 -> BookingResponse with checkedOutAt set
404 -> booking not found
400 -> booking not attended
```

---

## GYM Zone Access

QR codes at zone entrance and exit. Member scans on entry and exit.

### Enter zone
```
Member arrives at GYM zone entrance
        |
App scans entrance QR -> decodes zoneId
        |
POST /zones/:id/enter   (no body, JWT = member identity)
        |
API creates zone_visits row { userId, zoneId, enteredAt: now }
        |
201 -> ZoneVisitResponse { id, userId, zoneId, enteredAt, exitedAt: null }
404 -> zone not found
```

### Exit zone
```
Member leaves GYM zone
        |
App scans exit QR -> decodes zoneId
        |
POST /zones/:id/exit   (no body, JWT = member identity)
        |
API finds open visit (exitedAt IS NULL) for this user + zone
Sets exitedAt = now
        |
200 -> ZoneVisitResponse { exitedAt: timestamp }
404 -> no active visit found
```

---

## Notifications

Notifications are created automatically by background jobs. Member reads them in-app.

### When notifications are created

| Event | Type | Trigger |
|-------|------|---------|
| Standby booking promoted | `standby_promoted` | Another member cancels a confirmed booking |
| Class ended with no check-in | `no_show_tagged` | Job runs after session ends |
| No gym activity for 2 days | `absence_warning` | Daily background job |
| Session coming up | `reminder` | Job runs 24h and 1h before session |
| After attending a class | `feedback_request` | Job runs after checkout |

### Read notifications
```
Member opens notification center
        |
GET /notifications/me
        |
200 -> list of notifications newest first, unread (isRead: false) shown first in UI
```

### Mark one read
```
Member taps a notification
        |
PATCH /notifications/:id/read
        |
200 -> { success: true }
```

### Mark all read
```
Member taps "Mark all read"
        |
PATCH /notifications/read-all
        |
200 -> { success: true }
```

---

## Progress

### View stats
```
Member opens progress screen
        |
GET /progress/me
        |
API queries:
  attended bookings  -> session dates
  zone visits        -> entry dates
  merges into unique calendar days
        |
200 ->
{
  "totalSessions": 12,    classes attended
  "totalDays": 10,        unique days with any activity
  "currentStreak": 3      consecutive days up to today
}
```

Streak resets if member misses one full calendar day.

---

## Role Summary

| Action | member | instructor | admin |
|--------|--------|------------|-------|
| Register / login | yes | yes | yes |
| Browse sessions | yes | yes | yes |
| Book / cancel | yes | yes | yes |
| Check-in / check-out | yes | yes | yes |
| Zone enter / exit | yes | yes | yes |
| View own bookings | yes | yes | yes |
| View notifications | yes | yes | yes |
| View progress | yes | yes | yes |
| Create session | no | own only | yes |
| Edit session | no | own only | yes |
| Delete session | no | no | yes |
| View session roster | no | own only | yes |
| Create zone | no | no | yes |
