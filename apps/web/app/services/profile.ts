import {
  profileDataSchema,
  type ProfileData,
} from '~/schemas/profile'

const wait = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchProfileData(): Promise<ProfileData> {
  await wait()

  return profileDataSchema.parse({
    user: {
      id: 'u_1',
      name: 'PEAR',
      company: 'B.Grimm Energy',
      avatarUrl: 'https://www.figma.com/api/mcp/asset/6f8e9d1b-c3e7-4c2c-b33a-cbd2cf2483e9',
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
