<script setup lang="ts">
import { Motion } from 'motion-v'

definePageMeta({ ssr: false })

type ScanTab = 'check-in' | 'check-out'
type ScanState = 'idle' | 'requesting' | 'scanning' | 'scanned' | 'error'

interface BarcodeDetectorLike {
  detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue?: string }>>
}

const router = useRouter()
const activeTab = ref<ScanTab>('check-in')
const scanState = ref<ScanState>('idle')
const errorMessage = ref('')
const scannedCode = ref('')
const cameraReady = ref(false)
const shouldFlipPreview = ref(false)

const videoRef = ref<HTMLVideoElement | null>(null)
let stream: MediaStream | null = null
let rafId: number | null = null
let lastDetectTs = 0
let detector: BarcodeDetectorLike | null = null

const tabItems: { id: ScanTab; label: string }[] = [
  { id: 'check-in', label: 'Check in' },
  { id: 'check-out', label: 'Check out' },
]

const goBack = async () => {
  if (window.history.length > 1) {
    await router.back()
    return
  }
  await router.push('/')
}

const stopScanner = () => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
    stream = null
  }
  cameraReady.value = false
}

const handleScanned = async (value: string) => {
  scanState.value = 'scanned'
  scannedCode.value = value
  stopScanner()

  await nextTick()
  const target =
    activeTab.value === 'check-in'
      ? `/check-in-success?code=${encodeURIComponent(value)}`
      : `/check-out-success?code=${encodeURIComponent(value)}`

  setTimeout(() => {
    router.push(target)
  }, 350)
}

const scanLoop = async (ts: number) => {
  if (!videoRef.value || !detector || scanState.value !== 'scanning') return

  // Throttle detector calls for smoother preview.
  if (ts - lastDetectTs > 280) {
    lastDetectTs = ts
    try {
      const barcodes = await detector.detect(videoRef.value)
      const code = barcodes.find((entry) => entry.rawValue)?.rawValue
      if (code) {
        await handleScanned(code)
        return
      }
    } catch {
      // Keep scanning if one frame fails to decode.
    }
  }

  rafId = requestAnimationFrame(scanLoop)
}

const startScanner = async () => {
  if (!import.meta.client) return

  stopScanner()
  errorMessage.value = ''
  scannedCode.value = ''
  scanState.value = 'requesting'

  if (
    !('mediaDevices' in navigator) ||
    !('getUserMedia' in navigator.mediaDevices)
  ) {
    scanState.value = 'error'
    errorMessage.value = 'Camera is not available on this device/browser.'
    return
  }

  if (!('BarcodeDetector' in window)) {
    scanState.value = 'error'
    errorMessage.value = 'QR scanning is not supported in this browser yet.'
    return
  }

  try {
    const BarcodeDetectorCtor = window.BarcodeDetector as new (options?: {
      formats: string[]
    }) => BarcodeDetectorLike
    detector = new BarcodeDetectorCtor({ formats: ['qr_code'] })

    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
      },
      audio: false,
    })

    if (!videoRef.value) {
      scanState.value = 'error'
      errorMessage.value = 'Camera view failed to initialize.'
      return
    }

    videoRef.value.srcObject = stream
    await videoRef.value.play()
    const activeTrack = stream.getVideoTracks()[0]
    const facingMode = activeTrack?.getSettings().facingMode
    // Some browsers mirror preview from front/unknown cameras; flip once to keep QR readable to users.
    shouldFlipPreview.value = facingMode !== 'environment'

    cameraReady.value = true
    scanState.value = 'scanning'
    rafId = requestAnimationFrame(scanLoop)
  } catch (error) {
    scanState.value = 'error'
    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Unable to access camera. Please allow permission and try again.'
  }
}

watch(activeTab, () => {
  startScanner()
})

onMounted(() => {
  startScanner()
})

onBeforeUnmount(() => {
  stopScanner()
})
</script>

