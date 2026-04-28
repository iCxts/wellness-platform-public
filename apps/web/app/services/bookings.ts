import { useAuth } from '~/composables/useAuth'

type BookingCreateResponse = {
  id: string
  userId: string
  sessionId: string
  status: 'confirmed' | 'standby' | 'cancelled' | 'no_show' | 'attended' | 'pending_confirmation'
  standbyPosition: number | null
  createdAt: string
}

type BookingQrResponse = {
  token: string
  bookingId: string
  sessionId: string
  expiresAt: string
}

export type BookingDetailResponse = {
  bookingId: string
  status: 'confirmed' | 'standby' | 'cancelled' | 'no_show' | 'attended' | 'pending_confirmation'
  standbyPosition: number | null
  createdAt: string
  session: {
    id: string
    title: string
    startsAt: string
    endsAt: string
    roomName: string | null
    placeDescription: string | null
  }
  instructor: {
    id: string
    firstName: string
    lastName: string
  } | null
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

export async function createBooking(sessionId: string): Promise<BookingCreateResponse> {
  return await apiFetch<BookingCreateResponse>('/bookings', {
    method: 'POST',
    body: { sessionId },
  })
}

export async function fetchBookingQr(bookingId: string): Promise<BookingQrResponse> {
  return await apiFetch<BookingQrResponse>(`/bookings/${bookingId}/qr`)
}

export async function fetchBookingDetail(bookingId: string): Promise<BookingDetailResponse> {
  return await apiFetch<BookingDetailResponse>(`/bookings/${bookingId}`)
}

export async function cancelBooking(bookingId: string): Promise<void> {
  await apiFetch(`/bookings/${bookingId}`, { method: 'DELETE' })
}
