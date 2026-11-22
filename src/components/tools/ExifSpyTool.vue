<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { Upload, MapPin, ShieldCheck, ShieldAlert, Download, ExternalLink, Trash2, Camera } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const emit = defineEmits<{ log: [text: string] }>()
const { showToast } = useToast()

interface ExifEntry {
  label: string
  value: string
  sensitive?: boolean
}

interface GpsCoords {
  lat: number
  lng: number
  altitude?: string
}

const isDragging = ref(false)
const fileInfo = ref<{ name: string; size: number; type: string; width: number; height: number } | null>(null)
const previewUrl = ref<string | null>(null)
const loadedImg = ref<HTMLImageElement | null>(null)
const exifEntries = ref<ExifEntry[]>([])
const gpsCoords = ref<GpsCoords | null>(null)
const cleanFormat = ref<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg')
const cleanQuality = ref(0.92)
const cleanedSize = ref<number | null>(null)

// Pure TypeScript EXIF / TIFF / GPS Binary Parser for JPEG
function parseJpegExif(buffer: ArrayBuffer): { entries: ExifEntry[]; gps: GpsCoords | null } {
  const view = new DataView(buffer)
  const entries: ExifEntry[] = []
  let gps: GpsCoords | null = null

  if (view.byteLength < 12 || view.getUint16(0, false) !== 0xffd8) {
    return { entries, gps }
  }

  let offset = 2
  while (offset + 4 < view.byteLength) {
    const marker = view.getUint16(offset, false)
    offset += 2
    if (marker === 0xffe1) {
      // APP1 segment
      const segLength = view.getUint16(offset, false)
      const exifStr = getAscii(view, offset + 2, 4)
      if (exifStr === 'Exif') {
        const tiffStart = offset + 8
        const littleEndian = view.getUint16(tiffStart, false) === 0x4949
        const firstIfdOffset = view.getUint32(tiffStart + 4, littleEndian)
        const ifd0 = readIfd(view, tiffStart, tiffStart + firstIfdOffset, littleEndian)

        const addTag = (val: unknown, label: string, sensitive = false) => {
          if (val !== undefined && val !== null && String(val).trim() !== '') {
            entries.push({ label, value: String(val).trim(), sensitive })
          }
        }

        addTag(ifd0[0x010f], 'Hãng thiết bị (Make)', true)
        addTag(ifd0[0x0110], 'Tên thiết bị / Camera (Model)', true)
        addTag(ifd0[0x0131], 'Phần mềm xử lý (Software)', true)
        addTag(ifd0[0x0132], 'Thời gian chỉnh sửa', true)
        addTag(ifd0[0x013b], 'Tác giả (Artist)', true)
        addTag(ifd0[0x8298], 'Bản quyền (Copyright)')

        // Exif SubIFD
        if (typeof ifd0[0x8769] === 'number') {
          const exifIfd = readIfd(view, tiffStart, tiffStart + ifd0[0x8769], littleEndian)
          addTag(exifIfd[0x9003], 'Ngày giờ chụp gốc (DateTimeOriginal)', true)
          addTag(exifIfd[0xa433], 'Hãng ống kính (LensMake)')
          addTag(exifIfd[0xa434], 'Model ống kính (LensModel)')
          if (typeof exifIfd[0x8827] === 'number') addTag(`ISO ${exifIfd[0x8827]}`, 'Độ nhạy sáng (ISO)')
          if (typeof exifIfd[0x829d] === 'number') addTag(`f/${Number(exifIfd[0x829d]).toFixed(1)}`, 'Khẩu độ (Aperture)')
          if (typeof exifIfd[0x829a] === 'number') {
            const exp = exifIfd[0x829a]
            addTag(exp < 1 ? `1/${Math.round(1 / exp)}s` : `${exp}s`, 'Tốc độ màn trập')
          }
          if (typeof exifIfd[0x920a] === 'number') addTag(`${Number(exifIfd[0x920a]).toFixed(1)} mm`, 'Tiêu cự (Focal Length)')
        }

        // GPS SubIFD
        if (typeof ifd0[0x8825] === 'number') {
          const gpsIfd = readIfd(view, tiffStart, tiffStart + ifd0[0x8825], littleEndian)
          const latArr = gpsIfd[0x0002] as number[] | undefined
          const latRef = String(gpsIfd[0x0001] || 'N')
          const lngArr = gpsIfd[0x0004] as number[] | undefined
          const lngRef = String(gpsIfd[0x0003] || 'E')

          if (Array.isArray(latArr) && latArr.length >= 3 && Array.isArray(lngArr) && lngArr.length >= 3) {
            let lat = latArr[0] + latArr[1] / 60 + latArr[2] / 3600
            let lng = lngArr[0] + lngArr[1] / 60 + lngArr[2] / 3600
            if (latRef === 'S') lat = -lat
            if (lngRef === 'W') lng = -lng
            if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
              const alt = typeof gpsIfd[0x0006] === 'number' ? `${Number(gpsIfd[0x0006]).toFixed(1)} m` : undefined
              gps = { lat, lng, altitude: alt }
              entries.unshift({
                label: 'Tọa độ GPS (Vĩ độ, Kinh độ)',
                value: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                sensitive: true,
              })
            }
          }
        }
        break
      }
      offset += segLength
    } else if ((marker & 0xff00) !== 0xff00) {
      break
    } else {
      const size = view.getUint16(offset, false)
      offset += size
    }
  }
  return { entries, gps }
}

