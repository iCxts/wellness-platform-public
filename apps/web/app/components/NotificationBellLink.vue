<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** Smaller tap target (e.g. schedule header). */
    compact?: boolean
    /** Extra classes on the link (hover, text colour). */
    linkClass?: string
    /** Ring behind the dot for contrast on non-white backgrounds. */
    badgeRingClass?: string
  }>(),
  { compact: false },
)

const { data: unreadCount } = useUnreadNotificationCount()
const showBadge = computed(() => (unreadCount.value ?? 0) > 0)

const shellClass = computed(() =>
  [
    'relative grid place-items-center rounded-full transition-colors',
    props.compact
      ? 'h-8 w-8 md:h-10 md:w-10'
      : 'h-10 w-10',
    'text-[var(--bw-ink)] hover:bg-black/5',
    props.linkClass,
  ]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <NuxtLink
    to="/notifications"
    :class="shellClass"
    aria-label="Notifications"
  >
    <Icon name="ph:bell" class="h-6 w-6" />
    <span
      v-if="showBadge"
      class="pointer-events-none absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--bw-orange)] ring-2"
      :class="badgeRingClass ?? 'ring-white'"
      aria-hidden="true"
    />
  </NuxtLink>
</template>
