import { z } from 'zod'

export const profileUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  company: z.string(),
  avatarUrl: z.string().url(),
})

export const profileMenuActionSchema = z.enum(['route', 'logout'])

export const profileMenuItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  icon: z.string(),
  action: profileMenuActionSchema,
  to: z.string().optional(),
})

export const profileDataSchema = z.object({
  user: profileUserSchema,
  menuItems: z.array(profileMenuItemSchema).min(1),
})

export type ProfileUser = z.infer<typeof profileUserSchema>
export type ProfileMenuAction = z.infer<typeof profileMenuActionSchema>
export type ProfileMenuItem = z.infer<typeof profileMenuItemSchema>
export type ProfileData = z.infer<typeof profileDataSchema>
