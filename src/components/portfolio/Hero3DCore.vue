<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { Icon } from '@iconify/vue'
import { useTheme } from '@/composables/useTheme'
import { useAudio } from '@/composables/useAudio'

type ShapeKey = 'icosahedron' | 'torusKnot' | 'sphere' | 'octahedron'

const containerRef = ref<HTMLDivElement | null>(null)
const { isLight } = useTheme()
const { playBeep } = useAudio()

const currentShape = ref<ShapeKey>('icosahedron')
const wireframeOnly = ref(false)
const speedMode = ref<1 | 2.4 | 0>(1)
const fps = ref(60)
const vertCount = ref(0)

const shapes: { key: ShapeKey; label: string }[] = [
  { key: 'icosahedron', label: 'Crystal' },
  { key: 'torusKnot', label: 'Quantum' },
  { key: 'sphere', label: 'Sphere' },
  { key: 'octahedron', label: 'Diamond' },
]

let setShapeFn: ((key: ShapeKey) => void) | null = null
let toggleWireFn: ((wire: boolean) => void) | null = null
let updateThemeColorsFn: ((light: boolean) => void) | null = null
let cleanupFn: (() => void) | null = null

watch(isLight, (light) => {
  updateThemeColorsFn?.(light)
})

const selectShape = (key: ShapeKey) => {
  currentShape.value = key
  setShapeFn?.(key)
  playBeep(960, 'sine', 0.05)
}

const toggleWireframe = () => {
  wireframeOnly.value = !wireframeOnly.value
  toggleWireFn?.(wireframeOnly.value)
  playBeep(760, 'triangle', 0.05)
}

const cycleSpeed = () => {
  speedMode.value = speedMode.value === 1 ? 2.4 : speedMode.value === 2.4 ? 0 : 1
  playBeep(840, 'sine', 0.05)
}

