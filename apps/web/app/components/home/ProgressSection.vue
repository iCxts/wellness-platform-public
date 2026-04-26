<script setup lang="ts">
import { computed } from 'vue'
import { Motion } from 'motion-v'

const { data: stats, isPending } = useProgressStats()

const wideStat = computed(() =>
  stats.value?.find((stat) => stat.emphasis === 'wide'),
)
const compactStats = computed(
  () => stats.value?.filter((stat) => stat.emphasis === 'compact') ?? [],
)
</script>

<template>
  <section class="space-y-3">
    <h2 class="text-sm font-semibold text-[var(--bw-ink)] md:text-base">
      My Progress
    </h2>

    <div v-if="isPending" class="grid gap-3">
      <div class="h-20 animate-pulse rounded-3xl bg-white/70" />
      <div
        class="grid grid-cols-1 gap-3 overflow-hidden min-[360px]:grid-cols-2"
      >
        <div class="h-24 animate-pulse rounded-3xl bg-white/70" />
        <div class="h-24 animate-pulse rounded-3xl bg-white/70" />
      </div>
    </div>

    <div v-else class="grid gap-3">
      <Motion
        v-if="wideStat"
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.4, delay: 0.1 }"
      >
        <HomeStatCard :stat="wideStat" />
      </Motion>

      <div class="grid grid-cols-2 gap-3">
        <Motion
          v-for="(stat, index) in compactStats"
          :key="stat.id"
          :initial="{ opacity: 0, y: 12 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.4, delay: 0.15 + index * 0.05 }"
          class="min-w-0"
        >
          <HomeStatCard :stat="stat" />
        </Motion>
      </div>
    </div>
  </section>
</template>
