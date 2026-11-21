<script setup lang="ts">
import { interestsList } from '@/data/portfolio'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
</script>

<template>
  <section id="interests" class="py-20">
    <div class="mb-2 font-mono text-xs font-semibold tracking-widest uppercase" style="color: var(--accent-cyan)">
      {{ t('interests_tag') }}
    </div>
    <h2 class="mb-10 font-heading text-3xl font-bold sm:text-4xl">{{ t('interests_title') }}</h2>

    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div
        v-for="item in interestsList"
        :key="item.titleKey"
        v-spatial-tilt
        class="cyber-glass rounded-2xl p-6"
      >
        <div class="mb-3 text-3xl">{{ item.emoji }}</div>
        <h3 class="font-heading text-lg font-bold">{{ t(item.titleKey) }}</h3>
        <p class="mt-2 text-sm leading-relaxed" style="color: var(--text-muted)">
          {{ t(item.descKey) }}
        </p>
      </div>
    </div>
  </section>
</template>
