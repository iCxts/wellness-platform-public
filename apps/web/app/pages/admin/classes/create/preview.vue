<script setup lang="ts">
import { Motion } from 'motion-v'

definePageMeta({ ssr: false })

const draft = useAdminCreateClassDraft()
const { pageEnter } = useAppPageMotion()
</script>

<template>
  <LayoutAppShell content-max-width="max-w-[860px]">
    <Motion v-bind="pageEnter" class="w-full min-w-0">
    <div class="space-y-5 pb-5 md:space-y-6">
      <div class="relative h-[220px] overflow-hidden rounded-[20px] sm:h-[240px] md:h-[280px]">
        <img :src="draft.coverImageUrl" alt="Class cover" class="h-full w-full object-cover" />
        <NuxtLink to="/admin/classes/create/workout-details" class="absolute left-3 top-3 rounded-full bg-white/85 p-1.5">
          <Icon name="ph:arrow-circle-left" class="h-7 w-7 text-[var(--bw-ink)]" />
        </NuxtLink>
      </div>

      <div class="space-y-3">
        <h1 class="text-4xl font-semibold leading-none text-[var(--bw-ink)] sm:text-5xl">{{ draft.title }}</h1>
        <div class="flex flex-wrap gap-2">
          <span class="inline-flex items-center gap-1 rounded-full bg-[#ececec] px-3 py-2 text-sm">
            <Icon name="ph:flame" class="h-4 w-4 text-[var(--bw-orange)]" />
            {{ draft.intensity }}
          </span>
          <span class="inline-flex items-center gap-1 rounded-full bg-[#ececec] px-3 py-2 text-sm">
            <Icon name="ph:egg-crack" class="h-4 w-4 text-[#dca40b]" />
            2 slots left
          </span>
        </div>
      </div>

      <div class="grid gap-2 text-lg">
        <p class="flex items-center gap-2"><Icon name="ph:timer" class="h-6 w-6" /> APR 5 / {{ draft.startTime }} - {{ draft.endTime }} (45 min)</p>
        <p class="flex items-center gap-2"><Icon name="ph:map-pin-area" class="h-6 w-6" /> {{ draft.zone }} ( {{ draft.room }} )</p>
      </div>

      <p class="text-lg">{{ draft.description }}</p>

      <div>
        <p class="mb-2 text-2xl font-medium">Focus</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in draft.focus"
            :key="tag"
            class="inline-flex items-center gap-1 rounded-lg bg-[#e6f4ea] px-3 py-1.5 text-sm text-[#1e8e3e]"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <section class="grid gap-4 rounded-2xl border border-black/10 bg-white p-4 sm:grid-cols-[96px_1fr]">
        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=200&h=200&q=80" alt="Instructor avatar" class="h-24 w-24 rounded-full border border-[var(--bw-orange)] object-cover" />
        <div class="space-y-1.5">
          <p class="text-4xl font-medium leading-none">{{ draft.instructorName }} <span class="text-xl">🇹🇭</span></p>
          <p class="text-sm">{{ draft.instructorExp }}</p>
          <p class="text-sm text-[#555]">&quot;Let’s melt away that desk tension together and recharge your energy for a brilliant afternoon&quot;</p>
        </div>
      </section>

      <div class="sticky bottom-[calc(env(safe-area-inset-bottom)+0.5rem)] flex justify-end pt-3 md:static">
        <NuxtLink
          to="/admin/classes/create/success"
          class="w-full rounded-[20px] bg-[var(--bw-orange)] px-10 py-4 text-center text-lg font-bold text-white sm:w-auto md:min-w-[260px]"
        >
          Confirm New Class!
        </NuxtLink>
      </div>
    </div>
    </Motion>
  </LayoutAppShell>
</template>

