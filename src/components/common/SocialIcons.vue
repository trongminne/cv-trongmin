<script setup lang="ts">
import { Wrench } from 'lucide-vue-next'
import { contactInfo } from '@/data/portfolio'

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
</script>

<template>
  <div class="flex flex-wrap items-center gap-2.5">
    <a
      :href="contactInfo.socials.facebook"
      target="_blank"
      rel="noopener noreferrer"
      title="Facebook"
      :class="[
        'inline-flex items-center justify-center rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-500/20 hover:text-blue-300',
        size === 'sm' ? 'h-9 w-9' : 'h-11 w-11',
      ]"
      style="border-color: var(--border-subtle); background: var(--bg-surface); color: var(--text-main)"
    >
      <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" /></svg>
    </a>
    <a
      :href="contactInfo.socials.github"
      target="_blank"
      rel="noopener noreferrer"
      title="GitHub"
      :class="[
        'inline-flex items-center justify-center rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300',
        size === 'sm' ? 'h-9 w-9' : 'h-11 w-11',
      ]"
      style="border-color: var(--border-subtle); background: var(--bg-surface); color: var(--text-main)"
    >
      <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" /></svg>
    </a>
    <a
      :href="contactInfo.socials.youtube"
      target="_blank"
      rel="noopener noreferrer"
      title="YouTube"
      :class="[
        'inline-flex items-center justify-center rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-400 hover:bg-rose-500/20 hover:text-rose-300',
        size === 'sm' ? 'h-9 w-9' : 'h-11 w-11',
      ]"
      style="border-color: var(--border-subtle); background: var(--bg-surface); color: var(--text-main)"
    >
      <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
    </a>
    <a
      :href="contactInfo.socials.tiktok"
      target="_blank"
      rel="noopener noreferrer"
      title="TikTok"
      :class="[
        'inline-flex items-center justify-center rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-400 hover:bg-pink-500/20 hover:text-pink-300',
        size === 'sm' ? 'h-9 w-9' : 'h-11 w-11',
      ]"
      style="border-color: var(--border-subtle); background: var(--bg-surface); color: var(--text-main)"
    >
      <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
    </a>
    <RouterLink
      v-if="showToolLink"
      to="/tool"
      title="Công cụ & Tiện ích | trongmin.io.vn/tool"
      :class="[
        'inline-flex items-center justify-center rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-400 hover:bg-amber-500/20 hover:text-amber-300',
        size === 'sm' ? 'h-9 w-9' : 'h-11 w-11',
      ]"
      style="border-color: var(--border-subtle); background: var(--bg-surface); color: var(--accent-cyan)"
    >
      <Wrench class="h-4 w-4" />
    </RouterLink>
  </div>
</template>
