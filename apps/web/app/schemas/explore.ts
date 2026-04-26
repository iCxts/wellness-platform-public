import { z } from 'zod'

export const classLevelSchema = z.enum(['Beginner', 'Intermediate', 'Advanced'])
export const classStatusSchema = z.enum(['available', 'full'])

export const classItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  durationMin: z.number().int().positive(),
  location: z.string(),
  room: z.string(),
  dateLabel: z.string(),
  trainer: z.string(),
  trainerExp: z.string(),
  trainerQuote: z.string(),
  trainerAvatar: z.string().url(),
  trainerFlagEmoji: z.string(),
  heroImage: z.string().url(),
  level: classLevelSchema,
  slotsLeft: z.number().int().nonnegative(),
  status: classStatusSchema,
  focus: z.array(z.string()).min(1),
  category: z.enum([
    'All',
    'Yoga & Pilates',
    'HIIT & Strength',
    'Cardio & Dance',
    'Stretching',
  ]),
})

export const exploreFilterSchema = z.enum([
  'All',
  'Yoga & Pilates',
  'HIIT & Strength',
  'Cardio & Dance',
  'Stretching',
])

export type ClassItem = z.infer<typeof classItemSchema>
export type ExploreFilter = z.infer<typeof exploreFilterSchema>
