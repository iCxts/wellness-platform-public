<script setup lang="ts">
import { Motion } from 'motion-v'

definePageMeta({ ssr: false })

const draft = useAdminCreateClassDraft()
const { pageEnter, listStagger } = useAppPageMotion()
const selectedCategory = computed({
  get: () => draft.value.category,
  set: (value: string) => {
    draft.value.category = value
  },
})

const categories = [
  'Yoga & Pilates',
  'HIIT & Strength',
  'Cardio & Dance',
  'Combat & Boxing',
  'Stretching & Core',
  'Personal',
]
</script>

<template>
  <LayoutAppShell content-max-width="max-w-[840px]">
    <Motion v-bind="pageEnter" class="w-full min-w-0">
    <div class="space-y-6 pb-4 md:space-y-7">
      <header class="flex items-center gap-3">
        <NuxtLink to="/admin" class="grid h-8 w-8 place-items-center rounded-full text-[var(--bw-ink)]">
          <Icon name="ph:arrow-circle-left" class="h-7 w-7" />
        </NuxtLink>
        <h1 class="text-[28px] font-bold text-[var(--bw-ink)] md:text-[32px]">What to do ?</h1>
      </header>

      <div class="flex gap-1.5">
        <div class="h-1.5 w-16 rounded bg-[var(--bw-orange)]" />
        <div class="h-1.5 w-16 rounded bg-[#666]" />
        <div class="h-1.5 w-16 rounded bg-[#666]" />
        <div class="h-1.5 w-16 rounded bg-[#666]" />
      </div>

      <div class="grid gap-4 sm:grid-cols-2 md:gap-5">
        <Motion
          v-for="(category, index) in categories"
          :key="category"
          v-bind="listStagger(index)"
        >
        <button
          type="button"
          class="h-full w-full rounded-[20px] border border-[rgba(87,84,84,0.17)] bg-white p-5 text-left shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-colors md:min-h-[190px]"
          :class="selectedCategory === category ? 'bg-[var(--bw-orange)] text-white' : 'text-[var(--bw-ink)]'"
          @click="selectedCategory = category"
        >
          <div class="mb-5 grid h-20 w-20 place-items-center rounded-2xl bg-white/15 text-5xl">
            <span v-if="category.includes('Yoga')">🧘</span>
            <span v-else-if="category.includes('Strength')">🏋️</span>
            <span v-else-if="category.includes('Cardio')">🏃</span>
            <span v-else-if="category.includes('Combat')">🥊</span>
            <span v-else-if="category.includes('Stretching')">🌿</span>
            <span v-else>🎯</span>
          </div>
          <p class="text-2xl font-bold leading-tight">{{ category }}</p>
        </button>
        </Motion>
      </div>

      <div class="sticky bottom-[calc(env(safe-area-inset-bottom)+0.5rem)] flex justify-end pt-3 md:static">
        <NuxtLink
          to="/admin/classes/create/class-details"
          class="w-full rounded-[20px] bg-[var(--bw-orange)] px-10 py-4 text-center text-lg font-bold text-white sm:w-auto md:min-w-[220px]"
        >
          Next Step
        </NuxtLink>
      </div>
    </div>
    </Motion>
  </LayoutAppShell>
</template>

