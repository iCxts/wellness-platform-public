<script setup lang="ts">
const props = defineProps<{
  selectedDate?: Date
}>()

const emit = defineEmits<{
  (e: 'update:selectedDate', value: Date): void
}>()

const startOfDay = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate())

const selected = computed(() => startOfDay(props.selectedDate ?? new Date()))
const today = startOfDay(new Date())

const weekDays = computed(() =>
  Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() + index)
    return {
      date,
      key: date.toISOString(),
      label:
        index === 0
          ? 'Today'
          : date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: date.getDate(),
    }
  }),
)

const isSelected = (value: Date) =>
  startOfDay(value).getTime() === selected.value.getTime()

const onSelect = (value: Date) => {
  emit('update:selectedDate', startOfDay(value))
}
</script>

<template>
  <div class="-mx-1 overflow-x-auto pb-1 no-scrollbar">
    <div class="flex min-w-max gap-2.5 px-1">
      <button
        v-for="item in weekDays"
        :key="item.key"
        type="button"
        class="h-[78px] w-[58px] rounded-[14px] border px-2 py-2 text-center transition-colors"
        :class="
          isSelected(item.date)
            ? 'border-[var(--bw-ink)] bg-[var(--bw-ink)] text-white'
            : 'border-[var(--bw-ink)] bg-white text-[var(--bw-ink)]'
        "
        @click="onSelect(item.date)"
      >
        <p
          class="text-[12px]"
          :class="
            isSelected(item.date) ? 'text-white' : 'text-[var(--bw-subtle)]'
          "
        >
          {{ item.label }}
        </p>
        <p class="mt-1.5 text-[26px] font-semibold leading-none">
          {{ item.dayNum }}
        </p>
      </button>
    </div>
  </div>
</template>
