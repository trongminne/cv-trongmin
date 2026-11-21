<script setup lang="ts">
import { GraduationCap, Brain, Shield, MapPin, Send, Briefcase, Copy, Wrench } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useToast } from '@/composables/useToast'
import { contactInfo } from '@/data/portfolio'
import SocialIcons from '@/components/common/SocialIcons.vue'

const { t } = useI18n()
const { copyText } = useToast()

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section id="about" class="flex min-h-screen flex-col justify-center py-20 lg:py-24">
    <div class="mb-4 font-mono text-xs font-semibold tracking-widest uppercase" style="color: var(--accent-cyan)">
      {{ t('hero_tag') }}
    </div>

    <div class="mb-2 flex flex-wrap items-center gap-2.5 text-sm font-medium" style="color: var(--text-muted)">
      <span class="rounded-md bg-emerald-400/15 px-2.5 py-0.5 font-mono text-xs text-emerald-400">&lt;status: online/&gt;</span>
      <span>👋 {{ t('hero_greeting') }}</span>
    </div>

    <h1 class="font-heading text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
      Trọng <span class="cyber-gradient-text">Min</span>
    </h1>

    <div class="mt-4 flex flex-wrap items-center gap-2 text-base font-medium sm:text-lg" style="color: var(--text-muted)">
      <span>{{ t('hero_role1') }}</span>
      <span style="color: var(--accent-cyan)">✦</span>
      <span>{{ t('hero_role2') }}</span>
      <span style="color: var(--accent-cyan)">✦</span>
      <span>{{ t('hero_role3') }}</span>
    </div>

    <div class="mt-6">
      <SocialIcons />
    </div>

    <!-- Cyber Terminal Manifesto -->
    <div v-spatial-tilt class="cyber-glass mt-8 max-w-3xl overflow-hidden rounded-2xl">
      <div
        class="flex items-center justify-between border-b px-4 py-2.5 font-mono text-xs"
        style="border-color: var(--border-subtle); color: var(--text-dim)"
      >
        <div class="flex items-center gap-1.5">
          <span class="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span class="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span class="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <span>bash — trongmin@dev-box: ~/manifesto</span>
      </div>
      <p class="p-5 font-mono text-sm leading-relaxed sm:p-6 sm:text-[15px]" style="color: var(--text-main)">
        {{ t('hero_bio') }}
      </p>
    </div>

    <!-- Stats Bento Grid -->
    <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div v-spatial-tilt class="cyber-glass rounded-2xl p-5">
        <div class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-400">
          <GraduationCap class="h-5 w-5" />
        </div>
        <div class="font-heading text-xl font-bold">{{ t('stat_1_val') }}</div>
        <div class="mt-1 text-xs" style="color: var(--text-muted)">{{ t('stat_1_label') }}</div>
      </div>

      <div v-spatial-tilt class="cyber-glass rounded-2xl p-5">
        <div class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/15 text-purple-400">
          <Brain class="h-5 w-5" />
        </div>
        <div class="font-heading text-xl font-bold">{{ t('stat_2_val') }}</div>
        <div class="mt-1 text-xs" style="color: var(--text-muted)">{{ t('stat_2_label') }}</div>
      </div>

      <div v-spatial-tilt class="cyber-glass rounded-2xl p-5">
        <div class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/15 text-sky-400">
          <Shield class="h-5 w-5" />
        </div>
        <div class="font-heading text-xl font-bold">{{ t('stat_3_val') }}</div>
        <div class="mt-1 text-xs" style="color: var(--text-muted)">{{ t('stat_3_label') }}</div>
      </div>

      <div v-spatial-tilt class="cyber-glass rounded-2xl p-5">
        <div class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-400">
          <MapPin class="h-5 w-5" />
        </div>
        <div class="font-heading text-xl font-bold">{{ t('stat_4_val') }}</div>
        <div class="mt-1 text-xs" style="color: var(--text-muted)">{{ t('stat_4_label') }}</div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-8 flex flex-wrap items-center gap-3">
      <button
        type="button"
        class="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 text-xs font-bold tracking-wider text-slate-950 shadow-[0_0_24px_rgba(0,245,255,0.35)] transition hover:-translate-y-0.5 hover:brightness-110"
        @click="scrollTo('contact')"
      >
        <Send class="h-4 w-4" />
        <span>{{ t('btn_contact') }}</span>
      </button>

      <button
        type="button"
        class="cyber-glass inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold tracking-wider transition hover:-translate-y-0.5"
        style="color: var(--text-main)"
        @click="scrollTo('experience')"
      >
        <Briefcase class="h-4 w-4 text-cyan-400" />
        <span>{{ t('btn_experience') }}</span>
      </button>

      <button
        type="button"
        class="cyber-glass inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold tracking-wider transition hover:-translate-y-0.5"
        style="color: var(--text-main)"
        @click="copyText(contactInfo.email, t('copied_toast'))"
      >
        <Copy class="h-4 w-4 text-sky-400" />
        <span>{{ t('btn_copy_email') }}</span>
      </button>

      <RouterLink
        to="/tool"
        class="inline-flex items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 px-5 py-3 text-xs font-bold tracking-wider text-amber-300 transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-400/20"
      >
        <Wrench class="h-4 w-4" />
        <span>{{ t('btn_open_tools') }}</span>
      </RouterLink>
    </div>
  </section>
</template>
