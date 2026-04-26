<script setup lang="ts">
import { Motion } from 'motion-v'
definePageMeta({ ssr: false })

const route = useRoute()
const router = useRouter()
const id = computed(() => String(route.params.id ?? 'morning-reset'))
const mode = computed(() => (route.query.mode === 'queue' ? 'queue' : 'booking'))
const { data: classItem, isPending } = useClassDetail(id)

const ctaLabel = computed(() => (mode.value === 'queue' ? 'Join Queue' : 'Book now'))
const ctaClass = computed(() =>
  mode.value === 'queue'
    ? 'border border-[var(--bw-orange)] bg-white text-[var(--bw-orange)]'
    : 'bg-[var(--bw-orange)] text-white',
)

const onPrimary = () => {
  if (mode.value === 'queue') {
    router.push(`/queue-success?id=${id.value}`)
    return
  }
  router.push(`/booking-success?id=${id.value}`)
}
</script>

<template>
  <LayoutAppShell content-max-width="max-w-[420px] md:max-w-[860px]">
    <article v-if="classItem" class="space-y-4 pb-3 md:space-y-6">
      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35 }">
        <div class="relative -mx-4 h-[242px] overflow-hidden md:mx-0 md:rounded-3xl">
          <img :src="classItem.heroImage" :alt="classItem.title" class="h-full w-full object-cover" />
          <div class="absolute inset-0 bg-black/10" />
          <div class="absolute left-3 top-3 flex gap-1">
            <button class="grid h-8 w-8 place-items-center rounded-full bg-white/90" @click="$router.back()">
              <Icon name="ph:arrow-left" class="h-6 w-6" />
            </button>
          </div>
          <div class="absolute right-3 top-3 flex gap-2">
            <button class="grid h-8 w-8 place-items-center rounded-full bg-white/90">
              <Icon name="ph:heart" class="h-6 w-6" />
            </button>
            <button class="grid h-8 w-8 place-items-center rounded-full bg-white/90">
              <Icon name="ph:share-network" class="h-6 w-6" />
            </button>
          </div>
          <h2 class="absolute bottom-3 right-4 text-[20px] font-bold text-white md:text-[26px]">
            {{ classItem.title }}
          </h2>
        </div>
      </Motion>

      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35, delay: 0.05 }">
        <h1 class="text-[32px] font-semibold leading-none">{{ classItem.title }}</h1>
      </Motion>

      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35, delay: 0.1 }">
        <div class="flex flex-wrap gap-2 text-[14px] font-medium">
          <span class="inline-flex items-center gap-2 rounded-2xl bg-[#ececec] px-3 py-1.5">
            <Icon name="ph:flame" class="h-4 w-4 text-[var(--bw-orange)]" />
            {{ classItem.level }}
          </span>
          <span class="inline-flex items-center gap-2 rounded-2xl bg-[#ececec] px-3 py-1.5">
            <Icon name="ph:timer" class="h-4 w-4 text-[var(--bw-yellow)]" />
            {{ classItem.slotsLeft }} slots left
          </span>
        </div>
      </Motion>

      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35, delay: 0.15 }" class="space-y-2 text-[16px]">
        <p class="flex items-center gap-2"><Icon name="ph:timer" class="h-7 w-7" />{{ classItem.dateLabel }} / {{ classItem.startTime }} - {{ classItem.endTime }} ({{ classItem.durationMin }} min)</p>
        <p class="flex items-center gap-2"><Icon name="ph:map-pin-simple-area" class="h-7 w-7" />{{ classItem.location }} ({{ classItem.room }})</p>
      </Motion>

      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35, delay: 0.2 }" class="text-[12px] leading-[1.4]">
        {{
          mode === 'queue'
            ? 'This dynamic intermediate session syncs breath with movement to undo the desk hunch. Reset your posture, strengthen your core, and leave feeling taller and recharged for the afternoon.'
            : 'Undo the damage of your desk chair. A 45-minute flow targeting neck, shoulder, and back tension to leave you feeling taller, realigned, and recharged to tackle the rest of your workday with clarity.'
        }}
      </Motion>

      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35, delay: 0.25 }">
      <section>
        <h3 class="mb-2 text-[16px] font-medium">Focus</h3>
        <div class="flex flex-wrap gap-2">
          <span v-for="focus in classItem.focus" :key="focus" class="rounded-xl bg-[#e6f4ea] px-3 py-1.5 text-[10px] text-[#1e8e3e]">
            {{ focus }}
          </span>
        </div>
      </section>
      </Motion>

      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35, delay: 0.3 }">
      <section>
        <h3 class="mb-2 text-[16px] font-medium">Instructor</h3>
        <div class="flex items-start gap-3">
          <img :src="classItem.trainerAvatar" :alt="classItem.trainer" class="h-24 w-24 rounded-full border border-[var(--bw-orange)] object-cover" />
          <div>
            <p class="text-[18px] font-medium">{{ classItem.trainer }} {{ classItem.trainerFlagEmoji }}</p>
            <p class="text-[10px]">{{ classItem.trainerExp }}</p>
            <p class="mt-2 text-[10px]">
              {{
                mode === 'queue'
                  ? "\"Let's turn your workday stress into graceful energy. Expect a challenge but always with a smile! See you on the mat.\""
                  : "\"Let's melt away that desk tension together and recharge your energy for a brilliant afternoon\""
              }}
            </p>
          </div>
        </div>
      </section>
      </Motion>

      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35, delay: 0.35 }">
        <button
          class="h-[55px] w-full rounded-[20px] text-[16px] font-semibold"
          :class="ctaClass"
          @click="onPrimary"
        >
          {{ ctaLabel }}
        </button>
      </Motion>
    </article>

    <div v-else-if="isPending" class="space-y-4">
      <div class="h-[242px] animate-pulse rounded-3xl bg-white/70" />
      <div class="h-12 w-1/2 animate-pulse rounded bg-white/70" />
    </div>
  </LayoutAppShell>
</template>
