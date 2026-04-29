<script setup lang="ts">
import { Motion } from 'motion-v'
import {
  cancelBooking,
  confirmPromotionBooking,
  createBooking,
} from '~/services/bookings'
definePageMeta({ ssr: false })

const route = useRoute()
const router = useRouter()
const auth = useAuth()
const config = useRuntimeConfig()
const id = computed(() => String(route.params.id ?? 'morning-reset'))
const mode = computed(() =>
  route.query.mode === 'queue' ? 'queue' : 'booking',
)
const { data: classItem, isPending, refetch: refetchClassDetail } = useClassDetail(id)
const actionError = ref('')
const isSubmitting = ref(false)
const createdBookingStatus = ref<'confirmed' | 'standby' | null>(null)
const bookingStatusWatchKey = computed(
  () => `${id.value}:${auth.user.value?.id ?? 'guest'}:${auth.token.value ?? ''}`,
)

type SessionBookingState = {
  summary: 'waitlisted' | 'booked' | null
  standbyBookingId: string | null
  pendingConfirmationBookingId: string | null
}

const {
  data: sessionBookingState,
  pending: checkingExistingBooking,
  refresh: refreshSessionBookingState,
} = useAsyncData(
  () => `class-booking-status-${id.value}-${auth.user.value?.id ?? 'guest'}`,
  async (): Promise<SessionBookingState | null> => {
    if (!auth.token.value) return null
    const allBookings = await $fetch<
      Array<{
        id: string
        sessionId: string
        status:
          | 'confirmed'
          | 'standby'
          | 'cancelled'
          | 'no_show'
          | 'attended'
          | 'pending_confirmation'
        createdAt: string
      }>
    >('/bookings/me', {
      baseURL: config.public.apiBase || 'http://localhost:3001',
      headers: { Authorization: `Bearer ${auth.token.value}` },
    })

    const matching = allBookings
      .filter((item) => item.sessionId === id.value)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )

    const standbyBookingId =
      matching.find((item) => item.status === 'standby')?.id ?? null
    const pendingConfirmationBookingId =
      matching.find((item) => item.status === 'pending_confirmation')?.id ??
      null

    const pack = (
      summary: SessionBookingState['summary'],
    ): SessionBookingState => ({
      summary,
      standbyBookingId,
      pendingConfirmationBookingId,
    })

    if (matching.length === 0) {
      return pack(null)
    }
    if (
      matching.some((item) =>
        ['standby', 'pending_confirmation'].includes(item.status),
      )
    ) {
      return pack('waitlisted')
    }
    if (
      matching.some((item) => ['confirmed', 'attended'].includes(item.status))
    ) {
      return pack('booked')
    }
    if (
      matching.every((item) =>
        ['cancelled', 'no_show'].includes(item.status),
      )
    ) {
      return pack(null)
    }
    const active = matching.find((item) => item.status !== 'cancelled')
    if (
      active?.status === 'standby' ||
      active?.status === 'pending_confirmation'
    ) {
      return pack('waitlisted')
    }
    if (active?.status === 'confirmed' || active?.status === 'attended') {
      return pack('booked')
    }
    const latest = matching[0]
    if (!latest) return pack(null)
    if (['standby', 'pending_confirmation'].includes(latest.status)) {
      return pack('waitlisted')
    }
    if (['confirmed', 'attended'].includes(latest.status)) {
      return pack('booked')
    }

    return pack(null)
  },
  {
    server: false,
    default: () => null,
    watch: [bookingStatusWatchKey, () => classItem.value?.slotsLeft ?? -1],
  },
)
const isClassFull = computed(() => (classItem.value?.slotsLeft ?? 0) <= 0)
const effectiveMode = computed(() =>
  isClassFull.value || mode.value === 'queue' ? 'queue' : 'booking',
)
const existingBookingSummary = computed(
  () => sessionBookingState.value?.summary ?? null,
)
const standbyBookingIdRef = computed(
  () => sessionBookingState.value?.standbyBookingId ?? null,
)
const pendingBookingIdRef = computed(
  () => sessionBookingState.value?.pendingConfirmationBookingId ?? null,
)

const hasExistingBooking = computed(
  () =>
    existingBookingSummary.value === 'booked' ||
    existingBookingSummary.value === 'waitlisted' ||
    createdBookingStatus.value === 'confirmed' ||
    createdBookingStatus.value === 'standby',
)
const isAlreadyBooked = computed(
  () =>
    existingBookingSummary.value === 'booked' ||
    createdBookingStatus.value === 'confirmed',
)
const isAlreadyWaitlisted = computed(
  () =>
    existingBookingSummary.value === 'waitlisted' ||
    createdBookingStatus.value === 'standby',
)

/** Promoted-from-queue pending confirmation, or standby when API reports open spots. */
const showBookActionInsteadOfWaitlist = computed(() => {
  if (pendingBookingIdRef.value) return true
  const slots = classItem.value?.slotsLeft ?? 0
  return Boolean(standbyBookingIdRef.value) && slots > 0
})

