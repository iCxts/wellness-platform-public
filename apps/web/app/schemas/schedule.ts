import { z } from 'zod'

export const scheduleTabSchema = z.enum(['upcoming', 'history', 'waitlist'])

export const scheduleItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  dateLabel: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  location: z.string(),
  trainer: z.string(),
  tab: scheduleTabSchema,
  status: z.enum(['booked', 'completed', 'waitlisted']),
})

export type ScheduleTab = z.infer<typeof scheduleTabSchema>
export type ScheduleItem = z.infer<typeof scheduleItemSchema>
