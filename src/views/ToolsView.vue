<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { ArrowLeft, ArrowRight, Search, Terminal, ShieldCheck } from 'lucide-vue-next'
import CyberPreloader from '@/components/common/CyberPreloader.vue'
import SocialIcons from '@/components/common/SocialIcons.vue'
import { toolsCatalog, type ToolCategory } from '@/data/tools'
import { useTheme } from '@/composables/useTheme'

const { isLight, toggleTheme } = useTheme()

const selectedCategory = ref<ToolCategory>('all')
const searchQuery = ref('')
const searchInputRef = ref<HTMLInputElement | null>(null)

const categories: { id: ToolCategory; label: string; count: number }[] = [
  { id: 'all', label: 'Tất cả', count: toolsCatalog.length },
  { id: 'security', label: 'Bảo mật & Forensics', count: toolsCatalog.filter((t) => t.category === 'security').length },
  { id: 'dev', label: 'Web & Utilities', count: toolsCatalog.filter((t) => t.category === 'dev').length },
  { id: 'design', label: 'UI & Design', count: toolsCatalog.filter((t) => t.category === 'design').length },
]

const filteredTools = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return toolsCatalog.filter((tool) => {
    const matchCat = selectedCategory.value === 'all' || tool.category === selectedCategory.value
    const matchQ =
      !q ||
      tool.name.toLowerCase().includes(q) ||
      tool.shortName.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(q))
    return matchCat && matchQ
  })
})

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

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <CyberPreloader subtitle="<CYBER TOOLS SUITE & SANDBOX/>" node-label="NODE: HN_VN // TOOL_HUB" />

  <div class="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- Top Header Bar -->
    <header class="cyber-glass mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl px-5 py-4">
      <div class="flex items-center gap-3">
        <RouterLink
          to="/"
          class="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-3.5 py-2 text-xs font-bold text-slate-950 transition hover:brightness-110"
        >
          <ArrowLeft class="h-4 w-4" />
          <span>Quay lại Portfolio</span>
        </RouterLink>
        <div class="hidden items-center gap-2 font-mono text-xs sm:flex" style="color: var(--text-dim)">
          <Terminal class="h-3.5 w-3.5 text-cyan-400" />
          <span>trongmin.io.vn/tool</span>
        </div>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition hover:border-cyan-400"
          style="border-color: var(--border-subtle); background: var(--bg-input)"
          @click="toggleTheme"
        >
          <Icon :icon="isLight ? 'fluent-emoji:crescent-moon' : 'fluent-emoji:sun'" class="h-4 w-4" />
          <span>{{ isLight ? 'Neon' : 'Aqua' }}</span>
        </button>
        <SocialIcons size="sm" :show-tool-link="false" />
      </div>
    </header>

    <!-- Hero Banner -->
    <section class="mb-8 text-center">
      <div class="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/35 bg-cyan-400/10 px-4 py-1 font-mono text-xs font-semibold text-cyan-300">
        <ShieldCheck class="h-3.5 w-3.5 text-emerald-400" />
        <span>100% CLIENT-SIDE // KHÔNG GỬI DỮ LIỆU LÊN SERVER</span>
      </div>
      <h1 class="font-heading text-3xl font-extrabold tracking-tight sm:text-5xl">
        Kho Công Cụ <span class="cyber-gradient-text">Chuyên Biệt</span>
      </h1>
      <p class="mx-auto mt-3 max-w-2xl text-sm sm:text-base" style="color: var(--text-muted)">
        Chọn một công cụ bên dưới để mở không gian làm việc riêng biệt, rộng rãi và mượt mà ngay trên trình duyệt.
      </p>
    </section>

    <!-- Search & Category Filter -->
    <div class="cyber-glass mb-8 flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative flex-1">
        <Search class="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-cyan-400" />
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          type="text"
          placeholder="Tìm công cụ (steganography, exif, gps, sandbox, qr, color)..."
          class="w-full rounded-xl border py-2.5 pr-16 pl-10 text-sm outline-none focus:border-cyan-400"
          style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
        />
        <kbd
          class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded border px-1.5 py-0.5 font-mono text-[10px]"
          style="border-color: var(--border-subtle); color: var(--accent-cyan)"
        >
          Ctrl+K
        </kbd>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          class="cursor-pointer rounded-xl border px-3 py-2 text-xs font-semibold transition"
          :style="
            selectedCategory === cat.id
              ? 'background: var(--accent-cyan-dim); border-color: var(--accent-cyan); color: var(--accent-cyan)'
              : 'background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-muted)'
          "
          @click="selectedCategory = cat.id; searchQuery = ''"
        >
          {{ cat.label }} ({{ cat.count }})
        </button>
      </div>
    </div>

    <!-- Tool Launcher Cards Grid -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <RouterLink
        v-for="tool in filteredTools"
        :key="tool.slug"
        v-spatial-tilt
        :to="`/tool/${tool.slug}`"
        class="cyber-glass group flex flex-col justify-between rounded-3xl p-6 transition-all duration-200 hover:-translate-y-1.5"
      >
        <div>
          <div class="mb-4 flex items-start justify-between gap-3">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl border shadow-md" :class="tool.accentClass">
              <Icon :icon="tool.icon" class="h-8 w-8" />
            </div>
            <div class="flex flex-col items-end gap-1.5">
              <span class="rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold" :class="tool.badgeBgClass">
                {{ tool.categoryLabel }}
              </span>
              <span
                v-if="tool.isNew"
                class="rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-2 py-0.5 font-mono text-[9px] font-extrabold text-slate-950"
              >
                MỚI
              </span>
            </div>
          </div>

          <h2 class="font-heading text-xl font-bold transition group-hover:text-cyan-400" style="color: var(--text-main)">
            {{ tool.name }}
          </h2>
          <p class="mt-2 text-xs leading-relaxed sm:text-sm" style="color: var(--text-muted)">
            {{ tool.description }}
          </p>

          <div class="mt-4 flex flex-wrap gap-1.5">
            <span
              v-for="tag in tool.tags"
              :key="tag"
              class="rounded-lg border px-2 py-0.5 font-mono text-[10px]"
              style="border-color: var(--border-subtle); background: var(--bg-input); color: var(--text-dim)"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <div
          class="mt-6 flex items-center justify-between border-t pt-4 font-mono text-xs font-bold"
          style="border-color: var(--border-subtle); color: var(--accent-cyan)"
        >
          <span>/tool/{{ tool.slug }}</span>
          <span class="inline-flex items-center gap-1 transition-transform group-hover:translate-x-1">
            Mở công cụ <ArrowRight class="h-4 w-4" />
          </span>
        </div>
      </RouterLink>
    </div>

    <!-- Footer -->
    <footer class="mt-14 border-t py-6 text-center font-mono text-xs" style="border-color: var(--border-subtle); color: var(--text-dim)">
      &copy; {{ new Date().getFullYear() }} Trọng Min (trongmin.io.vn) •
      <RouterLink to="/" class="text-cyan-400 hover:underline">Trang CV Portfolio</RouterLink>
    </footer>
  </div>
</template>
