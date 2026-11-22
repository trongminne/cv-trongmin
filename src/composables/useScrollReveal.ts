import type { Directive } from 'vue'

export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    const delay = typeof binding.value === 'number' ? binding.value : 0
    el.style.opacity = '0'
    el.style.transform = 'translateY(26px) scale(0.985)'
    el.style.filter = 'blur(4px)'
    el.style.transition = `opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, filter 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = '1'
            el.style.transform = 'translateY(0) scale(1)'
            el.style.filter = 'blur(0px)'
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(el)
    ;(el as unknown as { _revealObserver?: IntersectionObserver })._revealObserver = observer
  },
  unmounted(el) {
    const obs = (el as unknown as { _revealObserver?: IntersectionObserver })._revealObserver
    obs?.disconnect()
  },
}
