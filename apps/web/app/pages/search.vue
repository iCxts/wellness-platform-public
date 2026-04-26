<script setup lang="ts">
import { Motion } from 'motion-v'
import type { ExploreFilter } from '~/schemas/explore'

definePageMeta({ ssr: false })

const activeFilter = ref<ExploreFilter>('All')
const { data: classes, isPending } = useExploreClasses(activeFilter)
</script>

<template>
  <LayoutAppShell content-max-width="">
    <div class="space-y-5 md:space-y-7">
      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35 }">
        <ExploreHeader />
      </Motion>
      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35, delay: 0.05 }">
        <ExploreScheduleStrip />
      </Motion>
      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35, delay: 0.1 }">
        <ExploreFilters v-model="activeFilter" />
      </Motion>

      <div
        v-if="isPending"
        class="grid grid-cols-2 gap-3.5 md:grid-cols-3 lg:grid-cols-4 md:gap-4"
      >
        <div
          v-for="i in 6"
          :key="i"
          class="h-[244px] animate-pulse rounded-[22px] bg-white/70"
        />
      </div>

      <div
        v-else
        class="grid grid-cols-2 gap-3.5 pb-4 md:grid-cols-3 lg:grid-cols-4 md:gap-4"
      >
        <Motion
          v-for="(item, index) in classes"
          :key="item.id"
          :initial="{ opacity: 0, y: 12 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.32, delay: 0.12 + index * 0.04 }"
        >
          <ExploreClassCard :item="item" />
        </Motion>
      </div>
    </div>
  </LayoutAppShell>
</template>
