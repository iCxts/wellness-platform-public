import { computed, type Ref } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '~/services/notifications'

export const notificationsQueryKeys = {
  list: (unreadOnly: boolean) => ['notifications', unreadOnly] as const,
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
