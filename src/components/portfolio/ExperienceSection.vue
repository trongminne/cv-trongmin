<script setup lang="ts">
import { Calendar, Code2 } from 'lucide-vue-next'
import { experienceList } from '@/data/portfolio'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
</script>

<template>
  <section id="experience" class="py-20">
    <div class="mb-2 font-mono text-xs font-semibold tracking-widest uppercase" style="color: var(--accent-cyan)">
      {{ t('exp_tag') }}
    </div>
    <h2 class="mb-10 font-heading text-3xl font-bold sm:text-4xl">{{ t('exp_title') }}</h2>

    <div class="relative space-y-6 border-l-2 pl-6 sm:pl-8" style="border-color: var(--border-subtle)">
      <article v-for="(item, idx) in experienceList" :key="idx" class="relative">
        <span
          class="absolute top-6 -left-[33px] h-4 w-4 rounded-full border-2 border-cyan-300 bg-sky-500 shadow-[0_0_14px_#00f5ff] sm:-left-[41px]"
        />
        <div v-spatial-tilt class="cyber-glass rounded-2xl p-6">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <h3 class="font-heading text-xl font-bold" style="color: var(--text-main)">
              {{ t(item.titleKey) }}
            </h3>
            <span
              class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs font-semibold"
              style="border-color: var(--border-subtle); background: var(--accent-cyan-dim); color: var(--accent-cyan)"
            >
              <Calendar class="h-3.5 w-3.5" />
              {{ t(item.dateKey) }}
            </span>
          </div>

          <div class="mt-2 flex items-center gap-2 text-sm font-semibold" style="color: var(--accent-blue)">
            <Code2 class="h-4 w-4 shrink-0" />
            <span>{{ t(item.roleKey) }}</span>
          </div>

          <p class="mt-3 text-sm leading-relaxed sm:text-[15px]" style="color: var(--text-muted)">
            {{ t(item.descKey) }}
          </p>

          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="tag in item.tags"
              :key="tag"
              class="rounded-lg border px-2.5 py-1 font-mono text-xs font-medium"
              style="border-color: var(--border-subtle); background: var(--accent-blue-dim); color: var(--text-main)"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
