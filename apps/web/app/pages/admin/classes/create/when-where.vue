<script setup lang="ts">
import { Motion } from 'motion-v'

definePageMeta({ ssr: false })

const draft = useAdminCreateClassDraft()
const { pageEnter } = useAppPageMotion()
const zonesQuery = useAdminZones()
const zones = computed(() => zonesQuery.data.value ?? [])
const fallbackZones = [
  { id: 'fallback:wellness-center-a', name: 'Wellness Center A' },
  { id: 'fallback:wellness-center-b', name: 'Wellness Center B' },
  { id: 'fallback:wellness-center-c', name: 'Wellness Center C' },
]
const zonesToRender = computed(() =>
  zones.value.length > 0 ? zones.value : fallbackZones,
)

const days = [
  { label: 'Sun', day: 5 },
  { label: 'Mon', day: 6 },
  { label: 'Tue', day: 7 },
  { label: 'Wed', day: 8 },
  { label: 'Thu', day: 9 },
  { label: 'Fri', day: 10 },
]
const selectedDay = ref(days[0]?.day ?? 5)

const rooms = ['Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5']

const durationMin = computed(() => {
  const [sh = 0, sm = 0] = draft.value.startTime.split(':').map(Number)
  const [eh = 0, em = 0] = draft.value.endTime.split(':').map(Number)
  return Math.max(0, eh * 60 + em - (sh * 60 + sm))
})

const selectZone = (zone: { id: string; name: string }) => {
  draft.value.zoneId = zone.id
  draft.value.zone = zone.name
}

const selectDay = (day: number) => {
  selectedDay.value = day
  draft.value.dateISO = `2026-05-${String(day).padStart(2, '0')}`
}

watchEffect(() => {
  if (draft.value.zoneId) return
  const firstZone = zonesToRender.value[0]
  if (!firstZone) return
  draft.value.zoneId = firstZone.id
  draft.value.zone = firstZone.name
})

watchEffect(() => {
  const iso = draft.value.dateISO
  if (!iso.startsWith('2026-05-')) return
  const parsedDay = Number(iso.slice(-2))
  if (days.some((d) => d.day === parsedDay)) {
    selectedDay.value = parsedDay
  }
})
</script>

<template>
  <LayoutAppShell content-max-width="max-w-[860px]">
    <Motion v-bind="pageEnter" class="w-full min-w-0">
      <div class="space-y-5 pb-5 md:space-y-6">
        <header class="flex items-center gap-3">
          <NuxtLink
            to="/admin/classes/create/class-details"
            class="grid h-8 w-8 place-items-center rounded-full text-[var(--bw-ink)]"
          >
            <Icon name="ph:arrow-circle-left" class="h-7 w-7" />
          </NuxtLink>
          <h1 class="text-[28px] font-bold text-[var(--bw-ink)] md:text-[32px]">
            When &amp; Where?
          </h1>
        </header>

        <div class="flex gap-1.5">
          <div class="h-1.5 w-16 rounded bg-[var(--bw-orange)]" />
          <div class="h-1.5 w-16 rounded bg-[var(--bw-orange)]" />
          <div class="h-1.5 w-16 rounded bg-[var(--bw-orange)]" />
          <div class="h-1.5 w-16 rounded bg-[#666]" />
        </div>

        <div class="rounded-xl bg-white p-4">
          <p class="text-center text-xl font-medium">MAY</p>
          <div class="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
            <button
              v-for="item in days"
              :key="item.day"
              type="button"
              class="rounded-2xl border px-3 py-3 text-center"
              :class="
                selectedDay === item.day
                  ? 'border-[#040036] bg-[#040036] text-white'
                  : 'border-[#040036] text-[#040036]'
              "
              @click="selectDay(item.day)"
            >
              <p class="text-sm">{{ item.label }}</p>
              <p class="text-3xl font-semibold">{{ item.day }}</p>
            </button>
          </div>
        </div>

        <section
          class="space-y-3 rounded-xl border border-black/10 bg-white p-4"
        >
          <p class="text-2xl font-bold">Time Selection</p>
          <div class="grid gap-3 sm:grid-cols-2">
            <label class="space-y-1">
              <p class="text-sm text-[#666]">Start</p>
              <input
                v-model="draft.startTime"
                type="time"
                class="w-full rounded-xl border border-[#666]/30 px-3 py-2"
              />
            </label>
            <label class="space-y-1">
              <p class="text-sm text-[#666]">End</p>
              <input
                v-model="draft.endTime"
                type="time"
                class="w-full rounded-xl border border-[#666]/30 px-3 py-2"
              />
            </label>
          </div>
          <p class="text-center text-lg font-medium">
            {{ draft.startTime }} - {{ draft.endTime }}
            <span class="text-[var(--bw-orange)]">{{ durationMin }} min</span>
          </p>
        </section>

        <section
          class="space-y-3 rounded-xl border border-black/10 bg-white p-4"
        >
          <div class="flex items-center justify-between">
            <p class="text-2xl font-bold">Place Selection</p>
            <p class="text-sm font-medium underline">Add new Place</p>
          </div>

          <p class="text-sm font-medium">Zone</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="zone in zonesToRender"
              :key="zone.id"
              class="rounded-lg border px-3 py-2 text-sm"
              :class="
                draft.zoneId === zone.id
                  ? 'border-[var(--bw-orange)] bg-[var(--bw-orange)] text-white'
                  : 'border-[#666] text-[#666]'
              "
              @click="selectZone(zone)"
            >
              {{ zone.name }}
            </button>
          </div>

          <p class="pt-1 text-sm font-medium">Room</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="room in rooms"
              :key="room"
              class="rounded-lg border px-3 py-2 text-sm"
              :class="
                draft.room === room
                  ? 'border-[var(--bw-orange)] bg-[var(--bw-orange)] text-white'
                  : 'border-[#666] text-[#666]'
              "
              @click="draft.room = room"
            >
              {{ room }}
            </button>
          </div>

          <div class="pt-1">
            <p class="text-sm font-medium">Capacity</p>
            <div class="mt-2 flex items-center justify-center gap-6">
              <button
                class="grid h-10 w-10 place-items-center rounded-full bg-[#ddd] text-2xl"
                @click="draft.capacity = Math.max(1, draft.capacity - 1)"
              >
                -
              </button>
              <p class="text-6xl font-bold">{{ draft.capacity }}</p>
              <button
                class="grid h-10 w-10 place-items-center rounded-full bg-[#ddd] text-2xl"
                @click="draft.capacity = draft.capacity + 1"
              >
                +
              </button>
            </div>
          </div>
        </section>

        <div
          class="bottom-[calc(env(safe-area-inset-bottom)+0.5rem)] flex justify-end pt-3 md:static"
        >
          <NuxtLink
            to="/admin/classes/create/workout-details"
            class="w-full rounded-[20px] bg-[var(--bw-orange)] px-10 py-4 text-center text-lg font-bold text-white sm:w-auto md:min-w-[220px]"
          >
            Next Step
          </NuxtLink>
        </div>
      </div>
    </Motion>
  </LayoutAppShell>
</template>
