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
    class="relative h-[176px] overflow-hidden rounded-[28px] shadow-card md:h-[220px]"
  >
    <div v-if="isPending" class="h-full w-full animate-pulse bg-black/10" />

    <template v-else-if="session">
      <img
        :src="session.imageUrl"
        :alt="session.title"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div class="absolute inset-0 bg-black/10" />
      <div
        class="absolute inset-y-0 right-0 w-[54%] bg-gradient-to-l from-[rgba(0,0,0,0.58)] via-[rgba(0,0,0,0.42)] to-transparent"
      />

      <div
        class="absolute right-0 top-5 flex items-center rounded-l-[10px] bg-[var(--bw-orange)] px-4 py-1.5 text-sm font-semibold text-white"
      >
        {{ startsInLabel }}
      </div>

      <div class="absolute right-6 top-[56%] -translate-y-1/2 text-white">
        <div>
          <p class="text-[12px] font-medium leading-tight opacity-95 md:text-sm">
            {{ session.subtitle }}
          </p>
          <p class="mt-1 text-[18px] font-bold leading-tight md:text-[22px]">
            {{ session.title }}
          </p>
        </div>
      </div>

      <button
        type="button"
        class="absolute bottom-5 right-6 flex items-center gap-1.5 text-[12px] font-semibold text-[var(--bw-orange)] underline decoration-[1.5px] underline-offset-[2px]"
      >
        <Icon name="ph:qr-code" class="h-4 w-4" />
        <span>Tap to check-in</span>
      </button>
    </template>
  </Motion>
</template>
