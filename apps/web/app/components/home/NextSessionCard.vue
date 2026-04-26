<script setup lang="ts">
import { computed } from 'vue'
import { Motion } from 'motion-v'

const { data: session, isPending } = useNextSession()

const startsInLabel = computed(() => {
  const minutes = session.value?.startsInMinutes ?? 0
  if (minutes < 60) return `Start in ${minutes} min`
  const hours = Math.round(minutes / 60)
  return `Start in ${hours} ${hours === 1 ? 'hour' : 'hours'}`
})
</script>

<template>
  <Motion
    :initial="{ opacity: 0, y: 16 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.45, delay: 0.05 }"
    class="relative h-[200px] overflow-hidden rounded-3xl shadow-card md:h-[260px]"
  >
    <div v-if="isPending" class="h-full w-full animate-pulse bg-black/10" />

    <template v-else-if="session">
      <img
        :src="session.imageUrl"
        :alt="session.title"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/0"
      />

      <div class="absolute right-0 top-5 flex items-center rounded-l-lg bg-[var(--bw-orange)] px-4 py-1.5 text-xs font-semibold text-white md:text-sm">
        {{ startsInLabel }}
      </div>

      <div class="absolute inset-x-6 bottom-5 flex items-end justify-between gap-4 text-white">
        <div>
          <p class="text-xs font-medium opacity-90 md:text-sm">{{ session.subtitle }}</p>
          <p class="mt-1 text-2xl font-bold md:text-3xl">{{ session.title }}</p>
        </div>
        <button
          type="button"
          class="flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 text-xs font-semibold text-[var(--bw-orange)] shadow-md transition-transform hover:-translate-y-0.5 md:text-sm"
        >
          <Icon name="ph:qr-code" class="h-4 w-4 md:h-5 md:w-5" />
          <span class="underline">Tap to check-in</span>
        </button>
      </div>
    </template>
  </Motion>
</template>
