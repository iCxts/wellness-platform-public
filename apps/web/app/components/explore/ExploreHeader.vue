<script setup lang="ts">
const { data: user, isPending } = useUser()

const today = new Date()
const dateLabel = `Today ${today.getDate()} ${today.toLocaleString('en-US', { month: 'short' })}`
</script>

<template>
  <header class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="relative h-10 w-10 overflow-hidden rounded-full bg-black/5">
        <img
          v-if="user?.avatarUrl"
          :src="user.avatarUrl"
          :alt="user.name"
          class="h-full w-full object-cover"
        />
      </div>
      <div>
        <p class="text-[16px] font-semibold leading-none text-[var(--bw-ink)]">
          Hello, {{ isPending ? '...' : user?.name }}
        </p>
        <p class="text-xs text-[var(--bw-subtle)]">{{ dateLabel }}</p>
      </div>
    </div>
    <NuxtLink
      to="/notifications"
      class="grid h-10 w-10 place-items-center rounded-full text-[var(--bw-ink)]"
      aria-label="Notifications"
    >
      <Icon name="ph:bell" class="h-6 w-6" />
    </NuxtLink>
  </header>
</template>
