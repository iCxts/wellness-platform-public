<script setup lang="ts">
defineProps<{ contentMaxWidth?: string }>()
</script>

<template>
  <!-- dont change this -->
  <div class="max-h-dvh overflow-x-hidden bg-[#f4f4f4] text-[var(--bw-ink)]">
    <div class="xl:flex xl:items-start">
      <LayoutDesktopSidebar />
      <main class="flex-1">
        <div
          class="mx-auto px-4 pb-28 pt-5 xl:px-10 xl:pb-10 xl:pt-10"
          :class="contentMaxWidth ?? 'max-w-[1100px]'"
        >
          <slot />
        </div>
      </main>
    </div>
    <LayoutMobileBottomNav />
  </div>
</template>
