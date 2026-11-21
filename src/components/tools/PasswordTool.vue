<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ShieldCheck, RefreshCw, Copy } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const emit = defineEmits<{ log: [text: string] }>()
const { copyText } = useToast()

const length = ref(20)
const useUpper = ref(true)
const useLower = ref(true)
const useNum = ref(true)
const useSym = ref(true)
const password = ref('')

const generate = (logAction = true) => {
  let chars = ''
  if (useUpper.value) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (useLower.value) chars += 'abcdefghijklmnopqrstuvwxyz'
  if (useNum.value) chars += '0123456789'
  if (useSym.value) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-='
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz0123456789'

  const arr = new Uint32Array(length.value)
  crypto.getRandomValues(arr)
  let pwd = ''
  for (let i = 0; i < length.value; i++) {
    pwd += chars[arr[i] % chars.length]
  }
  password.value = pwd
  if (logAction) emit('log', `Tạo mật khẩu (${length.value} ký tự)`)
}

watch([length, useUpper, useLower, useNum, useSym], () => generate(false))
onMounted(() => generate(false))

const copy = () => {
  copyText(password.value, 'Đã sao chép mật khẩu!')
  emit('log', 'Sao chép mật khẩu')
}
</script>

<template>
  <div class="cyber-glass flex flex-col rounded-2xl p-5">
    <div class="mb-4 flex items-start gap-3">
      <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/35 bg-emerald-400/15 text-emerald-400">
        <ShieldCheck class="h-5 w-5" />
      </div>
      <div>
        <h3 class="font-heading text-base font-bold">Tạo Mật Khẩu & Secret Key</h3>
        <p class="text-xs" style="color: var(--text-muted)">Sinh chuỗi bảo mật cao bằng Web Crypto API 100% phía client</p>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-3">
      <div>
        <div class="mb-1 flex justify-between text-xs">
          <span style="color: var(--text-dim)">Độ dài ký tự:</span>
          <strong class="font-mono text-cyan-400">{{ length }}</strong>
        </div>
        <input v-model.number="length" type="range" min="8" max="64" class="w-full accent-cyan-400" />
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs">
        <label class="flex cursor-pointer items-center gap-2">
          <input v-model="useUpper" type="checkbox" class="accent-cyan-400" /> In hoa (A-Z)
        </label>
        <label class="flex cursor-pointer items-center gap-2">
          <input v-model="useLower" type="checkbox" class="accent-cyan-400" /> Thường (a-z)
        </label>
        <label class="flex cursor-pointer items-center gap-2">
          <input v-model="useNum" type="checkbox" class="accent-cyan-400" /> Số (0-9)
        </label>
        <label class="flex cursor-pointer items-center gap-2">
          <input v-model="useSym" type="checkbox" class="accent-cyan-400" /> Ký tự (!@#$)
        </label>
      </div>

      <button
        type="button"
        class="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 transition hover:brightness-110"
        @click="generate(true)"
      >
        <RefreshCw class="h-3.5 w-3.5" />
        <span>Tạo Mới Ngay</span>
      </button>

      <div class="mt-auto">
        <div class="mb-1 flex items-center justify-between text-xs">
          <span style="color: var(--text-dim)">Mật khẩu đã tạo:</span>
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
          class="break-all rounded-xl border p-3 font-mono text-xs font-bold text-cyan-400"
          style="background: var(--bg-input); border-color: var(--border-subtle)"
        >
          {{ password }}
        </div>
      </div>
    </div>
  </div>
</template>
