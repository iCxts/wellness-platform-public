import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().url(),
})

export const nextSessionSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  startsInMinutes: z.number().int().nonnegative(),
  imageUrl: z.string().url(),
})

export const progressStatSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.number().int().nonnegative(),
  unit: z.string(),
  icon: z.string(),
  emphasis: z.enum(['wide', 'compact']).default('compact'),
  badge: z
    .object({
      text: z.string(),
      tone: z.enum(['orange']),
    })
    .optional(),
})

export const scheduleDaySchema = z.object({
  date: z.string(),
  dayLabel: z.string(),
  dayNum: z.number().int(),
  isToday: z.boolean().default(false),
  hasSession: z.boolean().default(false),
  sessionTone: z.enum(['orange', 'yellow']).optional(),
})

export const bookingSchema = z.object({
  id: z.string(),
  title: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  imageUrl: z.string().url(),
  location: z.string(),
  date: z.string(),
  dateLabel: z.string(),
  available: z.boolean().optional(),
})

export type User = z.infer<typeof userSchema>
export type NextSession = z.infer<typeof nextSessionSchema>
export type ProgressStat = z.infer<typeof progressStatSchema>
export type ScheduleDay = z.infer<typeof scheduleDaySchema>
export type Booking = z.infer<typeof bookingSchema>
