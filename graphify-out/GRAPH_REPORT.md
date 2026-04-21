# Graph Report - C:\Users\iCxt\Desktop\hs\wellness-platform-b  (2026-04-22)

## Corpus Check
- 41 files · ~11,979 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 90 nodes · 138 edges · 20 communities detected
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]

## God Nodes (most connected - your core abstractions)
1. `createNotification()` - 5 edges
2. `getMyProfile()` - 4 edges
3. `toResponse()` - 3 edges
4. `getSession()` - 3 edges
5. `createSession()` - 3 edges
6. `processAbsenceChecker()` - 2 edges
7. `enqueueNoShowTagger()` - 2 edges
8. `processNoShowTagger()` - 2 edges
9. `createWorker()` - 2 edges
10. `enqueueReminders()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `processAbsenceChecker()` --calls--> `createNotification()`  [INFERRED]
  C:\Users\iCxt\Desktop\hs\wellness-platform-b\apps\api\src\jobs\absence-checker.job.ts → C:\Users\iCxt\Desktop\hs\wellness-platform-b\apps\api\src\services\notifications.service.ts
- `processNoShowTagger()` --calls--> `createNotification()`  [INFERRED]
  C:\Users\iCxt\Desktop\hs\wellness-platform-b\apps\api\src\jobs\no-show-tagger.job.ts → C:\Users\iCxt\Desktop\hs\wellness-platform-b\apps\api\src\services\notifications.service.ts
- `processReminder()` --calls--> `createNotification()`  [INFERRED]
  C:\Users\iCxt\Desktop\hs\wellness-platform-b\apps\api\src\jobs\reminder.job.ts → C:\Users\iCxt\Desktop\hs\wellness-platform-b\apps\api\src\services\notifications.service.ts
- `processStandbyPromotion()` --calls--> `createNotification()`  [INFERRED]
  C:\Users\iCxt\Desktop\hs\wellness-platform-b\apps\api\src\jobs\standby-promotion.job.ts → C:\Users\iCxt\Desktop\hs\wellness-platform-b\apps\api\src\services\notifications.service.ts
- `createSession()` --calls--> `enqueueNoShowTagger()`  [INFERRED]
  C:\Users\iCxt\Desktop\hs\wellness-platform-b\apps\api\src\services\sessions.service.ts → C:\Users\iCxt\Desktop\hs\wellness-platform-b\apps\api\src\jobs\no-show-tagger.job.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.18
Nodes (7): processAbsenceChecker(), processNoShowTagger(), createNotification(), createWorker(), processReminder(), processStandbyPromotion(), startWorker()

### Community 1 - "Community 1"
Cohesion: 0.23
Nodes (0): 

### Community 2 - "Community 2"
Cohesion: 0.24
Nodes (8): enqueueNoShowTagger(), enqueueReminders(), createSession(), getSession(), getSpotCounts(), listSessions(), updateSession(), updateSessionImage()

### Community 3 - "Community 3"
Cohesion: 0.28
Nodes (5): cancelBooking(), confirmBooking(), createBooking(), toResponse(), enqueueStandbyPromotion()

### Community 4 - "Community 4"
Cohesion: 0.43
Nodes (4): getMyProfile(), mapToProfile(), updateAvatar(), updateProfile()

### Community 5 - "Community 5"
Cohesion: 0.4
Nodes (0): 

### Community 6 - "Community 6"
Cohesion: 0.5
Nodes (0): 

### Community 7 - "Community 7"
Cohesion: 1.0
Nodes (2): getDashboard(), toDateStr()

### Community 8 - "Community 8"
Cohesion: 1.0
Nodes (2): getProgress(), toDateStr()

### Community 9 - "Community 9"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Community 12"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Community 13"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 9`** (2 nodes): `client.ts`, `createClient()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (1 nodes): `drizzle.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (1 nodes): `bookings.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (1 nodes): `notifications.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (1 nodes): `sessions.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (1 nodes): `users.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (1 nodes): `zones.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (1 nodes): `zone_visits.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 4 inferred relationships involving `createNotification()` (e.g. with `processAbsenceChecker()` and `processNoShowTagger()`) actually correct?**
  _`createNotification()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `createSession()` (e.g. with `enqueueNoShowTagger()` and `enqueueReminders()`) actually correct?**
  _`createSession()` has 2 INFERRED edges - model-reasoned connections that need verification._