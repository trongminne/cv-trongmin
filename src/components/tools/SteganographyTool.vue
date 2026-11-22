<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { Upload, Lock, Unlock, Download, Copy, ShieldAlert, CheckCircle2, Trash2 } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const emit = defineEmits<{ log: [text: string] }>()
const { copyText, showToast } = useToast()

type Mode = 'encode' | 'decode'
const mode = ref<Mode>('encode')
const isDragging = ref(false)
const isProcessing = ref(false)

// Shared image state
const sourceUrl = ref<string | null>(null)
const sourceName = ref('')
const imgDims = ref<{ w: number; h: number }>({ w: 0, h: 0 })
const loadedImage = ref<HTMLImageElement | null>(null)

// Encode state
const secretMessage = ref('')
const encodePassword = ref('')
const encodedDataUrl = ref<string | null>(null)
const encodeStats = ref<{ usedBytes: number; maxBytes: number; encrypted: boolean } | null>(null)

// Decode state
const decodePassword = ref('')
const decodedMessage = ref('')
const decodeError = ref('')
const decodeInfo = ref<{ encrypted: boolean; byteLength: number } | null>(null)

const MAGIC = new TextEncoder().encode('TMSTEG01') // 8 bytes signature

const maxCapacityBytes = computed(() => {
  if (!imgDims.value.w || !imgDims.value.h) return 0
  return Math.max(0, Math.floor((imgDims.value.w * imgDims.value.h * 3) / 8) - 16)
})

const messageByteLength = computed(() => new TextEncoder().encode(secretMessage.value).length)

// Crypto helpers (AES-256-GCM + PBKDF2)
async function deriveAesKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

async function encryptPayload(plainBytes: Uint8Array, password: string): Promise<Uint8Array> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveAesKey(password, salt)
  const cipher = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plainBytes as BufferSource))
  const out = new Uint8Array(16 + 12 + cipher.length)
  out.set(salt, 0)
  out.set(iv, 16)
  out.set(cipher, 28)
  return out
}

async function decryptPayload(blob: Uint8Array, password: string): Promise<Uint8Array> {
  if (blob.length < 29) throw new Error('Dữ liệu mã hóa không hợp lệ.')
  const salt = blob.slice(0, 16)
  const iv = blob.slice(16, 28)
  const cipher = blob.slice(28)
  const key = await deriveAesKey(password, salt)
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher as BufferSource)
  return new Uint8Array(plain)
}

function handleFile(file: File | undefined) {
  if (!file || !file.type.startsWith('image/')) {
    showToast('Vui lòng chọn tệp hình ảnh hợp lệ!', '⚠️')
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    const url = String(reader.result)
    const img = new Image()
    img.onload = () => {
      sourceUrl.value = url
      sourceName.value = file.name
      imgDims.value = { w: img.naturalWidth, h: img.naturalHeight }
      loadedImage.value = img
      encodedDataUrl.value = null
      encodeStats.value = null
      decodedMessage.value = ''
      decodeError.value = ''
      decodeInfo.value = null
      emit('log', `Tải ảnh ${file.name} (${img.naturalWidth}x${img.naturalHeight})`)
    }
    img.src = url
  }
  reader.readAsDataURL(file)
}

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  handleFile(input.files?.[0])
}

const onDrop = (e: DragEvent) => {
  isDragging.value = false
  handleFile(e.dataTransfer?.files?.[0])
}

const clearImage = () => {
  sourceUrl.value = null
  sourceName.value = ''
  imgDims.value = { w: 0, h: 0 }
  loadedImage.value = null
  encodedDataUrl.value = null
  encodeStats.value = null
  decodedMessage.value = ''
  decodeError.value = ''
  decodeInfo.value = null
}

