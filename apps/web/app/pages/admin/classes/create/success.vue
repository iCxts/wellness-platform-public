<script setup lang="ts">
import { Motion } from 'motion-v'

definePageMeta({ ssr: false })

const draft = useAdminCreateClassDraft()
const { pageEnter } = useAppPageMotion()
</script>

<template>
  <LayoutAppShell content-max-width="max-w-[760px]">
    <Motion v-bind="pageEnter" class="w-full min-w-0">
    <div class="mx-auto max-w-[560px] space-y-5 py-5 md:space-y-8 md:py-8">
      <div class="mx-auto grid h-[96px] w-[96px] place-items-center rounded-full bg-[#fbe6dd] md:h-[132px] md:w-[132px]">
        <div class="grid h-[74px] w-[74px] place-items-center rounded-full bg-[var(--bw-orange)] text-4xl text-white md:h-[100px] md:w-[100px] md:text-6xl">✓</div>
      </div>

      <div class="text-center">
        <h1 class="text-[46px] font-semibold leading-[0.95] md:text-5xl">New Class Created!</h1>
        <p class="mt-2 text-[28px] text-[#666] md:text-2xl">&quot;{{ draft.title }}&quot; is now live</p>
      </div>

      <section class="rounded-[24px] border border-[#ececec] bg-white p-5 shadow-[0_4px_8px_rgba(0,0,0,0.12)] md:rounded-[30px] md:p-6">
        <div class="grid grid-cols-[112px_1fr] items-start gap-x-2 gap-y-4 text-[22px] leading-tight md:grid-cols-[120px_1fr] md:text-3xl">
          <p class="text-[#9d9c9c]">Class</p>
          <p class="font-medium text-[var(--bw-ink)] break-words">{{ draft.title }}</p>
          <p class="text-[#9d9c9c]">Instructor</p>
          <p class="font-medium text-[var(--bw-ink)] break-words">{{ draft.instructorName }}</p>
          <p class="text-[#9d9c9c]">Location</p>
          <p class="font-medium text-[var(--bw-ink)] break-words">{{ draft.zone }}</p>
        </div>
      </section>

      <div class="grid gap-3 sm:grid-cols-2">
        <NuxtLink to="/admin/classes/create" class="rounded-[16px] border border-[var(--bw-orange)] px-4 py-3 text-center text-lg font-medium text-[var(--bw-orange)] md:text-xl">
          Add More Classes
        </NuxtLink>
        <NuxtLink to="/admin" class="rounded-[16px] bg-[var(--bw-orange)] px-4 py-3 text-center text-lg font-medium text-white md:text-xl">
          Back to Schedule
        </NuxtLink>
      </div>
    </div>
    </Motion>
  </LayoutAppShell>
</template>

