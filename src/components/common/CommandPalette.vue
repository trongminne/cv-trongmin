<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, CornerDownLeft } from 'lucide-vue-next'
import { Icon } from '@iconify/vue'
import { useI18n } from '@/composables/useI18n'
import { useTheme } from '@/composables/useTheme'
import { useToast } from '@/composables/useToast'
import { contactInfo } from '@/data/portfolio'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  replayLoader: []
  openVoice: []
}>()

const router = useRouter()
const { lang, toggleLanguage } = useI18n()
const { toggleTheme } = useTheme()
const { copyText } = useToast()

const query = ref('')
const activeIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

interface CommandItem {
  id: string
  label: string
  group: string
  icon: string
  keywords: string
  action: () => void
}

const scrollTo = (id: string) => {
  if (router.currentRoute.value.path !== '/') {
    router.push('/').then(() => {
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 150)
    })
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
}

const commands = computed<CommandItem[]>(() => {
  const isEn = lang.value === 'en'
  return [
    { id: 'about', label: isEn ? 'Go to About Me' : 'Đi tới Thông tin cá nhân', group: 'Navigation', icon: 'fluent-emoji:bust-in-silhouette', keywords: 'about profile home 1', action: () => scrollTo('about') },
    { id: 'exp', label: isEn ? 'Go to Experience & Projects' : 'Đi tới Kinh nghiệm & Dự án', group: 'Navigation', icon: 'fluent-emoji:briefcase', keywords: 'experience projects work 2', action: () => scrollTo('experience') },
    { id: 'github', label: isEn ? 'Go to GitHub Live Showcase' : 'Đi tới GitHub Showcase', group: 'Navigation', icon: 'skill-icons:github-light', keywords: 'github repos code open source', action: () => scrollTo('github-showcase') },
    { id: 'edu', label: isEn ? 'Go to Education' : 'Đi tới Học vấn & Đào tạo', group: 'Navigation', icon: 'fluent-emoji:graduation-cap', keywords: 'education university gpa 3', action: () => scrollTo('education') },
    { id: 'skills', label: isEn ? 'Go to Technical Skills' : 'Đi tới Kỹ năng chuyên môn', group: 'Navigation', icon: 'fluent-emoji:hammer-and-wrench', keywords: 'skills tech stack asp.net python 4', action: () => scrollTo('skills') },
    { id: 'awards', label: isEn ? 'Go to Honors & Awards' : 'Đi tới Giải thưởng & Chứng nhận', group: 'Navigation', icon: 'fluent-emoji:trophy', keywords: 'awards honors scholarship 6', action: () => scrollTo('awards') },
    { id: 'contact', label: isEn ? 'Go to Contact Form' : 'Đi tới Form Liên hệ', group: 'Navigation', icon: 'fluent-emoji:e-mail', keywords: 'contact email message 7', action: () => scrollTo('contact') },
    { id: 'tools', label: isEn ? 'Open Dev Tools Hub (/tool)' : 'Mở Kho Công Cụ (/tool)', group: 'Tools', icon: 'fluent-emoji:toolbox', keywords: 'tool hub utilities', action: () => router.push('/tool') },
    { id: 'tool-steg', label: isEn ? 'Tool: Image Steganography (AES-256)' : 'Tool: Giấu Tin Bí Mật Trong Ảnh', group: 'Tools', icon: 'fluent-emoji:locked-with-key', keywords: 'steganography hide secret image aes', action: () => router.push('/tool/steganography') },
    { id: 'tool-exif', label: isEn ? 'Tool: EXIF GPS Spy & Cleaner' : 'Tool: Soi & Xóa Dữ Liệu Ẩn EXIF/GPS', group: 'Tools', icon: 'fluent-emoji:detective', keywords: 'exif gps metadata spy privacy image', action: () => router.push('/tool/exif-spy') },
    { id: 'tool-sandbox', label: isEn ? 'Tool: HTML/CSS/JS Live Sandbox' : 'Tool: Mini Sandbox HTML/CSS/JS', group: 'Tools', icon: 'fluent-emoji:laptop', keywords: 'sandbox codepen html css js live preview', action: () => router.push('/tool/code-sandbox') },
    { id: 'tool-qr', label: isEn ? 'Tool: Instant QR Code Generator' : 'Tool: Tạo Mã QR Tức Thì', group: 'Tools', icon: 'fluent-emoji:framed-picture', keywords: 'qr code wifi generator', action: () => router.push('/tool/qr-code') },
    { id: 'tool-color', label: isEn ? 'Tool: CSS Color Studio' : 'Tool: Bảng Màu & Chuyển Đổi CSS', group: 'Tools', icon: 'fluent-emoji:artist-palette', keywords: 'color hex rgb hsl palette css', action: () => router.push('/tool/color-converter') },
    { id: 'theme', label: isEn ? 'Toggle Theme (Neon / Aqua)' : 'Đổi giao diện (Neon / Aqua)', group: 'Actions', icon: 'fluent-emoji:sun', keywords: 'theme dark light color mode', action: () => toggleTheme() },
    { id: 'lang', label: isEn ? 'Switch Language (VN / EN)' : 'Đổi ngôn ngữ (VN / EN)', group: 'Actions', icon: lang.value === 'vi' ? 'circle-flags:us' : 'circle-flags:vn', keywords: 'language vietnamese english i18n', action: () => toggleLanguage() },
    { id: 'copy-email', label: isEn ? `Copy Email (${contactInfo.email})` : `Sao chép Email (${contactInfo.email})`, group: 'Actions', icon: 'fluent-emoji:clipboard', keywords: 'copy mail gmail', action: () => copyText(contactInfo.email) },
    { id: 'voice', label: isEn ? 'Open Voice Navigation' : 'Mở Điều khiển Giọng nói', group: 'Actions', icon: 'fluent-emoji:studio-microphone', keywords: 'voice mic speech', action: () => emit('openVoice') },
    { id: 'replay', label: isEn ? 'Replay Cyber Boot Loader' : 'Xem lại hiệu ứng Loading 3D', group: 'Actions', icon: 'fluent-emoji:rocket', keywords: 'loader boot animation replay', action: () => emit('replayLoader') },
  ]
})

