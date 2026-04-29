<script setup lang="ts">
import { Motion } from 'motion-v'
import QRCode from 'qrcode'
import { fetchBookingQr } from '~/services/bookings'
definePageMeta({ ssr: false })

const route = useRoute()
const id = computed(() => String(route.query.id ?? 'hatha-stretch'))
const bookingId = computed(() => String(route.query.bookingId ?? ''))
const { data: classItem } = useClassDetail(id)
const auth = useAuth()
const qrDataUrl = ref('')
const qrError = ref('')
const isQrLoading = ref(false)

const loadBookingQr = async () => {
  qrError.value = ''
  qrDataUrl.value = ''
  const raw = bookingId.value
  if (!raw || raw === 'undefined' || raw === 'null') {
    qrError.value = 'Booking QR is unavailable for this item.'
    return
  }
  try {
    isQrLoading.value = true
    const payload = await fetchBookingQr(raw)
    qrDataUrl.value = await QRCode.toDataURL(payload.token, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 228,
    })
  } catch (error) {
    qrError.value =
      (error as { data?: { error?: string } })?.data?.error ??
      'Unable to load QR. Please refresh.'
  } finally {
    isQrLoading.value = false
  }
}

onMounted(() => {
  auth.hydrate()
  loadBookingQr()
})
</script>

<template>
  <LayoutAppShell content-max-width="max-w-[420px] md:max-w-[860px]">
    <div class="mx-auto max-w-[420px] space-y-5 pb-4 text-center">
      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35 }">
        <div class="flex justify-start">
          <button class="grid h-8 w-8 place-items-center rounded-full border border-black/20" @click="$router.back()">
            <Icon name="ph:arrow-left" class="h-5 w-5" />
          </button>
        </div>
      </Motion>

      <Motion :initial="{ opacity: 0, scale: 0.94 }" :animate="{ opacity: 1, scale: 1 }" :transition="{ duration: 0.35, delay: 0.05 }">
        <div class="mx-auto grid h-[92px] w-[92px] place-items-center rounded-full bg-[#fff1e7]">
          <div class="grid h-[68px] w-[68px] place-items-center rounded-full bg-[var(--bw-orange)] text-white">
            <Icon name="ph:check-bold" class="h-10 w-10" />
          </div>
        </div>
      </Motion>

      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35, delay: 0.1 }" class="space-y-2">
        <h1 class="text-[28px] font-semibold leading-tight">You’re all set, {{ auth.user.value?.email?.split('@')[0] ?? 'Member' }}!</h1>
        <p class="text-[12px]">Scan the QR code in the class to join</p>
      </Motion>
      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35, delay: 0.15 }">
        <div v-if="isQrLoading" class="mx-auto h-[228px] w-[228px] animate-pulse rounded-2xl bg-white/70" />
        <img v-else-if="qrDataUrl" :src="qrDataUrl" alt="QR Code" class="mx-auto h-[228px] w-[228px] rounded-2xl bg-white p-2 object-contain" />
        <div v-else class="mx-auto flex h-[228px] w-[228px] items-center justify-center rounded-2xl bg-white px-4 text-center text-xs text-[#c20000]">
          {{ qrError || 'QR unavailable' }}
        </div>
      </Motion>
      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35, delay: 0.2 }" class="space-y-2">
        <p class="text-[12px] font-semibold">Show this QR to staff to join any class.</p>
        <button class="text-[16px] font-medium text-[var(--bw-orange)] underline">Add to calendar</button>
      </Motion>

      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35, delay: 0.25 }">
        <div class="flex items-center justify-center gap-2 border-y border-black/10 py-4 text-[16px]">
          <Icon name="ph:person-simple-run" class="h-6 w-6 text-[var(--bw-orange)]" />
          <span class="text-[var(--bw-subtle)]">Classes Taken</span>
          <span class="text-[28px] text-[var(--bw-subtle)]">7</span>
          <Icon name="ph:arrow-right" class="h-7 w-7 text-[var(--bw-subtle)]" />
          <span class="text-[40px] font-semibold text-[var(--bw-orange)]">8</span>
        </div>
      </Motion>
      <Motion :initial="{ opacity: 0, y: 12 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.35, delay: 0.3 }" class="space-y-1">
        <p class="text-[12px]">Amazing! You're 80% through your monthly goal</p>
        <p v-if="classItem" class="text-[11px] text-[var(--bw-subtle)]">Booked: {{ classItem.title }}</p>
      </Motion>
    </div>
  </LayoutAppShell>
</template>
