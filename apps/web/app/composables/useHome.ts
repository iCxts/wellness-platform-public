import { useQuery } from '@tanstack/vue-query'
import {
  fetchBookings,
  fetchNextSession,
  fetchProgressStats,
  fetchUser,
  fetchWeekSchedule,
} from '~/services/home'

export const homeQueryKeys = {
  user: ['home', 'user'] as const,
  nextSession: ['home', 'next-session'] as const,
  progressStats: ['home', 'progress-stats'] as const,
  weekSchedule: ['home', 'week-schedule'] as const,
  bookings: ['home', 'bookings'] as const,
}

export const useUser = () =>
  useQuery({ queryKey: homeQueryKeys.user, queryFn: fetchUser })

export const useNextSession = () =>
  useQuery({
    queryKey: homeQueryKeys.nextSession,
    queryFn: fetchNextSession,
  })

export const useProgressStats = () =>
  useQuery({
    queryKey: homeQueryKeys.progressStats,
    queryFn: fetchProgressStats,
  })

export const useWeekSchedule = () =>
  useQuery({
    queryKey: homeQueryKeys.weekSchedule,
    queryFn: fetchWeekSchedule,
  })

export const useBookings = () =>
  useQuery({ queryKey: homeQueryKeys.bookings, queryFn: fetchBookings })
