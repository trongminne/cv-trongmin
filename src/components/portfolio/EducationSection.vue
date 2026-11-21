<script setup lang="ts">
import { Calendar, GraduationCap, Calculator } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
</script>

<template>
  <section id="education" class="py-20">
    <div class="mb-2 font-mono text-xs font-semibold tracking-widest uppercase" style="color: var(--accent-cyan)">
      {{ t('edu_tag') }}
    </div>
    <h2 class="mb-10 font-heading text-3xl font-bold sm:text-4xl">{{ t('edu_title') }}</h2>

    <div class="relative space-y-6 border-l-2 pl-6 sm:pl-8" style="border-color: var(--border-subtle)">
      <!-- University -->
      <article class="relative">
        <span
          class="absolute top-6 -left-[33px] h-4 w-4 rounded-full border-2 border-cyan-300 bg-sky-500 shadow-[0_0_14px_#00f5ff] sm:-left-[41px]"
        />
        <div v-spatial-tilt class="cyber-glass rounded-2xl p-6">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <h3 class="font-heading text-xl font-bold">{{ t('edu_1_school') }}</h3>
            <span
              class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs font-semibold"
              style="border-color: var(--border-subtle); background: var(--accent-cyan-dim); color: var(--accent-cyan)"
            >
              <Calendar class="h-3.5 w-3.5" />
              {{ t('edu_1_date') }}
            </span>
          </div>

          <div class="mt-2 flex items-center gap-2 text-sm font-semibold" style="color: var(--accent-blue)">
            <GraduationCap class="h-4 w-4 shrink-0" />
            <span>{{ t('edu_1_major') }}</span>
          </div>

          <p class="mt-3 text-sm leading-relaxed sm:text-[15px]" style="color: var(--text-muted)">
            {{ t('edu_1_desc') }}
          </p>

          <div class="mt-5">
            <div class="mb-2 flex items-center justify-between font-mono text-xs">
              <span style="color: var(--accent-blue)">{{ t('edu_1_gpa') }}</span>
              <span class="font-bold" style="color: var(--accent-cyan)">86.25%</span>
            </div>
            <div class="h-2.5 w-full overflow-hidden rounded-full bg-slate-900/60">
              <div
                class="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 shadow-[0_0_14px_rgba(0,245,255,0.6)]"
                style="width: 86.25%"
              />
            </div>
          </div>
        </div>
      </article>

      <!-- High School -->
      <article class="relative">
        <span
          class="absolute top-6 -left-[33px] h-4 w-4 rounded-full border-2 border-cyan-300 bg-sky-500 shadow-[0_0_14px_#00f5ff] sm:-left-[41px]"
        />
        <div v-spatial-tilt class="cyber-glass rounded-2xl p-6">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <h3 class="font-heading text-xl font-bold">{{ t('edu_2_school') }}</h3>
            <span
              class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs font-semibold"
              style="border-color: var(--border-subtle); background: var(--accent-cyan-dim); color: var(--accent-cyan)"
            >
              <Calendar class="h-3.5 w-3.5" />
              {{ t('edu_2_date') }}
            </span>
          </div>

          <div class="mt-2 flex items-center gap-2 text-sm font-semibold" style="color: var(--accent-blue)">
            <Calculator class="h-4 w-4 shrink-0" />
            <span>{{ t('edu_2_major') }}</span>
          </div>

          <p class="mt-3 text-sm leading-relaxed sm:text-[15px]" style="color: var(--text-muted)">
            {{ t('edu_2_desc') }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>
