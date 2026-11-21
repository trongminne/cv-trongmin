<script setup lang="ts">
import { Terminal, X, PlayCircle } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  replayLoader: []
}>()

const { lang, t } = useI18n()

const shortcuts = [
  { vi: 'Thông tin cá nhân', en: 'Personal Profile', key: '1' },
  { vi: 'Kinh nghiệm & Dự án', en: 'Work Experience', key: '2' },
  { vi: 'Học vấn & Đào tạo', en: 'Education', key: '3' },
  { vi: 'Kỹ năng chuyên môn', en: 'Technical Skills', key: '4' },
  { vi: 'Sở thích cá nhân', en: 'Personal Interests', key: '5' },
  { vi: 'Giải thưởng & Chứng nhận', en: 'Honors & Awards', key: '6' },
  { vi: 'Form liên hệ hiện đại', en: 'Contact Form', key: '7 / C', highlight: true },
  { vi: 'Chuyển đổi ngôn ngữ VN / EN', en: 'Switch Language (VN / EN)', key: 'L', highlight: true },
  { vi: 'Xem lại hiệu ứng Loading', en: 'Replay Loading Screen', key: 'R' },
  { vi: 'Mở bảng phím tắt này', en: 'Open Shortcuts HUD', key: '? / H' },
]
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
            <Terminal class="h-5 w-5" />
            <span>{{ t('modal_sc_title') }}</span>
          </h3>
          <button type="button" class="cursor-pointer rounded-lg p-1 opacity-70 hover:opacity-100" @click="emit('close')">
            <X class="h-5 w-5" />
          </button>
        </div>

        <p class="mb-4 text-xs leading-relaxed" style="color: var(--text-muted)">
          {{ t('modal_sc_desc') }}
        </p>

        <div class="space-y-2">
          <div
            v-for="item in shortcuts"
            :key="item.key"
            class="flex items-center justify-between rounded-xl border px-3 py-2 text-xs"
            style="border-color: var(--border-subtle); background: var(--bg-input)"
          >
            <span :class="item.highlight ? 'font-bold text-cyan-400' : ''">{{ lang === 'en' ? item.en : item.vi }}</span>
            <kbd
              class="rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold"
              style="border-color: var(--border-active); background: var(--accent-cyan-dim); color: var(--accent-cyan)"
            >
              {{ item.key }}
            </kbd>
          </div>
        </div>

        <div class="mt-5 space-y-2.5">
          <button
            type="button"
            class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan-400/50 bg-cyan-400/10 py-2.5 text-xs font-bold text-cyan-300 transition hover:bg-cyan-400/20"
            @click="emit('close'); emit('replayLoader')"
          >
            <PlayCircle class="h-4 w-4" />
            <span>{{ t('sc_replay_loader') }} (R)</span>
          </button>

          <button
            type="button"
            class="w-full cursor-pointer rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 py-2.5 text-xs font-bold text-slate-950 transition hover:brightness-110"
            @click="emit('close')"
          >
            {{ t('btn_modal_close') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
