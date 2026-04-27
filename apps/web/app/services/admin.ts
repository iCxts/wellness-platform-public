import {
  adminDashboardSummarySchema,
  adminInstructorOptionSchema,
  adminMemberSchema,
  adminSessionSchema,
  adminZoneSchema,
  type AdminDashboardSummary,
  type AdminInstructorOption,
  type AdminMember,
  type AdminSession,
  type AdminZone,
} from '~/schemas/admin'
import { useAuth } from '~/composables/useAuth'

const wait = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms))

const sessionsSeed: AdminSession[] = [
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
    instructor: 'Kru Ploy',
    imageUrl:
      'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'yoga-flow',
    title: 'YOGA Flow',
    startTime: '13:00',
    endTime: '14:00',
    dateLabel: 'Today',
    location: 'Wellness Center A',
    room: 'Room 2',
    participants: 18,
    capacity: 20,
    instructor: 'Kru Pim',
    imageUrl:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'zumba-express',
    title: 'ZUMBA Express',
    startTime: '13:15',
    endTime: '14:00',
    dateLabel: 'Today',
    location: 'Wellness Center A',
    room: 'Room 4',
    participants: 17,
    capacity: 20,
    instructor: 'Kru Aom',
    imageUrl:
      'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'hiit-core',
    title: 'HIIT Core',
    startTime: '17:00',
    endTime: '17:30',
    dateLabel: 'Today',
    location: 'Wellness Center B',
    room: 'Room 1',
    participants: 15,
    capacity: 20,
    instructor: 'Kru Boss',
    imageUrl:
      'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=900&q=80',
  },
]

const membersBySessionSeed: Record<string, AdminMember[]> = {
  'yoga-express': [
    ['pear', 'PEAR', 'pear.w@bgrimm.com', '12:05', 'attended'],
    ['ploy', 'PLOY', 'ploy.s@bgrimm.com', '12:10', 'attended'],
    ['nick', 'NICK', 'nick.j@bgrimm.com', null, 'no-show'],
    ['mew', 'MEW', 'mew.k@bgrimm.com', '12:02', 'attended'],
    ['jay', 'JAY', 'jay.p@bgrimm.com', '12:13', 'attended'],
    ['fern', 'FERN', 'fern.t@bgrimm.com', null, 'pending'],
    ['top', 'TOP', 'top.n@bgrimm.com', '12:00', 'attended'],
    ['bow', 'BOW', 'bow.r@bgrimm.com', null, 'pending'],
    ['kai', 'KAI', 'kai.m@bgrimm.com', '12:14', 'attended'],
  ].map(([id, name, email, checkInTime, status], index) =>
    adminMemberSchema.parse({
      id,
      name,
      email,
      checkInTime,
      status,
      avatarUrl: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=96&h=96&q=80',
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=facearea&facepad=2&w=96&h=96&q=80',
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=facearea&facepad=2&w=96&h=96&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=96&h=96&q=80',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=96&h=96&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=96&h=96&q=80',
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=96&h=96&q=80',
        'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=facearea&facepad=2&w=96&h=96&q=80',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&facepad=2&w=96&h=96&q=80',
      ][index],
    }),
  ),
}

const mapStatus = (
  status:
    | 'confirmed'
    | 'standby'
    | 'cancelled'
    | 'no_show'
    | 'attended'
    | 'pending_confirmation',
) => {
  if (status === 'attended') return 'attended'
  if (status === 'no_show') return 'no-show'
  return 'pending'
}

const toTimeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

const toDateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  })

