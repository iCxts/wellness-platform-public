<script setup lang="ts">
import { ref } from 'vue'
import { Motion } from 'motion-v'
import type { ScheduleTab } from '~/schemas/schedule'

definePageMeta({
  ssr: false,
})

const activeTab = ref<ScheduleTab>('upcoming')
const { data: scheduleItems, isPending } = useScheduleList(activeTab)
</script>

<template>
  <LayoutAppShell content-max-width="">
    <div class="space-y-5 pb-3 md:space-y-7">
      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35 }">
        <ScheduleHeader />
      </Motion>
      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35, delay: 0.06 }">
        <ScheduleTabs v-model="activeTab" />
      </Motion>

      <div v-if="isPending" class="space-y-4">
        <div
          v-for="i in 4"
          :key="i"
          class="h-[146px] animate-pulse rounded-3xl bg-white/70"
        />
      </div>

      <div v-else class="space-y-4">
        <Motion
          v-for="(item, index) in scheduleItems"
          :key="item.id"
          :initial="{ opacity: 0, y: 12 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.32, delay: 0.1 + index * 0.04 }"
        >
          <ScheduleCard :item="item" />
        </Motion>
      </div>
    </div>
  </LayoutAppShell>
</template>
