<script setup lang="ts">
import { Motion } from 'motion-v'

const { data: user, isPending } = useUser()

const today = new Date()
const dateLabel = `Today ${today.getDate()} ${today.toLocaleString('en-US', {
  month: 'short',
})}`
</script>

<template>
  <Motion
    as="header"
    :initial="{ opacity: 0, y: -10 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.4 }"
    class="flex items-center gap-4"
  >
    <div class="relative h-12 w-12 overflow-hidden rounded-full bg-black/5 md:h-14 md:w-14">
      <img
        v-if="user?.avatarUrl"
        :src="user.avatarUrl"
        :alt="user.name"
        class="h-full w-full object-cover"
      />
    </div>

    <div class="flex-1 text-center md:text-left">
      <p class="text-base font-medium text-[var(--bw-ink)] md:text-lg">
        Hello, <span class="font-semibold">{{ isPending ? '...' : user?.name }}</span>
      </p>
      <p class="text-[11px] text-[var(--bw-subtle)] md:text-xs">{{ dateLabel }}</p>
    </div>

    <button
      type="button"
      class="grid h-10 w-10 place-items-center rounded-full text-[var(--bw-ink)] transition-colors hover:bg-black/5"
      aria-label="Notifications"
    >
      <Icon name="ph:bell" class="h-6 w-6" />
    </button>
  </Motion>
</template>