onMounted(() => {
  const container = containerRef.value
  if (!container) return

  try {
    const width = container.clientWidth || 340
    const height = container.clientHeight || 320

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.z = 11.2

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Lights
    scene.add(new THREE.AmbientLight(0x38bdf8, 1.5))
    const l1 = new THREE.PointLight(0x00f5ff, 3.2, 50)
    l1.position.set(8, 8, 8)
    scene.add(l1)
    const l2 = new THREE.PointLight(0x6366f1, 2.8, 50)
    l2.position.set(-8, -6, -6)
    scene.add(l2)

    const holoGroup = new THREE.Group()
    scene.add(holoGroup)

    const geometries: Record<ShapeKey, THREE.BufferGeometry> = {
      icosahedron: new THREE.IcosahedronGeometry(2.65, 1),
      torusKnot: new THREE.TorusKnotGeometry(1.8, 0.52, 100, 16),
      sphere: new THREE.SphereGeometry(2.55, 24, 24),
      octahedron: new THREE.OctahedronGeometry(2.85, 1),
    }

    const wireMat = new THREE.MeshBasicMaterial({
      color: isLight.value ? 0x0284c7 : 0x00f5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    })

    const innerMat = new THREE.MeshPhysicalMaterial({
      color: isLight.value ? 0x38bdf8 : 0x0284c7,
      emissive: isLight.value ? 0x0284c7 : 0x0369a1,
      emissiveIntensity: 0.35,
      metalness: 0.8,
      roughness: 0.22,
      transparent: true,
      opacity: 0.42,
    })

    const innerMesh = new THREE.Mesh(geometries.icosahedron, innerMat)
    const wireMesh = new THREE.Mesh(geometries.icosahedron, wireMat)
    wireMesh.scale.setScalar(1.03)
    holoGroup.add(innerMesh, wireMesh)
    vertCount.value = geometries.icosahedron.attributes.position.count

    // Outer Gyro Rings
    const ringGeo1 = new THREE.TorusGeometry(3.6, 0.038, 14, 64)
    const ringGeo2 = new THREE.TorusGeometry(4.05, 0.032, 14, 64)
    const ringMat1 = new THREE.MeshBasicMaterial({ color: isLight.value ? 0x0284c7 : 0x38bdf8, transparent: true, opacity: 0.7 })
    const ringMat2 = new THREE.MeshBasicMaterial({ color: isLight.value ? 0x0ea5e9 : 0x00f5ff, transparent: true, opacity: 0.5 })
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1)
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2)
    ring1.rotation.x = Math.PI / 3
    ring2.rotation.y = Math.PI / 4
    holoGroup.add(ring1, ring2)

    // Orbiting Quantum Dust
    const dustCount = 48
    const dustGeo = new THREE.BufferGeometry()
    const dustPos = new Float32Array(dustCount * 3)
    for (let i = 0; i < dustCount; i++) {
      const r = 3.5 + Math.random() * 1.4
      const theta = Math.random() * Math.PI * 2
      const phi = (Math.random() - 0.5) * Math.PI
      dustPos[i * 3] = r * Math.cos(phi) * Math.cos(theta)
      dustPos[i * 3 + 1] = r * Math.cos(phi) * Math.sin(theta)
      dustPos[i * 3 + 2] = r * Math.sin(phi)
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
    const dustMat = new THREE.PointsMaterial({
      color: isLight.value ? 0x0284c7 : 0x00f5ff,
      size: 0.14,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    })
    const dustPoints = new THREE.Points(dustGeo, dustMat)
    holoGroup.add(dustPoints)

    setShapeFn = (key: ShapeKey) => {
      innerMesh.geometry = geometries[key]
      wireMesh.geometry = geometries[key]
      vertCount.value = geometries[key].attributes.position.count
      holoGroup.scale.setScalar(0.76)
    }

    toggleWireFn = (wire: boolean) => {
      innerMesh.visible = !wire
      wireMat.opacity = wire ? 1 : 0.85
    }

    updateThemeColorsFn = (light: boolean) => {
      wireMat.color.setHex(light ? 0x0284c7 : 0x00f5ff)
      innerMat.color.setHex(light ? 0x38bdf8 : 0x0284c7)
      innerMat.emissive.setHex(light ? 0x0284c7 : 0x0369a1)
      ringMat1.color.setHex(light ? 0x0284c7 : 0x38bdf8)
      ringMat2.color.setHex(light ? 0x0ea5e9 : 0x00f5ff)
      dustMat.color.setHex(light ? 0x0284c7 : 0x00f5ff)
    }

    // 360 Drag Interaction
    let isDragging = false
    let prev = { x: 0, y: 0 }
    const vel = { x: 0, y: 0 }

    const onDown = (e: PointerEvent) => {
      isDragging = true
      prev = { x: e.clientX, y: e.clientY }
      vel.x = 0
      vel.y = 0
    }

    const onMove = (e: PointerEvent) => {
      if (!isDragging) return
      vel.x = (e.clientX - prev.x) * 0.008
      vel.y = (e.clientY - prev.y) * 0.008
      holoGroup.rotation.y += vel.x
      holoGroup.rotation.x += vel.y
      prev = { x: e.clientX, y: e.clientY }
    }

    const onUp = () => {
      isDragging = false
    }

    const onResize = () => {
      if (!container) return
      const w = container.clientWidth || 340
      const h = container.clientHeight || 320
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    container.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('resize', onResize)

    let inView = true
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true
      },
      { threshold: 0.05 },
    )
    io.observe(container)

    let rafId = 0
    let lastTime = performance.now()
    let frames = 0
    let fpsAcc = 0

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate)
      if (!inView || document.hidden) return

      const dt = (now - lastTime) / 1000
      lastTime = now

      if (holoGroup.scale.x < 1) {
        const s = holoGroup.scale.x + (1 - holoGroup.scale.x) * 0.12
        holoGroup.scale.setScalar(s)
      }

      if (!isDragging) {
        vel.x *= 0.94
        vel.y *= 0.94
        holoGroup.rotation.y += vel.x + 0.005 * speedMode.value
        holoGroup.rotation.x += vel.y + 0.0025 * speedMode.value
      }

      ring1.rotation.z += 0.006 * speedMode.value
      ring2.rotation.x -= 0.005 * speedMode.value
      dustPoints.rotation.y -= 0.003 * speedMode.value

      const breathe = Math.sin(now * 0.0022) * 0.03
      wireMesh.scale.setScalar(1.03 + breathe)

      renderer.render(scene, camera)

      frames++
      fpsAcc += dt
      if (fpsAcc >= 0.6) {
        fps.value = Math.min(144, Math.round(frames / fpsAcc))
        frames = 0
        fpsAcc = 0
      }
    }
    rafId = requestAnimationFrame(animate)

    cleanupFn = () => {
      cancelAnimationFrame(rafId)
      io.disconnect()
      container.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('resize', onResize)
      Object.values(geometries).forEach((g) => g.dispose())
      ringGeo1.dispose()
      ringGeo2.dispose()
      dustGeo.dispose()
      wireMat.dispose()
      innerMat.dispose()
      ringMat1.dispose()
      ringMat2.dispose()
      dustMat.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  } catch {
    // WebGL fallback
  }
})

