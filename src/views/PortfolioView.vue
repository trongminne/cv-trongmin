<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import CyberPreloader from '@/components/common/CyberPreloader.vue'
import PortfolioSidebar from '@/components/portfolio/PortfolioSidebar.vue'
import HeroSection from '@/components/portfolio/HeroSection.vue'
import ExperienceSection from '@/components/portfolio/ExperienceSection.vue'
import EducationSection from '@/components/portfolio/EducationSection.vue'
import SkillsSection from '@/components/portfolio/SkillsSection.vue'
import InterestsSection from '@/components/portfolio/InterestsSection.vue'
import AwardsSection from '@/components/portfolio/AwardsSection.vue'
import ContactSection from '@/components/portfolio/ContactSection.vue'
import FloatingHud from '@/components/portfolio/FloatingHud.vue'
import ShortcutModal from '@/components/portfolio/ShortcutModal.vue'
import VoiceGuideModal from '@/components/portfolio/VoiceGuideModal.vue'
import { navSections } from '@/data/portfolio'
import { useI18n } from '@/composables/useI18n'
import { useToast } from '@/composables/useToast'

const { t, toggleLanguage } = useI18n()
const { showToast } = useToast()

const preloaderRef = ref<InstanceType<typeof CyberPreloader> | null>(null)
const activeSection = ref('about')
const isShortcutOpen = ref(false)
const isVoiceOpen = ref(false)

let observer: IntersectionObserver | null = null

const jumpTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const handleKeydown = (e: KeyboardEvent) => {
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return
  if (e.ctrlKey || e.metaKey || e.altKey) return

  const keyMap: Record<string, string> = {
    '1': 'about',
    '2': 'experience',
    '3': 'education',
    '4': 'skills',
    '5': 'interests',
    '6': 'awards',
    '7': 'contact',
    c: 'contact',
  }

  const lower = e.key.toLowerCase()
  if (keyMap[lower]) {
    jumpTo(keyMap[lower])
  } else if (lower === 'l') {
    toggleLanguage()
  } else if (lower === 'r') {
    preloaderRef.value?.replay()
  } else if (e.key === '?' || lower === 'h') {
    isShortcutOpen.value = !isShortcutOpen.value
  } else if (e.key === 'Escape') {
    isShortcutOpen.value = false
    isVoiceOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    },
    { rootMargin: '-35% 0px -55% 0px' },
  )

  navSections.forEach((s) => {
    const el = document.getElementById(s.id)
    if (el) observer?.observe(el)
  })

  setTimeout(() => {
    showToast(t('ready_toast'), '⚡', 3800)
  }, 1500)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  observer?.disconnect()
})
</script>

<template>
  <CyberPreloader ref="preloaderRef" />

  <PortfolioSidebar
    :active-section="activeSection"
    @open-shortcuts="isShortcutOpen = true"
    @open-voice-guide="isVoiceOpen = true"
  />

  <main class="px-5 pt-16 sm:px-8 lg:ml-[285px] lg:px-14 lg:pt-0">
    <div class="mx-auto max-w-5xl">
      <HeroSection />
      <hr class="cyber-divider" />
      <ExperienceSection />
      <hr class="cyber-divider" />
      <EducationSection />
      <hr class="cyber-divider" />
      <SkillsSection />
      <hr class="cyber-divider" />
      <InterestsSection />
      <hr class="cyber-divider" />
      <AwardsSection />
      <hr class="cyber-divider" />
      <ContactSection />

      <footer class="border-t py-8 text-center font-mono text-xs" style="border-color: var(--border-subtle); color: var(--text-dim)">
        &copy; {{ new Date().getFullYear() }} Trọng Min (trongmin.io.vn) • Built with Vue 3 + TypeScript + Vite + Three.js
      </footer>
    </div>
  </main>

  <FloatingHud @open-shortcuts="isShortcutOpen = true" @open-voice-guide="isVoiceOpen = true" />

  <ShortcutModal
    :open="isShortcutOpen"
    @close="isShortcutOpen = false"
    @replay-loader="preloaderRef?.replay()"
  />

  <VoiceGuideModal :open="isVoiceOpen" @close="isVoiceOpen = false" />
</template>
