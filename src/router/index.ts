import { createRouter, createWebHistory } from 'vue-router'
import { getToolBySlug } from '@/data/tools'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'portfolio',
      component: () => import('@/views/PortfolioView.vue'),
      meta: {
        title: 'Trọng Min - Software Engineer & AI Developer | CV & Portfolio',
      },
    },
    {
      path: '/tool',
      name: 'tools',
      component: () => import('@/views/ToolsView.vue'),
      meta: {
        title: 'Trọng Min Dev Tools Hub | trongmin.io.vn/tool',
      },
    },
    {
      path: '/tool/:slug',
      name: 'tool-detail',
      component: () => import('@/views/ToolDetailView.vue'),
      meta: {
        title: 'Trọng Min Tool | trongmin.io.vn/tool',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'smooth' }
  },
})

router.afterEach((to) => {
  if (to.name === 'tool-detail' && typeof to.params.slug === 'string') {
    const tool = getToolBySlug(to.params.slug)
    if (tool) {
      document.title = `${tool.name} | Trọng Min Tools`
      return
    }
  }
  if (to.meta?.title) {
    document.title = String(to.meta.title)
  }
})

export default router
