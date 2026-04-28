import {
  profileDataSchema,
  type ProfileData,
} from '~/schemas/profile'
import { useAuth } from '~/composables/useAuth'

const wait = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchProfileData(): Promise<ProfileData> {
  await wait()

  const auth = useAuth()
  const config = useRuntimeConfig()
  const token = auth.token.value
  const fallbackName = auth.user.value?.email?.split('@')[0] ?? 'Member'
  const fallbackAvatar =
    'https://www.figma.com/api/mcp/asset/6f8e9d1b-c3e7-4c2c-b33a-cbd2cf2483e9'
  let resolvedName = fallbackName
  let resolvedAvatar = fallbackAvatar

  if (token) {
    try {
      const me = await $fetch<{
        id: string
        firstName: string
        lastName: string
        avatarUrl: string | null
      }>('/users/me', {
        baseURL: config.public.apiBase || 'http://localhost:3001',
        headers: { Authorization: `Bearer ${token}` },
      })

      resolvedName = `${me.firstName} ${me.lastName}`.trim() || fallbackName
      resolvedAvatar = me.avatarUrl ?? fallbackAvatar
    } catch {
      // Keep fallback identity when /users/me is unavailable.
    }
  }

  return profileDataSchema.parse({
    user: {
      id: auth.user.value?.id ?? 'u_1',
      name: resolvedName,
      company: 'B.Grimm Energy',
      avatarUrl: resolvedAvatar,
    },
    menuItems: [
      {
        id: 'reservations',
        label: 'Reservations',
        icon: 'ph:calendar-check',
        action: 'route',
        to: '/schedule',
      },
      {
        id: 'booking-history',
        label: 'Booking History',
        icon: 'ph:clipboard-text',
        action: 'route',
        to: '/schedule',
      },
      {
        id: 'favorites',
        label: 'My Favorites',
        icon: 'ph:heart',
        action: 'route',
        to: '/search',
      },
      {
        id: 'help-support',
        label: 'Help & Support',
        icon: 'ph:question',
        action: 'route',
        to: '/search',
      },
      {
        id: 'setting',
        label: 'Setting',
        icon: 'ph:gear',
        action: 'route',
        to: '/',
      },
      {
        id: 'logout',
        label: 'Log out',
        icon: 'ph:sign-out',
        action: 'logout',
      },
    ],
  })
}
