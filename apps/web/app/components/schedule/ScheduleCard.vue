<script setup lang="ts">
import type { ScheduleItem } from '~/schemas/schedule'

const props = defineProps<{
  item: ScheduleItem
}>()

const showPrimary = computed(() => props.item.status === 'booked')
const primaryLabel = computed(() => {
  if (props.item.status === 'completed') return 'Rebook'
  if (props.item.status === 'waitlisted') return 'Leave Waitlist'
  return 'My Booking'
})
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

        <div class="mt-3 flex gap-2">
          <button
            type="button"
            class="h-[31px] flex-1 rounded-xl border border-[#666666] text-sm font-medium text-[#666666]"
          >
            {{ item.status === 'completed' ? 'Detail' : 'Cancel' }}
          </button>
          <button
            v-if="showPrimary || item.status !== 'completed'"
            type="button"
            class="h-[31px] flex-1 rounded-xl bg-[var(--bw-orange)] text-sm font-medium text-white"
          >
            {{ primaryLabel }}
          </button>
        </div>
      </div>
    </div>
  </article>
</template>
