<script setup lang="ts">
import { Trophy, Star, Medal, Bot } from 'lucide-vue-next'
import { awardsList } from '@/data/portfolio'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
const icons = [Trophy, Star, Medal, Bot]
</script>

<template>
  <section id="awards" class="py-20">
    <div class="mb-2 font-mono text-xs font-semibold tracking-widest uppercase" style="color: var(--accent-cyan)">
      {{ t('awards_tag') }}
    </div>
    <h2 class="mb-10 font-heading text-3xl font-bold sm:text-4xl">{{ t('awards_title') }}</h2>

    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div
        v-for="(award, idx) in awardsList"
        :key="award.titleKey"
        v-spatial-tilt
        class="cyber-glass rounded-2xl p-6"
      >
        <span
          class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] font-bold"
          :class="award.accent"
          style="border-color: var(--border-subtle); background: var(--accent-blue-dim)"
        >
          <component :is="icons[idx]" class="h-3.5 w-3.5" />
          {{ t(award.badgeKey) }}
        </span>
        <h3 class="mt-4 font-heading text-lg font-bold">{{ t(award.titleKey) }}</h3>
        <p class="mt-2 text-sm leading-relaxed" style="color: var(--text-muted)">
          {{ t(award.descKey) }}
        </p>
      </div>
    </div>
  </section>
</template>
