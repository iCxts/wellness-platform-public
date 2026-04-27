import { computed, type Ref } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  createAdminClass,
  fetchAdminDashboardSummary,
  fetchAdminInstructors,
  fetchAdminMembers,
  fetchAdminSessionById,
  fetchAdminSessions,
  fetchAdminZones,
} from '~/services/admin'

export const adminQueryKeys = {
  sessions: ['admin', 'sessions'] as const,
  session: (id: string) => ['admin', 'session', id] as const,
  members: (sessionId: string) => ['admin', 'members', sessionId] as const,
  dashboard: ['admin', 'dashboard'] as const,
  zones: ['admin', 'zones'] as const,
  instructors: ['admin', 'instructors'] as const,
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

export const useAdminZones = () =>
  useQuery({
    queryKey: adminQueryKeys.zones,
    queryFn: fetchAdminZones,
  })

export const useAdminInstructors = () =>
  useQuery({
    queryKey: adminQueryKeys.instructors,
    queryFn: fetchAdminInstructors,
  })

export const useCreateAdminClass = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createAdminClass,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.sessions }),
        queryClient.invalidateQueries({ queryKey: ['instructor', 'sessions'] }),
      ])
    },
  })
}

