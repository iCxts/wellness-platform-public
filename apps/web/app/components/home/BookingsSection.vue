<script setup lang="ts">
import { Motion } from 'motion-v'

const { data: bookings, isPending } = useBookings()
</script>

<template>
  <section class="space-y-3">
    <div class="flex items-end justify-between">
      <h2 class="text-sm font-semibold text-[var(--bw-ink)] md:text-base">My Booking</h2>
      <NuxtLink
        to="/bookings"
        class="flex items-center gap-1 text-xs font-medium text-[var(--bw-ink)] underline-offset-4 hover:underline md:text-sm"
      >
        See All
        <Icon name="ph:arrow-right" class="h-4 w-4" />
      </NuxtLink>
    </div>

    <div v-if="isPending" class="flex gap-3 overflow-hidden">
      <div
        v-for="i in 3"
        :key="i"
        class="h-44 w-[160px] shrink-0 animate-pulse rounded-3xl bg-white/70 md:w-full"
      />
    </div>

    <div
      v-else
      class="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0"
    >
      <Motion
        v-for="(booking, index) in bookings"
        :key="booking.id"
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.4, delay: 0.05 * index }"
        class="w-[160px] shrink-0 md:w-full"
      >
        <HomeBookingCard :booking="booking" />
      </Motion>
    </div>
  </section>
</template>
