<script setup lang="ts">
import { Motion } from 'motion-v'

definePageMeta({ ssr: false })

const route = useRoute()
const sessionId = computed(() => String(route.params.id ?? ''))
const { data: session, isPending } = useAdminSession(sessionId)
const { pageEnter } = useAppPageMotion()

const level = ref('Beginner')
const slotsLeft = ref(2)
const description = ref(
  'Undo the damage of your desk chair. A 45-minute flow targeting neck, shoulder, and back tension.',
)
const focusTags = ref(['Neck & Shoulders', 'Posture Reset', 'Breathing Flow'])
</script>

<template>
  <LayoutAppShell content-max-width="max-w-[860px]">
    <Motion v-bind="pageEnter" class="w-full min-w-0">
    <div class="space-y-5 pb-5 md:space-y-6">
      <div
        class="relative h-[220px] overflow-hidden rounded-[20px] sm:h-[240px] md:h-[280px]"
      >
        <img
          :src="
            session?.imageUrl ??
            'https://www.figma.com/api/mcp/asset/22377b52-159d-4e36-8ade-0a08516b2b06'
          "
          :alt="session?.title ?? 'Class cover'"
          class="h-full w-full object-cover"
        />
        <NuxtLink
          to="/admin"
          class="flex absolute left-3 top-3 rounded-full bg-white/85 p-1.5"
        >
          <Icon
            name="ph:arrow-circle-left"
            class="h-7 w-7 text-[var(--bw-ink)]"
          />
        </NuxtLink>
      </div>

      <div class="space-y-3">
        <h1
          class="text-4xl font-semibold leading-none text-[var(--bw-ink)] sm:text-5xl"
        >
          {{ isPending ? 'Loading...' : session?.title }}
        </h1>
        <div class="flex flex-wrap gap-2">
          <span
            class="inline-flex items-center gap-1 rounded-full bg-[#ececec] px-3 py-2 text-sm"
          >
            <Icon name="ph:flame" class="h-4 w-4 text-[var(--bw-orange)]" />
            <select v-model="level" class="bg-transparent outline-none">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </span>
          <span
            class="inline-flex items-center gap-1 rounded-full bg-[#ececec] px-3 py-2 text-sm"
          >
            <Icon name="ph:egg-crack" class="h-4 w-4 text-[#dca40b]" />
            <input
              v-model.number="slotsLeft"
              type="number"
              min="0"
              class="w-16 bg-transparent outline-none"
            />
            slots left
          </span>
        </div>
      </div>

      <div class="grid gap-3 text-base md:text-lg">
        <label class="space-y-1">
          <p class="font-medium">Time</p>
          <input
            class="w-full rounded-xl border border-black/15 bg-white px-4 py-3"
            :value="`${session?.dateLabel ?? 'Today'} / ${session?.startTime ?? '12:15'} - ${session?.endTime ?? '13:00'}`"
          />
        </label>
        <label class="space-y-1">
          <p class="font-medium">Location</p>
          <input
            class="w-full rounded-xl border border-black/15 bg-white px-4 py-3"
            :value="`${session?.location ?? 'Wellness Center A'} ( ${session?.room ?? 'Room 4'} )`"
          />
        </label>
        <label class="space-y-1">
          <p class="font-medium">Description</p>
          <textarea
            v-model="description"
            rows="3"
            class="w-full rounded-xl border border-black/15 bg-white px-4 py-3"
          />
        </label>
      </div>

      <div>
        <p class="mb-2 text-lg font-medium">Focus</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(tag, index) in focusTags"
            :key="tag"
            class="inline-flex items-center gap-1 rounded-lg bg-[#e6f4ea] px-3 py-1.5 text-sm text-[#1e8e3e]"
          >
            {{ tag }}
            <button
              type="button"
              class="text-[#1e8e3e]/70"
              @click="focusTags.splice(index, 1)"
            >
              <Icon name="ph:x" class="h-3.5 w-3.5" />
            </button>
          </span>
        </div>
      </div>

      <div
        class="bottom-[calc(env(safe-area-inset-bottom)+0.5rem)] grid gap-3 sm:grid-cols-2 md:static"
      >
        <button
          class="rounded-[20px] border border-[#666] bg-white px-4 py-4 text-lg font-medium text-[#666] md:text-xl"
        >
          Delete Session
        </button>
        <button
          class="rounded-[20px] bg-[var(--bw-orange)] px-4 py-4 text-lg font-semibold text-white md:text-xl"
        >
          Update Session
        </button>
      </div>
    </div>
    </Motion>
  </LayoutAppShell>
</template>
