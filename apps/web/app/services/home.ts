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

const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchUser(): Promise<User> {
  await wait()
  return userSchema.parse({
    id: 'u_1',
    name: 'PEAR',
    avatarUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=160&h=160&q=80',
  })
}

export async function fetchNextSession(): Promise<NextSession> {
  await wait()
  return nextSessionSchema.parse({
    id: 's_1',
    title: 'YOGA Express',
    subtitle: 'Your Next Session',
    startsInMinutes: 120,
    imageUrl:
      'https://www.figma.com/api/mcp/asset/22377b52-159d-4e36-8ade-0a08516b2b06',
  })
}

export async function fetchProgressStats(): Promise<ProgressStat[]> {
  await wait()
  return [
    {
      id: 'streak',
      label: 'Daily Streak',
      value: 18,
      unit: 'Days',
      icon: 'ph:flame-fill',
      emphasis: 'wide',
      badge: { text: 'Keep it up!', tone: 'orange' },
    },
    {
      id: 'gym',
      label: 'Gym Attendance',
      value: 12,
      unit: 'Days',
      icon: 'ph:barbell-fill',
      emphasis: 'compact',
    },
    {
      id: 'classes',
      label: 'Classes Taken',
      value: 8,
      unit: 'Classes',
      icon: 'ph:person-simple-run-fill',
      emphasis: 'compact',
    },
  ].map((stat) => progressStatSchema.parse(stat))
}

export async function fetchWeekSchedule(): Promise<ScheduleDay[]> {
  await wait()
  const days = [
    {
      date: '2026-04-05',
      dayLabel: 'Today',
      dayNum: 5,
      isToday: true,
      hasSession: true,
      sessionTone: 'orange',
    },
    {
      date: '2026-04-06',
      dayLabel: 'Mon',
      dayNum: 6,
      hasSession: true,
      sessionTone: 'yellow',
    },
    { date: '2026-04-07', dayLabel: 'Tue', dayNum: 7 },
    {
      date: '2026-04-08',
      dayLabel: 'Wed',
      dayNum: 8,
      hasSession: true,
      sessionTone: 'yellow',
    },
    { date: '2026-04-09', dayLabel: 'Thu', dayNum: 9 },
    { date: '2026-04-10', dayLabel: 'Fri', dayNum: 10 },
    { date: '2026-04-11', dayLabel: 'Sat', dayNum: 11 },
    { date: '2026-04-12', dayLabel: 'Sun', dayNum: 12 },
    { date: '2026-04-13', dayLabel: 'Mon', dayNum: 13 },
  ]
  return days.map((day) => scheduleDaySchema.parse(day))
}

export async function fetchBookings(): Promise<Booking[]> {
  await wait()
  const items = [
    {
      id: 'b_1',
      title: 'YOGA Express',
      startTime: '12:45',
      endTime: '13:00',
      imageUrl:
        'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&h=400&q=80',
      location: 'Wellness Center A',
      date: '2026-04-05',
      dateLabel: 'Today',
    },
    {
      id: 'b_2',
      title: 'Full Body Flex',
      startTime: '13:00',
      endTime: '14:00',
      imageUrl:
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&h=400&q=80',
      location: 'Wellness Center C',
      date: '2026-04-13',
      dateLabel: '13 Apr',
    },
    {
      id: 'b_3',
      title: 'YOGA Flow',
      startTime: '13:00',
      endTime: '14:00',
      imageUrl:
        'https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&w=600&h=400&q=80',
      location: 'Wellness Center A',
      date: '2026-04-13',
      dateLabel: '13 Apr',
      available: true,
    },
    {
      id: 'b_4',
      title: 'YOGA Express',
      startTime: '12:45',
      endTime: '13:00',
      imageUrl:
        'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&h=400&q=80',
      location: 'Wellness Center A',
      date: '2026-04-05',
      dateLabel: 'Today',
    },
    {
      id: 'b_5',
      title: 'Full Body Flex',
      startTime: '13:00',
      endTime: '14:00',
      imageUrl:
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&h=400&q=80',
      location: 'Wellness Center C',
      date: '2026-04-13',
      dateLabel: '13 Apr',
    },
    {
      id: 'b_6',
      title: 'YOGA Flow',
      startTime: '13:00',
      endTime: '14:00',
      imageUrl:
        'https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&w=600&h=400&q=80',
      location: 'Wellness Center A',
      date: '2026-04-13',
      dateLabel: '13 Apr',
      available: true,
    },
  ]
  return items.map((item) => bookingSchema.parse(item))
}
