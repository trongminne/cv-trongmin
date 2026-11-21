<script setup lang="ts">
import { ref, computed } from 'vue'
import { FlaskConical, Copy } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const emit = defineEmits<{ log: [text: string] }>()
const { copyText } = useToast()

const pattern = ref('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')
const flags = ref('g')
const testText = ref('Liên hệ admin@trongmin.io.vn hoặc support@google.com nhé!')

const presets = [
  { label: 'Email', pat: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'g' },
  { label: 'SĐT VN', pat: '(84|0[3|5|7|8|9])+([0-9]{8})\\b', flags: 'g' },
  { label: 'URL', pat: 'https?:\\/\\/[^\\s/$.?#].[^\\s]*', flags: 'g' },
  { label: 'Date', pat: '\\d{4}-\\d{2}-\\d{2}', flags: 'g' },
]

const result = computed(() => {
  if (!pattern.value || !testText.value) {
    return { count: 0, text: 'Nhập biểu thức và chuỗi kiểm tra...', error: false }
  }
  try {
    const safeFlags = flags.value.includes('g') ? flags.value : flags.value + 'g'
    const matches = [...testText.value.matchAll(new RegExp(pattern.value, safeFlags))]
    if (matches.length === 0) {
      return { count: 0, text: 'Không có kết quả nào trùng khớp.', error: false }
    }
    return {
      count: matches.length,
      text: matches.map((m, idx) => `[#${idx + 1}] "${m[0]}" (index: ${m.index})`).join('\n'),
      error: false,
    }
  } catch (e) {
    return { count: 0, text: 'LỖI REGEX: ' + (e as Error).message, error: true }
  }
})

const applyPreset = (pat: string, fl: string, label: string) => {
  pattern.value = pat
  flags.value = fl
  emit('log', `Áp dụng Regex preset: ${label}`)
}
</script>

<template>
  <div class="cyber-glass flex flex-col rounded-2xl p-5">
    <div class="mb-4 flex items-start gap-3">
      <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-rose-400/35 bg-rose-400/15 text-rose-400">
        <FlaskConical class="h-5 w-5" />
      </div>
      <div>
        <h3 class="font-heading text-base font-bold">Regex Pattern Tester</h3>
        <p class="text-xs" style="color: var(--text-muted)">Kiểm tra biểu thức chính quy trực tiếp theo thời gian thực</p>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-2.5">
      <div class="flex gap-2">
        <input
          v-model="pattern"
          type="text"
          placeholder="Pattern..."
          class="flex-1 rounded-xl border px-3 py-2 font-mono text-xs outline-none focus:border-cyan-400"
          style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
        />
        <input
          v-model="flags"
          type="text"
          placeholder="g"
          class="w-16 rounded-xl border px-2 py-2 text-center font-mono text-xs outline-none focus:border-cyan-400"
          style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
        />
      </div>

      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="p in presets"
          :key="p.label"
          type="button"
          class="cursor-pointer rounded-lg border px-2.5 py-1 font-mono text-[11px] hover:border-cyan-400"
          style="border-color: var(--border-subtle); background: var(--bg-input); color: var(--accent-cyan)"
          @click="applyPreset(p.pat, p.flags, p.label)"
        >
          {{ p.label }}
        </button>
      </div>

      <textarea
        v-model="testText"
        rows="2"
        placeholder="Nhập văn bản cần kiểm tra..."
        class="w-full resize-none rounded-xl border p-2.5 text-xs outline-none focus:border-cyan-400"
        style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
      />

      <div class="mt-auto">
        <div class="mb-1 flex items-center justify-between text-xs">
          <span style="color: var(--text-dim)">
            Kết quả: <strong class="text-cyan-400">{{ result.count }} khớp</strong>
          </span>
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] hover:border-cyan-400"
            style="border-color: var(--border-subtle); color: var(--accent-cyan)"
            @click="copyText(result.text, 'Đã sao chép Regex Match!'); emit('log', 'Sao chép Regex Match')"
          >
            <Copy class="h-3 w-3" /> Sao chép
          </button>
        </div>
        <pre
          class="max-h-28 overflow-y-auto whitespace-pre-wrap rounded-xl border p-2.5 font-mono text-[11px]"
          :class="result.error ? 'text-rose-400' : 'text-cyan-300'"
          style="background: var(--bg-input); border-color: var(--border-subtle)"
        >{{ result.text }}</pre>
      </div>
    </div>
  </div>
</template>
