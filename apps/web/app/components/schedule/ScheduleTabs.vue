<script setup lang="ts">
import type { ScheduleTab } from '~/schemas/schedule'

const activeTab = defineModel<ScheduleTab>({ required: true })

const tabs: Array<{ id: ScheduleTab; label: string; icon: string }> = [
  { id: 'upcoming', label: 'Upcoming', icon: 'ph:calendar-check' },
  { id: 'history', label: 'History', icon: 'ph:check-circle' },
  { id: 'waitlist', label: 'Waitlist', icon: 'ph:hourglass-medium' },
]
</script>

<template>
  <div class="rounded-full bg-white p-1">
    <div class="grid grid-cols-3 gap-1">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors"
        :class="
          activeTab === tab.id
            ? 'bg-[var(--bw-orange)] text-white'
            : 'text-[var(--bw-ink)]'
        "
        @click="activeTab = tab.id"
      >
        <Icon :name="tab.icon" class="h-4 w-4" />
        <span>{{ tab.label }}</span>
      </button>
    </div>
  </div>
</template>
