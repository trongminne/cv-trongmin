<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import {
  ArrowLeft,
  Search,
  Terminal,
  Clock,
  ShieldCheck,
  PenSquare,
  Copy,
  Trash2,
  ListChecks,
  Keyboard,
  Sun,
  Moon,
  Layers,
} from 'lucide-vue-next'
import CyberPreloader from '@/components/common/CyberPreloader.vue'
import SocialIcons from '@/components/common/SocialIcons.vue'
import AiPromptTool from '@/components/tools/AiPromptTool.vue'
import PasswordTool from '@/components/tools/PasswordTool.vue'
import JsonFormatterTool from '@/components/tools/JsonFormatterTool.vue'
import Base64UrlTool from '@/components/tools/Base64UrlTool.vue'
import QrCodeTool from '@/components/tools/QrCodeTool.vue'
import UuidTimestampTool from '@/components/tools/UuidTimestampTool.vue'
import RegexTesterTool from '@/components/tools/RegexTesterTool.vue'
import ColorConverterTool from '@/components/tools/ColorConverterTool.vue'
import { useTheme } from '@/composables/useTheme'
import { useToast } from '@/composables/useToast'

const { isLight, toggleTheme } = useTheme()
const { copyText, showToast } = useToast()

type Category = 'all' | 'ai' | 'security' | 'dev' | 'encoding'

const tools = [
  { id: 'ai-prompt', category: 'ai' as Category, keywords: 'ai prompt chatgpt claude gemini', component: AiPromptTool },
  { id: 'password', category: 'security' as Category, keywords: 'password secret key token mat khau', component: PasswordTool },
  { id: 'json', category: 'dev' as Category, keywords: 'json format prettify minify validator', component: JsonFormatterTool },
  { id: 'codec', category: 'encoding' as Category, keywords: 'base64 url encode decode ma hoa', component: Base64UrlTool },
  { id: 'qr', category: 'dev' as Category, keywords: 'qr code generator barcode link', component: QrCodeTool },
  { id: 'uuid', category: 'dev' as Category, keywords: 'uuid guid unix timestamp time', component: UuidTimestampTool },
  { id: 'regex', category: 'dev' as Category, keywords: 'regex pattern matcher test', component: RegexTesterTool },
  { id: 'color', category: 'dev' as Category, keywords: 'color picker hex rgb hsl css mau', component: ColorConverterTool },
]

const categories: { id: Category; label: string; badge: string }[] = [
  { id: 'all', label: 'Tất cả công cụ', badge: '8' },
  { id: 'ai', label: 'AI Studio', badge: 'AI' },
  { id: 'security', label: 'Bảo mật', badge: 'SEC' },
  { id: 'dev', label: 'Dev & Code', badge: 'DEV' },
  { id: 'encoding', label: 'Mã hóa / Codec', badge: 'CODEC' },
]

const selectedCategory = ref<Category>('all')
const searchQuery = ref('')
const searchInputRef = ref<HTMLInputElement | null>(null)

const filteredTools = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return tools.filter((t) => {
    const matchCat = selectedCategory.value === 'all' || t.category === selectedCategory.value
    const matchQuery = !q || t.keywords.includes(q) || t.id.includes(q)
    return matchCat && matchQuery
  })
})

// Scratchpad
const SCRATCHPAD_KEY = 'tm_cyber_scratchpad_v1'
const scratchpad = ref('')

watch(scratchpad, (val) => {
  localStorage.setItem(SCRATCHPAD_KEY, val)
})

const clearScratchpad = () => {
  scratchpad.value = ''
  localStorage.removeItem(SCRATCHPAD_KEY)
  showToast('Đã xóa bảng nháp', '🗑️')
  addLog('Xóa sạch bảng nháp')
}

const copyScratchpad = () => {
  if (!scratchpad.value) return
  copyText(scratchpad.value, 'Đã sao chép bảng nháp!')
  addLog('Sao chép bảng nháp')
}

// Live Action Logs
const actionLogs = ref<{ time: string; text: string }[]>([])
const addLog = (text: string) => {
  const time = new Date().toTimeString().split(' ')[0]
  actionLogs.value.unshift({ time, text })
  if (actionLogs.value.length > 12) actionLogs.value.pop()
}

// Live Telemetry Clock
const clockStr = ref('--:--:--')
const pingMs = ref(14)
let clockTimer: ReturnType<typeof setInterval> | null = null

const updateClock = () => {
  clockStr.value = `${new Date().toTimeString().split(' ')[0]} (GMT+7)`
  if (Math.random() < 0.2) {
    pingMs.value = Math.floor(Math.random() * 8 + 11)
  }
}

const onKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    searchInputRef.value?.focus()
    searchInputRef.value?.select()
  } else if (e.key === 'Escape' && document.activeElement === searchInputRef.value) {
    searchQuery.value = ''
    searchInputRef.value?.blur()
  }
}

