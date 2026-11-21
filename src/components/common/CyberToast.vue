<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toastMessage, toastIcon, isToastVisible } = useToast()
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isToastVisible"
      role="status"
      aria-live="polite"
      class="cyber-glass fixed right-5 bottom-5 z-[10000] flex items-center gap-2.5 rounded-xl border border-cyan-400/50 px-4 py-3 text-sm font-medium shadow-[0_0_24px_rgba(0,245,255,0.28)]"
      style="color: var(--text-main)"
    >
      <span class="text-base font-bold" style="color: var(--accent-cyan)">{{ toastIcon }}</span>
      <span>{{ toastMessage }}</span>
    </div>
  </Transition>
</template>
