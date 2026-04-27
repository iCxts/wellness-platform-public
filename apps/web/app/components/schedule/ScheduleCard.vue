<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'
import type { ScheduleItem } from '~/schemas/schedule'
import { cancelBooking } from '~/services/bookings'

const props = defineProps<{
  item: ScheduleItem
}>()
const router = useRouter()
const queryClient = useQueryClient()

const showPrimary = computed(() => props.item.status === 'booked')
const primaryLabel = computed(() => {
  if (props.item.status === 'completed') return 'Rebook'
  if (props.item.status === 'waitlisted') return 'Leave Waitlist'
  return 'My Booking'
})

const cancelling = ref(false)
const actionMessage = ref('')

const invalidateAfterBookingChange = async () => {
  await queryClient.invalidateQueries({ queryKey: ['schedule'] })
  await queryClient.invalidateQueries({ queryKey: ['explore'] })
}

const onPrimary = async () => {
  if (props.item.status === 'booked' && props.item.bookingId) {
    await router.push(`/booking-success?bookingId=${props.item.bookingId}&id=${props.item.id}`)
    return
  }

  if (props.item.status === 'waitlisted' && props.item.bookingId) {
    actionMessage.value = ''
    if (!confirm('Leave the waitlist for this class?')) return
    cancelling.value = true
    try {
      await cancelBooking(props.item.bookingId)
      await invalidateAfterBookingChange()
    } catch (error) {
      const msg =
        (error as { data?: { error?: string } })?.data?.error ??
        (error instanceof Error ? error.message : 'Could not leave waitlist.')
      actionMessage.value = msg
    } finally {
      cancelling.value = false
    }
  }
}

const onSecondary = async () => {
  actionMessage.value = ''
  if (props.item.status === 'completed') {
    await router.push(`/class/${props.item.id}`)
    return
  }

  if (!props.item.bookingId) {
    actionMessage.value = 'This entry has no linked booking to cancel.'
    return
  }

  if (
    !confirm(
      props.item.status === 'waitlisted'
        ? 'Leave the waitlist for this class?'
        : 'Cancel this booking?',
    )
  ) {
    return
  }

  cancelling.value = true
  try {
    await cancelBooking(props.item.bookingId)
    await invalidateAfterBookingChange()
  } catch (error) {
    const msg =
      (error as { data?: { error?: string } })?.data?.error ??
      (error instanceof Error ? error.message : 'Could not cancel.')
    actionMessage.value = msg
  } finally {
    cancelling.value = false
  }
}
</script>

<template>
  <article
    class="overflow-hidden rounded-3xl border border-[rgba(87,84,84,0.2)] bg-white"
  >
    <div class="grid min-w-0 grid-cols-[110px_1fr] md:grid-cols-[200px_1fr]">
      <div class="bg-[#f6f6f6] p-4 md:p-5">
        <p
          class="text-[1.75rem] font-semibold uppercase leading-none text-[var(--bw-orange)] md:text-[2rem]"
        >
          {{ item.dateLabel }}
        </p>
        <p class="mt-4 text-[1.1rem] font-medium text-black md:text-[1.2rem]">
          {{ item.startTime }}-{{ item.endTime }}
        </p>
      </div>

      <div class="min-w-0 p-3 md:p-5">
        <h3
          class="truncate text-3xl font-semibold leading-none text-black md:text-4xl"
        >
          {{ item.title }}
        </h3>

        <div class="mt-3 space-y-1.5 text-sm text-[#575454] md:text-base">
          <div class="flex min-w-0 items-center gap-2">
            <Icon name="ph:map-pin-simple-area" class="h-5 w-5 shrink-0" />
            <p class="truncate">{{ item.location }}</p>
          </div>
          <div class="flex min-w-0 items-center gap-2">
            <Icon name="ph:person-simple-tai-chi" class="h-5 w-5 shrink-0" />
            <p class="truncate">{{ item.trainer }}</p>
          </div>
        </div>

        <p v-if="actionMessage" class="mt-2 text-xs text-[#c20000]">
          {{ actionMessage }}
        </p>

        <div class="mt-3 flex gap-2">
          <button
            type="button"
            class="h-[31px] flex-1 rounded-xl border border-[#666666] text-sm font-medium text-[#666666] disabled:opacity-50"
            :disabled="cancelling"
            @click="onSecondary"
          >
            {{
              cancelling
                ? '…'
                : item.status === 'completed'
                  ? 'Detail'
                  : 'Cancel'
            }}
          </button>
          <button
            v-if="showPrimary || item.status !== 'completed'"
            type="button"
            class="h-[31px] flex-1 rounded-xl bg-[var(--bw-orange)] text-sm font-medium text-white disabled:opacity-50"
            :disabled="cancelling"
            @click="onPrimary"
          >
            {{ primaryLabel }}
          </button>
        </div>
      </div>
    </div>
  </article>
</template>