<template>
  <div class="fixed inset-0 z-[60] overflow-hidden bg-black text-white">
    <video
      ref="videoRef"
      muted
      playsinline
      class="absolute inset-0 h-full w-full object-cover"
      :style="{
        transform: shouldFlipPreview ? 'scaleX(-1)' : 'none',
      }"
    />

    <div class="pointer-events-none absolute inset-0 bg-black/32" />

    <Motion
      :initial="{ opacity: 0, y: -10 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.3 }"
      class="absolute inset-x-0 top-0 px-4 pt-[max(1rem,env(safe-area-inset-top))]"
    >
      <div class="flex items-center justify-between">
        <button
          class="relative z-20 grid h-10 w-10 place-items-center rounded-full bg-black/45 backdrop-blur-sm"
          @click="goBack"
        >
          <Icon name="ph:arrow-left" class="h-6 w-6" />
        </button>
        <h1 class="text-[22px] font-semibold">Scan</h1>
        <div class="flex items-center gap-2">
          <button
            class="grid h-10 w-10 place-items-center rounded-full bg-black/45 backdrop-blur-sm"
          >
            <Icon name="ph:lightning" class="h-5 w-5" />
          </button>
          <button
            class="grid h-10 w-10 place-items-center rounded-full bg-black/45 backdrop-blur-sm"
          >
            <Icon name="ph:image" class="h-5 w-5" />
          </button>
        </div>
      </div>
    </Motion>

    <Motion
      :initial="{ opacity: 0, y: 10 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.35, delay: 0.05 }"
      class="pointer-events-none absolute inset-0 flex items-center justify-center px-6"
    >
      <div
        class="relative h-[275px] w-[275px] max-w-full rounded-[30px] border border-white/30"
      >
        <div
          class="absolute -left-[1px] -top-[1px] h-10 w-10 rounded-tl-[22px] border-l-[3px] border-t-[3px] border-white"
        />
        <div
          class="absolute -right-[1px] -top-[1px] h-10 w-10 rounded-tr-[22px] border-r-[3px] border-t-[3px] border-white"
        />
        <div
          class="absolute -bottom-[1px] -left-[1px] h-10 w-10 rounded-bl-[22px] border-b-[3px] border-l-[3px] border-white"
        />
        <div
          class="absolute -bottom-[1px] -right-[1px] h-10 w-10 rounded-br-[22px] border-b-[3px] border-r-[3px] border-white"
        />
      </div>
    </Motion>

    <Motion
      :initial="{ opacity: 0, y: 10 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.35, delay: 0.08 }"
      class="absolute inset-x-4 bottom-[calc(6.5rem+env(safe-area-inset-bottom))]"
    >
      <p
        class="rounded-full bg-black/45 px-4 py-2 text-center text-[13px] font-medium backdrop-blur-sm"
      >
        Align QR code inside the frame
      </p>
    </Motion>

    <Motion
      :initial="{ opacity: 0, y: 10 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.35, delay: 0.12 }"
      class="absolute inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <div
        class="grid grid-cols-2 rounded-[20px] border border-white/20 bg-black/40 p-1 backdrop-blur-md"
      >
        <button
          v-for="tab in tabItems"
          :key="tab.id"
          type="button"
          class="h-11 rounded-[16px] text-[15px] font-semibold transition-colors"
          :class="
            activeTab === tab.id
              ? 'bg-[var(--bw-orange)] text-white'
              : 'text-white/85'
          "
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>
    </Motion>

    <div
      v-if="scanState === 'requesting' || scanState === 'error'"
      class="absolute left-4 right-4 top-[calc(4.5rem+env(safe-area-inset-top))] rounded-xl bg-black/55 px-3 py-2 text-center text-[12px] backdrop-blur-sm"
    >
      <p v-if="scanState === 'requesting'">Requesting camera permission...</p>
      <div v-else class="space-y-2">
        <p class="text-[#ffd2d2]">{{ errorMessage }}</p>
        <button
          type="button"
          class="h-8 rounded-lg border border-white/35 px-3"
          @click="startScanner"
        >
          Retry
        </button>
      </div>
    </div>
  </div>
</template>
