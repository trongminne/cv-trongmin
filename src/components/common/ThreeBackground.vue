<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { useTheme } from '@/composables/useTheme'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { isLight } = useTheme()

let animFrameId: number | null = null
let renderer: THREE.WebGLRenderer | null = null
let pMaterial: THREE.PointsMaterial | null = null
let lineMaterial: THREE.LineBasicMaterial | null = null
let polyMeshes: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>[] = []

let cleanupListeners: (() => void) | null = null

watch(isLight, (light) => {
  if (!pMaterial || !lineMaterial) return
  if (light) {
    pMaterial.color.setHex(0x0284c7)
    pMaterial.opacity = 0.55
    lineMaterial.color.setHex(0x0284c7)
    lineMaterial.opacity = 0.16
    polyMeshes.forEach((m) => {
      m.material.color.setHex(0x0284c7)
      m.material.opacity = 0.14
    })
  } else {
    pMaterial.color.setHex(0x38bdf8)
    pMaterial.opacity = 0.85
    lineMaterial.color.setHex(0x00f5ff)
    lineMaterial.opacity = 0.22
    polyMeshes.forEach((m, idx) => {
      m.material.color.setHex(idx % 2 === 0 ? 0x00f5ff : 0x38bdf8)
      m.material.opacity = 0.22
    })
  }
})

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  try {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.z = 240

    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Particle Constellation
    const particleCount = window.innerWidth < 768 ? 110 : 220
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const velocities: { x: number; y: number; z: number }[] = []

    const range = 360
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * range * 1.5
      positions[i * 3 + 1] = (Math.random() - 0.5) * range
      positions[i * 3 + 2] = (Math.random() - 0.5) * range
      velocities.push({
        x: (Math.random() - 0.5) * 0.055,
        y: (Math.random() - 0.5) * 0.055,
        z: (Math.random() - 0.5) * 0.045,
      })
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const spriteCanvas = document.createElement('canvas')
    spriteCanvas.width = 32
    spriteCanvas.height = 32
    const ctx = spriteCanvas.getContext('2d')!
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    grad.addColorStop(0, 'rgba(56, 189, 248, 1)')
    grad.addColorStop(0.35, 'rgba(14, 165, 233, 0.7)')
    grad.addColorStop(1, 'rgba(14, 165, 233, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 32, 32)
    const pTexture = new THREE.CanvasTexture(spriteCanvas)

    pMaterial = new THREE.PointsMaterial({
      size: 4.5,
      map: pTexture,
      color: isLight.value ? 0x0284c7 : 0x38bdf8,
      transparent: true,
      opacity: isLight.value ? 0.55 : 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const particles = new THREE.Points(geometry, pMaterial)
    scene.add(particles)

    // Connecting Lines
    const maxLineDist = 44
    const maxPairs = 160
    const linePositions = new Float32Array(maxPairs * 2 * 3)
    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))

    lineMaterial = new THREE.LineBasicMaterial({
      color: isLight.value ? 0x0284c7 : 0x00f5ff,
      transparent: true,
      opacity: isLight.value ? 0.16 : 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    scene.add(new THREE.LineSegments(lineGeometry, lineMaterial))

    // Floating Polyhedra
    const polyGeos = [
      new THREE.IcosahedronGeometry(9, 0),
      new THREE.OctahedronGeometry(7, 0),
      new THREE.TorusGeometry(8, 1.8, 8, 20),
      new THREE.DodecahedronGeometry(8, 0),
    ]
    polyMeshes = []
    const rotSpeeds: { x: number; y: number; z: number }[] = []
    const polyCount = window.innerWidth < 768 ? 4 : 6

    for (let i = 0; i < polyCount; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: isLight.value ? 0x0284c7 : i % 2 === 0 ? 0x00f5ff : 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: isLight.value ? 0.14 : 0.22,
      })
      const mesh = new THREE.Mesh(polyGeos[i % polyGeos.length], mat)
      mesh.position.set(
        (Math.random() - 0.5) * range * 1.25,
        (Math.random() - 0.5) * range * 0.9,
        (Math.random() - 0.5) * 160,
      )
      scene.add(mesh)
      polyMeshes.push(mesh)
      rotSpeeds.push({
        x: (Math.random() - 0.5) * 0.002,
        y: (Math.random() - 0.5) * 0.003,
        z: (Math.random() - 0.5) * 0.0015,
      })
    }

    let targetMouseX = 0
    let targetMouseY = 0
    let mouseX = 0
    let mouseY = 0
    let scrollY = window.scrollY
    let isVisible = true

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }

    const onGyroTilt = (e: Event) => {
      const detail = (e as CustomEvent<{ x: number; y: number }>).detail
      if (detail) {
        targetMouseX = detail.x * 1.6
        targetMouseY = detail.y * 1.6
      }
    }

    const onScroll = () => {
      scrollY = window.scrollY
    }

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer?.setSize(window.innerWidth, window.innerHeight)
      renderer?.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    const onVisibility = () => {
      isVisible = !document.hidden
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('spatialGyroTilt', onGyroTilt, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)

    cleanupListeners = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('spatialGyroTilt', onGyroTilt)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      geometry.dispose()
      lineGeometry.dispose()
      pTexture.dispose()
      pMaterial?.dispose()
      lineMaterial?.dispose()
      polyGeos.forEach((g) => g.dispose())
      polyMeshes.forEach((m) => m.material.dispose())
      renderer?.dispose()
    }

    const animate = () => {
      animFrameId = requestAnimationFrame(animate)
      if (!isVisible || !renderer) return

      mouseX += (targetMouseX - mouseX) * 0.025
      mouseY += (targetMouseY - mouseY) * 0.025

      camera.position.x = mouseX * 12
      camera.position.y = -mouseY * 10 - scrollY * 0.04
      camera.lookAt(0, -scrollY * 0.04, 0)

      const posArr = geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3] += velocities[i].x
        posArr[i * 3 + 1] += velocities[i].y
        posArr[i * 3 + 2] += velocities[i].z

        if (Math.abs(posArr[i * 3]) > range * 0.8) velocities[i].x *= -1
        if (Math.abs(posArr[i * 3 + 1]) > range * 0.5) velocities[i].y *= -1
        if (Math.abs(posArr[i * 3 + 2]) > range * 0.5) velocities[i].z *= -1
      }
      geometry.attributes.position.needsUpdate = true

      let lineIdx = 0
      const lPos = lineGeometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount && lineIdx < maxPairs * 6; i += 2) {
        const x1 = posArr[i * 3]
        const y1 = posArr[i * 3 + 1]
        const z1 = posArr[i * 3 + 2]
        for (let j = i + 1; j < particleCount && lineIdx < maxPairs * 6; j += 2) {
          const dx = x1 - posArr[j * 3]
          const dy = y1 - posArr[j * 3 + 1]
          const dz = z1 - posArr[j * 3 + 2]
          if (dx * dx + dy * dy + dz * dz < maxLineDist * maxLineDist) {
            lPos[lineIdx++] = x1
            lPos[lineIdx++] = y1
            lPos[lineIdx++] = z1
            lPos[lineIdx++] = posArr[j * 3]
            lPos[lineIdx++] = posArr[j * 3 + 1]
            lPos[lineIdx++] = posArr[j * 3 + 2]
          }
        }
      }
      for (let k = lineIdx; k < maxPairs * 6; k++) lPos[k] = 0
      lineGeometry.attributes.position.needsUpdate = true

      polyMeshes.forEach((mesh, idx) => {
        mesh.rotation.x += rotSpeeds[idx].x
        mesh.rotation.y += rotSpeeds[idx].y
        mesh.rotation.z += rotSpeeds[idx].z
      })

      renderer.render(scene, camera)
    }

    animate()
  } catch {
    // Graceful WebGL fallback
  }
})

onUnmounted(() => {
  if (animFrameId !== null) cancelAnimationFrame(animFrameId)
  cleanupListeners?.()
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
    aria-hidden="true"
  />
  <div class="cyber-grid-bg" aria-hidden="true" />
  <div class="cyber-orb cyber-orb-1" aria-hidden="true" />
  <div class="cyber-orb cyber-orb-2" aria-hidden="true" />
  <div class="cyber-orb cyber-orb-3" aria-hidden="true" />
</template>
