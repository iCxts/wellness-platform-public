<script setup lang="ts">
import type { ProgressStat } from '~/schemas/home'

defineProps<{ stat: ProgressStat }>()
</script>

<template>
  <div class="relative h-full w-full min-w-0 rounded-3xl bg-white p-4 shadow-card md:p-5">
    <div class="flex items-center gap-3">
      <div
        class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[rgba(255,103,39,0.1)] text-[var(--bw-orange)] md:h-12 md:w-12"
      >
        <Icon :name="stat.icon" class="h-5 w-5 md:h-6 md:w-6" />
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex items-baseline gap-1.5">
          <p class="text-3xl font-semibold leading-none text-[var(--bw-orange)] md:text-4xl">
            {{ stat.value }}
          </p>
          <p class="truncate text-xs font-medium text-[var(--bw-subtle)] md:text-sm">{{ stat.unit }}</p>
        </div>
        <p class="mt-1 truncate text-[11px] font-medium text-[var(--bw-subtle)] md:text-xs">
          {{ stat.label }}
        </p>
      </div>

      <span
        v-if="stat.badge"
        class="self-center rounded-lg bg-[var(--bw-orange)] px-3 py-1.5 text-[11px] font-medium text-white md:text-xs"
      >
        {{ stat.badge.text }}
      </span>
    </div>
  </div>
</template>
