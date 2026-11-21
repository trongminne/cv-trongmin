<script setup lang="ts">
import { Icon } from '@iconify/vue'
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
      class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-cyan-400/45 bg-cyan-400/12 shadow-[0_0_14px_rgba(0,245,255,0.2)] backdrop-blur-md transition-all hover:scale-110 hover:border-cyan-400 hover:bg-cyan-400/25"
      @click="toggleLanguage"
    >
      <Icon :icon="lang === 'vi' ? 'circle-flags:vn' : 'circle-flags:us'" class="h-5 w-5" />
    </button>

    <!-- Theme Toggle -->
    <button
      type="button"
      title="Toggle Theme"
      :class="[
        'flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border backdrop-blur-md transition-all hover:scale-110',
        isLight
          ? 'border-indigo-500/45 bg-indigo-500/12 shadow-[0_0_14px_rgba(99,102,241,0.2)] hover:border-indigo-500 hover:bg-indigo-500/25'
          : 'border-amber-400/45 bg-amber-400/12 shadow-[0_0_14px_rgba(251,191,36,0.22)] hover:border-amber-400 hover:bg-amber-400/25',
      ]"
      @click="toggleTheme"
    >
      <Icon :icon="isLight ? 'fluent-emoji:crescent-moon' : 'fluent-emoji:sun'" class="h-5 w-5" />
    </button>

    <!-- Voice Navigation Mic -->
    <button
      type="button"
      title="Voice Navigation"
      :class="[
        'flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border backdrop-blur-md transition-all hover:scale-110',
        isListening
          ? 'border-rose-400 bg-rose-500/25 shadow-[0_0_18px_rgba(244,63,94,0.45)]'
          : 'border-emerald-400/45 bg-emerald-400/12 shadow-[0_0_14px_rgba(52,211,153,0.22)] hover:border-emerald-400 hover:bg-emerald-400/25',
      ]"
      @click="emit('openVoiceGuide')"
    >
      <Icon icon="fluent-emoji:studio-microphone" class="h-5 w-5" :class="isListening ? 'animate-pulse' : ''" />
    </button>

    <!-- Keyboard Shortcuts -->
    <button
      type="button"
      title="Keyboard Shortcuts (?)"
      class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-purple-400/45 bg-purple-500/12 shadow-[0_0_14px_rgba(168,85,247,0.22)] backdrop-blur-md transition-all hover:scale-110 hover:border-purple-400 hover:bg-purple-500/25"
      @click="emit('openShortcuts')"
    >
      <Icon icon="fluent-emoji:keyboard" class="h-5 w-5" />
    </button>

    <!-- Back to Top -->
    <button
      type="button"
      title="Back to top"
      class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-sky-400/45 bg-sky-400/12 shadow-[0_0_14px_rgba(56,189,248,0.22)] backdrop-blur-md transition-all hover:scale-110 hover:border-sky-400 hover:bg-sky-400/25"
      @click="scrollTop"
    >
      <Icon icon="fluent-emoji:up-arrow" class="h-5 w-5" />
    </button>
  </div>
</template>
