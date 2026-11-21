<script setup lang="ts">
import { onMounted } from 'vue'
import ThreeBackground from '@/components/common/ThreeBackground.vue'
import CyberToast from '@/components/common/CyberToast.vue'
import { useTheme } from '@/composables/useTheme'
import { useI18n } from '@/composables/useI18n'

const { initTheme } = useTheme()
const { initLanguage } = useI18n()

onMounted(() => {
  initTheme()
  initLanguage()
})
</script>

<template>
  <div class="relative min-h-screen w-full">
    <ThreeBackground />
    <div class="relative z-10">
      <RouterView />
    </div>
    <CyberToast />
  </div>
</template>
