import { z } from 'zod'

export const adminSessionSchema = z.object({
  id: z.string(),
  title: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  dateLabel: z.string(),
  location: z.string(),
  room: z.string(),
  participants: z.number().int().nonnegative(),
  capacity: z.number().int().positive(),
  instructor: z.string(),
  imageUrl: z.string().url(),
})

export type AdminSession = z.infer<typeof adminSessionSchema>

export const adminMemberStatusSchema = z.enum(['attended', 'pending', 'no-show'])
export type AdminMemberStatus = z.infer<typeof adminMemberStatusSchema>

export const adminMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().url(),
  checkInTime: z.string().nullable(),
  status: adminMemberStatusSchema,
})

export type AdminMember = z.infer<typeof adminMemberSchema>

export const adminDashboardSummarySchema = z.object({
  attendanceTotal: z.number().int().nonnegative(),
  classesHeldTotal: z.number().int().nonnegative(),
  bookingsTotal: z.number().int().nonnegative(),
  noShowRatePercent: z.number().min(0).max(100),
})

export type AdminDashboardSummary = z.infer<typeof adminDashboardSummarySchema>

export const adminZoneSchema = z.object({
  id: z.string(),
  name: z.string(),
})
export type AdminZone = z.infer<typeof adminZoneSchema>

export const adminInstructorOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
})
export type AdminInstructorOption = z.infer<typeof adminInstructorOptionSchema>

