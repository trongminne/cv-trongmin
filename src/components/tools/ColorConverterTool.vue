<script setup lang="ts">
import { ref, computed } from 'vue'
import { Copy, Sparkles } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const emit = defineEmits<{ log: [text: string] }>()
const { copyText } = useToast()

const hex = ref('#00f5ff')

const presets = [
  '#00f5ff',
  '#38bdf8',
  '#6366f1',
  '#a855f7',
  '#ec4899',
  '#f43f5e',
  '#f59e0b',
  '#10b981',
]

function hexToRgb(h: string): { r: number; g: number; b: number } | null {
  const clean = h.replace('#', '').trim()
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const converted = computed(() => {
  const rgb = hexToRgb(hex.value)
  if (!rgb) {
    return {
      valid: false,
      hex: hex.value,
      rgb: 'Invalid HEX',
      hsl: 'Invalid HEX',
      cssVar: '--brand-color: #00f5ff;',
      bestTextColor: '#000000',
      shades: [] as string[],
    }
  }

  const { r, g, b } = rgb
  const rN = r / 255
  const gN = g / 255
  const bN = b / 255
  const max = Math.max(rN, gN, bN)
  const min = Math.min(rN, gN, bN)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === rN) h = (gN - bN) / d + (gN < bN ? 6 : 0)
    else if (max === gN) h = (bN - rN) / d + 2
    else h = (rN - gN) / d + 4
    h /= 6
  }

  // Relative luminance for contrast recommendation
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  const bestTextColor = luminance > 155 ? '#06142c' : '#ffffff'

  // Generate 9 shades/tints
  const factors = [0.75, 0.5, 0.25, 0.1, 0, -0.15, -0.35, -0.55, -0.72]
  const shades = factors.map((f) => {
    if (f >= 0) {
      return rgbToHex(r + (255 - r) * f, g + (255 - g) * f, b + (255 - b) * f)
    }
    const mult = 1 + f
    return rgbToHex(r * mult, g * mult, b * mult)
  })

  return {
    valid: true,
    hex: hex.value.toUpperCase(),
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
    cssVar: `background: linear-gradient(135deg, ${hex.value}, ${shades[6]});`,
    bestTextColor,
    shades,
  }
})

const copyFormat = (value: string, label: string) => {
  copyText(value, `Đã sao chép ${label}: ${value}`)
  emit('log', `Sao chép mã màu ${label}`)
}
</script>

<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
    <!-- Left Color Picker & Swatch Preview -->
    <div class="cyber-glass space-y-5 rounded-2xl p-6 lg:col-span-5">
      <div
        class="flex h-44 w-full flex-col items-center justify-center rounded-2xl border shadow-lg transition-colors duration-200"
        :style="{
          backgroundColor: converted.valid ? hex : '#0f172a',
          color: converted.bestTextColor,
          borderColor: 'var(--border-subtle)',
        }"
      >
        <span class="font-heading text-3xl font-extrabold tracking-wider">{{ converted.hex }}</span>
        <span class="mt-1 font-mono text-xs opacity-85">
          Chữ tương phản tốt nhất: {{ converted.bestTextColor === '#ffffff' ? 'Trắng (#FFF)' : 'Tối (#06142C)' }}
        </span>
      </div>

      <div class="flex items-center gap-3">
        <input v-model="hex" type="color" class="h-12 w-16 cursor-pointer rounded-xl border-0 bg-transparent" />
        <input
          v-model="hex"
          type="text"
          placeholder="#00f5ff"
          class="flex-1 rounded-xl border px-4 py-3 font-mono text-sm font-bold uppercase outline-none focus:border-cyan-400"
          style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
        />
      </div>

      <div>
        <div class="mb-2 flex items-center gap-1.5 text-xs font-semibold" style="color: var(--text-dim)">
          <Sparkles class="h-3.5 w-3.5 text-cyan-400" /> Bảng màu gợi ý Cyber:
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="c in presets"
            :key="c"
            type="button"
            class="h-8 w-8 cursor-pointer rounded-lg border-2 transition hover:scale-110"
            :style="{ backgroundColor: c, borderColor: hex.toLowerCase() === c ? '#ffffff' : 'transparent' }"
            :title="c"
            @click="hex = c"
          />
        </div>
      </div>
    </div>

    <!-- Right Formats & Shades Palette -->
    <div class="cyber-glass space-y-5 rounded-2xl p-6 lg:col-span-7">
      <div class="space-y-3">
        <div
          v-for="row in [
            { label: 'HEX', val: converted.hex },
            { label: 'RGB', val: converted.rgb },
            { label: 'HSL', val: converted.hsl },
            { label: 'CSS Gradient', val: converted.cssVar },
          ]"
          :key="row.label"
          class="flex items-center justify-between gap-3 rounded-xl border px-4 py-3"
          style="border-color: var(--border-subtle); background: var(--bg-input)"
        >
          <div class="min-w-0">
            <div class="font-mono text-[10px] font-bold uppercase" style="color: var(--text-dim)">{{ row.label }}</div>
            <div class="truncate font-mono text-sm font-semibold" style="color: var(--text-main)">{{ row.val }}</div>
          </div>
          <button
            type="button"
            class="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold text-cyan-400 transition hover:border-cyan-400 hover:bg-cyan-400/10"
            style="border-color: var(--border-subtle)"
            @click="copyFormat(row.val, row.label)"
          >
            <Copy class="h-3.5 w-3.5" /> Sao chép
          </button>
        </div>
      </div>

      <!-- Auto Generated Shades & Tints -->
      <div v-if="converted.shades.length > 0">
        <div class="mb-2.5 text-xs font-semibold uppercase tracking-wider" style="color: var(--text-dim)">
          Dải sắc độ tự động (Tints & Shades — Bấm để sao chép)
        </div>
        <div class="grid grid-cols-3 gap-2 sm:grid-cols-9">
          <button
            v-for="(shade, idx) in converted.shades"
            :key="idx"
            type="button"
            class="group flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border p-1.5 transition hover:-translate-y-1 hover:border-cyan-400"
            style="border-color: var(--border-subtle); background: var(--bg-input)"
            @click="copyFormat(shade.toUpperCase(), 'Shade HEX')"
          >
            <span class="h-10 w-full rounded-lg shadow-inner" :style="{ backgroundColor: shade }" />
            <span class="font-mono text-[10px] opacity-85 group-hover:text-cyan-400">{{ shade.toUpperCase() }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
