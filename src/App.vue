<script setup lang="ts">
import { onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { X } from 'lucide-vue-next'
import ThreeBackground from '@/components/common/ThreeBackground.vue'
import CyberToast from '@/components/common/CyberToast.vue'
import { useTheme } from '@/composables/useTheme'
import { useI18n } from '@/composables/useI18n'
import { useToast } from '@/composables/useToast'
import {
  initGyroSupport,
  needsGyroPermission,
  gyroPromptDismissed,
  requestGyroPermission,
} from '@/composables/useSpatialTilt'

const { initTheme } = useTheme()
const { initLanguage, lang } = useI18n()
const { showToast } = useToast()

const handleEnableGyro = async () => {
  const ok = await requestGyroPermission()
  if (ok) {
    showToast(
      lang.value === 'en' ? '3D Gyroscope Tilt Enabled!' : 'Đã bật hiệu ứng nghiêng 3D (Gyroscope)!',
      '📱',
    )
  } else {
    showToast(
      lang.value === 'en' ? 'Motion sensor permission denied.' : 'Bạn chưa cấp quyền cảm biến chuyển động.',
      '⚠️',
    )
  }
}

onMounted(() => {
  initTheme()
  initLanguage()
  initGyroSupport()
})
</script>

<template>
  <div class="relative min-h-screen w-full">
    <ThreeBackground />
    <div class="relative z-10">
      <RouterView />
    </div>

    <!-- iOS Motion Sensor Permission Pill (only shown on iPhone/iPad when needed) -->
    <Transition name="fade">
      <div
        v-if="needsGyroPermission && !gyroPromptDismissed"
        class="cyber-glass fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-cyan-400/55 px-4 py-2 shadow-[0_0_24px_rgba(0,245,255,0.3)]"
      >
        <button
          type="button"
          class="flex cursor-pointer items-center gap-2 text-xs font-bold text-cyan-300"
          @click="handleEnableGyro"
        >
          <Icon icon="fluent-emoji:mobile-phone" class="h-4 w-4" />
          <span>{{ lang === 'en' ? 'Enable 3D Tilt (Gyro)' : 'Bật nghiêng 3D (Gyro)' }}</span>
        </button>
        <button
          type="button"
          class="cursor-pointer rounded-full p-0.5 opacity-60 hover:opacity-100"
          aria-label="Close"
          @click="gyroPromptDismissed = true"
        >
          <X class="h-3.5 w-3.5" />
        </button>
      </div>
    </Transition>

    <CyberToast />
  </div>
</template>
