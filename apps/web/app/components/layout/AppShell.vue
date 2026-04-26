<script setup lang="ts">
defineProps<{ contentMaxWidth?: string }>()
</script>

<template>
  <div
    class="max-h-dvh overflow-x-hidden overflow-y-auto bg-[#f4f4f4] text-[var(--bw-ink)]"
  >
    <div class="md:flex md:items-start">
      <LayoutDesktopSidebar />
      <main class="flex-1">
        <div
          class="mx-auto px-4 pb-28 pt-5 md:px-10 md:pb-10 md:pt-10"
          :class="contentMaxWidth ?? 'max-w-[1100px]'"
        >
          <slot />
        </div>
      </main>
    </div>
    <LayoutMobileBottomNav />
  </div>
</template>
