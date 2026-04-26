<template>
  <header class="flex items-center justify-between gap-3">
    <button
      type="button"
      class="grid h-8 w-8 place-items-center rounded-full border border-black/20 bg-white text-[var(--bw-ink)] md:h-10 md:w-10"
      aria-label="Back"
      @click="$router.back()"
    >
      <Icon name="ph:arrow-left" class="h-5 w-5 md:h-6 md:w-6" />
    </button>

    <h1 class="text-[1.65rem] font-semibold text-[var(--bw-ink)] md:text-[2rem]">
      My Schedule
    </h1>

    <button
      type="button"
      class="grid h-8 w-8 place-items-center rounded-full text-[var(--bw-ink)] md:h-10 md:w-10"
      aria-label="Notifications"
    >
      <Icon name="ph:bell" class="h-6 w-6" />
    </button>
  </header>
</template>
