<script setup lang="ts">
import { Sun, Moon, Mic, Keyboard, ArrowUp } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useTheme } from '@/composables/useTheme'
import { useVoiceNav } from '@/composables/useVoiceNav'

const emit = defineEmits<{
  openShortcuts: []
  openVoiceGuide: []
}>()

const { lang, toggleLanguage } = useI18n()
const { isLight, toggleTheme } = useTheme()
const { isListening } = useVoiceNav()

const scrollTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="fixed right-4 bottom-20 z-30 hidden flex-col gap-2.5 sm:flex">
    <!-- Language Switch -->
    <button
      type="button"
      title="Switch Language (Key L)"
      class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-cyan-400/50 bg-cyan-400/15 font-mono text-xs font-bold text-cyan-400 shadow-[0_0_14px_rgba(0,245,255,0.2)] backdrop-blur-md transition-all hover:scale-105 hover:bg-cyan-400 hover:text-slate-950 hover:shadow-[0_0_20px_rgba(0,245,255,0.5)]"
      @click="toggleLanguage"
    >
      {{ lang.toUpperCase() }}
    </button>

    <!-- Theme Toggle -->
    <button
      type="button"
      title="Toggle Theme"
      :class="[
        'flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border backdrop-blur-md transition-all hover:scale-105',
        isLight
          ? 'border-indigo-500/45 bg-indigo-500/15 text-indigo-600 shadow-[0_0_14px_rgba(99,102,241,0.2)] hover:bg-indigo-500 hover:text-white'
          : 'border-amber-400/50 bg-amber-400/15 text-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.22)] hover:bg-amber-400 hover:text-slate-950',
      ]"
      @click="toggleTheme"
    >
      <Moon v-if="isLight" class="h-4 w-4" />
      <Sun v-else class="h-4 w-4" />
    </button>

    <!-- Voice Navigation Mic -->
    <button
      type="button"
      title="Voice Navigation"
      :class="[
        'flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border backdrop-blur-md transition-all hover:scale-105',
        isListening
          ? 'border-rose-400 bg-rose-500/25 text-rose-400 shadow-[0_0_18px_rgba(244,63,94,0.45)]'
          : 'border-emerald-400/50 bg-emerald-400/15 text-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.22)] hover:bg-emerald-400 hover:text-slate-950',
      ]"
      @click="emit('openVoiceGuide')"
    >
      <Mic class="h-4 w-4" :class="isListening ? 'animate-pulse' : ''" />
    </button>

    <!-- Keyboard Shortcuts -->
    <button
      type="button"
      title="Keyboard Shortcuts (?)"
      class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-purple-400/50 bg-purple-500/15 text-purple-400 shadow-[0_0_14px_rgba(168,85,247,0.22)] backdrop-blur-md transition-all hover:scale-105 hover:bg-purple-500 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
      @click="emit('openShortcuts')"
    >
      <Keyboard class="h-4 w-4" />
    </button>

    <!-- Back to Top -->
    <button
      type="button"
      title="Back to top"
      class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-sky-400/50 bg-sky-400/15 text-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.22)] backdrop-blur-md transition-all hover:scale-105 hover:bg-sky-400 hover:text-slate-950 hover:shadow-[0_0_20px_rgba(56,189,248,0.5)]"
      @click="scrollTop"
    >
      <ArrowUp class="h-4 w-4" />
    </button>
  </div>
</template>
