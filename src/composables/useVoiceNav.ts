import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from './useI18n'
import { useToast } from './useToast'

interface SpeechRecognitionInstance {
  continuous: boolean
  lang: string
  start: () => void
  stop: () => void
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
}

const isListening = ref(false)
const lastTranscript = ref('')

export function useVoiceNav() {
  const router = useRouter()
  const { setLanguage, lang } = useI18n()
  const { showToast } = useToast()

  let recognition: SpeechRecognitionInstance | null = null

  const isSupported = () => {
    if (typeof window === 'undefined') return false
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  }

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const startVoice = () => {
    if (!isSupported()) {
      showToast(
        lang.value === 'en' ? 'Browser does not support Speech Recognition.' : 'Trình duyệt không hỗ trợ nhận diện giọng nói.',
        '⚠️',
      )
      return
    }

    const SpeechRec =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance; webkitSpeechRecognition?: new () => SpeechRecognitionInstance })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition

    if (!SpeechRec) return

    recognition = new SpeechRec()
    recognition.continuous = true
    recognition.lang = lang.value === 'en' ? 'en-US' : 'vi-VN'

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase()
      lastTranscript.value = transcript

      if (transcript.includes('kết thúc') || transcript.includes('stop') || transcript.includes('end')) {
        stopVoice()
        return
      }
      if (transcript.includes('thông tin') || transcript.includes('about') || transcript.includes('profile')) {
        scrollToSection('about')
      } else if (transcript.includes('kinh nghiệm') || transcript.includes('experience') || transcript.includes('project')) {
        scrollToSection('experience')
      } else if (transcript.includes('giáo dục') || transcript.includes('học vấn') || transcript.includes('education')) {
        scrollToSection('education')
      } else if (transcript.includes('kỹ năng') || transcript.includes('skills')) {
        scrollToSection('skills')
      } else if (transcript.includes('sở thích') || transcript.includes('interests')) {
        scrollToSection('interests')
      } else if (transcript.includes('giải thưởng') || transcript.includes('awards')) {
        scrollToSection('awards')
      } else if (transcript.includes('liên hệ') || transcript.includes('tin nhắn') || transcript.includes('contact')) {
        scrollToSection('contact')
      } else if (transcript.includes('tiếng anh') || transcript.includes('english')) {
        setLanguage('en')
      } else if (transcript.includes('tiếng việt') || transcript.includes('vietnamese')) {
        setLanguage('vi')
      } else if (transcript.includes('tool') || transcript.includes('công cụ')) {
        router.push('/tool')
      }
    }

    recognition.onend = () => {
      if (isListening.value && recognition) {
        try {
          recognition.start()
        } catch {
          isListening.value = false
        }
      }
    }

    recognition.onerror = () => {
      isListening.value = false
    }

    try {
      recognition.start()
      isListening.value = true
      showToast(
        lang.value === 'en' ? 'Voice navigation active! Speak a section name.' : 'Đã bật nhận diện giọng nói! Hãy đọc tên mục.',
        '🎙️',
      )
    } catch {
      isListening.value = false
    }
  }

  const stopVoice = () => {
    isListening.value = false
    if (recognition) {
      recognition.stop()
      recognition = null
    }
    showToast(lang.value === 'en' ? 'Voice navigation stopped.' : 'Đã tắt nhận diện giọng nói.', '🔇')
  }

  const toggleVoice = () => {
    if (isListening.value) stopVoice()
    else startVoice()
  }

  return {
    isListening,
    lastTranscript,
    isSupported,
    startVoice,
    stopVoice,
    toggleVoice,
  }
}
