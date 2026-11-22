<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { ExternalLink, Star, GitFork, FolderGit2, Users } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'

interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
}

interface GitHubProfile {
  public_repos: number
  followers: number
  following: number
}

const { lang } = useI18n()

const USERNAME = 'trongminne'
const CACHE_KEY = 'tm_github_showcase_v1'
const CACHE_TTL = 15 * 60 * 1000 // 15 minutes

const profile = ref<GitHubProfile>({ public_repos: 12, followers: 8, following: 10 })
const repos = ref<GitHubRepo[]>([])
const totalStars = ref(0)
const isLoading = ref(true)

const langColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Vue: '#42b883',
  'C#': '#178600',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  PHP: '#4F5D95',
}

onMounted(async () => {
  try {
    const cachedRaw = localStorage.getItem(CACHE_KEY)
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw)
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        profile.value = cached.profile
        repos.value = cached.repos
        totalStars.value = cached.totalStars
        isLoading.value = false
        return
      }
    }

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}`),
      fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=6`),
    ])

    if (userRes.ok && reposRes.ok) {
      const userData: GitHubProfile = await userRes.json()
      const reposData: GitHubRepo[] = await reposRes.json()
      profile.value = userData
      repos.value = reposData
      totalStars.value = reposData.reduce((acc, r) => acc + (r.stargazers_count || 0), 0)

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          profile: userData,
          repos: reposData,
          totalStars: totalStars.value,
        }),
      )
    }
  } catch {
    // Silent fallback when rate-limited or offline
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <section id="github-showcase" class="py-16">
    <div v-reveal class="mb-2 font-mono text-xs font-semibold tracking-widest uppercase" style="color: var(--accent-cyan)">
      OPEN_SOURCE // GITHUB_LIVE_TELEMETRY
    </div>
    <div v-reveal="60" class="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 class="font-heading text-3xl font-bold sm:text-4xl">
          {{ lang === 'en' ? 'GitHub Live Showcase' : 'Dự Án & Mã Nguồn GitHub' }}
        </h2>
        <p class="mt-1.5 text-sm" style="color: var(--text-muted)">
          {{ lang === 'en' ? 'Real-time repositories and stats synced directly from @trongminne' : 'Dữ liệu kho mã nguồn & thống kê cập nhật trực tiếp từ @trongminne' }}
        </p>
      </div>

      <a
        :href="`https://github.com/${USERNAME}`"
        target="_blank"
        rel="noopener noreferrer"
        class="cyber-glass inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition hover:-translate-y-0.5"
        style="color: var(--accent-cyan)"
      >
        <Icon icon="skill-icons:github-light" class="h-4 w-4" />
        <span>@{{ USERNAME }}</span>
        <ExternalLink class="h-3.5 w-3.5" />
      </a>
    </div>

    <!-- Live Metrics Row -->
    <div v-reveal="100" class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div v-spatial-tilt class="cyber-glass flex items-center gap-3.5 rounded-2xl p-4">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-400">
          <FolderGit2 class="h-5 w-5" />
        </div>
        <div>
          <div class="font-heading text-2xl font-bold">{{ profile.public_repos }}</div>
          <div class="font-mono text-[11px]" style="color: var(--text-dim)">Public Repos</div>
        </div>
      </div>

      <div v-spatial-tilt class="cyber-glass flex items-center gap-3.5 rounded-2xl p-4">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/15 text-amber-400">
          <Star class="h-5 w-5" />
        </div>
        <div>
          <div class="font-heading text-2xl font-bold">{{ totalStars }}</div>
          <div class="font-mono text-[11px]" style="color: var(--text-dim)">Recent Stars</div>
        </div>
      </div>

      <div v-spatial-tilt class="cyber-glass col-span-2 flex items-center gap-3.5 rounded-2xl p-4 sm:col-span-1">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/15 text-purple-400">
          <Users class="h-5 w-5" />
        </div>
        <div>
          <div class="font-heading text-2xl font-bold">{{ profile.followers }}</div>
          <div class="font-mono text-[11px]" style="color: var(--text-dim)">Followers</div>
        </div>
      </div>
    </div>

    <!-- Repositories Grid -->
    <div v-if="isLoading" class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="n in 3" :key="n" class="cyber-glass h-36 animate-pulse rounded-2xl p-5" />
    </div>

    <div v-else-if="repos.length > 0" class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <a
        v-for="(repo, idx) in repos"
        :key="repo.id"
        v-reveal="idx * 60"
        v-spatial-tilt
        :href="repo.html_url"
        target="_blank"
        rel="noopener noreferrer"
        class="cyber-glass group flex flex-col justify-between rounded-2xl p-5 transition hover:-translate-y-1"
      >
        <div>
          <div class="flex items-start justify-between gap-2">
            <h3 class="truncate font-heading text-base font-bold group-hover:text-cyan-400" style="color: var(--text-main)">
              {{ repo.name }}
            </h3>
            <ExternalLink class="h-4 w-4 shrink-0 opacity-50 transition group-hover:text-cyan-400 group-hover:opacity-100" />
          </div>
          <p class="mt-2 line-clamp-2 text-xs leading-relaxed" style="color: var(--text-muted)">
            {{ repo.description || (lang === 'en' ? 'Software engineering & web project.' : 'Dự án lập trình phần mềm & phát triển web.') }}
          </p>
        </div>

        <div class="mt-4 flex items-center justify-between border-t pt-3 font-mono text-[11px]" style="border-color: var(--border-subtle); color: var(--text-dim)">
          <span class="inline-flex items-center gap-1.5">
            <span
              class="h-2.5 w-2.5 rounded-full"
              :style="{ backgroundColor: langColors[repo.language || ''] || '#38bdf8' }"
            />
            <span>{{ repo.language || 'Code' }}</span>
          </span>
          <span class="flex items-center gap-3">
            <span class="inline-flex items-center gap-1"><Star class="h-3 w-3 text-amber-400" /> {{ repo.stargazers_count }}</span>
            <span class="inline-flex items-center gap-1"><GitFork class="h-3 w-3 text-sky-400" /> {{ repo.forks_count }}</span>
          </span>
        </div>
      </a>
    </div>
  </section>
</template>
