import { ref } from 'vue'
import { translations, type Lang, type TranslationKey } from '@/data/i18n'
import { useAudio } from './useAudio'
import { useToast } from './useToast'

const currentLang = ref<Lang>(
  (typeof localStorage !== 'undefined' && (localStorage.getItem('cv_lang') as Lang)) === 'en' ? 'en' : 'vi',
)

function syncDocumentLang(lang: Lang) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', lang)
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('cv_lang', lang)
  }
}

export function useI18n() {
  const { playSuccess } = useAudio()
  const { showToast } = useToast()

  const t = (key: TranslationKey): string => {
    return translations[currentLang.value][key] ?? key
  }

  const setLanguage = (lang: Lang, notify = true) => {
    if (lang === currentLang.value && notify) return
    currentLang.value = lang
    syncDocumentLang(lang)
    if (notify) {
      playSuccess()
      showToast(translations[lang].lang_toast, lang === 'en' ? '🇺🇸' : '🇻🇳')
    }
  }

  const toggleLanguage = () => {
    setLanguage(currentLang.value === 'vi' ? 'en' : 'vi', true)
  }

  const initLanguage = () => {
    syncDocumentLang(currentLang.value)
  }

  return {
    lang: currentLang,
    t,
    setLanguage,
    toggleLanguage,
    initLanguage,
  }
}
