<script setup lang="ts">
import { ref, computed } from 'vue'
import { QrCode, Download } from 'lucide-vue-next'

const emit = defineEmits<{ log: [text: string] }>()

const qrInput = ref('https://trongmin.io.vn')
const encoded = computed(() => encodeURIComponent(qrInput.value.trim() || 'https://trongmin.io.vn'))
const previewUrl = computed(() => `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encoded.value}`)
const downloadUrl = computed(() => `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encoded.value}`)
</script>

<template>
  <div class="cyber-glass flex flex-col rounded-2xl p-5">
    <div class="mb-4 flex items-start gap-3">
      <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-400/35 bg-sky-400/15 text-sky-300">
        <QrCode class="h-5 w-5" />
      </div>
      <div>
        <h3 class="font-heading text-base font-bold">Tạo Mã QR Tức Thì</h3>
        <p class="text-xs" style="color: var(--text-muted)">Tạo QR code độ nét cao cho link website, văn bản hoặc wifi</p>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-3">
      <input
        v-model="qrInput"
        type="text"
        placeholder="Nhập URL hoặc văn bản bất kỳ..."
        class="w-full rounded-xl border px-3 py-2 text-xs outline-none focus:border-cyan-400"
        style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
        @change="emit('log', 'Tạo mã QR Code')"
      />

      <div class="mx-auto flex h-[168px] w-[168px] items-center justify-center rounded-2xl bg-white p-2.5 shadow-lg">
        <img :src="previewUrl" alt="QR Code Preview" class="h-full w-full rounded object-contain" />
      </div>

      <a
        :href="downloadUrl"
        target="_blank"
        download="qr-trongmin.png"
        class="mt-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 transition hover:brightness-110"
        @click="emit('log', 'Tải ảnh QR Code HD')"
      >
        <Download class="h-3.5 w-3.5" />
        <span>Tải ảnh QR Code (HD)</span>
      </a>
    </div>
  </div>
</template>
