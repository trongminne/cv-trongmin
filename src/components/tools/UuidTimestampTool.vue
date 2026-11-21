<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Fingerprint, RefreshCw, Copy } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const emit = defineEmits<{ log: [text: string] }>()
const { copyText } = useToast()

const uuid = ref('')
const timestamp = ref('')
let timer: ReturnType<typeof setInterval> | null = null

const generateUuid = (logAction = true) => {
  if (typeof crypto.randomUUID === 'function') {
    uuid.value = crypto.randomUUID()
  } else {
    uuid.value = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
  if (logAction) emit('log', 'Sinh UUID v4 mới')
}

const updateTime = () => {
  const sec = Math.floor(Date.now() / 1000)
  timestamp.value = `${sec} (${new Date().toLocaleString('vi-VN')})`
}

onMounted(() => {
  generateUuid(false)
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="cyber-glass flex flex-col rounded-2xl p-5">
    <div class="mb-4 flex items-start gap-3">
      <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-400/35 bg-purple-400/15 text-purple-400">
        <Fingerprint class="h-5 w-5" />
      </div>
      <div>
        <h3 class="font-heading text-base font-bold">UUID (v4) & Unix Timestamp</h3>
        <p class="text-xs" style="color: var(--text-muted)">Sinh khóa định danh ngẫu nhiên UUID v4 và tra cứu Unix Time</p>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-3">
      <div>
        <div class="mb-1 flex items-center justify-between text-xs">
          <span style="color: var(--text-dim)">UUID v4:</span>
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] hover:border-cyan-400"
            style="border-color: var(--border-subtle); color: var(--accent-cyan)"
            @click="copyText(uuid, 'Đã sao chép UUID!'); emit('log', 'Sao chép UUID v4')"
          >
            <Copy class="h-3 w-3" /> Sao chép
          </button>
        </div>
        <div
          class="break-all rounded-xl border p-3 font-mono text-xs font-bold text-cyan-400"
          style="background: var(--bg-input); border-color: var(--border-subtle)"
        >
          {{ uuid }}
        </div>
      </div>

      <button
        type="button"
        class="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 transition hover:brightness-110"
        @click="generateUuid(true)"
      >
        <RefreshCw class="h-3.5 w-3.5" />
        <span>Sinh UUID Mới</span>
      </button>

      <div class="mt-auto">
        <div class="mb-1 flex items-center justify-between text-xs">
          <span style="color: var(--text-dim)">Unix Timestamp hiện tại:</span>
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] hover:border-cyan-400"
            style="border-color: var(--border-subtle); color: var(--accent-cyan)"
            @click="copyText(timestamp.split(' ')[0], 'Đã sao chép Timestamp!'); emit('log', 'Sao chép Unix Timestamp')"
          >
            <Copy class="h-3 w-3" /> Sao chép
          </button>
        </div>
        <div
          class="rounded-xl border p-3 font-mono text-xs"
          style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-muted)"
        >
          {{ timestamp }}
        </div>
      </div>
    </div>
  </div>
</template>