onUnmounted(() => {
  cleanupFn?.()
})
</script>

<template>
  <div class="cyber-glass flex flex-col overflow-hidden rounded-3xl p-4">
    <!-- Top Telemetry Bar -->
    <div class="mb-2 flex items-center justify-between font-mono text-[11px]">
      <span class="inline-flex items-center gap-1.5 font-bold" style="color: var(--accent-cyan)">
        <span class="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
        HOLO_CORE // 3D
      </span>
      <div class="flex items-center gap-2" style="color: var(--text-dim)">
        <span>{{ vertCount }} VERTS</span>
        <span class="rounded bg-cyan-400/15 px-1.5 py-0.5 text-cyan-400">{{ fps }} FPS</span>
      </div>
    </div>

    <!-- Interactive 3D Viewport -->
    <div
      ref="containerRef"
      class="relative h-[280px] w-full cursor-grab active:cursor-grabbing sm:h-[310px]"
      title="Kéo để xoay 360° / Drag to rotate 360°"
    >
      <div
        class="pointer-events-none absolute right-2 bottom-2 rounded-full border px-2.5 py-0.5 font-mono text-[10px] backdrop-blur-md"
        style="border-color: var(--border-subtle); background: var(--bg-input); color: var(--text-dim)"
      >
        Drag 360°
      </div>
    </div>

    <!-- Shape & Mode Controls -->
    <div class="mt-3 space-y-2 border-t pt-3" style="border-color: var(--border-subtle)">
      <div class="grid grid-cols-4 gap-1.5">
        <button
          v-for="s in shapes"
          :key="s.key"
          type="button"
          class="cursor-pointer rounded-lg border py-1.5 font-mono text-[10px] font-semibold transition"
          :style="
            currentShape === s.key
              ? 'background: var(--accent-cyan-dim); border-color: var(--accent-cyan); color: var(--accent-cyan)'
              : 'background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-muted)'
          "
          @click="selectShape(s.key)"
        >
          {{ s.label }}
        </button>
      </div>

      <div class="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          class="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border py-1.5 font-mono text-[11px] font-semibold transition hover:border-cyan-400"
          style="background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)"
          @click="cycleSpeed"
        >
          <Icon icon="fluent-emoji:high-voltage" class="h-3.5 w-3.5" />
          <span>Speed: {{ speedMode === 0 ? 'Pause' : `${speedMode}x` }}</span>
        </button>

        <button
          type="button"
          class="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border py-1.5 font-mono text-[11px] font-semibold transition hover:border-cyan-400"
          :style="
            wireframeOnly
              ? 'background: var(--accent-cyan-dim); border-color: var(--accent-cyan); color: var(--accent-cyan)'
              : 'background: var(--bg-input); border-color: var(--border-subtle); color: var(--text-main)'
          "
          @click="toggleWireframe"
        >
          <Icon icon="fluent-emoji:gem-stone" class="h-3.5 w-3.5" />
          <span>{{ wireframeOnly ? 'Wireframe' : 'Optical' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
