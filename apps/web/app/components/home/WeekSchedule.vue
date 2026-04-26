<script setup lang="ts">
import { Motion } from 'motion-v'

const { data: days, isPending } = useWeekSchedule()
</script>

<template>
  <section class="space-y-3 overflow-hidden -mx-4 px-4">
    <h2 class="text-sm font-semibold text-[var(--bw-ink)] md:text-base">
      My Schedule
    </h2>

    <div v-if="isPending" class="flex gap-2 overflow-hidden">
      <div
        v-for="i in 7"
        :key="i"
        class="h-[68px] w-[52px] shrink-0 animate-pulse rounded-2xl bg-white/70"
      />
    </div>

    <div
      v-else
      class="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar md:mx-0 md:px-0"
    >
      <Motion
        v-for="(day, index) in days"
        :key="day.date"
        :initial="{ opacity: 0, y: 8 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.3, delay: 0.05 * index }"
        class="grid h-[68px] w-[52px] shrink-0 place-items-center rounded-2xl border bg-white text-center transition-colors md:w-[64px]"
        :class="
          day.isToday
            ? 'border-[rgba(255,103,39,0.4)] ring-1 ring-[rgba(255,103,39,0.2)]'
            : 'border-black/15'
        "
      >
        <div class="flex flex-col items-center">
          <span class="text-[11px] text-[var(--bw-subtle)]">{{
            day.dayLabel
          }}</span>
          <span class="mt-0.5 text-base font-semibold text-[var(--bw-ink)]">{{
            day.dayNum
          }}</span>
          <span
            v-if="day.hasSession"
            class="mt-1 h-2 w-2 rounded-full"
            :class="
              day.sessionTone === 'orange'
                ? 'bg-[var(--bw-orange)]'
                : 'bg-[var(--bw-yellow)]'
            "
          />
        </div>
      </Motion>
    </div>
  </section>
</template>
