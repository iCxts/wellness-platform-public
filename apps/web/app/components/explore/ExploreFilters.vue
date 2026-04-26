<script setup lang="ts">
import type { ExploreFilter } from '~/schemas/explore'

const activeFilter = defineModel<ExploreFilter>({ required: true })
const filters: ExploreFilter[] = [
  'All',
  'Yoga & Pilates',
  'HIIT & Strength',
  'Cardio & Dance',
  'Stretching',
]
</script>

<template>
  <div class="-mx-1 overflow-x-auto pb-1 no-scrollbar">
    <div class="flex min-w-max gap-2.5 px-1">
      <button
        v-for="filter in filters"
        :key="filter"
        type="button"
        class="h-9 whitespace-nowrap rounded-[15px] border px-3.5 text-[13px] font-medium transition-colors"
        :class="
          activeFilter === filter
            ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
            : 'border-[#cfcfcf] bg-white text-[#5a5a5a] hover:border-[#1a1a1a]'
        "
        @click="activeFilter = filter"
      >
        {{ filter }}
      </button>
    </div>
  </div>
</template>
