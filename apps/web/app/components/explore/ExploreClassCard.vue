<script setup lang="ts">
import type { ClassItem } from '~/schemas/explore'

const props = defineProps<{ item: ClassItem }>()
const liked = ref(false)

const detailLink = computed(() =>
  props.item.status === 'full'
    ? `/class/${props.item.id}?mode=queue`
    : `/class/${props.item.id}?mode=booking`,
)
</script>

<template>
  <NuxtLink
    :to="detailLink"
    class="block min-w-0 overflow-hidden rounded-[22px] bg-white ring-1 ring-black/5"
  >
    <div class="relative h-[124px]">
      <img :src="item.heroImage" :alt="item.title" class="h-full w-full object-cover" />
      <button
        type="button"
        class="absolute left-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full bg-white/95"
        @click.prevent="liked = !liked"
      >
        <Icon :name="liked ? 'ph:heart-fill' : 'ph:heart'" class="h-4 w-4" :class="liked ? 'text-[var(--bw-orange)]' : 'text-black'" />
      </button>
    </div>

    <div class="min-w-0 p-3">
      <div class="flex items-center justify-between gap-2">
        <p class="truncate text-[13px] font-medium text-[var(--bw-ink)]">{{ item.startTime }} - {{ item.endTime }}</p>
        <span
          class="rounded-lg px-2 py-0.5 text-[10px] font-semibold"
          :class="
            item.status === 'available'
              ? 'bg-[#e6f4ea] text-[#1e8e3e]'
              : 'bg-[#f3e4e0] text-[#cb0000]'
          "
        >
          {{ item.status === 'available' ? 'Available' : 'Full' }}
        </span>
      </div>

      <h3 class="mt-1.5 line-clamp-2 text-[17px] font-semibold leading-[1.15] text-[var(--bw-ink)]">
        {{ item.title }}
      </h3>

      <div class="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px]">
        <span class="inline-flex items-center gap-1 rounded-md bg-[#f1f1f1] px-2 py-1 text-[var(--bw-ink)]">
          <Icon name="ph:flame" class="h-3 w-3 text-[var(--bw-orange)]" />
          {{ item.level }}
        </span>
        <span class="inline-flex items-center gap-1 rounded-md bg-[#f1f1f1] px-2 py-1 text-[var(--bw-ink)]">
          <Icon name="ph:timer" class="h-3 w-3 text-[var(--bw-yellow)]" />
          {{ item.slotsLeft }} slots left
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
