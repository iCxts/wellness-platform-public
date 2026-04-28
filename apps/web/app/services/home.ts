import {
  bookingSchema,
  nextSessionSchema,
  progressStatSchema,
  scheduleDaySchema,
  userSchema,
  type Booking,
  type NextSession,
  type ProgressStat,
  type ScheduleDay,
  type User,
} from '~/schemas/home'
import { useAuth } from '~/composables/useAuth'

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=160&h=160&q=80'
const DEFAULT_SESSION_IMAGE =
  'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&w=1400&q=90'

type DashboardResponse = {
  profile: { firstName: string; avatarUrl: string | null }
  upcomingClass: {
    bookingId: string
    sessionId: string
    title: string
    imageUrl: string | null
    startsAt: string
    endsAt: string
    startsInMs: number
  } | null
  progress: {
    currentStreak: number
    totalSessionsAttended: number
    totalZoneVisits: number
  }
  schedule: Array<{
    id: string
    title: string
    imageUrl: string | null
    startsAt: string
    endsAt: string
    spotsLeft: number
    bookingStatus: string | null
    bookingId: string | null
  }>
  myBookings: Array<{
    bookingId: string
    sessionId: string
    title: string
    imageUrl: string | null
    startsAt: string
    endsAt: string
    status: string
    standbyPosition: number | null
  }>
}

const apiFetch = async <T>(path: string) => {
  const auth = useAuth()
  const config = useRuntimeConfig()
  return await $fetch<T>(path, {
    baseURL: config.public.apiBase || 'http://localhost:3001',
    headers: auth.token.value ? { Authorization: `Bearer ${auth.token.value}` } : undefined,
  })
}

const toTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

const toDateLabel = (iso: string) => {
  const d = new Date(iso)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return 'Today'
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
}

const toDateStr = (d: Date) => d.toISOString().slice(0, 10)

export async function fetchDashboard(): Promise<DashboardResponse> {
  return apiFetch<DashboardResponse>('/dashboard/me')
}

export async function fetchUser(): Promise<User> {
  const auth = useAuth()
  const config = useRuntimeConfig()
  const token = auth.token.value
  const fallback = userSchema.parse({
    id: auth.user.value?.id ?? 'u_1',
    name: auth.user.value?.email?.split('@')[0] ?? 'Member',
    avatarUrl: DEFAULT_AVATAR,
  })
  if (!token) return fallback
  try {
    const me = await $fetch<{ id: string; firstName: string; lastName: string; avatarUrl: string | null }>(
      '/users/me',
      {
        baseURL: config.public.apiBase || 'http://localhost:3001',
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    return userSchema.parse({
      id: me.id,
      name: `${me.firstName} ${me.lastName}`.trim(),
      avatarUrl: me.avatarUrl ?? DEFAULT_AVATAR,
    })
  } catch {
    return fallback
  }
}

export function deriveNextSession(d: DashboardResponse): NextSession {
  if (!d.upcomingClass) {
    return nextSessionSchema.parse({
      id: 'none',
      title: 'No Upcoming Session',
      subtitle: 'Book a class to get started',
      startsInMinutes: 0,
      imageUrl: DEFAULT_SESSION_IMAGE,
    })
  }
  return nextSessionSchema.parse({
    id: d.upcomingClass.sessionId,
    title: d.upcomingClass.title,
    subtitle: 'Your Next Session',
    startsInMinutes: Math.max(0, Math.round(d.upcomingClass.startsInMs / 60000)),
    imageUrl: d.upcomingClass.imageUrl ?? DEFAULT_SESSION_IMAGE,
  })
}

export function deriveProgressStats(d: DashboardResponse): ProgressStat[] {
  return [
    {
      id: 'streak',
      label: 'Daily Streak',
      value: d.progress.currentStreak,
      unit: 'Days',
      icon: 'ph:flame-fill',
      emphasis: 'wide',
      badge: d.progress.currentStreak > 0 ? { text: 'Keep it up!', tone: 'orange' as const } : undefined,
    },
    {
      id: 'gym',
      label: 'Gym Attendance',
      value: d.progress.totalZoneVisits,
      unit: 'Days',
      icon: 'ph:barbell-fill',
      emphasis: 'compact',
    },
    {
      id: 'classes',
      label: 'Classes Taken',
      value: d.progress.totalSessionsAttended,
      unit: 'Classes',
      icon: 'ph:person-simple-run-fill',
      emphasis: 'compact',
    },
  ].map((s) => progressStatSchema.parse(s))
}

export function deriveWeekSchedule(d: DashboardResponse): ScheduleDay[] {
  const now = new Date()
  const bookedDays = new Set(d.myBookings.map((b) => toDateStr(new Date(b.startsAt))))
  const scheduleDays = new Set(d.schedule.map((s) => toDateStr(new Date(s.startsAt))))
  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return Array.from({ length: 9 }, (_, i) => {
    const d2 = new Date(now)
    d2.setDate(now.getDate() + i)
    const dateStr = toDateStr(d2)
    const isToday = i === 0
    const hasBooking = bookedDays.has(dateStr)
    const hasAvailable = scheduleDays.has(dateStr)
    return scheduleDaySchema.parse({
      date: dateStr,
      dayLabel: isToday ? 'Today' : DAY_LABELS[d2.getDay()],
      dayNum: d2.getDate(),
      isToday,
      hasSession: hasBooking || hasAvailable,
      sessionTone: hasBooking ? 'orange' : hasAvailable ? 'yellow' : undefined,
    })
  })
}

export function deriveBookings(d: DashboardResponse): Booking[] {
  return d.myBookings.map((b) =>
    bookingSchema.parse({
      id: b.bookingId,
      title: b.title,
      startTime: toTime(b.startsAt),
      endTime: toTime(b.endsAt),
      imageUrl: b.imageUrl ?? DEFAULT_SESSION_IMAGE,
      location: 'Wellness Center',
      date: toDateStr(new Date(b.startsAt)),
      dateLabel: toDateLabel(b.startsAt),
    }),
  )
}
