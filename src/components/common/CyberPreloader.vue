<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Cpu, ShieldCheck, Zap, Terminal } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useAudio } from '@/composables/useAudio'

const props = withDefaults(
  defineProps<{
    subtitle?: string
    nodeLabel?: string
  }>(),
  {
    subtitle: '<SOFTWARE ENGINEER & AI DEVELOPER/>',
    nodeLabel: 'NODE: HN_VN // AI_CORE',
  },
)

const { lang, t } = useI18n()
const { playBootChime } = useAudio()

const isVisible = ref(true)
const percent = ref(0)
let rafId: number | null = null
let startTime = 0

const stages = computed(() =>
  lang.value === 'en'
    ? [
        { threshold: 0, text: 'SYS_INIT // INITIALIZING VUE 3 ENGINE...', mem: '32MB' },
        { threshold: 25, text: '3D_ENGINE // COMPILING THREE.JS SHADERS...', mem: '64MB' },
        { threshold: 55, text: 'AI_CORE // MOUNTING NEURAL MODELS & ASP.NET...', mem: '96MB' },
        { threshold: 82, text: 'SECURITY // VERIFYING TLS 1.3 PROTOCOLS...', mem: '128MB' },
        { threshold: 100, text: 'SYSTEM READY // ACCESS GRANTED!', mem: '160MB' },
      ]
    : [
        { threshold: 0, text: 'SYS_INIT // KHỞI ĐỘNG HỆ THỐNG VUE 3...', mem: '32MB' },
        { threshold: 25, text: '3D_ENGINE // BIÊN DỊCH SHADERS THREE.JS...', mem: '64MB' },
        { threshold: 55, text: 'AI_CORE // TẢI MÔ HÌNH AI & ASP.NET CORE...', mem: '96MB' },
        { threshold: 82, text: 'SECURITY // XÁC MINH GIAO THỨC TLS 1.3...', mem: '128MB' },
        { threshold: 100, text: 'SYSTEM READY // SẴN SÀNG KHÁM PHÁ!', mem: '160MB' },
      ],
)

const currentStage = computed(() => {
  let active = stages.value[0]
  for (const s of stages.value) {
    if (percent.value >= s.threshold) active = s
  }
  return active
})

const finish = () => {
  if (!isVisible.value) return
  if (rafId !== null) cancelAnimationFrame(rafId)
  percent.value = 100
  playBootChime()
  setTimeout(() => {
    isVisible.value = false
  }, 240)
}

const runLoader = () => {
  if (rafId !== null) cancelAnimationFrame(rafId)
  isVisible.value = true
  percent.value = 0
  startTime = performance.now()
  const duration = 1100

  const tick = (now: number) => {
    const progress = Math.min(1, (now - startTime) / duration)
    // Smooth ease-out cubic
    percent.value = Math.round((1 - Math.pow(1 - progress, 3)) * 100)
    if (progress < 1) {
      rafId = requestAnimationFrame(tick)
    } else {
      finish()
    }
  }
  rafId = requestAnimationFrame(tick)
}

const onKeyDown = (e: KeyboardEvent) => {
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes((document.activeElement as HTMLElement)?.tagName)) return
  if (isVisible.value && (e.key === 'Escape' || e.code === 'Space')) {
    e.preventDefault()
    finish()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  runLoader()
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  if (rafId !== null) cancelAnimationFrame(rafId)
})

defineExpose({ replay: runLoader })
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isVisible"
      role="status"
      aria-label="Loading system"
      class="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_45%,#0d2854_0%,#07172e_60%,#030b17_100%)] text-sky-50"
    >
      <!-- Corner HUD Telemetry -->
      <div class="pointer-events-none absolute top-5 left-5 hidden items-center gap-2 font-mono text-xs text-cyan-400/75 sm:flex">
        <span>┌</span>
        <Terminal class="h-3.5 w-3.5" />
        <span>SYS_BOOT // VUE_4.0</span>
      </div>
      <div class="pointer-events-none absolute top-5 right-5 hidden items-center gap-2 font-mono text-xs text-cyan-400/75 sm:flex">
        <span>{{ props.nodeLabel }}</span>
        <span>┐</span>
      </div>
      <div class="pointer-events-none absolute bottom-5 left-5 hidden items-center gap-2 font-mono text-xs text-sky-300/60 sm:flex">
        <span>└ PORTFOLIO // TRỌNG MIN</span>
      </div>
      <div class="pointer-events-none absolute right-5 bottom-5 hidden items-center gap-2 font-mono text-xs text-sky-300/60 sm:flex">
        <span>60 FPS // TLS_1.3 ┘</span>
      </div>

      <!-- Central Holographic Core -->
      <div class="relative z-10 flex w-full max-w-md flex-col items-center px-6">
        <div class="relative mb-7 flex h-32 w-32 items-center justify-center">
          <div class="animate-spin-slow absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/45" />
          <div class="animate-spin-reverse absolute inset-3 rounded-full border-2 border-sky-400/60 border-t-transparent" />
          <div class="flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-300/60 bg-cyan-400/10 shadow-[0_0_30px_rgba(0,245,255,0.35)] backdrop-blur-md">
            <span class="font-mono text-lg font-bold tracking-wider text-cyan-300">&lt;TM/&gt;</span>
          </div>
        </div>

        <h1 class="text-center font-heading text-3xl font-bold tracking-[0.18em] text-white">TRỌNG MIN</h1>
        <p class="mt-1.5 font-mono text-xs tracking-widest text-cyan-300/90">{{ props.subtitle }}</p>

        <!-- Progress Bar -->
        <div class="mt-8 w-full">
          <div class="mb-2 flex items-center justify-between font-mono text-[11px]">
            <span class="truncate pr-2 text-sky-200">{{ currentStage.text }}</span>
            <span class="font-bold text-cyan-300">{{ percent }}%</span>
          </div>
          <div class="h-2 w-full overflow-hidden rounded-full border border-cyan-400/30 bg-slate-900/80">
            <div
              class="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-teal-300 shadow-[0_0_16px_rgba(0,245,255,0.8)] transition-[width] duration-75"
              :style="{ width: `${percent}%` }"
            />
          </div>
          <div class="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-sky-300/70">
            <span class="flex items-center gap-1"><Cpu class="h-3 w-3 text-cyan-400" /> MEM: {{ currentStage.mem }}</span>
            <span class="flex items-center gap-1"><ShieldCheck class="h-3 w-3 text-emerald-400" /> SECURE</span>
            <span class="flex items-center gap-1"><Zap class="h-3 w-3 text-amber-400" /> ACTIVE</span>
          </div>
        </div>

        <button
          type="button"
          class="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1.5 font-mono text-xs text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/20"
          @click="finish"
        >
          <span>{{ t('loader_skip') }}</span>
          <kbd class="rounded bg-slate-900/80 px-1.5 py-0.5 text-[10px] text-cyan-300">ESC</kbd>
        </button>
      </div>
    </div>
  </Transition>
</template>