onMounted(() => {
  scratchpad.value = localStorage.getItem(SCRATCHPAD_KEY) || ''
  updateClock()
  clockTimer = setInterval(updateClock, 1000)
  window.addEventListener('keydown', onKeydown)
  addLog('Hệ thống Tool Hub đã khởi động')
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <CyberPreloader subtitle="<DEV TOOLS HUB & UTILITIES/>" node-label="NODE: HN_VN // TOOL_CORE" />

  <div class="mx-auto grid min-h-screen max-w-[1680px] grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-12 lg:px-6">
    <!-- Left Sidebar -->
    <aside class="space-y-4 lg:col-span-3 xl:col-span-2">
      <div class="sticky top-6 space-y-4">
        <!-- Profile Card -->
        <div class="cyber-glass rounded-2xl p-5 text-center">
          <div class="mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full border-2 border-cyan-400/70 p-1">
            <img src="/assets/img/add.jpg" alt="Trọng Min" class="h-full w-full rounded-full object-cover" />
          </div>
          <div class="font-heading text-lg font-bold">TRỌNG MIN</div>
          <div class="font-mono text-xs text-cyan-400">&lt;dev.tools_hub/&gt;</div>

          <div class="mt-4 flex flex-col gap-2">
            <RouterLink
              to="/"
              class="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-3 py-2 text-xs font-bold text-slate-950 transition hover:brightness-110"
            >
              <ArrowLeft class="h-3.5 w-3.5" />
              <span>Quay lại Portfolio</span>
            </RouterLink>

            <button
              type="button"
              class="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition hover:border-cyan-400"
              style="border-color: var(--border-subtle); background: var(--bg-input)"
              @click="toggleTheme"
            >
              <Moon v-if="isLight" class="h-3.5 w-3.5 text-sky-600" />
              <Sun v-else class="h-3.5 w-3.5 text-amber-300" />
              <span>{{ isLight ? 'Tone Xanh Neon' : 'Tone Xanh Sáng' }}</span>
            </button>
          </div>
        </div>

        <!-- Category Nav -->
        <nav class="cyber-glass rounded-2xl p-4">
          <div class="mb-3 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider" style="color: var(--text-dim)">
            <Layers class="h-3.5 w-3.5 text-cyan-400" />
            <span>Danh mục</span>
          </div>
          <ul class="space-y-1">
            <li v-for="cat in categories" :key="cat.id">
              <button
                type="button"
                class="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition"
                :style="
                  selectedCategory === cat.id
                    ? 'background: var(--accent-cyan-dim); color: var(--accent-cyan); border: 1px solid var(--border-active)'
                    : 'color: var(--text-muted); border: 1px solid transparent'
                "
                @click="selectedCategory = cat.id; searchQuery = ''"
              >
                <span>{{ cat.label }}</span>
                <span class="font-mono text-[10px] opacity-80">{{ cat.badge }}</span>
              </button>
            </li>
          </ul>
        </nav>

        <!-- Telemetry -->
        <div class="cyber-glass space-y-2 rounded-2xl p-4 font-mono text-[11px]">
          <div class="flex items-center justify-between">
            <span class="flex items-center gap-1.5" style="color: var(--text-dim)"><Clock class="h-3 w-3" /> GIỜ:</span>
            <span class="text-cyan-400">{{ clockStr }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span style="color: var(--text-dim)">GIAO THỨC:</span>
            <span class="text-emerald-400">TLS 1.3</span>
          </div>
          <div class="flex items-center justify-between">
            <span style="color: var(--text-dim)">ĐỘ TRỄ:</span>
            <span class="text-sky-400">{{ pingMs }}ms</span>
          </div>
        </div>

        <div class="flex justify-center">
          <SocialIcons size="sm" :show-tool-link="false" />
        </div>
      </div>
    </aside>

    <!-- Center Main Workspace -->
    <main class="space-y-6 lg:col-span-9 xl:col-span-7">
      <!-- Banner -->
      <section class="cyber-glass rounded-2xl p-6">
        <div class="mb-2 inline-flex items-center gap-2 font-mono text-xs text-cyan-400">
          <Terminal class="h-3.5 w-3.5" />
          <span>https://trongmin.io.vn/tool // DEV_SUITE</span>
        </div>
        <h1 class="font-heading text-2xl font-extrabold sm:text-3xl">
          Kho Công Cụ <span class="cyber-gradient-text">Trực Tuyến & Thông Minh</span>
        </h1>
        <p class="mt-2 text-sm" style="color: var(--text-muted)">
          Tổng hợp các tiện ích lập trình, mã hóa, định dạng JSON, sinh mật khẩu bảo mật và tối ưu Prompt AI chạy 100% trên trình duyệt.
        </p>
      </section>

      <!-- Search & Filter -->
      <div class="cyber-glass space-y-3 rounded-2xl p-4">
        <div class="relative flex items-center">
          <Search class="pointer-events-none absolute left-3.5 h-4 w-4 text-cyan-400" />
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm nhanh công cụ (json, base64, password, qr, regex, color)..."
            class="w-full rounded-xl border py-2.5 pr-20 pl-10 text-sm outline-none focus:border-cyan-400"
            style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
          />
          <kbd
            class="pointer-events-none absolute right-3 rounded-md border px-2 py-0.5 font-mono text-[10px]"
            style="border-color: var(--border-subtle); color: var(--accent-cyan)"
          >
            Ctrl + K
          </kbd>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in categories"
            :key="cat.id"
            type="button"
            class="cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition"
            :style="
              selectedCategory === cat.id
                ? 'background: var(--accent-cyan-dim); border-color: var(--accent-cyan); color: var(--accent-cyan)'
                : 'background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-muted)'
            "
            @click="selectedCategory = cat.id; searchQuery = ''"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>

      <!-- Tools Grid -->
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <component
          :is="tool.component"
          v-for="tool in filteredTools"
          :key="tool.id"
          @log="addLog"
        />
      </div>

      <footer class="border-t py-6 text-center font-mono text-xs" style="border-color: var(--border-subtle); color: var(--text-dim)">
        &copy; {{ new Date().getFullYear() }} Trọng Min (trongmin.io.vn) •
        <RouterLink to="/" class="text-cyan-400 hover:underline">Quay về trang CV Portfolio</RouterLink>
      </footer>
    </main>

    <!-- Right Utility Column -->
    <aside class="space-y-4 lg:col-span-12 xl:col-span-3">
      <div class="sticky top-6 space-y-4">
        <!-- Scratchpad -->
        <div class="cyber-glass rounded-2xl p-4">
          <div class="mb-2.5 flex items-center justify-between">
            <span class="flex items-center gap-1.5 font-heading text-sm font-bold">
              <PenSquare class="h-4 w-4 text-cyan-400" /> Bảng Nháp Lập Trình
            </span>
            <div class="flex gap-1.5">
              <button
                type="button"
                title="Sao chép nháp"
                class="cursor-pointer rounded-lg border p-1.5 hover:border-cyan-400"
                style="border-color: var(--border-subtle); color: var(--accent-cyan)"
                @click="copyScratchpad"
              >
                <Copy class="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Xóa nháp"
                class="cursor-pointer rounded-lg border p-1.5 text-rose-400 hover:border-rose-400"
                style="border-color: var(--border-subtle)"
                @click="clearScratchpad"
              >
                <Trash2 class="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <textarea
            v-model="scratchpad"
            rows="6"
            placeholder="Ghi chú nhanh, paste token hoặc đoạn mã tạm thời (tự động lưu)..."
            class="w-full resize-y rounded-xl border p-3 font-mono text-xs outline-none focus:border-cyan-400"
            style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
          />
          <div class="mt-1.5 flex justify-between font-mono text-[11px]" style="color: var(--text-dim)">
            <span>{{ scratchpad.length }} ký tự</span>
            <span class="text-emerald-400">Auto-saved</span>
          </div>
        </div>

        <!-- Action Logs -->
        <div class="cyber-glass rounded-2xl p-4">
          <div class="mb-2.5 flex items-center justify-between">
            <span class="flex items-center gap-1.5 font-heading text-sm font-bold">
              <ListChecks class="h-4 w-4 text-cyan-400" /> Nhật Ký Thao Tác
            </span>
            <span class="font-mono text-[10px] font-bold text-emerald-400">LIVE</span>
          </div>
          <div class="max-h-48 space-y-1.5 overflow-y-auto font-mono text-[11px]">
            <div v-if="actionLogs.length === 0" class="opacity-60">Chưa có thao tác nào.</div>
            <div
              v-for="(log, idx) in actionLogs"
              :key="idx"
              class="rounded-lg border px-2.5 py-1.5"
              style="border-color: var(--border-subtle); background: var(--bg-input)"
            >
              <span class="text-cyan-400">[{{ log.time }}]</span> {{ log.text }}
            </div>
          </div>
        </div>

        <!-- Hotkeys -->
        <div class="cyber-glass rounded-2xl p-4">
          <div class="mb-2.5 flex items-center gap-1.5 font-heading text-sm font-bold">
            <Keyboard class="h-4 w-4 text-sky-400" /> Phím Tắt Nhanh
          </div>
          <div class="space-y-2 font-mono text-xs">
            <div class="flex items-center justify-between">
              <span style="color: var(--text-muted)">Tìm công cụ</span>
              <kbd class="rounded border px-2 py-0.5 text-[10px] text-cyan-400" style="border-color: var(--border-subtle)">Ctrl + K</kbd>
            </div>
            <div class="flex items-center justify-between">
              <span style="color: var(--text-muted)">Xóa tìm kiếm</span>
              <kbd class="rounded border px-2 py-0.5 text-[10px] text-cyan-400" style="border-color: var(--border-subtle)">ESC</kbd>
            </div>
          </div>
        </div>

        <!-- Security Pledge -->
        <div class="cyber-glass flex items-start gap-3 rounded-2xl border-emerald-400/30 p-4">
          <ShieldCheck class="h-6 w-6 shrink-0 text-emerald-400" />
          <div>
            <h4 class="font-heading text-xs font-bold text-emerald-400">Bảo Mật 100% Phía Client</h4>
            <p class="mt-1 text-[11px] leading-relaxed" style="color: var(--text-muted)">
              Mọi thuật toán mã hóa, sinh mật khẩu và định dạng JSON đều chạy trực tiếp trên trình duyệt của bạn.
            </p>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>
