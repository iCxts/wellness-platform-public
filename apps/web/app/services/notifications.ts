import { useAuth } from '~/composables/useAuth'

export type NotificationApiItem = {
  id: string
  userId: string
  type: string
  title: string
  body: string
  isRead: boolean
  metadata: { sessionId?: string; bookingId?: string } | null
  sessionId: string | null
  createdAt: string
}

const apiFetch = async <T>(path: string, options: Parameters<typeof $fetch<T>>[1] = {}) => {
  const auth = useAuth()
  const config = useRuntimeConfig()
  return await $fetch<T>(path, {
    baseURL: config.public.apiBase || 'http://localhost:3001',
    headers: auth.token.value
      ? { Authorization: `Bearer ${auth.token.value}` }
      : undefined,
    ...options,
  })
}

export async function fetchNotifications(unreadOnly: boolean): Promise<NotificationApiItem[]> {
  const q = unreadOnly ? '?unread=true' : ''
  return await apiFetch<NotificationApiItem[]>(`/notifications/me${q}`)
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiFetch('/notifications/read-all', { method: 'PATCH' })
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiFetch(`/notifications/${id}/read`, { method: 'PATCH' })
}
