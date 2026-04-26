<script setup lang="ts">
import type { Booking } from '~/schemas/home'

defineProps<{ booking: Booking }>()
</script>

<template>
  <article
    class="group flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white shadow-card-lg transition-transform hover:-translate-y-1"
  >
    <div class="relative h-24 md:h-36">
      <img
        :src="booking.imageUrl"
        :alt="booking.title"
        class="h-full w-full object-cover"
      />
      <span
        class="absolute left-2 top-1/2 -translate-y-1/2 rounded-l-md bg-[var(--bw-orange)] px-2 py-1 text-[10px] font-semibold text-white md:text-xs"
      >
        {{ booking.dateLabel }}
      </span>
    </div>

    <div class="flex flex-1 flex-col gap-1 p-3 md:p-4">
      <p class="text-[11px] text-[rgba(4,0,54,0.8)] md:text-xs">
        {{ booking.startTime }} - {{ booking.endTime }}
      </p>
      <div class="flex items-center justify-between gap-2">
        <p class="text-sm font-semibold text-[var(--bw-ink)] md:text-base">{{ booking.title }}</p>
        <span
          v-if="booking.available"
          class="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-medium text-emerald-700 md:text-[10px]"
        >
          Available
        </span>
      </div>
      <div class="mt-1 flex items-center gap-1 text-[10px] text-[rgba(4,0,54,0.8)] md:text-xs">
        <Icon name="ph:map-pin-simple-area" class="h-3.5 w-3.5 text-[rgba(4,0,54,0.7)]" />
        <span>{{ booking.location }}</span>
      </div>
    </div>
  </article>
</template>
