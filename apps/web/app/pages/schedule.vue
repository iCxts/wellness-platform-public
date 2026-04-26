<script setup lang="ts">
import { ref } from 'vue'
import type { ScheduleTab } from '~/schemas/schedule'

definePageMeta({
  ssr: false,
})

const activeTab = ref<ScheduleTab>('upcoming')
const { data: scheduleItems, isPending } = useScheduleList(activeTab)
</script>

<template>
  <LayoutAppShell content-max-width="max-w-[860px]">
    <div class="space-y-5 pb-3 md:space-y-7">
      <ScheduleHeader />
      <ScheduleTabs v-model="activeTab" />

      <div v-if="isPending" class="space-y-4">
        <div
          v-for="i in 4"
          :key="i"
          class="h-[146px] animate-pulse rounded-3xl bg-white/70"
        />
      </div>

      <div v-else class="space-y-4">
        <ScheduleCard
          v-for="item in scheduleItems"
          :key="item.id"
          :item="item"
        />
      </div>
    </div>
  </LayoutAppShell>
</template>
