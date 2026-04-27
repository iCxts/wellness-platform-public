<script setup lang="ts">
definePageMeta({ ssr: false })

const draft = useAdminCreateClassDraft()
</script>

<template>
  <LayoutAppShell content-max-width="max-w-[760px]">
    <div class="mx-auto max-w-[560px] space-y-8 py-8">
      <div class="mx-auto grid h-[132px] w-[132px] place-items-center rounded-full bg-[#fbe6dd]">
        <div class="grid h-[100px] w-[100px] place-items-center rounded-full bg-[var(--bw-orange)] text-6xl text-white">✓</div>
      </div>

      <div class="text-center">
        <h1 class="text-5xl font-semibold">New Class Created!</h1>
        <p class="mt-2 text-2xl text-[#666]">&quot;{{ draft.title }}&quot; is now live</p>
      </div>

      <section class="rounded-[30px] border border-[#ececec] bg-white p-6 shadow-[0_4px_8px_rgba(0,0,0,0.12)]">
        <div class="grid grid-cols-[120px_1fr] gap-y-4 text-3xl">
          <p class="text-[#9d9c9c]">Class</p>
          <p class="font-medium text-[var(--bw-ink)]">{{ draft.title }}</p>
          <p class="text-[#9d9c9c]">Instructor</p>
          <p class="font-medium text-[var(--bw-ink)]">{{ draft.instructorName }}</p>
          <p class="text-[#9d9c9c]">Location</p>
          <p class="font-medium text-[var(--bw-ink)]">{{ draft.zone }}</p>
        </div>
      </section>

      <div class="grid gap-3 sm:grid-cols-2">
        <NuxtLink to="/admin/classes/create" class="rounded-[16px] border border-[var(--bw-orange)] px-4 py-3 text-center text-xl font-medium text-[var(--bw-orange)]">
          Add More Classes
        </NuxtLink>
        <NuxtLink to="/admin" class="rounded-[16px] bg-[var(--bw-orange)] px-4 py-3 text-center text-xl font-medium text-white">
          Back to Schedule
        </NuxtLink>
      </div>
    </div>
  </LayoutAppShell>
</template>

