<script setup lang="ts">
interface NavItem {
  id: string
  icon: string
  label: string
  to: string
}

const items: NavItem[] = [
  { id: 'home', icon: 'ph:house-fill', label: 'Home', to: '/' },
  { id: 'search', icon: 'ph:magnifying-glass', label: 'Search', to: '/search' },
  { id: 'check-in', icon: 'ph:qr-code', label: 'Check-in', to: '/check-in' },
  {
    id: 'schedule',
    icon: 'ph:calendar-blank',
    label: 'Schedule',
    to: '/schedule',
  },
  { id: 'profile', icon: 'ph:user', label: 'Profile', to: '/profile' },
]

const route = useRoute()
const isActive = (to: string) =>
  to === '/' ? route.path === '/' : route.path.startsWith(to)
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[9999] mx-auto flex w-[min(20rem,calc(100%-1.25rem))] items-center justify-between rounded-full border border-black/10 bg-black/0.12 px-3.5 py-2.5 shadow-card backdrop-blur-xl md:hidden"
  >
    <NuxtLink
      v-for="item in items"
      :key="item.id"
      :to="item.to"
      class="grid h-11 w-11 place-items-center rounded-full transition-colors"
      :class="
        isActive(item.to)
          ? 'bg-[rgba(255,103,39,0.2)] text-[var(--bw-orange)]'
          : 'text-[rgba(4,0,54,0.7)] hover:text-[var(--bw-ink)]'
      "
      :aria-label="item.label"
    >
      <Icon :name="item.icon" class="h-7 w-7" />
    </NuxtLink>
  </nav>
</template>
