<script setup lang="ts">
import { ref } from 'vue'
import { Code2, AlignLeft, Minimize2, Copy } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const emit = defineEmits<{ log: [text: string] }>()
const { copyText, showToast } = useToast()

const rawJson = ref('')
const output = ref('Kết quả JSON sẽ hiển thị tại đây...')
const hasError = ref(false)

const format = (pretty: boolean) => {
  if (!rawJson.value.trim()) {
    output.value = 'Vui lòng dán dữ liệu JSON vào ô nhập!'
    hasError.value = true
    return
  }
  try {
    const parsed = JSON.parse(rawJson.value)
    output.value = pretty ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed)
    hasError.value = false
    showToast(pretty ? 'Đã làm đẹp JSON!' : 'Đã nén JSON!')
    emit('log', pretty ? 'Format JSON (Prettify)' : 'Minify JSON')
  } catch (err) {
    output.value = 'LỖI CÚ PHÁP: ' + (err as Error).message
    hasError.value = true
    emit('log', 'Lỗi cú pháp JSON')
  }
}

const copy = () => {
  if (hasError.value || output.value.startsWith('Kết quả')) return
  copyText(output.value, 'Đã sao chép JSON!')
  emit('log', 'Sao chép JSON')
}
</script>

<template>
  <div class="cyber-glass flex flex-col rounded-2xl p-5">
    <div class="mb-4 flex items-start gap-3">
      <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/35 bg-amber-400/15 text-amber-400">
        <Code2 class="h-5 w-5" />
      </div>
      <div>
        <h3 class="font-heading text-base font-bold">JSON Formatter & Validator</h3>
        <p class="text-xs" style="color: var(--text-muted)">Làm đẹp (Prettify), nén (Minify) và kiểm tra lỗi cú pháp tức thì</p>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-3">
      <textarea
        v-model="rawJson"
        rows="3"
        placeholder='{"name":"TrongMin","role":"Developer","skills":["ASP.NET","Vue 3","AI"]}'
        class="w-full resize-none rounded-xl border p-3 font-mono text-xs outline-none focus:border-cyan-400"
        style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
      />

      <div class="grid grid-cols-2 gap-2">
        <button
          type="button"
          class="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-3 py-2 text-xs font-bold text-slate-950 transition hover:brightness-110"
          @click="format(true)"
        >
          <AlignLeft class="h-3.5 w-3.5" /> Làm đẹp
        </button>
        <button
          type="button"
          class="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition hover:border-cyan-400"
          style="border-color: var(--border-subtle); color: var(--text-main)"
          @click="format(false)"
        >
          <Minimize2 class="h-3.5 w-3.5" /> Nén (Minify)
        </button>
      </div>

      <div class="mt-auto">
        <div class="mb-1 flex items-center justify-between text-xs">
          <span style="color: var(--text-dim)">Kết quả JSON:</span>
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] hover:border-cyan-400"
            style="border-color: var(--border-subtle); color: var(--accent-cyan)"
            @click="copy"
          >
            <Copy class="h-3 w-3" /> Sao chép
          </button>
        </div>
        <pre
          class="max-h-36 overflow-y-auto whitespace-pre-wrap rounded-xl border p-3 font-mono text-[11px]"
          :class="hasError ? 'text-rose-400' : 'text-sky-300'"
          style="background: var(--bg-input); border-color: var(--border-subtle)"
        >{{ output }}</pre>
      </div>
    </div>
  </div>
</template>
