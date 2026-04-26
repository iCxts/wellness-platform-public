<script setup lang="ts">
import { Motion } from 'motion-v'
import type { ProfileMenuItem } from '~/schemas/profile'

definePageMeta({ ssr: false })

const router = useRouter()
const showLogoutSheet = ref(false)
const { data: profileData, isPending } = useProfileData()

const profileUser = computed(() => ({
  name: profileData.value?.user.name ?? '...',
  company: profileData.value?.user.company ?? '',
  avatarUrl:
    profileData.value?.user.avatarUrl ??
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=200&h=200&q=80',
}))

const menuItems = computed(() => profileData.value?.menuItems ?? [])

const handleMenuAction = async (item: ProfileMenuItem) => {
  if (item.action === 'logout') {
    showLogoutSheet.value = true
    return
  }

  if (item.to) {
    await router.push(item.to)
  }
}

const confirmLogout = async () => {
  showLogoutSheet.value = false
  await router.push('/login')
}

const closeLogoutSheet = () => {
  showLogoutSheet.value = false
}
</script>

<template>
  <LayoutAppShell content-max-width="" class="overflow-hidden">
    <div class="scale-110 origin-top -mt-5">
      <div class="mx-auto w-full max-w-[393px] space-y-0 bg-[#f1f1f1] pb-4">
        <Motion
          :initial="{ opacity: 0, y: 12 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.35 }"
          class="relative min-h-[402px] overflow-hidden rounded-b-[48px] bg-[var(--bw-orange)] px-6 pb-16 pt-5 text-white"
        >
          <header class="flex items-center justify-between">
            <button
              v-if="showLogoutSheet"
              type="button"
              class="grid h-8 w-8 place-items-center rounded-full text-black/90 transition-colors hover:bg-black/10"
              aria-label="Close logout dialog"
              @click="closeLogoutSheet"
            >
              <Icon name="ph:arrow-circle-left" class="h-7 w-7" />
            </button>
            <div v-else class="h-8 w-8" />
            <h1 class="text-base font-medium text-black">PROFILE</h1>
            <button
              type="button"
              class="grid h-8 w-8 place-items-center rounded-full text-black/90 transition-colors hover:bg-black/10"
              aria-label="Notifications"
            >
              <Icon name="ph:bell" class="h-6 w-6" />
            </button>
          </header>

          <div class="mt-8 flex flex-col items-center">
            <div class="relative h-[120px] w-[120px] rounded-full">
              <img
                :src="profileUser.avatarUrl"
                :alt="profileUser.name"
                class="h-full w-full rounded-full object-cover"
              />
              <button
                type="button"
                class="absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full border border-black/25 bg-[#f4f4f4] text-black"
                aria-label="Edit profile photo"
              >
                <Icon name="ph:pencil-simple" class="h-4 w-4" />
              </button>
            </div>

            <p class="mt-4 text-[1.75rem] font-semibold leading-none">
              {{ profileUser.name }}
            </p>
            <p class="mt-1 text-[0.75rem] font-medium text-white/95">
              {{ profileUser.company }}
            </p>
          </div>
        </Motion>

        <div class="px-5 relative translate-y-[-10%]">
          <Motion
            :initial="{ opacity: 0, y: 18 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.36, delay: 0.06 }"
            class="-mt-12 rounded-[30px] bg-white px-5 pb-8 pt-6"
          >
            <div v-if="isPending" class="space-y-3 py-2">
              <div
                v-for="item in 6"
                :key="item"
                class="h-[52px] animate-pulse rounded-2xl bg-white/60"
              />
            </div>

            <ul v-else class="space-y-0">
              <li
                v-for="item in menuItems"
                :key="item.id"
                class="border-b border-black/15"
              >
                <button
                  type="button"
                  class="flex w-full items-center gap-4 px-1 py-[15px] text-left"
                  @click="handleMenuAction(item)"
                >
                  <Icon
                    :name="item.icon"
                    class="h-[22px] w-[22px] text-black/90"
                  />
                  <span class="flex-1 text-[1rem] font-medium text-black">{{
                    item.label
                  }}</span>
                  <Icon
                    name="ph:caret-right"
                    class="h-[22px] w-[22px] text-black/80"
                  />
                </button>
              </li>
            </ul>
          </Motion>
        </div>
      </div>
    </div>
  </LayoutAppShell>

  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="showLogoutSheet"
      class="fixed inset-0 z-[100001] flex items-end bg-[rgba(65,65,65,0.4)]"
      @click.self="closeLogoutSheet"
    >
      <Motion
        :initial="{ y: 80, opacity: 0 }"
        :animate="{ y: 0, opacity: 1 }"
        :transition="{ duration: 0.25 }"
        class="mx-auto w-full max-w-[393px] rounded-t-[30px] bg-white px-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3"
      >
        <div class="mx-auto h-[2px] w-[126px] rounded-full bg-[#575454]" />
        <h2 class="mt-4 text-center text-[2rem] font-medium text-black">
          Logout
        </h2>
        <div class="mt-3 border-t border-black/10 pt-4">
          <p class="text-center text-[0.875rem] text-[var(--bw-subtle)]">
            Are you sure you want to logout?
          </p>
        </div>
        <div class="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            class="h-[55px] rounded-[20px] border border-[#666] text-[1rem] font-medium text-[#666]"
            @click="confirmLogout"
          >
            Yes. Logout
          </button>
          <button
            type="button"
            class="h-[55px] rounded-[20px] bg-[var(--bw-orange)] text-[1rem] font-medium text-white"
            @click="closeLogoutSheet"
          >
            Cancel
          </button>
        </div>
      </Motion>
    </div>
  </Transition>
</template>
