<script setup lang="ts">
import { ref, computed } from 'vue'
import { Palette, Copy } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const emit = defineEmits<{ log: [text: string] }>()
const { copyText } = useToast()

const hex = ref('#00f5ff')

const converted = computed(() => {
  const clean = hex.value.replace('#', '').trim()
  if (clean.length !== 6) {
    return { rgb: 'Invalid HEX', hsl: 'Invalid HEX', valid: false }
  }
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return { rgb: 'Invalid HEX', hsl: 'Invalid HEX', valid: false }
  }

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
  return {
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
    valid: true,
  }
})
</script>

<template>
  <div class="cyber-glass flex flex-col rounded-2xl p-5">
    <div class="mb-4 flex items-start gap-3">
      <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-400/35 bg-sky-400/15 text-sky-400">
        <Palette class="h-5 w-5" />
      </div>
      <div>
        <h3 class="font-heading text-base font-bold">Bảng Màu & Chuyển Đổi CSS</h3>
        <p class="text-xs" style="color: var(--text-muted)">Chuyển đổi nhanh mã màu HEX sang RGB, HSL kèm xem trước</p>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-3">
      <div class="flex items-center gap-2.5">
        <input v-model="hex" type="color" class="h-10 w-12 cursor-pointer rounded-lg border-0 bg-transparent" />
        <input
          v-model="hex"
          type="text"
          class="flex-1 rounded-xl border px-3 py-2 font-mono text-xs outline-none focus:border-cyan-400"
          style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
        />
        <div
          class="h-10 w-12 rounded-xl border shadow-inner"
          :style="{ backgroundColor: converted.valid ? hex : 'transparent', borderColor: 'var(--border-subtle)' }"
        />
      </div>

      <div>
        <div class="mb-1 flex items-center justify-between text-xs">
          <span style="color: var(--text-dim)">Định dạng RGB:</span>
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] hover:border-cyan-400"
            style="border-color: var(--border-subtle); color: var(--accent-cyan)"
            @click="copyText(converted.rgb, 'Đã sao chép RGB!'); emit('log', 'Sao chép màu RGB')"
          >
            <Copy class="h-3 w-3" /> Sao chép
          </button>
        </div>
        <div
          class="rounded-xl border p-2.5 font-mono text-xs"
          style="background: var(--bg-input); border-color: var(--border-subtle)"
        >
          {{ converted.rgb }}
        </div>
      </div>

      <div class="mt-auto">
        <div class="mb-1 flex items-center justify-between text-xs">
          <span style="color: var(--text-dim)">Định dạng HSL:</span>
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] hover:border-cyan-400"
            style="border-color: var(--border-subtle); color: var(--accent-cyan)"
            @click="copyText(converted.hsl, 'Đã sao chép HSL!'); emit('log', 'Sao chép màu HSL')"
          >
            <Copy class="h-3 w-3" /> Sao chép
          </button>
        </div>
        <div
          class="rounded-xl border p-2.5 font-mono text-xs"
          style="background: var(--bg-input); border-color: var(--border-subtle)"
        >
          {{ converted.hsl }}
        </div>
      </div>
    </div>
  </div>
</template>
