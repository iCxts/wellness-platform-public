<script setup lang="ts">
import { Motion } from 'motion-v'

definePageMeta({ ssr: false })

const route = useRoute()
const scannedCode = computed(() => String(route.query.code ?? 'BWELL-CHECKIN-001'))
</script>

<template>
  <LayoutAppShell content-max-width="max-w-[420px] md:max-w-[860px]">
    <div class="mx-auto max-w-[420px] space-y-5 pb-4 text-center">
      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35 }">
        <div class="flex justify-start">
          <button class="grid h-8 w-8 place-items-center rounded-full border border-black/20" @click="$router.back()">
            <Icon name="ph:arrow-left" class="h-5 w-5" />
          </button>
        </div>
      </Motion>

      <Motion :initial="{ opacity: 0, scale: 0.94 }" :animate="{ opacity: 1, scale: 1 }" :transition="{ duration: 0.35, delay: 0.05 }">
        <div class="mx-auto grid h-[92px] w-[92px] place-items-center rounded-full bg-[#eefbf2]">
          <div class="grid h-[68px] w-[68px] place-items-center rounded-full bg-[#21a366] text-white">
            <Icon name="ph:check-bold" class="h-10 w-10" />
          </div>
        </div>
      </Motion>

      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35, delay: 0.1 }" class="space-y-2">
        <h1 class="text-[28px] font-semibold leading-tight">Check in complete</h1>
        <p class="text-[12px] text-[var(--bw-subtle)]">Welcome in! Your attendance has been recorded.</p>
      </Motion>

      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35, delay: 0.15 }">
        <div class="rounded-[24px] border border-black/10 bg-white px-5 py-4 text-left">
          <p class="text-[11px] text-[var(--bw-subtle)]">Scanned Code</p>
          <p class="mt-1 truncate text-[16px] font-semibold text-[var(--bw-ink)]">{{ scannedCode }}</p>
          <p class="mt-3 text-[11px] text-[var(--bw-subtle)]">Time</p>
          <p class="mt-1 text-[14px] font-medium text-[var(--bw-ink)]">
            {{ new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
          </p>
        </div>
      </Motion>

      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35, delay: 0.2 }" class="space-y-3 pt-1">
        <NuxtLink
          to="/check-in"
          class="mx-auto flex h-[52px] w-full items-center justify-center rounded-[18px] border border-[var(--bw-orange)] text-[16px] font-semibold text-[var(--bw-orange)]"
        >
          Scan another code
        </NuxtLink>
        <NuxtLink
          to="/"
          class="mx-auto flex h-[52px] w-full items-center justify-center rounded-[18px] bg-[var(--bw-orange)] text-[16px] font-semibold text-white"
        >
          Back to home
        </NuxtLink>
      </Motion>
    </div>
  </LayoutAppShell>
</template>
