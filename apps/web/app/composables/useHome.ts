import { useQuery } from '@tanstack/vue-query'
import {
  fetchDashboard,
  fetchUser,
  deriveNextSession,
  deriveProgressStats,
  deriveWeekSchedule,
  deriveBookings,
} from '~/services/home'

export const homeQueryKeys = {
  user: ['home', 'user'] as const,
  dashboard: ['home', 'dashboard'] as const,
}

export const useUser = () =>
  useQuery({
    queryKey: [...homeQueryKeys.user, useAuth().user.value?.id ?? 'guest'],
    queryFn: fetchUser,
  })

export const useNextSession = () =>
  useQuery({
    queryKey: homeQueryKeys.dashboard,
    queryFn: fetchDashboard,
    select: deriveNextSession,
  })

export const useProgressStats = () =>
  useQuery({
    queryKey: homeQueryKeys.dashboard,
    queryFn: fetchDashboard,
    select: deriveProgressStats,
  })

export const useWeekSchedule = () =>
  useQuery({
    queryKey: homeQueryKeys.dashboard,
    queryFn: fetchDashboard,
    select: deriveWeekSchedule,
  })

export const useBookings = () =>
  useQuery({
    queryKey: homeQueryKeys.dashboard,
    queryFn: fetchDashboard,
    select: deriveBookings,
  })
