<script setup lang="ts">
import { ref, computed } from 'vue'
import { Download, Link as LinkIcon, Wifi, Copy } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const emit = defineEmits<{ log: [text: string] }>()
const { copyText } = useToast()

const qrMode = ref<'text' | 'wifi'>('text')
const qrInput = ref('https://trongmin.io.vn')
const wifiSsid = ref('')
const wifiPass = ref('')
const wifiType = ref<'WPA' | 'WEP' | 'nopass'>('WPA')

const fgColor = ref('#0a2347')
const bgColor = ref('#ffffff')
const exportSize = ref(600)

const finalPayload = computed(() => {
  if (qrMode.value === 'wifi') {
    const ssid = wifiSsid.value.trim() || 'TrongMin_WiFi'
    return `WIFI:T:${wifiType.value};S:${ssid};P:${wifiPass.value};;`
  }
  return qrInput.value.trim() || 'https://trongmin.io.vn'
})

const cleanFg = computed(() => fgColor.value.replace('#', ''))
const cleanBg = computed(() => bgColor.value.replace('#', ''))
const encoded = computed(() => encodeURIComponent(finalPayload.value))

const previewUrl = computed(
  () => `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&color=${cleanFg.value}&bgcolor=${cleanBg.value}&data=${encoded.value}`,
)
const downloadUrl = computed(
  () =>
    `https://api.qrserver.com/v1/create-qr-code/?size=${exportSize.value}x${exportSize.value}&margin=14&color=${cleanFg.value}&bgcolor=${cleanBg.value}&data=${encoded.value}`,
)
</script>

<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
    <!-- Left Config -->
    <div class="cyber-glass space-y-5 rounded-2xl p-6 lg:col-span-7">
      <!-- Mode Toggle -->
      <div class="inline-grid grid-cols-2 rounded-xl border p-1" style="border-color: var(--border-subtle); background: var(--bg-input)">
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition"
          :class="qrMode === 'text' ? 'bg-cyan-400 text-slate-950' : 'opacity-70 hover:opacity-100'"
          @click="qrMode = 'text'"
        >
          <LinkIcon class="h-3.5 w-3.5" /> URL / Văn bản
        </button>
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition"
          :class="qrMode === 'wifi' ? 'bg-cyan-400 text-slate-950' : 'opacity-70 hover:opacity-100'"
          @click="qrMode = 'wifi'"
        >
          <Wifi class="h-3.5 w-3.5" /> Mã QR Wi-Fi
        </button>
      </div>

      <!-- Inputs -->
      <div v-if="qrMode === 'text'">
        <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style="color: var(--text-dim)">
          Đường dẫn hoặc nội dung văn bản
        </label>
        <textarea
          v-model="qrInput"
          rows="3"
          placeholder="Nhập URL website, số điện thoại, ghi chú..."
          class="w-full resize-none rounded-xl border p-3.5 text-sm outline-none focus:border-cyan-400"
          style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
        />
      </div>

      <div v-else class="space-y-3">
        <div>
          <label class="mb-1 block text-xs font-semibold" style="color: var(--text-dim)">Tên mạng Wi-Fi (SSID)</label>
          <input
            v-model="wifiSsid"
            type="text"
            placeholder="Ví dụ: TrongMin_5G"
            class="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-cyan-400"
            style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
          />
        </div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label class="mb-1 block text-xs font-semibold" style="color: var(--text-dim)">Mật khẩu Wi-Fi</label>
            <input
              v-model="wifiPass"
              type="text"
              placeholder="Nhập mật khẩu Wi-Fi..."
              class="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-cyan-400"
              style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
            />
          </div>
          <div>
            <label class="mb-1 block text-xs font-semibold" style="color: var(--text-dim)">Chuẩn bảo mật</label>
            <select
              v-model="wifiType"
              class="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-cyan-400"
              style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
            >
              <option value="WPA">WPA / WPA2 / WPA3</option>
              <option value="WEP">WEP</option>
              <option value="nopass">Không mật khẩu</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Color & Size Customization -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label class="mb-1 block text-xs font-semibold" style="color: var(--text-dim)">Màu mã QR</label>
          <div class="flex items-center gap-2 rounded-xl border p-1.5" style="border-color: var(--border-subtle); background: var(--bg-input)">
            <input v-model="fgColor" type="color" class="h-7 w-9 cursor-pointer border-0 bg-transparent" />
            <span class="font-mono text-xs">{{ fgColor }}</span>
          </div>
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold" style="color: var(--text-dim)">Màu nền</label>
          <div class="flex items-center gap-2 rounded-xl border p-1.5" style="border-color: var(--border-subtle); background: var(--bg-input)">
            <input v-model="bgColor" type="color" class="h-7 w-9 cursor-pointer border-0 bg-transparent" />
            <span class="font-mono text-xs">{{ bgColor }}</span>
          </div>
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold" style="color: var(--text-dim)">Độ phân giải tải</label>
          <select
            v-model.number="exportSize"
            class="w-full rounded-xl border px-3 py-2 text-xs outline-none focus:border-cyan-400"
            style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
          >
            <option :value="400">400 × 400 px</option>
            <option :value="600">600 × 600 px (HD)</option>
            <option :value="1000">1000 × 1000 px (Ultra HD)</option>
          </select>
        </div>
      </div>

      <!-- Payload Preview -->
      <div class="rounded-xl border p-3 font-mono text-xs" style="border-color: var(--border-subtle); background: var(--bg-input)">
        <div class="mb-1 flex items-center justify-between text-[11px]" style="color: var(--text-dim)">
          <span>Dữ liệu mã hóa:</span>
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1 text-cyan-400 hover:underline"
            @click="copyText(finalPayload, 'Đã sao chép chuỗi QR!')"
          >
            <Copy class="h-3 w-3" /> Sao chép
          </button>
        </div>
        <div class="break-all" style="color: var(--text-main)">{{ finalPayload }}</div>
      </div>
    </div>

    <!-- Right QR Preview -->
    <div class="cyber-glass flex flex-col items-center justify-center gap-5 rounded-2xl p-6 text-center lg:col-span-5">
      <div
        class="rounded-3xl p-4 shadow-[0_0_36px_rgba(0,245,255,0.2)] transition"
        :style="{ backgroundColor: bgColor }"
      >
        <img :src="previewUrl" alt="QR Code Preview" class="h-[230px] w-[230px] rounded-xl object-contain" />
      </div>

      <p class="font-mono text-xs" style="color: var(--text-muted)">
        Quét thử ngay bằng camera điện thoại của bạn
      </p>

      <a
        :href="downloadUrl"
        target="_blank"
        download="qr-trongmin.png"
        class="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 text-xs font-bold text-slate-950 shadow-[0_0_24px_rgba(0,245,255,0.3)] transition hover:brightness-110"
        @click="emit('log', `Tải ảnh QR Code (${exportSize}x${exportSize})`)"
      >
        <Download class="h-4 w-4" />
        <span>Tải ảnh QR Code ({{ exportSize }}px)</span>
      </a>
    </div>
  </div>
</template>
