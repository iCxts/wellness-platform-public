<script setup lang="ts">
interface NavItem {
  id: string
  icon: string
  label: string
  to: string
}

const items: NavItem[] = [
  { id: 'home', icon: 'ph:house-fill', label: 'Home', to: '/' },
  { id: 'search', icon: 'ph:magnifying-glass', label: 'Discover', to: '/search' },
  { id: 'check-in', icon: 'ph:qr-code', label: 'Check-in', to: '/check-in' },
  { id: 'schedule', icon: 'ph:calendar-blank', label: 'Schedule', to: '/schedule' },
  { id: 'profile', icon: 'ph:user', label: 'Profile', to: '/profile' },
]

const route = useRoute()
const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))
</script>

<template>
  <aside
    class="hidden h-screen flex-col gap-2 border-r border-black/5 bg-white/70 px-5 py-8 backdrop-blur-xl xl:sticky xl:top-0 xl:flex xl:w-64"
  >
    <div class="mb-8 flex items-center gap-3 px-2">
      <div class="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--bw-orange)] text-white">
        <Icon name="ph:flower-lotus-fill" class="h-6 w-6" />
      </div>
      <div class="leading-tight">
        <p class="text-sm font-semibold text-[var(--bw-ink)]">B. Well</p>
        <p class="text-xs text-[var(--bw-subtle)]">Wellness Hub</p>
      </div>
    </div>

    <NuxtLink
      v-for="item in items"
      :key="item.id"
      :to="item.to"
      class="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-colors"
      :class="
        isActive(item.to)
          ? 'bg-[rgba(255,103,39,0.1)] text-[var(--bw-orange)]'
          : 'text-[rgba(4,0,54,0.7)] hover:bg-black/5 hover:text-[var(--bw-ink)]'
      "
    >
      <Icon :name="item.icon" class="h-5 w-5" />
      <span>{{ item.label }}</span>
    </NuxtLink>

    <div class="mt-auto rounded-2xl bg-[rgba(255,103,39,0.05)] p-4 text-center">
      <p class="text-xs text-[var(--bw-subtle)]">Need help?</p>
      <p class="mt-1 text-sm font-semibold text-[var(--bw-ink)]">Visit our wellness desk</p>
    </div>
  </aside>
</template>
