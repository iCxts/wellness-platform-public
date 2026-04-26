<script setup lang="ts">
const today = new Date()
const dateLabel = `Today ${today.getDate()} ${today.toLocaleString('en-US', { month: 'short' })}`
</script>

<template>
  <header class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <img
        src="https://www.figma.com/api/mcp/asset/a1029d83-0114-438d-b73a-6c6b8b6fbe94"
        alt="Profile"
        class="h-10 w-10 rounded-full object-cover"
      />
      <div>
        <p class="text-[16px] font-semibold leading-none text-[var(--bw-ink)]">Hello, PEAR</p>
        <p class="text-xs text-[var(--bw-subtle)]">{{ dateLabel }}</p>
      </div>
    </div>
    <button class="grid h-10 w-10 place-items-center rounded-full text-[var(--bw-ink)]">
      <Icon name="ph:bell" class="h-6 w-6" />
    </button>
  </header>
</template>
