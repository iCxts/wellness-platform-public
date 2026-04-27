<script setup lang="ts">
import { Motion } from 'motion-v'

definePageMeta({ ssr: false })

const route = useRoute()
const sessionId = computed(() => String(route.params.id ?? ''))

const { data: session } = useAdminSession(sessionId)
const { data: members, isPending } = useAdminMembers(sessionId)
const { pageEnter, listStagger } = useAppPageMotion()

const statusClass: Record<string, string> = {
  attended: 'bg-[var(--bw-orange)] text-white',
  pending: 'bg-[#666] text-white',
  'no-show': 'bg-[#c20000] text-white',
}

const statusLabel: Record<string, string> = {
  attended: 'Attended',
  pending: 'Pending',
  'no-show': 'No-show',
}
</script>

<template>
  <LayoutAppShell content-max-width="max-w-[940px]">
    <Motion v-bind="pageEnter" class="w-full min-w-0">
    <div class="space-y-4 pb-6 md:space-y-5">
      <NuxtLink to="/admin" class="inline-grid h-8 w-8 place-items-center rounded-full text-[var(--bw-ink)]">
        <Icon name="ph:arrow-circle-left" class="h-7 w-7" />
      </NuxtLink>

      <h1 class="text-4xl font-bold leading-none text-[var(--bw-ink)] sm:text-5xl md:text-6xl">{{ session?.title ?? 'Class Members' }}</h1>

      <p class="flex items-center gap-2 text-lg sm:text-xl md:text-2xl">
        <Icon name="ph:timer" class="h-6 w-6" />
        {{ session?.startTime }} - {{ session?.endTime }}
      </p>
      <p class="flex items-center gap-2 text-lg sm:text-xl md:text-2xl">
        <Icon name="ph:map-pin-area" class="h-6 w-6" />
        {{ session?.location }} / {{ session?.room }}
      </p>

      <div class="space-y-1">
        <p class="text-base sm:text-lg md:text-xl">{{ session?.participants }}/{{ session?.capacity }} Showed / 1 No-show</p>
        <div class="h-4 overflow-hidden rounded-lg bg-[#d9d9d9]">
          <div class="h-full rounded-lg bg-[var(--bw-orange)]" :style="{ width: `${((session?.participants ?? 0) / (session?.capacity ?? 1)) * 100}%` }" />
        </div>
      </div>

      <div class="hidden grid-cols-[1.4fr_1fr_0.8fr] border-b border-black/10 px-2 pb-2 text-sm font-medium md:grid">
        <p>Members</p>
        <p>Check-in time</p>
        <p>Status</p>
      </div>

      <div v-if="isPending" class="space-y-2">
        <div v-for="i in 8" :key="i" class="h-14 animate-pulse rounded-xl bg-white/70" />
      </div>

      <div v-else class="space-y-2">
        <Motion
          v-for="(member, index) in members"
          :key="member.id"
          v-bind="listStagger(index)"
        >
        <article
          class="grid items-center gap-3 rounded-xl border border-black/10 bg-white px-2 py-2 sm:grid-cols-[1.2fr_1fr] md:grid-cols-[1.4fr_1fr_0.8fr] md:border-0 md:border-b md:border-black/10 md:rounded-none"
        >
          <div class="flex min-w-0 items-center gap-2.5">
            <img :src="member.avatarUrl" :alt="member.name" class="h-10 w-10 rounded-full border border-black/10 object-cover" />
            <div class="min-w-0">
              <p class="truncate text-lg font-medium sm:text-xl md:text-2xl">{{ member.name }}</p>
              <p class="truncate text-xs text-[#666]">{{ member.email }}</p>
            </div>
          </div>
          <p class="text-lg sm:text-xl md:text-2xl">{{ member.checkInTime ?? '-' }}</p>
          <p class="inline-flex w-fit rounded-md px-3 py-1.5 text-base font-medium md:text-lg" :class="statusClass[member.status]">
            {{ statusLabel[member.status] }}
          </p>
        </article>
        </Motion>
      </div>
    </div>
    </Motion>
  </LayoutAppShell>
</template>

