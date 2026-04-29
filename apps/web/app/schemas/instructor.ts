import { z } from 'zod'
import { adminMemberSchema, adminSessionSchema } from '~/schemas/admin'

export const instructorSessionSchema = adminSessionSchema
export type InstructorSession = z.infer<typeof instructorSessionSchema>

export const instructorMemberSchema = adminMemberSchema
export type InstructorMember = z.infer<typeof instructorMemberSchema>

export const instructorWaitlistMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().url(),
  position: z.number().int().positive(),
  status: z.literal('standby'),
})

export type InstructorWaitlistMember = z.infer<
  typeof instructorWaitlistMemberSchema
>
