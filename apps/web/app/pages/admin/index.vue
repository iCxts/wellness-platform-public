<script setup lang="ts">
definePageMeta({ ssr: false })

const { data: sessions, isPending } = useAdminSessions()
</script>

<template>
  <LayoutAppShell content-max-width="max-w-[980px]">
    <div class="space-y-5 md:space-y-6">
      <header class="flex items-center justify-between gap-3">
        <h1
          class="text-[28px] font-bold leading-none text-[var(--bw-ink)] md:text-[32px]"
        >
          All Class
        </h1>
        <div class="flex items-center gap-2">
          <NuxtLink
            to="/admin/dashboard"
            class="grid h-10 w-10 place-items-center rounded-full border-2 border-black text-black md:h-11 md:w-11"
            aria-label="Go to dashboard"
          >
            <Icon name="ph:chart-line-up-bold" class="h-5 w-5" />
          </NuxtLink>
          <NuxtLink
            to="/admin/classes/create"
            class="grid h-10 w-10 place-items-center rounded-full border-2 border-black text-black md:h-11 md:w-11"
            aria-label="Create class"
          >
            <Icon name="ph:plus-bold" class="h-5 w-5" />
          </NuxtLink>
        </div>
      </header>

      <div v-if="isPending" class="space-y-4">
        <div
          v-for="i in 4"
          :key="i"
          class="h-[146px] animate-pulse rounded-[20px] bg-white/70"
        />
      </div>

      <div v-else class="space-y-4 pb-6">
        <article
          v-for="session in sessions"
          :key="session.id"
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
                :to="`/admin/classes/${session.id}/edit`"
                class="rounded-[10px] border border-[var(--bw-orange)] px-4 py-1.5 text-sm font-medium text-[var(--bw-orange)] md:px-5"
              >
                Edit Session
              </NuxtLink>
              <NuxtLink
                :to="`/admin/classes/${session.id}/members`"
                class="rounded-[10px] bg-[var(--bw-orange)] px-4 py-1.5 text-sm font-medium text-white md:px-5"
              >
                See Member
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </div>
  </LayoutAppShell>
</template>
