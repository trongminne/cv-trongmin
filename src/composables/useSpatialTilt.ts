import { ref, type Directive } from 'vue'

interface TiltCardState {
  el: HTMLElement
  glare: HTMLDivElement
  isHovered: boolean
  targetRotX: number
  targetRotY: number
  targetScale: number
  targetGlareX: number
  targetGlareY: number
  targetGlareOpacity: number
  currRotX: number
  currRotY: number
  currScale: number
  currGlareX: number
  currGlareY: number
  currGlareOpacity: number
  cleanup: () => void
}

const MAX_TILT = 13
const CENTRIFUGAL = 1.3
const LERP = 0.12

const cards = new Set<TiltCardState>()
let rafId: number | null = null
let gyroAttached = false
let baseBeta: number | null = null
let baseGamma: number | null = null

export const gyroActive = ref(false)
export const needsGyroPermission = ref(false)
export const gyroPromptDismissed = ref(false)

function checkIosPermissionRequired(): boolean {
  if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) return false
  const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<'granted' | 'denied'> }
  return typeof DOE.requestPermission === 'function'
}

function onDeviceOrientation(e: DeviceOrientationEvent) {
  if (e.gamma === null || e.beta === null) return

  // Auto-calibrate initial holding angle on first reading (works whether sitting or lying down)
  if (baseBeta === null || baseGamma === null) {
    baseBeta = Math.max(-75, Math.min(75, e.beta))
    baseGamma = Math.max(-45, Math.min(45, e.gamma))
  }

  // Slowly adapt baseline so holding posture stays comfortable
  baseBeta += (Math.max(-75, Math.min(75, e.beta)) - baseBeta) * 0.008
  baseGamma += (Math.max(-45, Math.min(45, e.gamma)) - baseGamma) * 0.008

  const deltaX = e.gamma - baseGamma
  const deltaY = e.beta - baseBeta

  const normX = Math.max(-1, Math.min(1, deltaX / 24))
  const normY = Math.max(-1, Math.min(1, deltaY / 24))

  const dist = Math.sqrt(normX * normX + normY * normY)
  const centrifugal = 1 + dist * (CENTRIFUGAL - 1)

  gyroActive.value = true

  // Apply gyro tilt to cards currently visible in viewport
  const vh = window.innerHeight
  cards.forEach((card) => {
    if (card.isHovered) return
    const rect = card.el.getBoundingClientRect()
    if (rect.top < vh && rect.bottom > 0) {
      card.targetRotX = -normY * MAX_TILT * centrifugal
      card.targetRotY = normX * MAX_TILT * centrifugal
      card.targetScale = 1 + Math.min(0.02, dist * 0.018)
      card.targetGlareOpacity = Math.min(0.36, dist * 0.42)
      card.targetGlareX = 50 + normX * 38
      card.targetGlareY = 50 + normY * 38
    }
  })

  // Bridge tilt to Three.js 3D background camera parallax
  window.dispatchEvent(
    new CustomEvent('spatialGyroTilt', {
      detail: { x: normX, y: normY },
    }),
  )
}

function attachGyroListener() {
  if (gyroAttached || typeof window === 'undefined') return
  gyroAttached = true
  window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true })
}

export async function requestGyroPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) return false
  const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<'granted' | 'denied'> }

  if (typeof DOE.requestPermission === 'function') {
    try {
      const result = await DOE.requestPermission()
      if (result === 'granted') {
        needsGyroPermission.value = false
        attachGyroListener()
        return true
      }
      return false
    } catch {
      return false
    }
  } else {
    needsGyroPermission.value = false
    attachGyroListener()
    return true
  }
}

export function initGyroSupport() {
  if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) return
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  if (!isTouchDevice) return

  if (checkIosPermissionRequired()) {
    needsGyroPermission.value = true
  } else {
    // Android & standard browsers allow direct subscription on HTTPS
    attachGyroListener()
  }
}

function startLoop() {
  if (rafId !== null) return
  const tick = () => {
    if (cards.size === 0) {
      rafId = null
      return
    }
    rafId = requestAnimationFrame(tick)

    cards.forEach((c) => {
      c.currRotX += (c.targetRotX - c.currRotX) * LERP
      c.currRotY += (c.targetRotY - c.currRotY) * LERP
      c.currScale += (c.targetScale - c.currScale) * LERP
      c.currGlareX += (c.targetGlareX - c.currGlareX) * LERP
      c.currGlareY += (c.targetGlareY - c.currGlareY) * LERP
      c.currGlareOpacity += (c.targetGlareOpacity - c.currGlareOpacity) * LERP

      const active =
        c.isHovered ||
        Math.abs(c.currRotX) > 0.03 ||
        Math.abs(c.currRotY) > 0.03 ||
        c.currGlareOpacity > 0.008

      if (active) {
        c.el.style.transform = `perspective(1050px) rotateX(${c.currRotX.toFixed(2)}deg) rotateY(${c.currRotY.toFixed(2)}deg) scale3d(${c.currScale.toFixed(3)}, ${c.currScale.toFixed(3)}, ${c.currScale.toFixed(3)})`
        c.glare.style.opacity = c.currGlareOpacity.toFixed(3)
        c.glare.style.background = `radial-gradient(circle at ${c.currGlareX.toFixed(1)}% ${c.currGlareY.toFixed(1)}%, rgba(255,255,255,0.42) 0%, rgba(56,189,248,0.22) 30%, transparent 68%)`
      } else if (c.el.style.transform) {
        c.el.style.transform = ''
        c.glare.style.opacity = '0'
      }
    })
  }
  rafId = requestAnimationFrame(tick)
}

export const vSpatialTilt: Directive<HTMLElement> = {
  mounted(el) {
    el.classList.add('spatial-depth-card')

    const glare = document.createElement('div')
    glare.className = 'depth-specular-glare'
    el.appendChild(glare)

    const state: TiltCardState = {
      el,
      glare,
      isHovered: false,
      targetRotX: 0,
      targetRotY: 0,
      targetScale: 1,
      targetGlareX: 50,
      targetGlareY: 50,
      targetGlareOpacity: 0,
      currRotX: 0,
      currRotY: 0,
      currScale: 1,
      currGlareX: 50,
      currGlareY: 50,
      currGlareOpacity: 0,
      cleanup: () => {},
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      state.isHovered = true
      const rect = el.getBoundingClientRect()
      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      const dist = Math.min(1.4, Math.sqrt(normX * normX + normY * normY))
      const centrifugal = 1 + dist * (CENTRIFUGAL - 1)

      state.targetRotX = -normY * (MAX_TILT * 0.78) * centrifugal
      state.targetRotY = normX * (MAX_TILT * 0.78) * centrifugal
      state.targetScale = 1.018
      state.targetGlareOpacity = 0.32
      state.targetGlareX = ((e.clientX - rect.left) / rect.width) * 100
      state.targetGlareY = ((e.clientY - rect.top) / rect.height) * 100
    }

    const onLeave = () => {
      state.isHovered = false
      state.targetRotX = 0
      state.targetRotY = 0
      state.targetScale = 1
      state.targetGlareOpacity = 0
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    state.cleanup = () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }

    cards.add(state)
    ;(el as unknown as { _tiltState?: TiltCardState })._tiltState = state
    initGyroSupport()
    startLoop()
  },
  unmounted(el) {
    const state = (el as unknown as { _tiltState?: TiltCardState })._tiltState
    if (state) {
      state.cleanup()
      cards.delete(state)
    }
  },
}