async function runEncode() {
  if (!loadedImage.value) {
    showToast('Vui lòng chọn một bức ảnh gốc trước!', '⚠️')
    return
  }
  if (!secretMessage.value.trim()) {
    showToast('Vui lòng nhập nội dung tin nhắn bí mật!', '⚠️')
    return
  }

  isProcessing.value = true
  try {
    const rawBytes = new TextEncoder().encode(secretMessage.value)
    const hasPwd = encodePassword.value.length > 0
    const payload = hasPwd ? await encryptPayload(rawBytes, encodePassword.value) : rawBytes

    // Packet: MAGIC (8) + FLAG (1) + LENGTH (4) + PAYLOAD
    const packet = new Uint8Array(8 + 1 + 4 + payload.length)
    packet.set(MAGIC, 0)
    packet[8] = hasPwd ? 1 : 0
    const view = new DataView(packet.buffer)
    view.setUint32(9, payload.length, false)
    packet.set(payload, 13)

    const totalBits = packet.length * 8
    const canvas = document.createElement('canvas')
    canvas.width = loadedImage.value.naturalWidth
    canvas.height = loadedImage.value.naturalHeight
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!
    ctx.drawImage(loadedImage.value, 0, 0)
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imgData.data

    const availableBits = (data.length / 4) * 3
    if (totalBits > availableBits) {
      showToast('Ảnh quá nhỏ để chứa toàn bộ tin nhắn này! Hãy chọn ảnh lớn hơn.', '✕')
      return
    }

    // Write bits into R, G, B LSB and force Alpha = 255 to avoid premultiplied alpha corruption
    let bitIdx = 0
    for (let p = 0; p < data.length && bitIdx < totalBits; p += 4) {
      data[p + 3] = 255
      for (let c = 0; c < 3 && bitIdx < totalBits; c++) {
        const byteVal = packet[bitIdx >> 3]
        const bit = (byteVal >> (7 - (bitIdx & 7))) & 1
        data[p + c] = (data[p + c] & 0xfe) | bit
        bitIdx++
      }
    }

    ctx.putImageData(imgData, 0, 0)
    encodedDataUrl.value = canvas.toDataURL('image/png')
    encodeStats.value = {
      usedBytes: packet.length,
      maxBytes: Math.floor(availableBits / 8),
      encrypted: hasPwd,
    }
    showToast('Đã giấu tin nhắn bí mật vào ảnh PNG thành công!', '🔐')
    emit('log', `Giấu ${packet.length} bytes vào ảnh PNG${hasPwd ? ' (AES-256)' : ''}`)
  } catch (err) {
    showToast('Lỗi mã hóa: ' + (err as Error).message, '✕')
  } finally {
    isProcessing.value = false
  }
}

function readBytesFromImageData(data: Uint8ClampedArray, byteOffset: number, byteCount: number): Uint8Array {
  const out = new Uint8Array(byteCount)
  const startBit = byteOffset * 8
  const endBit = startBit + byteCount * 8

  for (let bitIdx = startBit; bitIdx < endBit; bitIdx++) {
    const pixelIndex = Math.floor(bitIdx / 3)
    const channel = bitIdx % 3
    const dataIdx = pixelIndex * 4 + channel
    if (dataIdx >= data.length) break
    const bit = data[dataIdx] & 1
    const relBit = bitIdx - startBit
    out[relBit >> 3] = (out[relBit >> 3] << 1) | bit
  }
  return out
}

async function runDecode() {
  if (!loadedImage.value) {
    showToast('Vui lòng chọn bức ảnh PNG cần giải mã!', '⚠️')
    return
  }

  isProcessing.value = true
  decodeError.value = ''
  decodedMessage.value = ''
  decodeInfo.value = null

  try {
    const canvas = document.createElement('canvas')
    canvas.width = loadedImage.value.naturalWidth
    canvas.height = loadedImage.value.naturalHeight
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!
    ctx.drawImage(loadedImage.value, 0, 0)
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data

    const header = readBytesFromImageData(data, 0, 13)
    for (let i = 0; i < 8; i++) {
      if (header[i] !== MAGIC[i]) {
        decodeError.value = 'Không tìm thấy tin nhắn bí mật nào trong bức ảnh này (hoặc ảnh đã bị nén thành JPG làm mất bit ẩn).'
        emit('log', 'Giải mã: Không tìm thấy dữ liệu ẩn')
        return
      }
    }

    const isEncrypted = header[8] === 1
    const payloadLen = new DataView(header.buffer).getUint32(9, false)
    const maxPossible = Math.floor(((data.length / 4) * 3) / 8) - 13

    if (payloadLen <= 0 || payloadLen > maxPossible) {
      decodeError.value = 'Header dữ liệu ẩn bị hỏng hoặc ảnh đã bị thay đổi kích thước.'
      return
    }

    const payload = readBytesFromImageData(data, 13, payloadLen)
    let plainBytes: Uint8Array

    if (isEncrypted) {
      if (!decodePassword.value) {
        decodeError.value = 'Ảnh này được khóa bằng mật khẩu AES-256! Vui lòng nhập mật khẩu để mở khóa.'
        return
      }
      try {
        plainBytes = await decryptPayload(payload, decodePassword.value)
      } catch {
        decodeError.value = 'Mật khẩu không chính xác! Không thể giải mã AES-256-GCM.'
        return
      }
    } else {
      plainBytes = payload
    }

    decodedMessage.value = new TextDecoder().decode(plainBytes)
    decodeInfo.value = { encrypted: isEncrypted, byteLength: plainBytes.length }
    showToast('Giải mã tin nhắn bí mật thành công!', '🔓')
    emit('log', `Giải mã thành công (${plainBytes.length} bytes)`)
  } catch (err) {
    decodeError.value = 'Lỗi giải mã: ' + (err as Error).message
  } finally {
    isProcessing.value = false
  }
}

