import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

// Plugin to generate 404.html from index.html for GitHub Pages SPA routing (/tool, etc.)
function githubPagesSpaFallback() {
  return {
    name: 'github-pages-spa-fallback',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist')
      const indexHtml = resolve(distDir, 'index.html')
      const notFoundHtml = resolve(distDir, '404.html')
      if (existsSync(indexHtml)) {
        copyFileSync(indexHtml, notFoundHtml)
      }
    },
  }
}

export default defineConfig({
  // Custom domain (trongmin.io.vn) uses root base '/'.
  // If deploying to username.github.io/repo-name without custom domain, set base: '/cv-trongmin/'
  base: '/',
  plugins: [vue(), tailwindcss(), githubPagesSpaFallback()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three'],
          'vue-vendor': ['vue', 'vue-router'],
        },
      },
    },
  },
})