const blocksPrimaryBooking = computed(() => {
  if (
    existingBookingSummary.value === 'booked' ||
    createdBookingStatus.value === 'confirmed'
  )
    return true
  const onWaitlist =
    existingBookingSummary.value === 'waitlisted' ||
    createdBookingStatus.value === 'standby'
  if (onWaitlist && !showBookActionInsteadOfWaitlist.value) return true
  return false
})

const ctaLabel = computed(() =>
  checkingExistingBooking.value && Boolean(auth.token.value)
    ? 'Checking...'
    : isAlreadyBooked.value
      ? 'Already booked'
      : showBookActionInsteadOfWaitlist.value
        ? pendingBookingIdRef.value
          ? 'Confirm booking'
          : 'Book now'
        : isAlreadyWaitlisted.value
          ? 'On waitlist'
          : effectiveMode.value === 'queue'
            ? 'Join Queue'
            : 'Book now',
)
const ctaClass = computed(() => {
  if (showBookActionInsteadOfWaitlist.value) {
    return 'bg-[var(--bw-orange)] text-white'
  }
  if (blocksPrimaryBooking.value) {
    return 'bg-[#9d9c9c] text-white'
  }
  if (effectiveMode.value === 'queue') {
    return 'border border-[var(--bw-orange)] bg-white text-[var(--bw-orange)]'
  }
  return 'bg-[var(--bw-orange)] text-white'
})

const showQueueSessionCopy = computed(
  () => effectiveMode.value === 'queue' && !showBookActionInsteadOfWaitlist.value,
)

/** Real sessions hit GET /sessions/:id — poll while standby waitlisted & slots still read full until API catches cancellations. */
watchEffect((onCleanup) => {
  const standby = standbyBookingIdRef.value
  const waitlisted = existingBookingSummary.value === 'waitlisted'
  const slots = classItem.value?.slotsLeft ?? 0
  if (!standby || !waitlisted || slots > 0) return

  const tick = () => {
    void refetchClassDetail()
  }
  tick()
  const intervalMs = 3500
  const t = setInterval(tick, intervalMs)
  onCleanup(() => clearInterval(t))
})

function onVisibilityChange() {
  if (document.visibilityState === 'visible') void refetchClassDetail()
}

onMounted(() => {
  void refetchClassDetail()
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', onVisibilityChange)
})