function getAscii(view: DataView, start: number, len: number): string {
  let out = ''
  for (let i = 0; i < len && start + i < view.byteLength; i++) {
    const c = view.getUint8(start + i)
    if (c === 0) break
    out += String.fromCharCode(c)
  }
  return out
}

function readIfd(view: DataView, tiffStart: number, dirStart: number, le: boolean): Record<number, unknown> {
  const tags: Record<number, unknown> = {}
  if (dirStart + 2 > view.byteLength) return tags
  const count = view.getUint16(dirStart, le)

  for (let i = 0; i < count; i++) {
    const entryOffset = dirStart + 2 + i * 12
    if (entryOffset + 12 > view.byteLength) break
    const tag = view.getUint16(entryOffset, le)
    const type = view.getUint16(entryOffset + 2, le)
    const numValues = view.getUint32(entryOffset + 4, le)
    const valOffset = entryOffset + 8

    if (type === 2) {
      // ASCII
      const strOffset = numValues > 4 ? tiffStart + view.getUint32(valOffset, le) : valOffset
      tags[tag] = getAscii(view, strOffset, numValues)
    } else if (type === 3 && numValues === 1) {
      tags[tag] = view.getUint16(valOffset, le)
    } else if (type === 4 && numValues === 1) {
      tags[tag] = view.getUint32(valOffset, le)
    } else if (type === 5) {
      // Rational (unsigned)
      const dataOff = tiffStart + view.getUint32(valOffset, le)
      if (numValues === 1 && dataOff + 8 <= view.byteLength) {
        const num = view.getUint32(dataOff, le)
        const den = view.getUint32(dataOff + 4, le) || 1
        tags[tag] = num / den
      } else if (numValues > 1 && dataOff + numValues * 8 <= view.byteLength) {
        const arr: number[] = []
        for (let k = 0; k < numValues; k++) {
          const num = view.getUint32(dataOff + k * 8, le)
          const den = view.getUint32(dataOff + k * 8 + 4, le) || 1
          arr.push(num / den)
        }
        tags[tag] = arr
      }
    }
  }
  return tags
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

async function handleFile(file: File | undefined) {
  if (!file || !file.type.startsWith('image/')) {
    showToast('Vui lòng chọn tệp ảnh hợp lệ (JPG, PNG, WebP)!', '⚠️')
    return
  }

  cleanedSize.value = null
  const buffer = await file.arrayBuffer()
  const { entries, gps } = parseJpegExif(buffer)
  exifEntries.value = entries
  gpsCoords.value = gps

  const url = URL.createObjectURL(file)
  const img = new Image()
  img.onload = () => {
    previewUrl.value = url
    loadedImg.value = img
    fileInfo.value = {
      name: file.name,
      size: file.size,
      type: file.type,
      width: img.naturalWidth,
      height: img.naturalHeight,
    }
    emit('log', `Quét EXIF ${file.name}: ${entries.length} thẻ${gps ? ' (CÓ GPS!)' : ''}`)
  }
  img.src = url
}

const onFileChange = (e: Event) => {
  handleFile((e.target as HTMLInputElement).files?.[0])
}

const onDrop = (e: DragEvent) => {
  isDragging.value = false
  handleFile(e.dataTransfer?.files?.[0])
}

const clearFile = () => {
  previewUrl.value = null
  loadedImg.value = null
  fileInfo.value = null
  exifEntries.value = []
  gpsCoords.value = null
  cleanedSize.value = null
}

const downloadCleanedImage = () => {
  if (!loadedImg.value || !fileInfo.value) return
  const canvas = document.createElement('canvas')
  canvas.width = loadedImg.value.naturalWidth
  canvas.height = loadedImg.value.naturalHeight
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(loadedImg.value, 0, 0)

  canvas.toBlob(
    (blob) => {
      if (!blob) return
      cleanedSize.value = blob.size
      const url = URL.createObjectURL(blob)
      const ext = cleanFormat.value === 'image/png' ? 'png' : cleanFormat.value === 'image/webp' ? 'webp' : 'jpg'
      const base = fileInfo.value!.name.replace(/\.[^.]+$/, '') || 'clean-image'
      const a = document.createElement('a')
      a.href = url
      a.download = `${base}-clean.${ext}`
      a.click()
      URL.revokeObjectURL(url)
      showToast('Đã xóa sạch 100% dữ liệu EXIF / GPS và tải ảnh về máy!', '🛡️')
      emit('log', `Xuất ảnh sạch EXIF (${formatBytes(blob.size)})`)
    },
    cleanFormat.value,
    cleanQuality.value,
  )
}
</script>

<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
    <!-- Left: Dropzone & Privacy Cleaner -->
    <div class="space-y-4 lg:col-span-5">
      <div
        class="cyber-glass flex min-h-[290px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition"
        :class="isDragging ? 'border-rose-400 bg-rose-400/10' : ''"
        style="border-color: var(--border-subtle)"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
      >
        <template v-if="!previewUrl">
          <div class="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400">
            <Camera class="h-7 w-7" />
          </div>
          <p class="font-heading text-base font-bold">Kéo thả ảnh chụp để soi EXIF / GPS</p>
          <p class="mt-1 text-xs" style="color: var(--text-muted)">
            Hỗ trợ ảnh chụp trực tiếp từ iPhone, Android, máy ảnh DSLR (JPEG chứa nhiều EXIF nhất)
          </p>
          <label
            class="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition hover:brightness-110"
          >
            <Upload class="h-4 w-4" />
            <span>Chọn ảnh để kiểm tra</span>
            <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
          </label>
        </template>

        <template v-else>
          <img :src="previewUrl" alt="Preview" class="max-h-[230px] rounded-xl object-contain shadow-lg" />
          <div v-if="fileInfo" class="mt-4 flex w-full items-center justify-between gap-2 border-t pt-3 font-mono text-[11px]" style="border-color: var(--border-subtle)">
            <span class="truncate" style="color: var(--text-dim)">
              {{ fileInfo.name }} • {{ fileInfo.width }}×{{ fileInfo.height }} • {{ formatBytes(fileInfo.size) }}
            </span>
            <button
              type="button"
              class="cursor-pointer rounded-lg border p-1.5 text-rose-400 hover:border-rose-400"
              style="border-color: var(--border-subtle)"
              @click="clearFile"
            >
              <Trash2 class="h-3.5 w-3.5" />
            </button>
          </div>
        </template>
      </div>

      <!-- Strip Metadata Action Card -->
      <div v-if="fileInfo" class="cyber-glass space-y-4 rounded-2xl p-5">
        <div class="flex items-center gap-2 font-heading text-base font-bold text-emerald-400">
          <ShieldCheck class="h-5 w-5" />
          <span>Xóa Sạch Dữ Liệu Ẩn & Tải Ảnh An Toàn</span>
        </div>

        <div class="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label class="mb-1 block font-semibold" style="color: var(--text-dim)">Định dạng xuất</label>
            <select
              v-model="cleanFormat"
              class="w-full rounded-xl border px-3 py-2 outline-none focus:border-cyan-400"
              style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
            >
              <option value="image/jpeg">JPEG (.jpg)</option>
              <option value="image/webp">WebP (.webp — nhẹ nhất)</option>
              <option value="image/png">PNG (.png — không nén)</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block font-semibold" style="color: var(--text-dim)">
              Chất lượng: <strong class="text-cyan-400">{{ Math.round(cleanQuality * 100) }}%</strong>
            </label>
            <input
              v-model.number="cleanQuality"
              type="range"
              min="0.6"
              max="1"
              step="0.02"
              :disabled="cleanFormat === 'image/png'"
              class="mt-2 w-full accent-cyan-400"
            />
          </div>
        </div>

        <button
          type="button"
          class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 py-3 text-xs font-bold text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.3)] transition hover:brightness-110"
          @click="downloadCleanedImage"
        >
          <Download class="h-4 w-4" />
          <span>Xóa 100% EXIF / GPS & Tải Ảnh Sạch</span>
        </button>

        <p v-if="cleanedSize !== null" class="text-center font-mono text-[11px] text-emerald-400">
          ✓ Đã xuất ảnh sạch metadata ({{ formatBytes(cleanedSize) }})
        </p>
      </div>
    </div>

    <!-- Right: EXIF & GPS Report -->
    <div class="space-y-4 lg:col-span-7">
      <!-- GPS Alert Banner -->
      <div
        v-if="gpsCoords"
        class="rounded-2xl border border-rose-500/60 bg-rose-500/15 p-5 shadow-[0_0_28px_rgba(244,63,94,0.2)]"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="flex items-start gap-3">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/25 text-rose-400">
              <MapPin class="h-6 w-6 animate-bounce" />
            </div>
            <div>
              <h3 class="font-heading text-base font-bold text-rose-300">
                CẢNH BÁO: PHÁT HIỆN TỌA ĐỘ GPS TRONG ẢNH!
              </h3>
              <p class="mt-1 font-mono text-xs text-rose-200/90">
                Vĩ độ: {{ gpsCoords.lat.toFixed(6) }} • Kinh độ: {{ gpsCoords.lng.toFixed(6) }}
                <span v-if="gpsCoords.altitude"> • Độ cao: {{ gpsCoords.altitude }}</span>
              </p>
            </div>
          </div>

          <a
            :href="`https://www.google.com/maps?q=${gpsCoords.lat},${gpsCoords.lng}`"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 rounded-xl bg-rose-500 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-rose-400"
          >
            <span>Xem trên Google Maps</span>
            <ExternalLink class="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <!-- Metadata Table -->
      <div class="cyber-glass rounded-2xl p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="flex items-center gap-2 font-heading text-lg font-bold">
            <Icon icon="fluent-emoji:magnifying-glass-tilted-left" class="h-5 w-5" />
            <span>Báo Cáo Dữ Liệu Ẩn (EXIF Forensics)</span>
          </h3>
          <span
            v-if="fileInfo"
            class="rounded-full border px-3 py-1 font-mono text-xs font-bold"
            :class="
              exifEntries.length > 0
                ? 'border-amber-400/45 bg-amber-400/15 text-amber-300'
                : 'border-emerald-400/45 bg-emerald-400/15 text-emerald-300'
            "
          >
            {{ exifEntries.length > 0 ? `${exifEntries.length} thẻ metadata` : 'Ảnh sạch' }}
          </span>
        </div>

        <div v-if="!fileInfo" class="py-14 text-center text-sm" style="color: var(--text-muted)">
          Chọn một bức ảnh ở khung bên trái để phân tích thiết bị chụp, thông số ống kính và tọa độ GPS.
        </div>

        <div v-else-if="exifEntries.length === 0" class="rounded-xl border border-emerald-400/35 bg-emerald-400/10 p-5 text-center">
          <ShieldCheck class="mx-auto mb-2 h-9 w-9 text-emerald-400" />
          <p class="font-heading text-base font-bold text-emerald-300">Không phát hiện dữ liệu EXIF / GPS ẩn!</p>
          <p class="mt-1 text-xs" style="color: var(--text-muted)">
            Bức ảnh này không chứa thông tin thiết bị hoặc vị trí địa lý (thường đã được xóa sẵn hoặc là file PNG/ảnh tải từ mạng xã hội).
          </p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="(item, idx) in exifEntries"
            :key="idx"
            class="flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-2.5 text-xs"
            :class="item.sensitive ? 'border-amber-400/35 bg-amber-400/8' : ''"
            style="border-color: var(--border-subtle); background: var(--bg-input)"
          >
            <span class="flex items-center gap-2 font-semibold" style="color: var(--text-muted)">
              <ShieldAlert v-if="item.sensitive" class="h-3.5 w-3.5 text-amber-400" />
              <span>{{ item.label }}</span>
            </span>
            <span class="font-mono font-bold" style="color: var(--accent-cyan)">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
