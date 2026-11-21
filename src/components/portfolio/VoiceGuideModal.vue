<script setup lang="ts">
import { Mic, MicOff, X } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useVoiceNav } from '@/composables/useVoiceNav'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { lang } = useI18n()
const { isListening, lastTranscript, toggleVoice } = useVoiceNav()
</script>

<template>
  <Transition name="modal">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div class="cyber-glass w-full max-w-md rounded-2xl p-6">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="flex items-center gap-2 font-heading text-lg font-bold" style="color: var(--accent-cyan)">
            <Mic class="h-5 w-5" />
            <span>{{ lang === 'en' ? 'VOICE NAVIGATION HUD' : 'ĐIỀU KHIỂN BẰNG GIỌNG NÓI' }}</span>
          </h3>
          <button type="button" class="cursor-pointer rounded-lg p-1 opacity-70 hover:opacity-100" @click="emit('close')">
            <X class="h-5 w-5" />
          </button>
        </div>

        <ul class="space-y-1.5 rounded-xl border p-4 font-mono text-xs leading-relaxed" style="border-color: var(--border-subtle); background: var(--bg-input); color: var(--text-muted)">
          <li>• <b>"Thông tin" / "About"</b> → About Me</li>
          <li>• <b>"Kinh nghiệm" / "Experience"</b> → Experience</li>
          <li>• <b>"Giáo dục" / "Education"</b> → Education</li>
          <li>• <b>"Kỹ năng" / "Skills"</b> → Skills</li>
          <li>• <b>"Sở thích" / "Interests"</b> → Interests</li>
          <li>• <b>"Giải thưởng" / "Awards"</b> → Awards</li>
          <li>• <b>"Liên hệ" / "Contact"</b> → Contact Form</li>
          <li>• <b>"English" / "Tiếng Việt"</b> → Switch Language</li>
          <li>• <b>"Tool" / "Công cụ"</b> → Open Dev Tools Hub</li>
          <li>• <b>"Kết thúc" / "Stop"</b> → Stop Listening</li>
        </ul>

        <div v-if="lastTranscript" class="mt-3 rounded-lg bg-cyan-400/10 px-3 py-2 font-mono text-xs text-cyan-300">
          Heard: "{{ lastTranscript }}"
        </div>

        <div class="mt-5 flex gap-2.5">
          <button
            type="button"
            class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition"
            :class="
              isListening
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : 'bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 hover:brightness-110'
            "
            @click="toggleVoice"
          >
            <MicOff v-if="isListening" class="h-4 w-4" />
            <Mic v-else class="h-4 w-4" />
            <span>
              {{
                isListening
                  ? lang === 'en'
                    ? 'STOP LISTENING'
                    : 'DỪNG GHI ÂM'
                  : lang === 'en'
                    ? 'START VOICE NAV'
                    : 'BẬT GIỌNG NÓI'
              }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
