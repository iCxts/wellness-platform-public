<script setup lang="ts">
definePageMeta({ ssr: false })

const { data: summary, isPending } = useAdminDashboardSummary()
</script>

<template>
  <LayoutAppShell content-max-width="max-w-[860px]">
    <div class="space-y-5 pb-4 md:space-y-6">
      <header class="flex items-center gap-3">
        <NuxtLink to="/admin" class="grid h-8 w-8 place-items-center rounded-full text-[var(--bw-ink)]">
          <Icon name="ph:arrow-circle-left" class="h-7 w-7" />
        </NuxtLink>
        <h1 class="text-[28px] font-bold text-[var(--bw-ink)] md:text-[32px]">Dashboard</h1>
      </header>

      <div class="flex flex-wrap gap-2 md:gap-2.5">
        <button class="rounded-lg border border-[#666] px-4 py-2 text-sm text-[#666]">This Week</button>
        <button class="rounded-lg border border-[#666] px-4 py-2 text-sm text-[#666]">This Month</button>
        <button class="rounded-lg border border-[#666] px-4 py-2 text-sm text-[#666]">All time</button>
      </div>

      <section class="rounded-xl border border-[#d8d8d8] bg-white p-4 md:p-5">
        <svg viewBox="0 0 360 250" class="h-auto w-full" role="img" aria-label="Attendance trend chart placeholder">
          <rect x="0" y="0" width="360" height="250" fill="#fff" />
          <g stroke="#d8d8d8" stroke-width="1">
            <line v-for="y in [30, 70, 110, 150, 190, 230]" :key="`h-${y}`" x1="30" :y1="y" x2="338" :y2="y" />
            <line v-for="x in [30, 92, 154, 216, 278, 338]" :key="`v-${x}`" :x1="x" y1="30" :x2="x" y2="230" />
          </g>
          <polyline
            fill="none"
            stroke="#ff6727"
            stroke-width="3"
            points="30,170 92,100 154,145 216,92 278,108 338,98"
          />
          <g fill="#ff6727">
            <circle v-for="x in [30, 92, 154, 216, 278, 338]" :key="`p-${x}`" :cx="x" cy="230" r="4" />
          </g>
        </svg>
      </section>

      <div class="grid gap-4 md:grid-cols-2 md:gap-5">
        <section class="rounded-xl border border-[#d8d8d8] bg-white p-5 md:col-span-2">
          <p class="text-center text-xl font-medium text-[var(--bw-ink)] md:text-2xl">No-show rate</p>
          <div class="mt-4 flex justify-center">
            <div class="relative h-32 w-60 md:h-40 md:w-72">
              <div class="absolute inset-0 rounded-t-[999px] border-[24px] border-b-0 border-[#666]" />
              <div class="absolute inset-0 rounded-t-[999px] border-[24px] border-b-0 border-[var(--bw-orange)] [clip-path:inset(0_40%_0_0)]" />
              <p class="absolute bottom-1 left-1/2 -translate-x-1/2 text-5xl font-medium text-[var(--bw-orange)] md:text-6xl">
                {{ isPending ? '--' : `${summary?.noShowRatePercent}%` }}
              </p>
            </div>
          </div>
        </section>

        <section class="rounded-xl border border-[#d8d8d8] bg-white p-5">
          <p class="text-xl font-medium text-[var(--bw-ink)] md:text-2xl">Total attendance</p>
          <p class="mt-3 text-6xl font-medium text-[var(--bw-orange)] md:text-7xl">{{ isPending ? '--' : summary?.attendanceTotal }}</p>
          <p class="mt-2 flex items-center gap-1 text-sm md:text-base"><Icon name="ph:arrow-up" class="h-4 w-4 text-[#1e8e3e]" /> 12% Increased</p>
        </section>

        <section class="rounded-xl border border-[#d8d8d8] bg-white p-5">
          <p class="text-xl font-medium text-[var(--bw-ink)] md:text-2xl">Total classes held</p>
          <p class="mt-3 text-6xl font-medium text-[var(--bw-orange)] md:text-7xl">{{ isPending ? '--' : summary?.classesHeldTotal }}</p>
          <p class="mt-2 flex items-center gap-1 text-sm md:text-base"><Icon name="ph:arrow-up" class="h-4 w-4 text-[#1e8e3e]" /> 12% Increased</p>
        </section>

        <section class="rounded-xl border border-[#d8d8d8] bg-white p-5 md:col-span-2">
          <p class="text-center text-xl font-medium text-[var(--bw-ink)] md:text-2xl">Total bookings</p>
          <div class="mt-3 flex flex-col items-center justify-center gap-2 md:flex-row md:gap-6">
            <p class="text-6xl font-medium text-[var(--bw-orange)] md:text-7xl">{{ isPending ? '--' : summary?.bookingsTotal }}</p>
            <p class="flex items-center gap-1 text-lg md:text-2xl"><Icon name="ph:arrow-up" class="h-5 w-5 text-[#1e8e3e]" /> 12% Increased</p>
          </div>
        </section>
      </div>
    </div>
  </LayoutAppShell>
</template>

