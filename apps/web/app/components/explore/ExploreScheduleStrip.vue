<template>
  <div class="-mx-1 overflow-x-auto pb-1 no-scrollbar">
    <div class="flex min-w-max gap-2.5 px-1">
      <div class="h-[78px] w-[58px] rounded-[14px] border border-[var(--bw-ink)] bg-white px-2 py-2 text-center">
        <p class="text-[12px] font-medium text-[var(--bw-ink)]">Today</p>
        <p class="mt-1.5 text-[26px] font-semibold leading-none text-[var(--bw-ink)]">5</p>
      </div>
      <div class="h-[78px] w-[58px] rounded-[14px] border border-[var(--bw-ink)] bg-[var(--bw-ink)] px-2 py-2 text-center text-white">
        <p class="text-[12px]">Mon</p>
        <p class="mt-1.5 text-[26px] font-semibold leading-none">6</p>
      </div>
      <div
        v-for="item in [
          ['Tue', 7],
          ['Wed', 8],
          ['Thu', 9],
          ['Fri', 10],
          ['Sat', 11],
          ['Sun', 12],
        ]"
        :key="item[0]"
        class="h-[78px] w-[58px] rounded-[14px] border border-[var(--bw-ink)] bg-white px-2 py-2 text-center"
      >
        <p class="text-[12px] text-[var(--bw-subtle)]">{{ item[0] }}</p>
        <p class="mt-1.5 text-[26px] font-semibold leading-none text-[var(--bw-ink)]">{{ item[1] }}</p>
      </div>
    </div>
  </div>
</template>
