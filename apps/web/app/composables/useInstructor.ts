import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import {
  fetchInstructorMembers,
  fetchInstructorSessionById,
  fetchInstructorSessions,
  fetchInstructorWaitlist,
} from '~/services/instructor'

export const instructorQueryKeys = {
  sessions: ['instructor', 'sessions'] as const,
  session: (id: string) => ['instructor', 'session', id] as const,
  members: (id: string) => ['instructor', 'members', id] as const,
  waitlist: (id: string) => ['instructor', 'waitlist', id] as const,
}

export const useInstructorSessions = () =>
  useQuery({
    queryKey: instructorQueryKeys.sessions,
    queryFn: fetchInstructorSessions,
  })

export const useInstructorSession = (id: Ref<string>) =>
  useQuery({
    queryKey: computed(() => instructorQueryKeys.session(id.value)),
    queryFn: () => fetchInstructorSessionById(id.value),
  })

export const useInstructorMembers = (sessionId: Ref<string>) =>
  useQuery({
    queryKey: computed(() => instructorQueryKeys.members(sessionId.value)),
    queryFn: () => fetchInstructorMembers(sessionId.value),
  })

export const useInstructorWaitlist = (sessionId: Ref<string>) =>
  useQuery({
    queryKey: computed(() => instructorQueryKeys.waitlist(sessionId.value)),
    queryFn: () => fetchInstructorWaitlist(sessionId.value),
  })
