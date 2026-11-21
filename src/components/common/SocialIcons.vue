<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { contactInfo } from '@/data/portfolio'
import { useTheme } from '@/composables/useTheme'

withDefaults(
  defineProps<{
    showToolLink?: boolean
    size?: 'sm' | 'md'
  }>(),
  {
    showToolLink: true,
    size: 'md',
  },
)

const { isLight } = useTheme()
</script>

<template>
  <div class="flex flex-wrap items-center gap-2.5">
    <!-- Facebook -->
    <a
      :href="contactInfo.socials.facebook"
      target="_blank"
      rel="noopener noreferrer"
      title="Facebook"
      :class="[
        'inline-flex items-center justify-center rounded-xl border border-[#1877F2]/40 bg-[#1877F2]/12 shadow-[0_0_14px_rgba(24,119,242,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-[#1877F2] hover:bg-[#1877F2]/25 hover:shadow-[0_0_22px_rgba(24,119,242,0.45)]',
        size === 'sm' ? 'h-9 w-9' : 'h-11 w-11',
      ]"
    >
      <Icon icon="logos:facebook" :class="size === 'sm' ? 'h-5 w-5' : 'h-6 w-6'" />
    </a>

    <!-- GitHub -->
    <a
      :href="contactInfo.socials.github"
      target="_blank"
      rel="noopener noreferrer"
      title="GitHub"
      :class="[
        'inline-flex items-center justify-center rounded-xl border border-purple-400/40 bg-purple-500/12 shadow-[0_0_14px_rgba(168,85,247,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-purple-400 hover:bg-purple-500/25 hover:shadow-[0_0_22px_rgba(168,85,247,0.45)]',
        size === 'sm' ? 'h-9 w-9' : 'h-11 w-11',
      ]"
    >
      <Icon :icon="isLight ? 'skill-icons:github-dark' : 'skill-icons:github-light'" :class="size === 'sm' ? 'h-5 w-5' : 'h-6 w-6'" />
    </a>

    <!-- YouTube -->
    <a
      :href="contactInfo.socials.youtube"
      target="_blank"
      rel="noopener noreferrer"
      title="YouTube"
      :class="[
        'inline-flex items-center justify-center rounded-xl border border-red-500/40 bg-red-500/12 shadow-[0_0_14px_rgba(239,68,68,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-red-500 hover:bg-red-500/25 hover:shadow-[0_0_22px_rgba(239,68,68,0.45)]',
        size === 'sm' ? 'h-9 w-9' : 'h-11 w-11',
      ]"
    >
      <Icon icon="logos:youtube-icon" :class="size === 'sm' ? 'h-5 w-5' : 'h-6 w-6'" />
    </a>

    <!-- TikTok -->
    <a
      :href="contactInfo.socials.tiktok"
      target="_blank"
      rel="noopener noreferrer"
      title="TikTok"
      :class="[
        'inline-flex items-center justify-center rounded-xl border border-pink-500/40 bg-gradient-to-br from-pink-500/12 to-cyan-400/12 shadow-[0_0_14px_rgba(236,72,153,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-pink-400 hover:from-pink-500/25 hover:to-cyan-400/25 hover:shadow-[0_0_22px_rgba(236,72,153,0.45)]',
        size === 'sm' ? 'h-9 w-9' : 'h-11 w-11',
      ]"
    >
      <Icon icon="logos:tiktok-icon" :class="size === 'sm' ? 'h-5 w-5' : 'h-6 w-6'" />
    </a>

    <!-- Dev Tools Hub -->
    <RouterLink
      v-if="showToolLink"
      to="/tool"
      title="Công cụ & Tiện ích | trongmin.io.vn/tool"
      :class="[
        'inline-flex items-center justify-center rounded-xl border border-amber-400/45 bg-amber-400/12 shadow-[0_0_14px_rgba(251,191,36,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-amber-400 hover:bg-amber-400/25 hover:shadow-[0_0_22px_rgba(251,191,36,0.45)]',
        size === 'sm' ? 'h-9 w-9' : 'h-11 w-11',
      ]"
    >
      <Icon icon="fluent-emoji:wrench" :class="size === 'sm' ? 'h-5 w-5' : 'h-6 w-6'" />
    </RouterLink>
  </div>
</template>
