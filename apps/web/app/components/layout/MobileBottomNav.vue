<script setup lang="ts">
interface NavItem {
  id: string
  icon: string
  label: string
  to: string
  roles?: Array<'member' | 'instructor' | 'admin'>
}

const items: NavItem[] = [
  { id: 'home', icon: 'ph:house-fill', label: 'Home', to: '/' },
  { id: 'search', icon: 'ph:magnifying-glass', label: 'Search', to: '/search' },
  {
    id: 'instructor',
    icon: 'ph:chalkboard-teacher',
    label: 'Teach',
    to: '/instructor',
    roles: ['instructor'],
  },
  {
    id: 'admin',
    icon: 'ph:shield-star',
    label: 'Admin',
    to: '/admin',
    roles: ['admin'],
  },
  {
    id: 'check-in',
    icon: 'ph:qr-code',
    label: 'Scan',
    to: '/check-in',
    roles: ['member', 'instructor'],
  },
  {
    id: 'schedule',
    icon: 'ph:calendar-blank',
    label: 'Schedule',
    to: '/schedule',
  },
  { id: 'profile', icon: 'ph:user', label: 'Profile', to: '/profile' },
]

const route = useRoute()
const auth = useAuth()

const visibleItems = computed(() => {
  const role = auth.user.value?.role
  if (!role) return items
  return items.filter((item) => !item.roles || item.roles.includes(role))
})

const isActive = (to: string) =>
  to === '/' ? route.path === '/' : route.path.startsWith(to)
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[9999] mx-auto flex w-[min(20rem,calc(100%-1.25rem))] items-center justify-between rounded-full border border-black/10 bg-black/0.12 px-3.5 py-2.5 shadow-card backdrop-blur-xl xl:hidden"
  >
    <NuxtLink
      v-for="item in visibleItems"
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
