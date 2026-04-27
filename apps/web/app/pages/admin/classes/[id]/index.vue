<script setup lang="ts">
definePageMeta({ ssr: false })

const route = useRoute()
await navigateTo(`/admin/classes/${String(route.params.id ?? '')}/edit`, { replace: true })
</script>

<template>
  <div />
</template>

