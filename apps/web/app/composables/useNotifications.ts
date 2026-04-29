import { computed, type Ref } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '~/services/notifications'
import { useAuth } from '~/composables/useAuth'

export const notificationsQueryKeys = {
  list: (unreadOnly: boolean) => ['notifications', unreadOnly] as const,
  unreadCount: ['notifications', 'unread-count'] as const,
}

/** Dot/badge on bell icons; invalidated when lists mark items read. */
export function useUnreadNotificationCount() {
  const auth = useAuth()
  return useQuery({
    queryKey: notificationsQueryKeys.unreadCount,
    queryFn: async () => {
      const items = await fetchNotifications(true)
      return items.length
    },
    enabled: computed(() => !!auth.token.value),
    staleTime: 30_000,
  })
}

export function useNotificationsList(unreadOnly: Ref<boolean>) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: computed(() => notificationsQueryKeys.list(unreadOnly.value)),
    queryFn: () => fetchNotifications(unreadOnly.value),
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['notifications'] })

  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: invalidate,
  })

  const markOneMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: invalidate,
  })

  return {
    ...query,
    markAllRead: markAllMutation.mutateAsync,
    markOneRead: markOneMutation.mutateAsync,
    isMarkingAll: computed(() => markAllMutation.isPending.value),
  }
}