const filtered = computed(() => {
  const q = query.value.toLowerCase().trim()
  if (!q) return commands.value
  return commands.value.filter(
    (c) => c.label.toLowerCase().includes(q) || c.keywords.includes(q) || c.group.toLowerCase().includes(q),
  )
})

watch(
  () => props.open,
  async (val) => {
    if (val) {
      query.value = ''
      activeIndex.value = 0
      await nextTick()
      inputRef.value?.focus()
    }
  },
)

watch(filtered, () => {
  activeIndex.value = 0
})

const runItem = (item: CommandItem) => {
  emit('close')
  item.action()
}

const onKeydown = (e: KeyboardEvent) => {
  if (!props.open) return
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % Math.max(1, filtered.value.length)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value - 1 + Math.max(1, filtered.value.length)) % Math.max(1, filtered.value.length)
  } else if (e.key === 'Enter' && filtered.value[activeIndex.value]) {
    e.preventDefault()
    runItem(filtered.value[activeIndex.value])
  } else if (e.key === 'Escape') {
    e.preventDefault()
    emit('close')
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Transition name="modal">
    <div
      v-if="open"
      class="fixed inset-0 z-[60] flex items-start justify-center bg-slate-950/70 px-4 pt-[12vh] backdrop-blur-md"
      @click.self="emit('close')"
    >
      <div class="cyber-glass w-full max-w-xl overflow-hidden rounded-2xl border border-cyan-400/45 shadow-[0_24px_80px_rgba(0,0,0,0.65)]">
        <!-- Search Input -->
        <div class="flex items-center gap-3 border-b px-4 py-3.5" style="border-color: var(--border-subtle)">
          <Search class="h-4 w-4 shrink-0 text-cyan-400" />
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            :placeholder="lang === 'en' ? 'Type a command or search section...' : 'Nhập lệnh nhanh hoặc tên mục cần đến...'"
            class="w-full bg-transparent text-sm outline-none"
            style="color: var(--text-main)"
          />
          <kbd
            class="rounded-md border px-2 py-0.5 font-mono text-[10px]"
            style="border-color: var(--border-subtle); color: var(--text-dim)"
          >
            ESC
          </kbd>
        </div>

        <!-- Results -->
        <div class="max-h-[360px] overflow-y-auto p-2">
          <div v-if="filtered.length === 0" class="py-8 text-center font-mono text-xs opacity-65">
            {{ lang === 'en' ? 'No matching commands.' : 'Không tìm thấy lệnh phù hợp.' }}
          </div>

          <button
            v-for="(item, idx) in filtered"
            :key="item.id"
            type="button"
            class="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition"
            :style="
              idx === activeIndex
                ? 'background: var(--accent-cyan-dim); color: var(--accent-cyan)'
                : 'color: var(--text-main)'
            "
            @mouseenter="activeIndex = idx"
            @click="runItem(item)"
          >
            <span class="flex items-center gap-3">
              <Icon :icon="item.icon" class="h-4 w-4 shrink-0" />
              <span class="font-medium">{{ item.label }}</span>
            </span>
            <span class="flex items-center gap-2 font-mono text-[10px] opacity-70">
              <span>{{ item.group }}</span>
              <CornerDownLeft v-if="idx === activeIndex" class="h-3.5 w-3.5" />
            </span>
          </button>
        </div>

        <!-- Footer hint -->
        <div
          class="flex items-center justify-between border-t px-4 py-2 font-mono text-[10px]"
          style="border-color: var(--border-subtle); color: var(--text-dim)"
        >
          <span>↑↓ Navigate • ↵ Select</span>
          <span>Command Palette // Ctrl + K</span>
        </div>
      </div>
    </div>
  </Transition>
</template>
