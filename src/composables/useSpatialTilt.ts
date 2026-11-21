import type { Directive } from 'vue'

export const vSpatialTilt: Directive<HTMLElement> = {
  mounted(el) {
    el.classList.add('spatial-depth-card')

    const glare = document.createElement('div')
    glare.className = 'depth-specular-glare'
    el.appendChild(glare)

    const maxTilt = 9

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      const rotX = -normY * maxTilt
      const rotY = normX * maxTilt

      el.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`
      glare.style.opacity = '0.32'
      glare.style.background = `radial-gradient(circle at ${((e.clientX - rect.left) / rect.width) * 100}% ${((e.clientY - rect.top) / rect.height) * 100}%, rgba(255,255,255,0.38) 0%, rgba(56,189,248,0.18) 32%, transparent 68%)`
    }

    const onLeave = () => {
      el.style.transition = 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)'
      el.style.transform = ''
      glare.style.opacity = '0'
      setTimeout(() => {
        el.style.transition = ''
      }, 350)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    ;(el as unknown as { _tiltCleanup?: () => void })._tiltCleanup = () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  },
  unmounted(el) {
    const cleanup = (el as unknown as { _tiltCleanup?: () => void })._tiltCleanup
    if (cleanup) cleanup()
  },
}
