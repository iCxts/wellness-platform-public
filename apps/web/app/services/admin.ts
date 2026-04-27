import {
  adminDashboardSummarySchema,
  adminMemberSchema,
  adminSessionSchema,
  type AdminDashboardSummary,
  type AdminMember,
  type AdminSession,
} from '~/schemas/admin'

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

export async function fetchAdminSessions(): Promise<AdminSession[]> {
  await wait()
  return sessionsSeed.map((item) => adminSessionSchema.parse(item))
}

export async function fetchAdminSessionById(id: string): Promise<AdminSession> {
  await wait()
  const found = sessionsSeed.find((item) => item.id === id) ?? sessionsSeed[0]
  return adminSessionSchema.parse(found)
}

export async function fetchAdminMembers(sessionId: string): Promise<AdminMember[]> {
  await wait()
  const members = membersBySessionSeed[sessionId] ?? membersBySessionSeed['yoga-express']
  return members.map((member) => adminMemberSchema.parse(member))
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

