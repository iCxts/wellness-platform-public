/** Local calendar date as `YYYY-MM-DD` (not UTC midnight shifted). */
export function localDateISO(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export interface AdminCreateClassDraft {
  category: string
  title: string
  description: string
  dateISO: string
  startTime: string
  endTime: string
  zone: string
  zoneId: string | null
  room: string
  capacity: number
  intensity: string
  focus: string[]
  coverImageUrl: string
  instructorName: string
  instructorId: string | null
  instructorExp: string
}

const defaultDraft = (): AdminCreateClassDraft => ({
  category: 'Yoga & Pilates',
  title: 'YOGA Flow',
  description:
    'Undo the damage of your desk chair. A 45-minute flow targeting neck, shoulder, and back tension to leave you feeling taller, realigned, and recharged.',
  dateISO: localDateISO(),
  startTime: '12:15',
  endTime: '13:00',
  zone: 'Wellness Center A',
  zoneId: null,
  room: 'Room 3',
  capacity: 12,
  intensity: 'Beginner',
  focus: ['Neck & Shoulders', 'Posture Reset', 'Breathing Flow'],
  coverImageUrl:
    'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&w=900&q=80',
  instructorName: 'Kru Ploy',
  instructorId: null,
  instructorExp: '8+ Years Exp',
})

export const useAdminCreateClassDraft = () =>
  useState<AdminCreateClassDraft>('admin-create-class-draft', defaultDraft)

