<script setup lang="ts">
import { Motion } from 'motion-v'

definePageMeta({ ssr: false })

const route = useRoute()
const sessionId = computed(() => String(route.params.id ?? ''))

const { data: session } = useInstructorSession(sessionId)
const { data: members, isPending: membersLoading } =
  useInstructorMembers(sessionId)
const { data: waitlist, isPending: waitlistLoading } =
  useInstructorWaitlist(sessionId)

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

const { pageEnter, listStagger } = useAppPageMotion()
const mainMemberCount = computed(() => members.value?.length ?? 0)
</script>

<template>
  <LayoutAppShell content-max-width="max-w-[940px]">
    <Motion v-bind="pageEnter" class="w-full min-w-0">
    <div class="space-y-4 pb-8 md:space-y-5">
      <NuxtLink
        to="/instructor"
        class="inline-grid h-8 w-8 place-items-center rounded-full text-[var(--bw-ink)]"
      >
        <Icon name="ph:arrow-circle-left" class="h-7 w-7" />
      </NuxtLink>

      <h1
        class="text-4xl font-bold leading-none text-[var(--bw-ink)] sm:text-5xl md:text-6xl"
      >
        {{ session?.title ?? 'Class Members' }}
      </h1>

      <p class="flex items-center gap-2 text-lg sm:text-xl md:text-2xl">
        <Icon name="ph:timer" class="h-6 w-6" />
        {{ session?.startTime }} - {{ session?.endTime }}
      </p>
      <p class="flex items-center gap-2 text-lg sm:text-xl md:text-2xl">
        <Icon name="ph:map-pin-area" class="h-6 w-6" />
        {{ session?.location }} / {{ session?.room }}
      </p>
      <NuxtLink
        :to="`/check-in?sessionId=${sessionId}`"
        class="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--bw-orange)] px-4 text-sm font-semibold text-white"
      >
        <Icon name="ph:qr-code" class="h-5 w-5" />
        Scan QR for this class
      </NuxtLink>

      <div
        class="hidden grid-cols-[1.4fr_1fr_0.8fr] border-b border-black/10 px-2 pb-2 text-sm font-medium md:grid"
      >
        <p>Members</p>
        <p class="text-center">Check in time</p>
        <p class="text-end">Status</p>
      </div>

      <div v-if="membersLoading" class="space-y-2">
        <div
          v-for="i in 8"
          :key="i"
          class="h-14 animate-pulse rounded-xl bg-white/70"
        />
      </div>

      <div v-else class="space-y-0">
        <Motion
          v-for="(member, index) in members"
          :key="member.id"
          v-bind="listStagger(index)"
        >
        <article
          class="flex items-center justify-between items-center gap-3 border-b border-black/10 py-3 sm:grid-cols-[1.2fr_1fr] md:grid-cols-[1.4fr_1fr_0.8fr] md:px-2"
        >
          <div class="flex min-w-0 items-center gap-2.5">
            <img
              :src="member.avatarUrl"
              :alt="member.name"
              class="h-10 w-10 rounded-full border border-black/10 object-cover"
            />
            <div class="min-w-0">
              <a
                :href="`mailto:${member.email}`"
                class="block truncate text-lg font-medium sm:text-xl md:text-2xl"
                >{{ member.name }}</a
              >
              <p class="truncate text-xs text-[#666]">{{ member.email }}</p>
            </div>
          </div>
          <p class="text-center text-lg sm:text-xl md:text-2xl">
            {{ member.checkInTime ?? '—' }}
          </p>
          <p
            class="inline-flex w-fit justify-self-end rounded-md px-3 py-1.5 text-base font-medium md:text-lg"
            :class="statusClass[member.status]"
          >
            {{ statusLabel[member.status] }}
          </p>
        </article>
        </Motion>
      </div>

      <p class="pt-2 text-center">
        <button
          type="button"
          class="text-sm font-medium text-[var(--bw-ink)] underline decoration-solid"
        >
          Remind all Pending members
        </button>
      </p>

      <h2 class="pt-4 text-2xl font-bold text-[var(--bw-ink)]">Waiting List</h2>

      <div v-if="waitlistLoading" class="space-y-2">
        <div
          v-for="i in 2"
          :key="i"
          class="h-14 animate-pulse rounded-xl bg-white/70"
        />
      </div>

      <div v-else class="space-y-0">
        <Motion
          v-for="(w, index) in waitlist"
          :key="w.id"
          v-bind="listStagger(mainMemberCount + index)"
        >
        <article
          class="flex items-center justify-between items-center gap-3 border-b border-black/10 py-3 sm:grid-cols-[1.2fr_1fr] md:grid-cols-[1.4fr_1fr_0.8fr] md:px-2"
        >
          <div class="flex min-w-0 items-center gap-2.5">
            <img
              :src="w.avatarUrl"
              :alt="w.name"
              class="h-10 w-10 rounded-full border border-black/10 object-cover"
            />
            <div class="min-w-0">
              <p class="truncate text-lg font-medium sm:text-xl md:text-2xl">
                {{ w.name }}
              </p>
              <p class="truncate text-xs text-[#666]">{{ w.email }}</p>
            </div>
          </div>
          <p class="text-center text-lg sm:text-xl md:text-2xl">
            #{{ w.position }}
          </p>
          <p
            class="inline-flex w-[75px] justify-self-end rounded-md bg-[#ffb800] px-2 py-1.5 text-center text-sm font-medium text-[var(--bw-ink)]"
          >
            Standby
          </p>
        </article>
        </Motion>
      </div>
    </div>
    </Motion>
  </LayoutAppShell>
</template>
