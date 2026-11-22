<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
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

const techModules = [
  { name: 'Vue 3', icon: 'logos:vue', threshold: 10 },
  { name: 'TypeScript', icon: 'logos:typescript-icon', threshold: 28 },
  { name: 'ASP.NET', icon: 'logos:dotnet', threshold: 48 },
  { name: 'AI Core', icon: 'logos:python', threshold: 68 },
  { name: 'Three.js', icon: 'skill-icons:threejs-dark', threshold: 85 },
]

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

// SVG circular progress ring (r = 68 -> circumference ~ 427.25)
const ringCircumference = 2 * Math.PI * 68
const ringDashOffset = computed(() => ringCircumference * (1 - percent.value / 100))

const finish = () => {
  if (!isVisible.value) return
  if (rafId !== null) cancelAnimationFrame(rafId)
  percent.value = 100
  playBootChime()
  setTimeout(() => {
    isVisible.value = false
  }, 260)
}

const runLoader = () => {
  if (rafId !== null) cancelAnimationFrame(rafId)
  isVisible.value = true
  percent.value = 0
  startTime = performance.now()
  const duration = 1250

  const tick = (now: number) => {
    const progress = Math.min(1, (now - startTime) / duration)
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
      class="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_40%,#0e3166_0%,#07172e_58%,#030b17_100%)] text-sky-50"
    >
      <!-- Ambient Grid & Radial Glows -->
      <div
        class="pointer-events-none absolute inset-0 opacity-25"
        style="
          background-image: linear-gradient(to right, rgba(56, 189, 248, 0.14) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.14) 1px, transparent 1px);
          background-size: 44px 44px;
        "
      />
      <div class="pointer-events-none absolute top-1/3 left-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/15 blur-[110px]" />

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

      <!-- Central Holographic Boot Hub -->
      <div class="relative z-10 flex w-full max-w-lg flex-col items-center px-6">
        <!-- Top Status Pill & Signal Waveform -->
        <div class="mb-4 flex items-center gap-3 rounded-full border border-cyan-400/35 bg-slate-900/60 px-4 py-1.5 backdrop-blur-md">
          <span class="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          <span class="font-mono text-[11px] font-semibold tracking-widest text-cyan-300">
            NEURAL_LINK // {{ percent >= 100 ? 'CONNECTED' : 'SYNCING' }}
          </span>
          <!-- Mini Animated Waveform -->
          <span class="flex h-3 items-end gap-0.5">
            <span class="w-0.5 animate-pulse rounded-full bg-cyan-400" style="height: 45%; animation-delay: 0ms" />
            <span class="w-0.5 animate-pulse rounded-full bg-sky-400" style="height: 100%; animation-delay: 120ms" />
            <span class="w-0.5 animate-pulse rounded-full bg-cyan-300" style="height: 65%; animation-delay: 240ms" />
            <span class="w-0.5 animate-pulse rounded-full bg-emerald-400" style="height: 90%; animation-delay: 360ms" />
          </span>
        </div>

        <!-- Module Tech Stack Boot Strip (fills top area dynamically) -->
        <div class="mb-7 flex flex-wrap items-center justify-center gap-2">
          <div
            v-for="mod in techModules"
            :key="mod.name"
            class="flex items-center gap-1.5 rounded-xl border px-2.5 py-1 font-mono text-[11px] transition-all duration-300"
            :class="
              percent >= mod.threshold
                ? 'scale-100 border-cyan-400/55 bg-cyan-400/15 text-sky-100 shadow-[0_0_14px_rgba(0,245,255,0.22)]'
                : 'scale-95 border-sky-400/15 bg-slate-900/40 text-sky-300/40 opacity-50'
            "
          >
            <Icon :icon="mod.icon" class="h-3.5 w-3.5" />
            <span>{{ mod.name }}</span>
          </div>
        </div>

        <!-- Enhanced Holographic Gyro Core + SVG Progress Ring -->
        <div class="relative mb-6 flex h-40 w-40 items-center justify-center">
          <!-- 4 Corner Crosshairs -->
          <span class="pointer-events-none absolute -top-2 -left-2 font-mono text-xs text-cyan-400/60">+</span>
          <span class="pointer-events-none absolute -top-2 -right-2 font-mono text-xs text-cyan-400/60">+</span>
          <span class="pointer-events-none absolute -bottom-2 -left-2 font-mono text-xs text-cyan-400/60">+</span>
          <span class="pointer-events-none absolute -right-2 -bottom-2 font-mono text-xs text-cyan-400/60">+</span>

          <!-- Radar Sweep Glow -->
          <div
            class="animate-spin-slow pointer-events-none absolute inset-2 rounded-full opacity-35"
            style="background: conic-gradient(from 0deg, transparent 0deg, transparent 260deg, rgba(0, 245, 255, 0.7) 360deg)"
          />

          <!-- Outer Orbit Ring with Glowing Satellite Dots -->
          <div class="animate-spin-slow absolute inset-0 rounded-full border border-dashed border-cyan-400/45">
            <span class="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_10px_#00f5ff]" />
            <span class="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-purple-400 shadow-[0_0_8px_#a78bfa]" />
          </div>

          <!-- SVG Live Progress Ring -->
          <svg class="pointer-events-none absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(56,189,248,0.16)" stroke-width="3" />
            <circle
              cx="80"
              cy="80"
              r="68"
              fill="none"
              stroke="url(#loaderRingGrad)"
              stroke-width="3.5"
              stroke-linecap="round"
              :stroke-dasharray="ringCircumference"
              :stroke-dashoffset="ringDashOffset"
              class="transition-[stroke-dashoffset] duration-75"
            />
            <defs>
              <linearGradient id="loaderRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00f5ff" />
                <stop offset="50%" stop-color="#38bdf8" />
                <stop offset="100%" stop-color="#818cf8" />
              </linearGradient>
            </defs>
          </svg>

          <!-- Inner Reverse Ring -->
          <div class="animate-spin-reverse absolute inset-5 rounded-full border-2 border-sky-400/50 border-t-transparent border-b-transparent" />

          <!-- Center Badge -->
          <div class="relative flex h-20 w-20 flex-col items-center justify-center rounded-2xl border border-cyan-300/65 bg-slate-950/65 shadow-[0_0_32px_rgba(0,245,255,0.35)] backdrop-blur-md">
            <span class="font-mono text-lg font-bold tracking-wider text-cyan-300">&lt;TM/&gt;</span>
            <span class="font-mono text-[9px] font-semibold text-sky-300/80">{{ percent }}%</span>
          </div>
        </div>

        <h1 class="text-center font-heading text-3xl font-bold tracking-[0.18em] text-white">TRỌNG MIN</h1>
        <p class="mt-1.5 font-mono text-xs tracking-widest text-cyan-300/90">{{ props.subtitle }}</p>

        <!-- Progress Bar -->
        <div class="mt-7 w-full">
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
          class="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1.5 font-mono text-xs text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/20"
          @click="finish"
        >
          <span>{{ t('loader_skip') }}</span>
          <kbd class="rounded bg-slate-900/80 px-1.5 py-0.5 text-[10px] text-cyan-300">ESC</kbd>
        </button>
      </div>
    </div>
  </Transition>
</template>