const downloadFilename = computed(() => {
  const base = sourceName.value.replace(/\.[^.]+$/, '') || 'secret-image'
  return `${base}-stego.png`
})
</script>

<template>
  <div class="space-y-6">
    <!-- Mode Tabs -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div
        class="inline-grid grid-cols-2 rounded-2xl border p-1"
        style="border-color: var(--border-subtle); background: var(--bg-surface)"
      >
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition"
          :class="
            mode === 'encode'
              ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow'
              : 'opacity-75 hover:opacity-100'
          "
          @click="mode = 'encode'"
        >
          <Lock class="h-4 w-4" />
          <span>Giấu Tin Vào Ảnh (Encode)</span>
        </button>
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition"
          :class="
            mode === 'decode'
              ? 'bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 shadow'
              : 'opacity-75 hover:opacity-100'
          "
          @click="mode = 'decode'"
        >
          <Unlock class="h-4 w-4" />
          <span>Giải Mã Tin Ẩn (Decode)</span>
        </button>
      </div>

      <div class="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 font-mono text-[11px] text-emerald-300">
        <Icon icon="fluent-emoji:shield" class="h-4 w-4" />
        <span>100% Xử lý tại trình duyệt • Hỗ trợ AES-256-GCM</span>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left: Image Upload & Preview -->
      <div class="space-y-4 lg:col-span-5">
        <div
          class="cyber-glass relative flex min-h-[290px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition"
          :class="isDragging ? 'border-cyan-400 bg-cyan-400/10' : ''"
          style="border-color: var(--border-subtle)"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="onDrop"
        >
          <template v-if="!sourceUrl">
            <div class="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-400">
              <Upload class="h-7 w-7" />
            </div>
            <p class="font-heading text-base font-bold">
              {{ mode === 'encode' ? 'Chọn ảnh gốc để giấu tin' : 'Chọn ảnh PNG chứa tin ẩn' }}
            </p>
            <p class="mt-1 text-xs" style="color: var(--text-muted)">
              Kéo thả ảnh vào đây hoặc bấm nút bên dưới (PNG, JPG, WebP)
            </p>
            <label
              class="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition hover:brightness-110"
            >
              <Upload class="h-4 w-4" />
              <span>Chọn tệp ảnh</span>
              <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
            </label>
          </template>

          <template v-else>
            <img :src="sourceUrl" alt="Source Preview" class="max-h-[240px] rounded-xl object-contain shadow-lg" />
            <div class="mt-4 flex w-full flex-wrap items-center justify-between gap-2 border-t pt-3 font-mono text-[11px]" style="border-color: var(--border-subtle)">
              <span class="truncate" style="color: var(--text-dim)">{{ sourceName }} ({{ imgDims.w }}×{{ imgDims.h }})</span>
              <div class="flex gap-2">
                <label class="cursor-pointer rounded-lg border px-2.5 py-1 text-cyan-400 hover:border-cyan-400" style="border-color: var(--border-subtle)">
                  Đổi ảnh
                  <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
                </label>
                <button
                  type="button"
                  class="inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-1 text-rose-400 hover:border-rose-400"
                  style="border-color: var(--border-subtle)"
                  @click="clearImage"
                >
                  <Trash2 class="h-3 w-3" />
                </button>
              </div>
            </div>
          </template>
        </div>

        <!-- Important PNG Tip -->
        <div class="cyber-glass flex items-start gap-3 rounded-2xl border-amber-400/30 p-4 text-xs">
          <ShieldAlert class="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div style="color: var(--text-muted)">
            <b class="text-amber-300">Lưu ý quan trọng:</b> Ảnh sau khi giấu tin phải lưu ở định dạng <b>PNG gốc</b>. Nếu gửi qua Zalo/Messenger/Facebook, hãy chọn gửi dạng <b>Tệp (File / HD gốc)</b> để không bị nén mất dữ liệu pixel ẩn!
          </div>
        </div>
      </div>

      <!-- Right: Encode / Decode Controls -->
      <div class="lg:col-span-7">
        <!-- ENCODE PANEL -->
        <div v-if="mode === 'encode'" class="cyber-glass space-y-4 rounded-2xl p-6">
          <div>
            <div class="mb-1.5 flex items-center justify-between text-xs">
              <label class="font-semibold uppercase tracking-wider" style="color: var(--text-dim)">
                Nội dung tin nhắn bí mật
              </label>
              <span class="font-mono text-[11px]" style="color: var(--accent-cyan)">
                {{ messageByteLength.toLocaleString() }} / {{ maxCapacityBytes.toLocaleString() }} bytes
              </span>
            </div>
            <textarea
              v-model="secretMessage"
              rows="5"
              placeholder="Nhập mật thư, mã khôi phục, hoặc tin nhắn bí mật muốn giấu vào trong ảnh..."
              class="w-full resize-y rounded-xl border p-3.5 font-mono text-sm outline-none focus:border-cyan-400"
              style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style="color: var(--text-dim)">
              Mật khẩu mã hóa AES-256 <span class="font-normal normal-case opacity-70">(Tùy chọn — khuyên dùng)</span>
            </label>
            <input
              v-model="encodePassword"
              type="password"
              placeholder="Để trống nếu không cần mật khẩu, hoặc nhập khóa bảo vệ..."
              class="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-cyan-400"
              style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
            />
          </div>

          <button
            type="button"
            :disabled="isProcessing || !sourceUrl"
            class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 py-3 text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(52,211,153,0.3)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            @click="runEncode"
          >
            <Lock class="h-4 w-4" />
            <span>{{ isProcessing ? 'Đang nhúng bit vào pixel...' : 'Giấu Tin Nhắn & Xuất Ảnh PNG' }}</span>
          </button>

          <!-- Encoded Result -->
          <div
            v-if="encodedDataUrl && encodeStats"
            class="space-y-3 rounded-2xl border border-emerald-400/45 bg-emerald-400/10 p-4"
          >
            <div class="flex items-center gap-2 text-sm font-bold text-emerald-300">
              <CheckCircle2 class="h-5 w-5" />
              <span>Hoàn tất! Mắt thường hoàn toàn không thấy ảnh thay đổi.</span>
            </div>
            <div class="grid grid-cols-3 gap-2 font-mono text-[11px]">
              <div class="rounded-lg bg-slate-950/50 p-2 text-center">
                <div class="opacity-60">ĐÃ NHÚNG</div>
                <div class="font-bold text-cyan-300">{{ encodeStats.usedBytes }} B</div>
              </div>
              <div class="rounded-lg bg-slate-950/50 p-2 text-center">
                <div class="opacity-60">BẢO MẬT</div>
                <div class="font-bold text-emerald-300">{{ encodeStats.encrypted ? 'AES-256' : 'LSB Plain' }}</div>
              </div>
              <div class="rounded-lg bg-slate-950/50 p-2 text-center">
                <div class="opacity-60">ĐỊNH DẠNG</div>
                <div class="font-bold text-sky-300">PNG Gốc</div>
              </div>
            </div>
            <a
              :href="encodedDataUrl"
              :download="downloadFilename"
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 py-2.5 text-xs font-bold text-slate-950 transition hover:brightness-110"
              @click="emit('log', `Tải xuống ${downloadFilename}`)"
            >
              <Download class="h-4 w-4" />
              <span>Tải Ảnh Đã Giấu Tin ({{ downloadFilename }})</span>
            </a>
          </div>
        </div>

        <!-- DECODE PANEL -->
        <div v-else class="cyber-glass space-y-4 rounded-2xl p-6">
          <div>
            <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style="color: var(--text-dim)">
              Mật khẩu giải mã <span class="font-normal normal-case opacity-70">(Nếu ảnh được khóa AES-256)</span>
            </label>
            <input
              v-model="decodePassword"
              type="password"
              placeholder="Nhập mật khẩu (để trống nếu ảnh không đặt mật khẩu)..."
              class="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-cyan-400"
              style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
              @keyup.enter="runDecode"
            />
          </div>

          <button
            type="button"
            :disabled="isProcessing || !sourceUrl"
            class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 py-3 text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(0,245,255,0.3)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            @click="runDecode"
          >
            <Unlock class="h-4 w-4" />
            <span>{{ isProcessing ? 'Đang quét pixel...' : 'Quét & Giải Mã Tin Ẩn' }}</span>
          </button>

          <div
            v-if="decodeError"
            class="rounded-xl border border-rose-500/45 bg-rose-500/15 p-4 text-xs font-medium text-rose-300"
          >
            {{ decodeError }}
          </div>

          <div v-if="decodedMessage" class="space-y-2.5 rounded-2xl border border-cyan-400/45 bg-cyan-400/10 p-4">
            <div class="flex items-center justify-between">
              <span class="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                <CheckCircle2 class="h-4 w-4 text-emerald-400" />
                Tin nhắn bí mật được tìm thấy
                <span v-if="decodeInfo?.encrypted" class="rounded bg-emerald-400/20 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">
                  AES-256
                </span>
              </span>
              <button
                type="button"
                class="inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold text-cyan-300 hover:border-cyan-300"
                style="border-color: var(--border-subtle)"
                @click="copyText(decodedMessage, 'Đã sao chép tin nhắn bí mật!')"
              >
                <Copy class="h-3.5 w-3.5" /> Sao chép
              </button>
            </div>
            <pre
              class="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-xl border p-3.5 font-mono text-sm"
              style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
            >{{ decodedMessage }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
