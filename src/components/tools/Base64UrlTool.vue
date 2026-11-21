<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeftRight, Copy } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const emit = defineEmits<{ log: [text: string] }>()
const { copyText, showToast } = useToast()

const input = ref('')
const output = ref('Kết quả...')

const process = (mode: 'b64-enc' | 'b64-dec' | 'url-enc' | 'url-dec') => {
  if (!input.value) {
    output.value = 'Vui lòng nhập chuỗi văn bản!'
    return
  }
  try {
    if (mode === 'b64-enc') {
      const bytes = new TextEncoder().encode(input.value)
      let bin = ''
      bytes.forEach((b) => (bin += String.fromCharCode(b)))
      output.value = btoa(bin)
      showToast('Đã mã hóa Base64!')
      emit('log', 'Base64 Encode')
    } else if (mode === 'b64-dec') {
      const bin = atob(input.value)
      const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
      output.value = new TextDecoder().decode(bytes)
      showToast('Đã giải mã Base64!')
      emit('log', 'Base64 Decode')
    } else if (mode === 'url-enc') {
      output.value = encodeURIComponent(input.value)
      showToast('Đã URL Encode!')
      emit('log', 'URL Encode')
    } else {
      output.value = decodeURIComponent(input.value)
      showToast('Đã URL Decode!')
      emit('log', 'URL Decode')
    }
  } catch (e) {
    output.value = 'Lỗi xử lý: ' + (e as Error).message
  }
}

const copy = () => {
  if (output.value === 'Kết quả...') return
  copyText(output.value, 'Đã sao chép kết quả!')
  emit('log', 'Sao chép Base64/URL')
}
</script>

<template>
  <div class="cyber-glass flex flex-col rounded-2xl p-5">
    <div class="mb-4 flex items-start gap-3">
      <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-400/35 bg-sky-400/15 text-sky-400">
        <ArrowLeftRight class="h-5 w-5" />
      </div>
      <div>
        <h3 class="font-heading text-base font-bold">Base64 & URL Encoder/Decoder</h3>
        <p class="text-xs" style="color: var(--text-muted)">Mã hóa hoặc giải mã chuỗi văn bản UTF-8 chuẩn xác</p>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-3">
      <textarea
        v-model="input"
        rows="3"
        placeholder="Nhập chuỗi văn bản cần xử lý..."
        class="w-full resize-none rounded-xl border p-3 font-mono text-xs outline-none focus:border-cyan-400"
        style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
      />

      <div class="grid grid-cols-2 gap-2">
        <button
          type="button"
          class="cursor-pointer rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 py-1.5 text-xs font-bold text-slate-950 hover:brightness-110"
          @click="process('b64-enc')"
        >
          Base64 Encode
        </button>
        <button
          type="button"
          class="cursor-pointer rounded-xl border py-1.5 text-xs font-bold hover:border-cyan-400"
          style="border-color: var(--border-subtle)"
          @click="process('b64-dec')"
        >
          Base64 Decode
        </button>
        <button
          type="button"
          class="cursor-pointer rounded-xl border py-1.5 text-xs font-bold hover:border-cyan-400"
          style="border-color: var(--border-subtle)"
          @click="process('url-enc')"
        >
          URL Encode
        </button>
        <button
          type="button"
          class="cursor-pointer rounded-xl border py-1.5 text-xs font-bold hover:border-cyan-400"
          style="border-color: var(--border-subtle)"
          @click="process('url-dec')"
        >
          URL Decode
        </button>
      </div>

      <div class="mt-auto">
        <div class="mb-1 flex items-center justify-between text-xs">
          <span style="color: var(--text-dim)">Kết quả:</span>
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] hover:border-cyan-400"
            style="border-color: var(--border-subtle); color: var(--accent-cyan)"
            @click="copy"
          >
            <Copy class="h-3 w-3" /> Sao chép
          </button>
        </div>
        <div
          class="max-h-28 overflow-y-auto break-all rounded-xl border p-3 font-mono text-xs"
          style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-muted)"
        >
          {{ output }}
        </div>
      </div>
    </div>
  </div>
</template>
