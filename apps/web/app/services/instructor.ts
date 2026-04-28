import {
  instructorMemberSchema,
  instructorSessionSchema,
  instructorWaitlistMemberSchema,
  type InstructorMember,
  type InstructorSession,
  type InstructorWaitlistMember,
} from '~/schemas/instructor'
import { useAuth } from '~/composables/useAuth'

const wait = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

const imgYoga1 =
  'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&w=900&q=80'
const imgYoga2 =
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80'

/** Mock: logged-in instructor — swap for auth user from API */
export const INSTRUCTOR_MOCK_NAME = 'Kru Ploy'

const instructorSessionsSeed: InstructorSession[] = [
  {
    id: 'yoga-express',
    title: 'YOGA Express',
    startTime: '12:15',
    endTime: '13:00',
    dateLabel: 'Today',
    location: 'Wellness Center A',
    room: 'Room 4',
    participants: 18,
    capacity: 20,
    instructor: INSTRUCTOR_MOCK_NAME,
    imageUrl: imgYoga1,
  },
  {
    id: 'instructor-yoga-flow-1',
    title: 'YOGA Flow',
    startTime: '13:00',
    endTime: '14:00',
    dateLabel: '8 APR',
    location: 'Wellness Center A',
    room: 'Room 2',
    participants: 18,
    capacity: 20,
    instructor: INSTRUCTOR_MOCK_NAME,
    imageUrl: imgYoga2,
  },
  {
    id: 'instructor-yoga-express-2',
    title: 'YOGA Express',
    startTime: '13:15',
    endTime: '14:00',
    dateLabel: '12 APR',
    location: 'Wellness Center A',
    room: 'Room 4',
    participants: 18,
    capacity: 20,
    instructor: INSTRUCTOR_MOCK_NAME,
    imageUrl: imgYoga1,
  },
  {
    id: 'instructor-yoga-express-3',
    title: 'YOGA Express',
    startTime: '17:00',
    endTime: '17:30',
    dateLabel: '18 APR',
    location: 'Wellness Center A',
    room: 'Room 4',
    participants: 18,
    capacity: 20,
    instructor: INSTRUCTOR_MOCK_NAME,
    imageUrl: imgYoga1,
  },
  {
    id: 'instructor-yoga-flow-2',
    title: 'YOGA Flow',
    startTime: '17:00',
    endTime: '17:30',
    dateLabel: '24 APR',
    location: 'Wellness Center A',
    room: 'Room 2',
    participants: 12,
    capacity: 20,
    instructor: INSTRUCTOR_MOCK_NAME,
    imageUrl: imgYoga2,
  },
]

const waitlistBySessionSeed: Record<string, InstructorWaitlistMember[]> = {
  'yoga-express': [
    {
      id: 'pim',
      name: 'Pim',
      email: 'pim.a@bgrimm.com',
      position: 1,
      status: 'standby',
      avatarUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=96&h=96&q=80',
    },
    {
      id: 'david',
      name: 'David',
      email: 'david.h@bgrimm.com',
      position: 2,
      status: 'standby',
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=96&h=96&q=80',
    },
  ],
}

const fallbackMemberAvatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=96&h=96&q=80',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=facearea&facepad=2&w=96&h=96&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=96&h=96&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=96&h=96&q=80',
]

const memberPlaceholderSeed: InstructorMember[] = [
  {
    id: 'placeholder-member-1',
    name: 'Placeholder Member',
    email: 'placeholder.member@bwell.local',
    checkInTime: null,
    status: 'pending',
    avatarUrl: fallbackMemberAvatars[0],
  },
]

const apiFetch = async <T>(
  path: string,
  options: Parameters<typeof $fetch<T>>[1] = {},
) => {
  const auth = useAuth()
  const config = useRuntimeConfig()
  return await $fetch<T>(path, {
    baseURL: config.public.apiBase || 'http://localhost:3001',
    headers: auth.token.value
      ? { Authorization: `Bearer ${auth.token.value}` }
      : undefined,
    ...options,
  })
}

