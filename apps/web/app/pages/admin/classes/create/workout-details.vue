<script setup lang="ts">
definePageMeta({ ssr: false })

const draft = useAdminCreateClassDraft()

const intensityOptions = ['Beginner', 'Intermediate', 'Advance', 'Pre-Intermediate']
const coverImages = [
  'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1506629905607-d9fdfd53d1aa?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&w=900&q=80',
]

const availableFocus = ['Neck & Shoulders', 'Posture Reset', 'Breathing Flow', 'Core', 'Mobility']

const toggleFocus = (item: string) => {
  const has = draft.value.focus.includes(item)
  if (has) {
    draft.value.focus = draft.value.focus.filter((value) => value !== item)
    return
  }
  draft.value.focus = [...draft.value.focus, item]
}
</script>

<template>
  <LayoutAppShell content-max-width="max-w-[900px]">
    <div class="space-y-5 pb-5 md:space-y-6">
      <header class="flex items-center gap-3">
        <NuxtLink to="/admin/classes/create/when-where" class="grid h-8 w-8 place-items-center rounded-full text-[var(--bw-ink)]">
          <Icon name="ph:arrow-circle-left" class="h-7 w-7" />
        </NuxtLink>
        <h1 class="text-[28px] font-bold text-[var(--bw-ink)] md:text-[32px]">What to Workout?</h1>
      </header>

      <div class="flex gap-1.5">
        <div class="h-1.5 w-16 rounded bg-[var(--bw-orange)]" />
        <div class="h-1.5 w-16 rounded bg-[var(--bw-orange)]" />
        <div class="h-1.5 w-16 rounded bg-[var(--bw-orange)]" />
        <div class="h-1.5 w-16 rounded bg-[var(--bw-orange)]" />
      </div>

      <section class="space-y-3">
        <p class="text-2xl font-bold">Intensity</p>
        <div class="grid gap-2 sm:grid-cols-2">
          <button
            v-for="option in intensityOptions"
            :key="option"
            class="inline-flex items-center justify-center gap-2 rounded-[15px] border px-4 py-2.5 text-lg"
            :class="draft.intensity === option ? 'border-[var(--bw-orange)] bg-[var(--bw-orange)] text-white' : 'border-[#666] text-[#666]'"
            @click="draft.intensity = option"
          >
            <Icon name="ph:flame" />
            {{ option }}
          </button>
        </div>
      </section>

      <section class="space-y-3">
        <p class="text-2xl font-bold">Focus Section</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="item in availableFocus"
            :key="item"
            class="rounded-xl px-4 py-2 text-base"
            :class="draft.focus.includes(item) ? 'bg-[#e6f4ea] text-[#1e8e3e]' : 'border border-[#cfd8d3] text-[#666]'"
            @click="toggleFocus(item)"
          >
            {{ item }}
          </button>
        </div>
      </section>

      <section class="space-y-3">
        <div class="flex items-center justify-between">
          <p class="text-2xl font-bold">Hero Photo Section</p>
          <p class="text-sm font-medium underline">Add Cover Photo</p>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <button
            v-for="image in coverImages"
            :key="image"
            class="overflow-hidden rounded-[18px] border-4"
            :class="draft.coverImageUrl === image ? 'border-[var(--bw-orange)]' : 'border-transparent'"
            @click="draft.coverImageUrl = image"
          >
            <img :src="image" alt="Cover option" class="h-[140px] w-full object-cover" />
          </button>
        </div>
      </section>

      <div class="sticky bottom-[calc(env(safe-area-inset-bottom)+0.5rem)] flex justify-end pt-3 md:static">
        <NuxtLink
          to="/admin/classes/create/preview"
          class="w-full rounded-[20px] bg-[var(--bw-orange)] px-10 py-4 text-center text-lg font-bold text-white sm:w-auto md:min-w-[220px]"
        >
          Preview Class
        </NuxtLink>
      </div>
    </div>
  </LayoutAppShell>
</template>

