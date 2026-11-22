<script setup lang="ts">
import { computed, ref, watch, type Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { ArrowLeft, Home, ShieldCheck, ListChecks } from 'lucide-vue-next'
import { toolsCatalog, getToolBySlug } from '@/data/tools'
import { useTheme } from '@/composables/useTheme'
import SteganographyTool from '@/components/tools/SteganographyTool.vue'
import ExifSpyTool from '@/components/tools/ExifSpyTool.vue'
import CodeSandboxTool from '@/components/tools/CodeSandboxTool.vue'
import QrCodeTool from '@/components/tools/QrCodeTool.vue'
import ColorConverterTool from '@/components/tools/ColorConverterTool.vue'

const route = useRoute()
const router = useRouter()
const { isLight, toggleTheme } = useTheme()

const componentMap: Record<string, Component> = {
  steganography: SteganographyTool,
  'exif-spy': ExifSpyTool,
  'code-sandbox': CodeSandboxTool,
  'qr-code': QrCodeTool,
  'color-converter': ColorConverterTool,
}

const slug = computed(() => String(route.params.slug || ''))
const toolMeta = computed(() => getToolBySlug(slug.value))
const activeComponent = computed(() => componentMap[slug.value] || null)

const actionLogs = ref<{ time: string; text: string }[]>([])

const addLog = (text: string) => {
  const time = new Date().toTimeString().split(' ')[0]
  actionLogs.value.unshift({ time, text })
  if (actionLogs.value.length > 8) actionLogs.value.pop()
}

watch(
  slug,
  (val) => {
    if (!getToolBySlug(val)) {
      router.replace('/tool')
      return
    }
    actionLogs.value = [{ time: new Date().toTimeString().split(' ')[0], text: `Đã mở ${getToolBySlug(val)?.shortName}` }]
  },
  { immediate: true },
)
</script>

<template>
  <div v-if="toolMeta && activeComponent" class="mx-auto min-h-screen max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
    <!-- Top Workspace Navigation -->
    <header class="cyber-glass mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3">
      <div class="flex flex-wrap items-center gap-2">
        <RouterLink
          to="/tool"
          class="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-3.5 py-2 text-xs font-bold text-slate-950 transition hover:brightness-110"
        >
          <ArrowLeft class="h-4 w-4" />
          <span>Kho Công Cụ</span>
        </RouterLink>

        <RouterLink
          to="/"
          class="inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition hover:border-cyan-400"
          style="border-color: var(--border-subtle); background: var(--bg-input)"
        >
          <Home class="h-3.5 w-3.5 text-cyan-400" />
          <span class="hidden sm:inline">CV Portfolio</span>
        </RouterLink>
      </div>

      <!-- Quick Tool Switcher Pills -->
      <nav class="flex flex-wrap items-center gap-1.5" aria-label="Quick switch tools">
        <RouterLink
          v-for="item in toolsCatalog"
          :key="item.slug"
          :to="`/tool/${item.slug}`"
          class="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition"
          :style="
            item.slug === slug
              ? 'background: var(--accent-cyan-dim); border-color: var(--accent-cyan); color: var(--accent-cyan)'
              : 'background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-muted)'
          "
        >
          <Icon :icon="item.icon" class="h-3.5 w-3.5" />
          <span class="hidden md:inline">{{ item.shortName }}</span>
        </RouterLink>

        <button
          type="button"
          title="Đổi giao diện"
          class="ml-1 inline-flex cursor-pointer items-center justify-center rounded-xl border p-2 transition hover:border-cyan-400"
          style="border-color: var(--border-subtle); background: var(--bg-input)"
          @click="toggleTheme"
        >
          <Icon :icon="isLight ? 'fluent-emoji:crescent-moon' : 'fluent-emoji:sun'" class="h-4 w-4" />
        </button>
      </nav>
    </header>

    <!-- Tool Hero Title Bar -->
    <section class="cyber-glass mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 sm:p-6">
      <div class="flex items-start gap-4">
        <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border shadow-md" :class="toolMeta.accentClass">
          <Icon :icon="toolMeta.icon" class="h-8 w-8" />
        </div>
        <div>
          <div class="mb-1 flex flex-wrap items-center gap-2">
            <span class="rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold" :class="toolMeta.badgeBgClass">
              {{ toolMeta.categoryLabel }}
            </span>
            <span class="font-mono text-[11px]" style="color: var(--text-dim)">/tool/{{ toolMeta.slug }}</span>
          </div>
          <h1 class="font-heading text-2xl font-extrabold sm:text-3xl">{{ toolMeta.name }}</h1>
          <p class="mt-1 text-xs sm:text-sm" style="color: var(--text-muted)">{{ toolMeta.tagline }}</p>
        </div>
      </div>

      <div class="inline-flex items-center gap-2 rounded-xl border border-emerald-400/35 bg-emerald-400/10 px-3.5 py-2 font-mono text-[11px] text-emerald-300">
        <ShieldCheck class="h-4 w-4 text-emerald-400" />
        <span>100% Client-Side</span>
      </div>
    </section>

    <!-- Active Tool Full Workspace -->
    <main>
      <component :is="activeComponent" @log="addLog" />
    </main>

    <!-- Compact Activity Log Footer -->
    <section class="cyber-glass mt-6 rounded-2xl p-4">
      <div class="mb-2 flex items-center justify-between">
        <span class="flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-400">
          <ListChecks class="h-4 w-4" /> NHẬT KÝ THAO TÁC
        </span>
        <span class="font-mono text-[10px] text-emerald-400">LIVE</span>
      </div>
      <div class="flex flex-wrap gap-2 font-mono text-[11px]">
        <span
          v-for="(log, idx) in actionLogs"
          :key="idx"
          class="rounded-lg border px-2.5 py-1"
          style="border-color: var(--border-subtle); background: var(--bg-input); color: var(--text-muted)"
        >
          <span class="text-cyan-400">[{{ log.time }}]</span> {{ log.text }}
        </span>
      </div>
    </section>
  </div>
</template>