export async function fetchInstructorSessions(): Promise<InstructorSession[]> {
  const auth = useAuth()
  const config = useRuntimeConfig()
  const instructorId = auth.user.value?.id
  if (!instructorId) {
    await wait()
    return instructorSessionsSeed.map((s) => instructorSessionSchema.parse(s))
  }

  try {
    const sessions = await $fetch<
      Array<{
        id: string
        title: string
        startsAt: string
        endsAt: string
        placeDescription: string | null
        roomName: string | null
        capacity: number
        spotsLeft: number
        trainerId: string | null
        imageUrl: string | null
      }>
    >('/sessions', {
      baseURL: config.public.apiBase || 'http://localhost:3001',
      headers: auth.token.value
        ? { Authorization: `Bearer ${auth.token.value}` }
        : undefined,
    })

    return sessions
      .filter((item) => item.trainerId === instructorId)
      .map((item) =>
        instructorSessionSchema.parse({
          id: item.id,
          title: item.title,
          startTime: new Date(item.startsAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
          endTime: new Date(item.endsAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
          dateLabel: new Date(item.startsAt).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
          }),
          location: item.placeDescription ?? 'Wellness Center',
          room: item.roomName ?? 'Room',
          participants: Math.max(item.capacity - item.spotsLeft, 0),
          capacity: item.capacity,
          instructor: auth.user.value?.email.split('@')[0] ?? INSTRUCTOR_MOCK_NAME,
          imageUrl: item.imageUrl ?? imgYoga1,
        }),
      )
  } catch {
    await wait()
    return instructorSessionsSeed.map((s) => instructorSessionSchema.parse(s))
  }
}

export async function fetchInstructorSessionById(id: string): Promise<InstructorSession> {
  const sessions = await fetchInstructorSessions()
  const found = sessions.find((s) => s.id === id) ?? instructorSessionsSeed[0]
  return instructorSessionSchema.parse(found)
}

export async function fetchInstructorMembers(_sessionId: string): Promise<InstructorMember[]> {
  await wait()
  try {
    const rows = await apiFetch<
      Array<{
        id: string
        status:
          | 'confirmed'
          | 'standby'
          | 'cancelled'
          | 'no_show'
          | 'attended'
          | 'pending_confirmation'
        createdAt: string
        user: {
          id: string
          firstName: string
          lastName: string
          email: string
        }
      }>
    >(`/sessions/${_sessionId}/bookings`)

    const fromDb = rows
      .filter((item) => item.status !== 'standby')
      .map((item, index) =>
        instructorMemberSchema.parse({
          id: item.id,
          name: `${item.user.firstName} ${item.user.lastName}`.trim(),
          email: item.user.email,
          avatarUrl: fallbackMemberAvatars[index % fallbackMemberAvatars.length],
          checkInTime: null,
          status:
            item.status === 'attended'
              ? 'attended'
              : item.status === 'no_show'
                ? 'no-show'
                : 'pending',
        }),
      )

    const merged = [
      ...fromDb,
      ...memberPlaceholderSeed.filter(
        (placeholder) => !fromDb.some((item) => item.id === placeholder.id),
      ),
    ]

    return merged.map((item) => instructorMemberSchema.parse(item))
  } catch {
    return memberPlaceholderSeed.map((item) => instructorMemberSchema.parse(item))
  }
}

export async function fetchInstructorWaitlist(sessionId: string): Promise<InstructorWaitlistMember[]> {
  await wait()
  try {
    const rows = await apiFetch<
      Array<{
        id: string
        status:
          | 'confirmed'
          | 'standby'
          | 'cancelled'
          | 'no_show'
          | 'attended'
          | 'pending_confirmation'
        standbyPosition: number | null
        user: {
          firstName: string
          lastName: string
          email: string
        }
      }>
    >(`/sessions/${sessionId}/bookings`)

    const fromDb = rows
      .filter((row) => row.status === 'standby')
      .sort((a, b) => (a.standbyPosition ?? 9999) - (b.standbyPosition ?? 9999))
      .map((row, index) =>
        instructorWaitlistMemberSchema.parse({
          id: row.id,
          name: `${row.user.firstName} ${row.user.lastName}`.trim(),
          email: row.user.email,
          position: row.standbyPosition ?? index + 1,
          status: 'standby',
          avatarUrl: fallbackMemberAvatars[index % fallbackMemberAvatars.length],
        }),
      )

    const placeholders = waitlistBySessionSeed[sessionId] ?? []
    return [...fromDb, ...placeholders].map((w) =>
      instructorWaitlistMemberSchema.parse(w),
    )
  } catch {
    const list = waitlistBySessionSeed[sessionId] ?? []
    return list.map((w) => instructorWaitlistMemberSchema.parse(w))
  }
}

export async function checkInByQrToken(input: {
  sessionId: string
  memberToken: string
}) {
  return await apiFetch<{
    checkInTime: string
    className: string
    memberName: string
  }>('/checkin', {
    method: 'POST',
    body: input,
  })
}
