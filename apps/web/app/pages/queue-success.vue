<script setup lang="ts">
import { Motion } from 'motion-v'
import { fetchBookingDetail } from '~/services/bookings'
definePageMeta({ ssr: false })

const route = useRoute()
const id = computed(() => String(route.query.id ?? 'vinyasa-flow'))
const bookingId = computed(() => String(route.query.bookingId ?? ''))
const { data: classItem } = useClassDetail(id)
const { data: bookingDetail } = useAsyncData(
  () => `queue-booking-${bookingId.value}`,
  async () => {
    if (!bookingId.value) return null
    return await fetchBookingDetail(bookingId.value)
  },
)

const queuePositionLabel = computed(() => {
  const position = bookingDetail.value?.standbyPosition
  return typeof position === 'number' && position > 0 ? `#${position} in queue` : 'In queue'
})

const detailClassName = computed(
  () => bookingDetail.value?.session.title ?? classItem.value?.title,
)
const detailInstructor = computed(() => {
  if (bookingDetail.value?.instructor) {
    return `${bookingDetail.value.instructor.firstName} ${bookingDetail.value.instructor.lastName}`.trim()
  }
  return classItem.value?.trainer
})
const detailDate = computed(() => {
  const startsAt = bookingDetail.value?.session.startsAt
  if (!startsAt) return classItem.value?.dateLabel ?? '—'
  return new Date(startsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
})
const detailTime = computed(() => {
  const startsAt = bookingDetail.value?.session.startsAt
  const endsAt = bookingDetail.value?.session.endsAt
  if (!startsAt || !endsAt) return `${classItem.value?.startTime ?? '—'} - ${classItem.value?.endTime ?? '—'}`
  const start = new Date(startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  const end = new Date(endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  return `${start} - ${end}`
})
const detailLocation = computed(
  () => bookingDetail.value?.session.placeDescription ?? classItem.value?.location ?? 'Wellness Center',
)
const detailRoom = computed(
  () => bookingDetail.value?.session.roomName ?? classItem.value?.room ?? 'Room',
)
</script>

<template>
  <LayoutAppShell content-max-width="max-w-[420px] md:max-w-[860px]">
    <div class="mx-auto max-w-[420px] space-y-5 pb-4 text-center">
      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35 }">
        <div class="flex justify-start">
          <button class="grid h-8 w-8 place-items-center rounded-full border border-black/20" @click="$router.back()">
            <Icon name="ph:arrow-left" class="h-5 w-5" />
          </button>
        </div>
      </Motion>

      <Motion :initial="{ opacity: 0, scale: 0.94 }" :animate="{ opacity: 1, scale: 1 }" :transition="{ duration: 0.35, delay: 0.05 }">
        <div class="mx-auto grid h-[92px] w-[92px] place-items-center rounded-full bg-[#fff8df]">
          <div class="grid h-[68px] w-[68px] place-items-center rounded-full bg-[var(--bw-yellow)] text-white">
            <Icon name="ph:hourglass-medium-fill" class="h-10 w-10" />
          </div>
        </div>
      </Motion>

      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35, delay: 0.1 }" class="space-y-2">
        <h1 class="text-[28px] font-semibold">You're on the waitlist!</h1>
        <p class="text-[12px]">Hang tight! We'll ping you if a spot opens up.</p>
      </Motion>

      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35, delay: 0.15 }">
        <div class="rounded-[30px] border border-[#ececec] p-6 text-left">
          <p class="mb-5 text-center text-[42px] font-semibold text-[var(--bw-yellow)]">{{ queuePositionLabel }}</p>
          <dl class="space-y-2 text-[17px]">
            <div class="flex justify-between gap-4"><dt class="text-[#9d9c9c]">Class</dt><dd class="font-medium">{{ detailClassName }}</dd></div>
            <div class="flex justify-between gap-4"><dt class="text-[#9d9c9c]">Instructor</dt><dd class="font-medium">{{ detailInstructor ?? 'Instructor' }}</dd></div>
            <div class="flex justify-between gap-4"><dt class="text-[#9d9c9c]">Date</dt><dd class="font-medium">{{ detailDate }}</dd></div>
            <div class="flex justify-between gap-4"><dt class="text-[#9d9c9c]">Time</dt><dd class="font-medium">{{ detailTime }}</dd></div>
            <div class="flex justify-between gap-4"><dt class="text-[#9d9c9c]">Location</dt><dd class="font-medium">{{ detailLocation }}</dd></div>
            <div class="flex justify-between gap-4"><dt class="text-[#9d9c9c]">Room</dt><dd class="font-medium">{{ detailRoom }}</dd></div>
          </dl>
        </div>
      </Motion>

      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35, delay: 0.2 }">
        <NuxtLink
          to="/search"
          class="mx-auto flex h-[55px] w-[211px] items-center justify-center rounded-[20px] border border-[var(--bw-orange)] text-[16px] font-semibold text-[var(--bw-orange)]"
        >
          Explore other classes
        </NuxtLink>
      </Motion>
    </div>
  </LayoutAppShell>
</template>
