import { ref, computed } from 'vue'
import { useAudio } from './useAudio'
import { useToast } from './useToast'

export type ThemeMode = 'luminous-cyan' | 'light-blue'

const theme = ref<ThemeMode>(
  (typeof localStorage !== 'undefined' && (localStorage.getItem('cv_theme') as ThemeMode)) || 'luminous-cyan',
)

function applyTheme(next: ThemeMode) {
  theme.value = next
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', next)
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('cv_theme', next)
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: next } }))
  }
}

export function useTheme() {
  const { playBeep } = useAudio()
  const { showToast } = useToast()

  const isLight = computed(() => theme.value === 'light-blue')

  const initTheme = () => {
    applyTheme(theme.value)
  }

  const toggleTheme = () => {
    const next: ThemeMode = theme.value === 'luminous-cyan' ? 'light-blue' : 'luminous-cyan'
    applyTheme(next)
    playBeep(next === 'light-blue' ? 980 : 660, 'triangle', 0.07)
    showToast(next === 'light-blue' ? 'Light Aqua Mode ☀️' : 'Neon Blue Mode ⚡', '🎨')
  }

  return {
    theme,
    isLight,
    initTheme,
    toggleTheme,
  }
}
