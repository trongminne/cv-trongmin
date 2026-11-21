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
  <div class="fixed right-4 bottom-20 z-30 hidden flex-col gap-2 sm:flex">
    <button
      type="button"
      title="Switch Language (Key L)"
      class="cyber-glass flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl font-mono text-xs font-bold transition hover:scale-105"
      style="color: var(--accent-cyan)"
      @click="toggleLanguage"
    >
      {{ lang.toUpperCase() }}
    </button>

    <button
      type="button"
      title="Toggle Theme"
      class="cyber-glass flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition hover:scale-105"
      style="color: var(--text-main)"
      @click="toggleTheme"
    >
      <Moon v-if="isLight" class="h-4 w-4 text-sky-600" />
      <Sun v-else class="h-4 w-4 text-amber-300" />
    </button>

    <button
      type="button"
      title="Voice Navigation"
      class="cyber-glass flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition hover:scale-105"
      :class="isListening ? 'border-rose-400 text-rose-400' : ''"
      @click="emit('openVoiceGuide')"
    >
      <Mic class="h-4 w-4" :class="isListening ? 'animate-pulse text-rose-400' : 'text-cyan-400'" />
    </button>

    <button
      type="button"
      title="Keyboard Shortcuts (?)"
      class="cyber-glass flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition hover:scale-105"
      style="color: var(--text-main)"
      @click="emit('openShortcuts')"
    >
      <Keyboard class="h-4 w-4 text-sky-400" />
    </button>

    <button
      type="button"
      title="Back to top"
      class="cyber-glass flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition hover:scale-105"
      style="color: var(--accent-cyan)"
      @click="scrollTop"
    >
      <ArrowUp class="h-4 w-4" />
    </button>
  </div>
</template>
