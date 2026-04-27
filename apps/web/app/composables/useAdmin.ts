import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import {
  fetchAdminDashboardSummary,
  fetchAdminMembers,
  fetchAdminSessionById,
  fetchAdminSessions,
} from '~/services/admin'

export const adminQueryKeys = {
  sessions: ['admin', 'sessions'] as const,
  session: (id: string) => ['admin', 'session', id] as const,
  members: (sessionId: string) => ['admin', 'members', sessionId] as const,
  dashboard: ['admin', 'dashboard'] as const,
}

export const useAdminSessions = () =>
  useQuery({
    queryKey: adminQueryKeys.sessions,
    queryFn: fetchAdminSessions,
  })

export const useAdminSession = (id: Ref<string>) =>
  useQuery({
    queryKey: computed(() => adminQueryKeys.session(id.value)),
    queryFn: () => fetchAdminSessionById(id.value),
  })

export const useAdminMembers = (sessionId: Ref<string>) =>
  useQuery({
    queryKey: computed(() => adminQueryKeys.members(sessionId.value)),
    queryFn: () => fetchAdminMembers(sessionId.value),
  })

export const useAdminDashboardSummary = () =>
  useQuery({
    queryKey: adminQueryKeys.dashboard,
    queryFn: fetchAdminDashboardSummary,
  })

