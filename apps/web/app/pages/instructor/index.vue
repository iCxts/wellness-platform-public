<script setup lang="ts">
import { Motion } from 'motion-v'

definePageMeta({ ssr: false })

const { data: sessions, isPending } = useInstructorSessions()
const { pageEnter, listStagger } = useAppPageMotion()
</script>

<template>
  <LayoutAppShell content-max-width="max-w-[980px]">
    <Motion v-bind="pageEnter" class="w-full min-w-0">
    <div class="space-y-5 md:space-y-6">
      <header class="text-center">
        <h1 class="text-[22px] font-bold text-[var(--bw-ink)] md:text-2xl">
          My Schedule
        </h1>
      </header>

      <div v-if="isPending" class="space-y-4">
        <div
          v-for="i in 4"
          :key="i"
          class="h-[146px] animate-pulse rounded-[20px] bg-white/70"
        />
      </div>

      <div v-else class="space-y-4 pb-6">
        <Motion
          v-for="(session, index) in sessions"
          :key="session.id"
          v-bind="listStagger(index)"
        >
        <article
          class="grid overflow-hidden rounded-[20px] border border-black/5 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.12)] md:grid-cols-[130px_1fr] xl:grid-cols-[140px_1fr]"
        >
          <div class="bg-[#f2f2f2] p-4 md:p-5">
            <p
              class="text-[30px] font-semibold leading-none text-[var(--bw-orange)] md:text-[32px]"
            >
              {{ session.dateLabel }}
            </p>
            <p
              class="mt-2.5 text-lg font-medium text-[var(--bw-ink)] md:mt-3 md:text-xl"
            >
              {{ session.startTime }} -{{ session.endTime }}
            </p>
          </div>

          <div class="space-y-2.5 px-4 py-3 md:space-y-3 md:px-5 md:py-4">
            <h2
              class="text-[36px] font-semibold leading-none text-[var(--bw-ink)] md:text-[38px]"
            >
              {{ session.title }}
            </h2>
            <p
              class="flex items-center gap-1.5 text-[15px] text-[#575454] md:text-base"
            >
              <Icon name="ph:map-pin-area" class="h-5 w-5" />
              {{ session.location }} / {{ session.room }}
            </p>
            <p
              class="flex items-center gap-1.5 text-[15px] text-[#575454] md:text-base"
            >
              <Icon name="ph:users-three" class="h-5 w-5" />
              {{ session.participants }}/{{ session.capacity }} Participants
            </p>
            <div class="flex flex-wrap gap-2 pt-1 md:gap-2.5">
              <NuxtLink
                :to="`/instructor/classes/${session.id}/edit`"
                class="rounded-[10px] border border-[var(--bw-orange)] px-4 py-1.5 text-sm font-medium text-[var(--bw-orange)] md:px-5"
              >
                Edit Session
              </NuxtLink>
              <NuxtLink
                :to="`/instructor/classes/${session.id}/members`"
                class="rounded-[10px] bg-[var(--bw-orange)] px-4 py-1.5 text-sm font-medium text-white md:px-5"
              >
                See member
              </NuxtLink>
            </div>
          </div>
        </article>
        </Motion>
      </div>
    </div>
    </Motion>
  </LayoutAppShell>
</template>
