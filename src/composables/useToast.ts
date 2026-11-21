import { ref } from 'vue'
import { useAudio } from './useAudio'

const toastMessage = ref('')
const toastIcon = ref('✓')
const isToastVisible = ref(false)
let hideTimer: ReturnType<typeof setTimeout> | null = null

export function useToast() {
  const { playBeep } = useAudio()

  const showToast = (message: string, icon = '✓', duration = 3000) => {
    toastMessage.value = message
    toastIcon.value = icon
    isToastVisible.value = true
    playBeep(1100, 'sine', 0.05)

    if (hideTimer) clearTimeout(hideTimer)
    hideTimer = setTimeout(() => {
      isToastVisible.value = false
    }, duration)
  }

  const copyText = async (text: string, successMessage = 'Đã sao chép vào bộ nhớ tạm!') => {
    try {
      await navigator.clipboard.writeText(text)
      showToast(successMessage, '✓')
      return true
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
        showToast(successMessage, '✓')
        return true
      } catch {
        showToast('Không thể sao chép tự động!', '✕')
        return false
      } finally {
        document.body.removeChild(ta)
      }
    }
  }

  return {
    toastMessage,
    toastIcon,
    isToastVisible,
    showToast,
    copyText,
  }
}
