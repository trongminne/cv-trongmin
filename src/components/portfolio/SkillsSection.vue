<script setup lang="ts">
import { Layers, Laptop, GitBranch } from 'lucide-vue-next'
import { skillCategories } from '@/data/portfolio'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
const icons = [Layers, Laptop, GitBranch]
</script>

<template>
  <section id="skills" class="py-20">
    <div class="mb-2 font-mono text-xs font-semibold tracking-widest uppercase" style="color: var(--accent-cyan)">
      {{ t('skills_tag') }}
    </div>
    <h2 class="mb-10 font-heading text-3xl font-bold sm:text-4xl">{{ t('skills_title') }}</h2>

    <div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div
        v-for="(cat, idx) in skillCategories"
        :key="cat.titleKey"
        v-spatial-tilt
        class="cyber-glass rounded-2xl p-6"
      >
        <div class="mb-5 flex items-center gap-2.5 font-heading text-lg font-bold">
          <component :is="icons[idx]" class="h-5 w-5" :class="cat.accent" />
          <span>{{ t(cat.titleKey) }}</span>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
          <div
            v-for="skill in cat.items"
            :key="skill.name"
            :title="skill.title"
            class="flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition duration-200 hover:-translate-y-1 hover:border-cyan-400/70"
            style="border-color: var(--border-subtle); background: var(--bg-input)"
          >
            <img :src="skill.icon" :alt="skill.name" class="h-10 w-10 object-contain" loading="lazy" />
            <span class="font-mono text-xs font-semibold" style="color: var(--text-main)">{{ skill.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
