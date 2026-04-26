<script setup lang="ts">
definePageMeta({
  // The whole app is behind login; render this page on the client only.
  ssr: false,
})
</script>

<template>
  <LayoutAppShell content-max-width="">
    <div class="space-y-6 md:space-y-8">
      <HomeHeader />

      <div class="grid gap-6 md:grid-cols-2 md:gap-8">
        <HomeNextSessionCard class="md:col-span-2" />

        <HomeProgressSection />
        <HomeWeekSchedule />
      </div>

      <HomeBookingsSection />
    </div>
  </LayoutAppShell>
</template>
