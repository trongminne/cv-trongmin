<script setup lang="ts">
import { ref } from 'vue'
import { Menu, X, Mic, Keyboard, Sun, Moon, Terminal, Wrench } from 'lucide-vue-next'
import { navSections } from '@/data/portfolio'
import { useI18n } from '@/composables/useI18n'
import { useTheme } from '@/composables/useTheme'
import { useVoiceNav } from '@/composables/useVoiceNav'
import SocialIcons from '@/components/common/SocialIcons.vue'

defineProps<{
  activeSection: string
}>()

const emit = defineEmits<{
  openShortcuts: []
  openVoiceGuide: []
}>()

const { lang, t, setLanguage, toggleLanguage } = useI18n()
const { isLight, toggleTheme } = useTheme()
const { isListening } = useVoiceNav()
const mobileOpen = ref(false)

const jumpTo = (id: string) => {
  mobileOpen.value = false
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <!-- Mobile Topbar -->
  <header
    class="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b px-4 backdrop-blur-xl lg:hidden"
    style="background: var(--bg-sidebar); border-color: var(--border-subtle)"
  >
    <button
      type="button"
      class="flex cursor-pointer items-center gap-2 font-heading text-lg font-bold tracking-wide"
      style="color: var(--accent-cyan)"
      @click="jumpTo('about')"
    >
      <Terminal class="h-5 w-5" />
      <span>TRỌNG MIN</span>
    </button>

    <div class="flex items-center gap-2">
      <button
        type="button"
        class="cursor-pointer rounded-lg border px-2.5 py-1 font-mono text-xs font-semibold"
        style="border-color: var(--border-subtle); color: var(--accent-cyan); background: var(--bg-surface)"
        @click="toggleLanguage"
      >
        {{ lang.toUpperCase() }}
      </button>
      <button
        type="button"
        class="cursor-pointer rounded-lg border p-2"
        style="border-color: var(--border-subtle); color: var(--text-main); background: var(--bg-surface)"
        @click="toggleTheme"
        :aria-label="isLight ? 'Switch to Neon Blue' : 'Switch to Light Aqua'"
      >
        <Moon v-if="isLight" class="h-4 w-4" />
        <Sun v-else class="h-4 w-4" />
      </button>
      <button
        type="button"
        class="cursor-pointer rounded-lg border p-2"
        style="border-color: var(--border-subtle); color: var(--text-main); background: var(--bg-surface)"
        @click="mobileOpen = !mobileOpen"
        aria-label="Toggle Menu"
      >
        <X v-if="mobileOpen" class="h-5 w-5" />
        <Menu v-else class="h-5 w-5" />
      </button>
    </div>
  </header>

  <!-- Mobile Drawer -->
  <Transition name="fade">
    <div
      v-if="mobileOpen"
      class="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm lg:hidden"
      @click="mobileOpen = false"
    />
  </Transition>

  <aside
    :class="[
      'fixed top-0 left-0 z-40 flex h-screen w-[285px] flex-col justify-between border-r px-5 py-6 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0',
      mobileOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
    style="background: var(--bg-sidebar); border-color: var(--border-subtle)"
  >
    <!-- Profile Header -->
    <div class="flex flex-col items-center text-center">
      <div class="relative mb-3">
        <div class="h-24 w-24 overflow-hidden rounded-full border-2 border-cyan-400/70 p-1 shadow-[0_0_25px_rgba(0,245,255,0.3)]">
          <img
            src="/assets/img/add.jpg"
            alt="Trọng Min Avatar"
            class="h-full w-full rounded-full object-cover"
          />
        </div>
        <span
          class="absolute -right-1 bottom-1 h-4 w-4 rounded-full border-2 border-slate-900 bg-emerald-400 shadow-[0_0_10px_#34d399]"
          title="Online"
        />
      </div>

      <button
        type="button"
        class="cursor-pointer font-heading text-xl font-bold tracking-tight transition hover:opacity-85"
        style="color: var(--text-main)"
        @click="jumpTo('about')"
      >
        Trọng Min
      </button>
      <div class="font-mono text-xs" style="color: var(--accent-cyan)">&lt;dev.trongmin/&gt;</div>

      <div
        class="mt-2.5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium"
        style="border-color: var(--border-subtle); background: var(--accent-cyan-dim); color: var(--text-main)"
      >
        <span class="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        <span>{{ t('nav_status') }}</span>
      </div>
    </div>

    <!-- Navigation Links -->
    <nav class="my-4 flex-1 overflow-y-auto pr-1" aria-label="Portfolio sections">
      <ul class="space-y-1">
        <li v-for="item in navSections" :key="item.id">
          <button
            type="button"
            class="group flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all"
            :class="
              activeSection === item.id
                ? 'border shadow-[0_0_18px_rgba(0,245,255,0.18)]'
                : 'border border-transparent hover:bg-sky-400/10'
            "
            :style="
              activeSection === item.id
                ? 'background: var(--accent-cyan-dim); border-color: var(--border-active); color: var(--accent-cyan)'
                : 'color: var(--text-muted)'
            "
            @click="jumpTo(item.id)"
          >
            <span class="flex items-center gap-2.5">
              <span class="font-mono text-xs opacity-75">[{{ item.code }}]</span>
              <span>{{ t(item.labelKey) }}</span>
            </span>
            <span
              v-if="item.isHot"
              class="rounded-full bg-cyan-400/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-cyan-300"
            >
              {{ t('nav_badge_new') }}
            </span>
          </button>
        </li>
      </ul>

      <RouterLink
        to="/tool"
        class="mt-3 flex w-full items-center justify-between rounded-xl border border-amber-400/35 bg-amber-400/10 px-3 py-2.5 text-sm font-semibold text-amber-300 transition hover:border-amber-300 hover:bg-amber-400/20"
      >
        <span class="flex items-center gap-2">
          <Wrench class="h-4 w-4" />
          <span>{{ t('nav_tools_hub') }}</span>
        </span>
        <span class="font-mono text-[10px] opacity-85">/tool</span>
      </RouterLink>
    </nav>

    <!-- Bottom Controls -->
    <div class="space-y-2.5 border-t pt-4" style="border-color: var(--border-subtle)">
      <div class="grid grid-cols-2 gap-2">
        <button
          type="button"
          class="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs font-semibold transition"
          :class="
            isListening
              ? 'border-rose-400 bg-rose-500/20 text-rose-400 shadow-[0_0_14px_rgba(244,63,94,0.3)]'
              : 'border-emerald-400/40 bg-emerald-400/12 text-emerald-400 hover:border-emerald-400 hover:bg-emerald-400/20'
          "
          @click="emit('openVoiceGuide')"
        >
          <Mic class="h-3.5 w-3.5" :class="isListening ? 'animate-pulse' : ''" />
          <span>{{ t('nav_voice') }}</span>
        </button>
        <button
          type="button"
          class="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-purple-400/40 bg-purple-500/12 px-2.5 py-2 text-xs font-semibold text-purple-400 transition hover:border-purple-400 hover:bg-purple-500/20"
          @click="emit('openShortcuts')"
        >
          <Keyboard class="h-3.5 w-3.5" />
          <span>{{ t('nav_shortcuts') }}</span>
        </button>
      </div>

      <!-- Language + Theme Row -->
      <div class="grid grid-cols-2 gap-2">
        <div
          class="grid grid-cols-2 rounded-xl border p-0.5"
          style="border-color: var(--border-subtle); background: var(--bg-surface)"
        >
          <button
            type="button"
            class="cursor-pointer rounded-lg py-1.5 font-mono text-xs font-bold transition"
            :class="lang === 'vi' ? 'bg-cyan-400 text-slate-950 shadow' : 'opacity-70 hover:opacity-100'"
            @click="setLanguage('vi')"
          >
            VN
          </button>
          <button
            type="button"
            class="cursor-pointer rounded-lg py-1.5 font-mono text-xs font-bold transition"
            :class="lang === 'en' ? 'bg-cyan-400 text-slate-950 shadow' : 'opacity-70 hover:opacity-100'"
            @click="setLanguage('en')"
          >
            EN
          </button>
        </div>

        <button
          type="button"
          :class="[
            'flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition',
            isLight
              ? 'border-indigo-500/40 bg-indigo-500/12 text-indigo-600 hover:border-indigo-500 hover:bg-indigo-500/20'
              : 'border-amber-400/40 bg-amber-400/12 text-amber-300 hover:border-amber-400 hover:bg-amber-400/20',
          ]"
          @click="toggleTheme"
        >
          <Moon v-if="isLight" class="h-3.5 w-3.5" />
          <Sun v-else class="h-3.5 w-3.5" />
          <span class="truncate">{{ isLight ? 'Neon' : 'Aqua' }}</span>
        </button>
      </div>

      <div class="flex justify-center pt-1">
        <SocialIcons size="sm" :show-tool-link="false" />
      </div>
    </div>
  </aside>
</template>