const onPrimary = async () => {
  if (isSubmitting.value) return
  if (checkingExistingBooking.value && auth.token.value) return
  if (hasExistingBooking.value && !showBookActionInsteadOfWaitlist.value) return
  actionError.value = ''
  try {
    isSubmitting.value = true

    if (pendingBookingIdRef.value) {
      const promotedBookingId = pendingBookingIdRef.value
      await confirmPromotionBooking(promotedBookingId)
      createdBookingStatus.value = 'confirmed'
      await refreshSessionBookingState()
      await router.push(
        `/booking-success?id=${id.value}&bookingId=${promotedBookingId}`,
      )
      return
    }

    if (showBookActionInsteadOfWaitlist.value && standbyBookingIdRef.value) {
      await cancelBooking(standbyBookingIdRef.value)
      createdBookingStatus.value = null
      await refreshSessionBookingState()
    }

    const booking = await createBooking(id.value)
    createdBookingStatus.value =
      booking.status === 'standby' ? 'standby' : 'confirmed'
    await refreshSessionBookingState()
    if (booking.status === 'standby') {
      await router.push(`/queue-success?id=${id.value}&bookingId=${booking.id}`)
      return
    }
    await router.push(`/booking-success?id=${id.value}&bookingId=${booking.id}`)
  } catch (error) {
    actionError.value =
      (error as { data?: { error?: string } })?.data?.error ??
      'Unable to create booking. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <LayoutAppShell content-max-width="max-w-[420px] md:max-w-[860px]">
    <article v-if="classItem" class="space-y-4 pb-3 md:space-y-6">
      <Motion
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.35 }"
      >
        <div
          class="relative -mx-6 -mt-5 h-[242px] overflow-hidden md:mx-0 md:rounded-3xl"
        >
          <img
            :src="classItem.heroImage"
            :alt="classItem.title"
            class="h-full w-full object-cover"
          />
          <div class="absolute inset-0 bg-black/10" />
          <div class="absolute left-3 top-3 flex gap-1">
            <button
              class="grid h-8 w-8 place-items-center rounded-full bg-white/90"
              @click="$router.back()"
            >
              <Icon name="ph:arrow-left" class="h-6 w-6" />
            </button>
          </div>
          <div class="absolute right-3 top-3 flex gap-2">
            <button
              class="grid h-8 w-8 place-items-center rounded-full bg-white/90"
            >
              <Icon name="ph:heart" class="h-6 w-6" />
            </button>
            <button
              class="grid h-8 w-8 place-items-center rounded-full bg-white/90"
            >
              <Icon name="ph:share-network" class="h-6 w-6" />
            </button>
          </div>
          <h2
            class="absolute bottom-3 right-4 text-[20px] font-bold text-white md:text-[26px]"
          >
            {{ classItem.title }}
          </h2>
        </div>
      </Motion>

      <Motion
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.35, delay: 0.05 }"
      >
        <h1 class="text-[32px] font-semibold leading-none">
          {{ classItem.title }}
        </h1>
      </Motion>

      <Motion
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.35, delay: 0.1 }"
      >
        <div class="flex flex-wrap gap-2 text-[14px] font-medium">
          <span
            class="inline-flex items-center gap-2 rounded-2xl bg-[#ececec] px-3 py-1.5"
          >
            <Icon name="ph:flame" class="h-4 w-4 text-[var(--bw-orange)]" />
            {{ classItem.level }}
          </span>
          <span
            class="inline-flex items-center gap-2 rounded-2xl bg-[#ececec] px-3 py-1.5"
          >
            <Icon name="ph:timer" class="h-4 w-4 text-[var(--bw-yellow)]" />
            {{ classItem.slotsLeft }} slots left
          </span>
        </div>
      </Motion>

      <Motion
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.35, delay: 0.15 }"
        class="space-y-2 text-[16px]"
      >
        <p class="flex items-center gap-2">
          <Icon name="ph:timer" class="h-7 w-7" />{{ classItem.dateLabel }} /
          {{ classItem.startTime }} - {{ classItem.endTime }} ({{
            classItem.durationMin
          }}
          min)
        </p>
        <p class="flex items-center gap-2">
          <Icon name="ph:map-pin-simple-area" class="h-7 w-7" />{{
            classItem.location
          }}
          ({{ classItem.room }})
        </p>
      </Motion>

      <Motion
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.35, delay: 0.2 }"
        class="text-[12px] leading-[1.4]"
      >
        {{
          showQueueSessionCopy
            ? 'This dynamic intermediate session syncs breath with movement to undo the desk hunch. Reset your posture, strengthen your core, and leave feeling taller and recharged for the afternoon.'
            : 'Undo the damage of your desk chair. A 45-minute flow targeting neck, shoulder, and back tension to leave you feeling taller, realigned, and recharged to tackle the rest of your workday with clarity.'
        }}
      </Motion>

      <Motion
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.35, delay: 0.25 }"
      >
        <section>
          <h3 class="mb-2 text-[16px] font-medium">Focus</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="focus in classItem.focus"
              :key="focus"
              class="rounded-xl bg-[#e6f4ea] px-3 py-1.5 text-[10px] text-[#1e8e3e]"
            >
              {{ focus }}
            </span>
          </div>
        </section>
      </Motion>

      <Motion
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.35, delay: 0.3 }"
      >
        <section>
          <h3 class="mb-2 text-[16px] font-medium">Instructor</h3>
          <div class="flex items-start gap-3">
            <img
              :src="classItem.trainerAvatar"
              :alt="classItem.trainer"
              class="h-24 w-24 rounded-full border border-[var(--bw-orange)] object-cover"
            />
            <div>
              <p class="text-[18px] font-medium">
                {{ classItem.trainer }} {{ classItem.trainerFlagEmoji }}
              </p>
              <p class="text-[10px]">{{ classItem.trainerExp }}</p>
              <p class="mt-2 text-[10px]">
                {{
                  showQueueSessionCopy
                    ? '"Let\'s turn your workday stress into graceful energy. Expect a challenge but always with a smile! See you on the mat."'
                    : '"Let\'s melt away that desk tension together and recharge your energy for a brilliant afternoon"'
                }}
              </p>
            </div>
          </div>
        </section>
      </Motion>

      <Motion
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.35, delay: 0.35 }"
      >
        <button
          class="h-[55px] w-full rounded-[20px] text-[16px] font-semibold"
          :class="ctaClass"
          :disabled="
            blocksPrimaryBooking ||
              isSubmitting ||
              (checkingExistingBooking && !!auth.token)
          "
          @click="onPrimary"
        >
          {{ ctaLabel }}
        </button>
        <NuxtLink
          v-if="hasExistingBooking"
          to="/schedule"
          class="mt-3 flex h-[46px] w-full items-center justify-center rounded-[16px] border border-[var(--bw-orange)] text-[14px] font-semibold text-[var(--bw-orange)]"
        >
          Go to my schedule
        </NuxtLink>
        <p v-if="actionError" class="mt-2 text-sm text-[#c20000]">
          {{ actionError }}
        </p>
      </Motion>
    </article>

    <div v-else-if="isPending" class="space-y-4">
      <div class="h-[242px] animate-pulse rounded-3xl bg-white/70" />
      <div class="h-12 w-1/2 animate-pulse rounded bg-white/70" />
    </div>
  </LayoutAppShell>
</template>
