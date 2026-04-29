<script setup lang="ts">
import { Motion } from 'motion-v'

definePageMeta({ ssr: false })

type FilterTab = 'all' | 'unread'
type IconKind = 'promoted' | 'feedback' | 'reminder' | 'gym'

interface NotificationRow {
  id: string
  section: 'today' | 'week'
  title: string
  body: string
  icon: IconKind
  unread: boolean
}

const filter = ref<FilterTab>('all')

const rows = ref<NotificationRow[]>([
  {
    id: '1',
    section: 'today',
    title: 'Standby Promoted 🎉',
    body: "You're In! A spot opened up! You now have a confirmed booking for Vinyasa Flow on ARP 6 / 13:00–14:00.",
    icon: 'promoted',
    unread: true,
  },
  {
    id: '2',
    section: 'today',
    title: 'Feedback Request⭐',
    body: 'How was the session? Great work! How was your experience with Kru Ploy today?',
    icon: 'feedback',
    unread: false,
  },
  {
    id: '3',
    section: 'today',
    title: 'Reminder ⏰',
    body: 'See you soon! Your YOGA Express starts in 1 hour at Wellness Center A ( Room 4 ). Ready?',
    icon: 'reminder',
    unread: false,
  },
  {
    id: '4',
    section: 'today',
    title: 'Miss your GYM glow? ✨',
    body: "It's been 2 days since your last activity. Come find your energy today. we're ready for you!",
    icon: 'gym',
    unread: false,
  },
  {
    id: '5',
    section: 'week',
    title: 'Reminder ⏰',
    body: 'You have YOGA Express tomorrow at 12:15–13:00. Looking forward to seeing you there!',
    icon: 'reminder',
    unread: false,
  },
  {
    id: '6',
    section: 'week',
    title: 'Feedback Request⭐',
    body: 'How was the session? Great work! How was your experience with Kru Pim today?',
    icon: 'feedback',
    unread: false,
  },
  {
    id: '7',
    section: 'week',
    title: 'Reminder ⏰',
    body: 'See you soon! Your Vinyasa Flow starts in 1 hour at Wellness Center A ( Room 6 ). Ready?',
    icon: 'reminder',
    unread: false,
  },
  {
    id: '8',
    section: 'week',
    title: 'Standby Promoted🎉',
    body: "You're In! A spot opened up! You now have a confirmed booking for YOGA Flow on ARP 1 / 13:00–14:00.",
    icon: 'promoted',
    unread: false,
  },
])

const visibleRows = computed(() => {
  const list = rows.value
  if (filter.value === 'all') return list
  return list.filter((r) => r.unread)
})

const sections = computed(() => {
  const today = visibleRows.value.filter((r) => r.section === 'today')
  const week = visibleRows.value.filter((r) => r.section === 'week')
  return [
    { key: 'today' as const, label: 'Today', items: today },
    { key: 'week' as const, label: 'This Week', items: week },
  ].filter((s) => s.items.length > 0)
})

function iconBg(kind: IconKind) {
  switch (kind) {
    case 'promoted':
      return 'bg-[var(--bw-orange)]'
    case 'gym':
      return 'bg-[var(--bw-yellow)]'
    default:
      return 'bg-[var(--bw-gray)]'
  }
}

function iconName(kind: IconKind) {
  switch (kind) {
    case 'promoted':
      return 'ph:check-bold'
    case 'feedback':
      return 'ph:star'
    case 'reminder':
      return 'ph:timer'
    case 'gym':
      return 'ph:hand-waving'
    default:
      return 'ph:bell'
  }
}

function markAllRead() {
  rows.value = rows.value.map((r) => ({ ...r, unread: false }))
}
</script>

<template>
  <LayoutAppShell content-max-width="" class="overflow-hidden -m-5">
    <section class="rounded-[12px] bg-white px-3 pb-8 pt-1 md:px-4">
      <Motion
        :initial="{ opacity: 0, y: 10 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.3 }"
        class="relative flex items-center justify-center px-1 pb-5 pt-1"
      >
        <button
          type="button"
          class="absolute left-0 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center text-[var(--bw-ink)]"
          aria-label="Back"
          @click="$router.back()"
        >
          <Icon name="ph:arrow-circle-left" class="h-8 w-8" />
        </button>
        <h1 class="text-[16px] font-medium text-[var(--bw-ink)]">
          Notifications
        </h1>
        <button
          type="button"
          class="absolute right-0 top-1/2 -translate-y-1/2 text-[12px] font-medium text-black underline decoration-solid underline-offset-2"
          @click="markAllRead"
        >
          Mark all read
        </button>
      </Motion>

      <Motion
        :initial="{ opacity: 0, y: 8 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.28, delay: 0.04 }"
        class="mb-4 flex items-center gap-2 px-0"
      >
        <button
          type="button"
          class="h-9 min-w-[56px] rounded-full px-4 text-[14px] font-medium transition-colors"
          :class="
            filter === 'all'
              ? 'bg-[var(--bw-gray)] text-white'
              : 'border border-[var(--bw-gray)] bg-white text-[var(--bw-gray)]'
          "
          @click="filter = 'all'"
        >
          ALL
        </button>
        <button
          type="button"
          class="h-9 rounded-full border px-5 text-[14px] font-medium transition-colors"
          :class="
            filter === 'unread'
              ? 'border-transparent bg-[var(--bw-gray)] text-white'
              : 'border-[var(--bw-gray)] bg-white text-[var(--bw-gray)]'
          "
          @click="filter = 'unread'"
        >
          Unread
        </button>
      </Motion>

      <div class="mb-3 h-px w-full bg-black/10" />

      <div
        v-if="sections.length === 0"
        class="px-1 py-12 text-center text-sm text-[var(--bw-subtle)]"
      >
        No notifications yet.
      </div>

      <div v-for="(block, bi) in sections" :key="block.key" class="mb-6">
        <p class="mb-3 text-[14px] font-medium text-black">{{ block.label }}</p>
        <ul class="divide-y divide-black/10">
          <li
            v-for="(item, index) in block.items"
            :key="item.id"
            class="list-none"
          >
            <Motion
              :initial="{ opacity: 0, y: 10 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.22, delay: bi * 0.06 + index * 0.03 }"
              class="flex gap-3 py-4"
            >
              <div class="flex w-[18px] shrink-0 flex-col items-center pt-2">
                <span
                  v-if="item.unread"
                  class="h-2 w-2 shrink-0 rounded-full bg-[#ef4444]"
                  aria-hidden="true"
                />
              </div>
              <div
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-[18px] p-1"
                :class="iconBg(item.icon)"
              >
                <Icon :name="iconName(item.icon)" class="h-7 w-7 text-white" />
              </div>
              <div class="min-w-0 flex-1 pt-0.5">
                <p class="text-[14px] font-medium leading-snug text-black">
                  {{ item.title }}
                </p>
                <p
                  class="mt-1 text-[10px] font-medium leading-[14px] text-[var(--bw-gray)]"
                >
                  {{ item.body }}
                </p>
              </div>
            </Motion>
          </li>
        </ul>
      </div>
    </section>
  </LayoutAppShell>
</template>
