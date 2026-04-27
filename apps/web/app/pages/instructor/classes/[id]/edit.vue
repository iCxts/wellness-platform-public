<script setup lang="ts">
import { Motion } from 'motion-v'

definePageMeta({ ssr: false })

const route = useRoute()
const sessionId = computed(() => String(route.params.id ?? ''))
const { data: session, isPending } = useInstructorSession(sessionId)
const { pageEnter } = useAppPageMotion()

const level = ref('Beginner')
const slotsLeft = ref(2)
const description = ref(
  'Undo the damage of your desk chair. A 45-minute flow targeting neck, shoulder, and back tension to leave you feeling taller, realigned, and recharged to tackle the rest of your workday with clarity.',
)
const focusTags = ref(['Neck & Shoulders', 'Posture Reset', 'Breathing Flow'])
const showSuccess = ref(false)

const onUpdate = () => {
  showSuccess.value = true
}
</script>

<template>
  <LayoutAppShell content-max-width="max-w-[860px]">
    <Motion v-bind="pageEnter" class="w-full min-w-0">
    <div class="relative space-y-5 pb-5 md:space-y-6">
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
          to="/instructor"
          class="absolute flex left-3 top-3 rounded-full bg-white/85 p-1.5"
        >
          <Icon
            name="ph:arrow-circle-left"
            class="h-7 w-7 text-[var(--bw-ink)]"
          />
        </NuxtLink>
        <div
          class="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1.5 text-sm font-bold text-[var(--bw-ink)]"
        >
          <Icon name="ph:camera-rotate" class="h-6 w-6" />
          Change
        </div>
      </div>

      <div class="space-y-3">
        <h1
          class="flex items-center gap-1 text-4xl font-semibold leading-none text-[var(--bw-ink)] sm:text-5xl"
        >
          {{ isPending ? 'Loading...' : session?.title }}
          <Icon name="ph:caret-right" class="h-4 w-4" />
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
            <Icon
              name="ph:caret-right"
              class="h-3.5 w-3.5 text-[var(--bw-ink)]"
            />
          </span>
          <span
            class="inline-flex items-center gap-1 rounded-full bg-[#ececec] px-3 py-2 text-sm"
          >
            <Icon name="ph:egg-crack" class="h-4 w-4 text-[#dca40b]" />
            <input
              v-model.number="slotsLeft"
              type="number"
              min="0"
              class="w-12 bg-transparent outline-none"
            />
            slots left
            <Icon name="ph:caret-right" class="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      <div class="grid gap-3 text-base md:text-lg">
        <label class="flex items-start gap-2 space-y-0">
          <Icon name="ph:timer" class="mt-1 h-6 w-6 shrink-0" />
          <div class="flex-1">
            <p class="font-medium">Time</p>
            <input
              class="mt-1 w-full rounded-xl border border-black/15 bg-white px-4 py-3"
              :value="`Today / ${session?.startTime ?? '12:15'} - ${session?.endTime ?? '13:00'} (45 min)`"
            />
          </div>
          <Icon name="ph:caret-right" class="mt-8 h-4 w-4 shrink-0" />
        </label>
        <label class="flex items-start gap-2">
          <Icon name="ph:map-pin-area" class="mt-1 h-6 w-6 shrink-0" />
          <div class="flex-1">
            <p class="font-medium">Location</p>
            <input
              class="mt-1 w-full rounded-xl border border-black/15 bg-white px-4 py-3"
              :value="`${session?.location ?? 'Wellness Center A'} ( ${session?.room ?? 'Room 4'} )`"
            />
          </div>
          <Icon name="ph:caret-right" class="mt-8 h-4 w-4 shrink-0" />
        </label>
        <div>
          <p class="font-medium">Description</p>
          <textarea
            v-model="description"
            rows="3"
            class="mt-1 w-full rounded-xl border border-black/15 bg-white px-4 py-3"
          />
        </div>
      </div>

      <div>
        <p class="mb-2 flex items-center gap-1 text-lg font-medium">
          Focus
          <Icon name="ph:caret-right" class="h-4 w-4" />
        </p>
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

      <section class="border-t border-black/10 pt-4">
        <p class="mb-3 text-lg font-medium">Instructor</p>
        <div class="flex gap-4">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=200&h=200&q=80"
            alt="Kru Ploy"
            class="h-24 w-24 shrink-0 rounded-full border border-[var(--bw-orange)] object-cover"
          />
          <div class="min-w-0 space-y-1">
            <p class="text-xl font-medium">
              Kru Ploy <span class="text-base">🇹🇭</span>
            </p>
            <p class="text-xs text-[#666]">8+ Years Exp</p>
            <p class="flex gap-1">
              <Icon name="ph:medal" class="h-6 w-6 text-[var(--bw-orange)]" />
              <Icon name="ph:medal" class="h-6 w-6 text-[var(--bw-orange)]" />
            </p>
            <p class="text-xs text-[#555]">
              &quot;Let’s melt away that desk tension together and recharge your
              energy for a brilliant afternoon&quot;
            </p>
          </div>
        </div>
      </section>

      <div
        class="bottom-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 md:static"
      >
        <button
          type="button"
          class="w-full rounded-[20px] bg-[var(--bw-orange)] px-4 py-4 text-lg font-semibold text-white md:text-xl"
          @click="onUpdate"
        >
          Update Session
        </button>
      </div>

      <Teleport to="body">
        <div
          v-if="showSuccess"
          class="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 px-4 pt-24"
          @click.self="showSuccess = false"
        >
          <div
            class="w-full max-w-[341px] rounded-[20px] bg-white p-6 text-center shadow-lg"
            role="dialog"
            aria-labelledby="instructor-success-title"
          >
            <div
              class="mx-auto mb-3 grid h-[60px] w-[60px] place-items-center rounded-full bg-[var(--bw-orange)] text-white"
            >
              <Icon name="ph:check-bold" class="h-8 w-8" />
            </div>
            <p
              id="instructor-success-title"
              class="text-xl font-semibold text-[var(--bw-orange)]"
            >
              Session updated successfully!
            </p>
            <button
              type="button"
              class="mt-6 w-full rounded-xl border border-black/10 py-2 text-sm font-medium"
              @click="showSuccess = false"
            >
              Close
            </button>
          </div>
        </div>
      </Teleport>
    </div>
    </Motion>
  </LayoutAppShell>
</template>