const apiFetch = async <T>(path: string, options: Parameters<typeof $fetch<T>>[1] = {}) => {
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

export async function fetchAdminSessions(): Promise<AdminSession[]> {
  try {
    const [sessions, instructors] = await Promise.all([
      apiFetch<
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
      >('/sessions'),
      fetchAdminInstructors(),
    ])

    const instructorById = new Map(instructors.map((item) => [item.id, item.name]))
    const mapped = sessions.map((item) =>
      adminSessionSchema.parse({
        id: item.id,
        title: item.title,
        startTime: toTimeLabel(item.startsAt),
        endTime: toTimeLabel(item.endsAt),
        dateLabel: toDateLabel(item.startsAt),
        location: item.placeDescription ?? 'Wellness Center',
        room: item.roomName ?? 'Room',
        participants: Math.max(item.capacity - item.spotsLeft, 0),
        capacity: item.capacity,
        instructor: item.trainerId
          ? instructorById.get(item.trainerId) ?? 'Assigned Instructor'
          : 'Unassigned',
        imageUrl: item.imageUrl ?? sessionsSeed[0].imageUrl,
      }),
    )

    // Keep placeholders, but always show database classes first.
    return [...mapped, ...sessionsSeed]
  } catch {
    await wait()
    return sessionsSeed.map((item) => adminSessionSchema.parse(item))
  }
}

export async function fetchAdminSessionById(id: string): Promise<AdminSession> {
  const sessions = await fetchAdminSessions()
  const found = sessions.find((item) => item.id === id) ?? sessionsSeed[0]
  return adminSessionSchema.parse(found)
}

export async function fetchAdminMembers(sessionId: string): Promise<AdminMember[]> {
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
        user: {
          id: string
          firstName: string
          lastName: string
          email: string
        }
      }>
    >(`/sessions/${sessionId}/bookings`)

    return rows.map((item, index) =>
      adminMemberSchema.parse({
        id: item.id,
        name: `${item.user.firstName} ${item.user.lastName}`.trim(),
        email: item.user.email,
        checkInTime: null,
        status: mapStatus(item.status),
        avatarUrl: membersBySessionSeed['yoga-express'][index % 9]?.avatarUrl,
      }),
    )
  } catch {
    await wait()
    const members = membersBySessionSeed[sessionId] ?? membersBySessionSeed['yoga-express']
    return members.map((member) => adminMemberSchema.parse(member))
  }
}

export async function fetchAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  await wait()
  return adminDashboardSummarySchema.parse({
    attendanceTotal: 128,
    classesHeldTotal: 10,
    bookingsTotal: 56,
    noShowRatePercent: 70,
  })
}

export async function fetchAdminZones(): Promise<AdminZone[]> {
  const rows = await apiFetch<Array<{ id: string; name: string }>>('/zones')
  return rows.map((item) => adminZoneSchema.parse(item))
}

export async function resolveAdminZoneId(input: {
  zoneId: string | null
  zoneName: string
}): Promise<string> {
  if (input.zoneId && !input.zoneId.startsWith('fallback:')) {
    return input.zoneId
  }

  const zones = await fetchAdminZones()
  const existing = zones.find(
    (zone) => zone.name.toLowerCase() === input.zoneName.toLowerCase(),
  )
  if (existing) return existing.id

  const created = await apiFetch<{ id: string; name: string }>('/zones', {
    method: 'POST',
    body: {
      name: input.zoneName,
      description: 'Auto-created from admin class form',
      capacity: 60,
    },
  })
  return created.id
}

export async function fetchAdminInstructors(): Promise<AdminInstructorOption[]> {
  const rows = await apiFetch<
    Array<{ id: string; firstName: string; lastName: string; email: string }>
  >('/users/instructors')

  return rows.map((item) =>
    adminInstructorOptionSchema.parse({
      id: item.id,
      name: `${item.firstName} ${item.lastName}`.trim(),
      email: item.email,
    }),
  )
}

export async function createAdminClass(input: {
  title: string
  description: string
  level?: 'beginner' | 'pre_intermediate' | 'intermediate' | 'advanced'
  focus?: Array<
    | 'neck_shoulders'
    | 'hips_opener'
    | 'breathing_flow'
    | 'lower_back_care'
    | 'core_strength'
    | 'posture_reset'
    | 'stress_release'
    | 'brain_refresh'
  >
  roomName: string
  placeDescription: string
  trainerId: string
  zoneId: string
  startsAt: string
  endsAt: string
  capacity: number
}) {
  return await apiFetch('/sessions', {
    method: 'POST',
    body: {
      ...input,
      type: 'group_class',
    },
  })
}

