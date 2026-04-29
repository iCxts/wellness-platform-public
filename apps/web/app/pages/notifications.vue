<script setup lang="ts">
import { Motion } from 'motion-v'
import type { NotificationApiItem } from '~/services/notifications'

definePageMeta({ ssr: false })

type FilterTab = 'all' | 'unread'
type IconKind = 'promoted' | 'feedback' | 'reminder' | 'gym' | 'info'

const filter = ref<FilterTab>('all')
const unreadOnly = computed(() => filter.value === 'unread')

const { data, isPending, markAllRead, markOneRead } =
  useNotificationsList(unreadOnly)

const router = useRouter()

function sectionForCreatedAt(createdAt: string): 'today' | 'week' {
  const date = new Date(createdAt)
  const startToday = new Date()
  startToday.setHours(0, 0, 0, 0)
  const endToday = new Date(startToday)
  endToday.setHours(23, 59, 59, 999)
  if (date >= startToday && date <= endToday) return 'today'
  return 'week'
}

function iconForType(type: string): IconKind {
  switch (type) {
    case 'standby_promoted':
    case 'spot_opened':
      return 'promoted'
    case 'feedback_request':
      return 'feedback'
    case 'reminder':
      return 'reminder'
    case 'no_show_tagged':
    case 'absence_warning':
      return 'info'
    default:
      return 'info'
  }
}

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
    case 'info':
      return 'ph:info'
    default:
      return 'ph:bell'
  }
}

const sections = computed(() => {
  const list = data.value ?? []
  const today = list.filter((r) => sectionForCreatedAt(r.createdAt) === 'today')
  const week = list.filter((r) => sectionForCreatedAt(r.createdAt) === 'week')
  return [
    { key: 'today' as const, label: 'Today', items: today },
    { key: 'week' as const, label: 'This Week', items: week },
  ].filter((s) => s.items.length > 0)
})

async function handleMarkAllRead() {
  await markAllRead()
}

async function handleRowClick(item: NotificationApiItem) {
  const sessionId = item.sessionId ?? item.metadata?.sessionId
  if (!sessionId) return

  if (!item.isRead) {
    try {
      await markOneRead(item.id)
    } catch {
      /* ignore */
    }
  }
  await router.push(`/class/${sessionId}`)
}

const rowCursorClass = (item: NotificationApiItem) =>
  item.sessionId || item.metadata?.sessionId
    ? 'cursor-pointer active:bg-black/[0.02]'
    : ''
</script>

<template>
  <LayoutAppShell content-max-width="" class="-m-5 overflow-hidden">
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
          @click="handleMarkAllRead"
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

      <div v-if="isPending" class="space-y-4 px-1 py-8">
        <div class="h-16 animate-pulse rounded-xl bg-black/[0.06]" />
        <div class="h-16 animate-pulse rounded-xl bg-black/[0.06]" />
        <div class="h-16 animate-pulse rounded-xl bg-black/[0.06]" />
      </div>

      <template v-else-if="sections.length === 0">
        <div class="px-1 py-12 text-center text-sm text-[var(--bw-subtle)]">
          No notifications yet.
        </div>
      </template>

      <template v-else>
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
              :class="rowCursorClass(item)"
              role="button"
              tabindex="0"
              @click="handleRowClick(item)"
              @keydown.enter.prevent="handleRowClick(item)"
            >
              <div class="flex w-[18px] shrink-0 flex-col items-center pt-2">
                <span
                  v-if="!item.isRead"
                  class="h-2 w-2 shrink-0 rounded-full bg-[#ef4444]"
                  aria-hidden="true"
                />
              </div>
              <div
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-[18px] p-1"
                :class="iconBg(iconForType(item.type))"
              >
                <Icon
                  :name="iconName(iconForType(item.type))"
                  class="h-7 w-7 text-white"
                />
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
      </template>
    </section>
  </LayoutAppShell>
</template>
