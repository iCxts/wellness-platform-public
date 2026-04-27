<script setup lang="ts">
import { Motion } from 'motion-v'

definePageMeta({ ssr: false })

const draft = useAdminCreateClassDraft()
const { pageEnter } = useAppPageMotion()

const categoryEmoji = computed(() => {
  if (draft.value.category.includes('Yoga')) return '🧘'
  if (draft.value.category.includes('Strength')) return '🏋️'
  if (draft.value.category.includes('Cardio')) return '🏃'
  if (draft.value.category.includes('Combat')) return '🥊'
  if (draft.value.category.includes('Stretching')) return '🌿'
  return '🎯'
})
</script>

<template>
  <LayoutAppShell content-max-width="max-w-[840px]">
    <Motion v-bind="pageEnter" class="w-full min-w-0">
    <div class="space-y-6 pb-4 md:space-y-7">
      <header class="flex items-center gap-3">
        <NuxtLink to="/admin/classes/create" class="grid h-8 w-8 place-items-center rounded-full text-[var(--bw-ink)]">
          <Icon name="ph:arrow-circle-left" class="h-7 w-7" />
        </NuxtLink>
        <h1 class="text-[28px] font-bold text-[var(--bw-ink)] md:text-[32px]">What the class ?</h1>
      </header>

      <div class="flex gap-1.5">
        <div class="h-1.5 w-16 rounded bg-[var(--bw-orange)]" />
        <div class="h-1.5 w-16 rounded bg-[var(--bw-orange)]" />
        <div class="h-1.5 w-16 rounded bg-[#666]" />
        <div class="h-1.5 w-16 rounded bg-[#666]" />
      </div>

      <div class="flex items-center gap-3 rounded-2xl bg-white p-4">
        <span class="text-5xl">{{ categoryEmoji }}</span>
        <p class="text-4xl font-bold text-[var(--bw-ink)]">{{ draft.category }}</p>
      </div>

      <label class="block space-y-2">
        <p class="text-2xl font-bold">Enter Class Name</p>
        <input v-model="draft.title" class="w-full rounded-[20px] border border-[#d9d9d9] bg-[#f8f8f8] px-4 py-4 text-lg text-[#666]" />
      </label>

      <label class="block space-y-2">
        <p class="text-2xl font-bold">Write the description of the class</p>
        <textarea
          v-model="draft.description"
          rows="6"
          class="w-full rounded-[20px] border border-[#d9d9d9] bg-[#f8f8f8] px-4 py-4 text-base text-[#666]"
        />
      </label>

      <div class="sticky bottom-[calc(env(safe-area-inset-bottom)+0.5rem)] flex justify-end pt-3 md:static">
        <NuxtLink
          to="/admin/classes/create/when-where"
          class="w-full rounded-[20px] bg-[var(--bw-orange)] px-10 py-4 text-center text-lg font-bold text-white sm:w-auto md:min-w-[220px]"
        >
          Next Step
        </NuxtLink>
      </div>
    </div>
    </Motion>
  </LayoutAppShell>
</template>

