/**
 * THREE.JS 3D INTERACTIVE ENGINE - CV TRỌNG MIN
 * 1. Fullscreen interactive 3D WebGL particle constellation & floating cyber polyhedra background
 * 2. Hero Interactive 3D Holographic Core (360° Drag, Shape Morphing, Live Telemetry, Audio Feedback)
 * 3. Dynamic Bright Blue theme synchronization (Luminous Cyan & Light Aqua modes)
 */

(function () {
  'use strict';

  // Check WebGL availability
  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  if (!isWebGLAvailable() || typeof THREE === 'undefined') {
    console.warn('Three.js or WebGL not available. 3D engine disabled gracefully.');
    return;
  }

  /* ==========================================================================
     1. FULLSCREEN 3D AMBIENT BACKGROUND SCENE (#three-bg-canvas)
     ========================================================================== */
  const bgCanvas = document.getElementById('three-bg-canvas');
  if (bgCanvas) {
    initBackgroundScene();
  }

  function initBackgroundScene() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({
      canvas: bgCanvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle Cloud System (Calm, ethereal nebulae drift)
    const particleCount = window.innerWidth < 768 ? 140 : 280;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    const baseVelocities = [];

    const range = 360;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * range * 1.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * range;
      positions[i * 3 + 2] = (Math.random() - 0.5) * range;

      // Gentle, serene cosmic drift speed (~0.05 vs old 0.28)
      const bVx = (Math.random() - 0.5) * 0.055;
      const bVy = (Math.random() - 0.5) * 0.055;
      const bVz = (Math.random() - 0.5) * 0.045;
      velocities.push({ x: bVx, y: bVy, z: bVz });
      baseVelocities.push({ x: bVx, y: bVy, z: bVz });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Soft glowing circle sprite for stardust
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(56, 189, 248, 1)');
    grad.addColorStop(0.35, 'rgba(14, 165, 233, 0.7)');
    grad.addColorStop(1, 'rgba(14, 165, 233, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const pTexture = new THREE.CanvasTexture(canvas);

    const pMaterial = new THREE.PointsMaterial({
      size: 4.5,
      map: pTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, pMaterial);
    scene.add(particles);

    // Dynamic Connecting Constellation Lines
    const maxLineDist = 42;
    const lineMeshMaxPairs = 180;
    const linePositions = new Float32Array(lineMeshMaxPairs * 2 * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Floating 3D Geometric Cyber Polyhedra in Space
    const polyhedraGroup = new THREE.Group();
    scene.add(polyhedraGroup);

    const polyGeos = [
      new THREE.IcosahedronGeometry(9, 0),
      new THREE.OctahedronGeometry(7, 0),
      new THREE.TorusGeometry(8, 1.8, 8, 20),
      new THREE.DodecahedronGeometry(8, 0),
      new THREE.IcosahedronGeometry(6, 1)
    ];

    const polyMeshList = [];
    const polyCount = window.innerWidth < 768 ? 4 : 7;

    for (let i = 0; i < polyCount; i++) {
      const geo = polyGeos[i % polyGeos.length];
      const wireMat = new THREE.MeshBasicMaterial({
        color: (i % 2 === 0) ? 0x00f5ff : 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.22
      });

      const mesh = new THREE.Mesh(geo, wireMat);
      mesh.position.set(
        (Math.random() - 0.5) * range * 1.3,
        (Math.random() - 0.5) * range * 0.9,
        (Math.random() - 0.5) * 160
      );

      mesh.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.0018,
        y: (Math.random() - 0.5) * 0.0028,
        z: (Math.random() - 0.5) * 0.0012
      };

      polyhedraGroup.add(mesh);
      polyMeshList.push(mesh);
    }

    // Mouse Parallax & Dynamic Tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;

    window.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
    }, { passive: true });

    // Interactive Click Shockwave stardust
    const shockwaves = [];
    window.addEventListener('click', (e) => {
      // Avoid firing shockwave if clicking inside hero 3D viewport or inputs
      if (e.target.closest('#three-hero-viewport') || e.target.closest('input, textarea, button, a')) return;

      const vec = new THREE.Vector3(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
        0.5
      );
      vec.unproject(camera);
      vec.sub(camera.position).normalize();
      const distance = (0 - camera.position.z) / vec.z;
      const pos = camera.position.clone().add(vec.multiplyScalar(distance));

      createShockwave(pos);
    });

    function createShockwave(origin) {
      const burstCount = 18;
      const burstGeo = new THREE.BufferGeometry();
      const burstPos = new Float32Array(burstCount * 3);
      const burstVels = [];

      for (let i = 0; i < burstCount; i++) {
        burstPos[i * 3] = origin.x;
        burstPos[i * 3 + 1] = origin.y;
        burstPos[i * 3 + 2] = origin.z;

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const speed = 1.2 + Math.random() * 2.2;
        burstVels.push({
          x: Math.sin(phi) * Math.cos(theta) * speed,
          y: Math.sin(phi) * Math.sin(theta) * speed,
          z: Math.cos(phi) * speed
        });
      }

      burstGeo.setAttribute('position', new THREE.BufferAttribute(burstPos, 3));
      const burstMat = new THREE.PointsMaterial({
        size: 5.5,
        map: pTexture,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const burstPoints = new THREE.Points(burstGeo, burstMat);
      scene.add(burstPoints);

      shockwaves.push({
        mesh: burstPoints,
        geo: burstGeo,
        vels: burstVels,
        life: 1.0
      });
    }

    // Responsive Resize Handler
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Centrifugal & Gyroscope Depth Hook (Vương Giả Vinh Diệu & iPhone Spatial Depth)
    window.addEventListener('spatialCentrifugalTilt', (e) => {
      if (e.detail) {
        targetMouseX = e.detail.x * 1.5;
        targetMouseY = e.detail.y * 1.5;
      }
    }, { passive: true });

    window.addEventListener('centrifugalForcePulse', (e) => {
      if (!e.detail) return;
      const originX = (e.detail.originX || 0) * (range * 0.4);
      const originY = (e.detail.originY || 0) * (range * 0.4);
      const intensity = Math.min(1.5, e.detail.intensity || 1.0);
      const posArr = geometry.attributes.position.array;

      for (let i = 0; i < particleCount; i++) {
        const px = posArr[i * 3];
        const py = posArr[i * 3 + 1];
        const dx = px - originX;
        const dy = py - originY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        if (dist < 160) {
          velocities[i].x += (dx / dist) * intensity * 0.07;
          velocities[i].y += (dy / dist) * intensity * 0.07;
        }
      }
    }, { passive: true });

    // Theme update hook for background scene
    window.addEventListener('themeChanged', (e) => {
      const isLight = e.detail && e.detail.theme === 'light-blue';
      if (isLight) {
        pMaterial.color.setHex(0x0284c7);
        pMaterial.opacity = 0.55;
        lineMaterial.color.setHex(0x0284c7);
        lineMaterial.opacity = 0.16;
        polyMeshList.forEach((m) => {
          m.material.color.setHex(0x0284c7);
          m.material.opacity = 0.15;
        });
      } else {
        pMaterial.color.setHex(0x38bdf8);
        pMaterial.opacity = 0.85;
        lineMaterial.color.setHex(0x00f5ff);
        lineMaterial.opacity = 0.22;
        polyMeshList.forEach((m, idx) => {
          m.material.color.setHex(idx % 2 === 0 ? 0x00f5ff : 0x38bdf8);
          m.material.opacity = 0.22;
        });
      }
    });

    // Background Render Loop
    let bgClock = new THREE.Clock();
    let isBgVisible = true;

    document.addEventListener('visibilitychange', () => {
      isBgVisible = !document.hidden;
    });

    function animateBackground() {
      requestAnimationFrame(animateBackground);
      if (!isBgVisible) return;

      const delta = bgClock.getDelta();

      // Smooth mouse lerping - calm and cinematic
      mouseX += (targetMouseX - mouseX) * 0.025;
      mouseY += (targetMouseY - mouseY) * 0.025;

      // Camera parallax with scroll drift
      camera.position.x = mouseX * 12;
      camera.position.y = -mouseY * 10 - (scrollY * 0.04);
      camera.lookAt(0, -scrollY * 0.04, 0);

      // Animate particles with smooth velocity damping
      const posArr = geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        // Smoothly decay velocity back to base drift
        velocities[i].x += (baseVelocities[i].x - velocities[i].x) * 0.025;
        velocities[i].y += (baseVelocities[i].y - velocities[i].y) * 0.025;
        velocities[i].z += (baseVelocities[i].z - velocities[i].z) * 0.025;

        posArr[i * 3] += velocities[i].x;
        posArr[i * 3 + 1] += velocities[i].y;
        posArr[i * 3 + 2] += velocities[i].z;

        // Boundary bounce
        if (Math.abs(posArr[i * 3]) > range * 0.8) {
          velocities[i].x *= -1;
          baseVelocities[i].x *= -1;
        }
        if (Math.abs(posArr[i * 3 + 1]) > range * 0.5) {
          velocities[i].y *= -1;
          baseVelocities[i].y *= -1;
        }
        if (Math.abs(posArr[i * 3 + 2]) > range * 0.5) {
          velocities[i].z *= -1;
          baseVelocities[i].z *= -1;
        }
      }
      geometry.attributes.position.needsUpdate = true;

      // Update connecting lines dynamically
      let lineIndex = 0;
      const linePosArr = lineGeometry.attributes.position.array;
      const step = 2; // sample step to keep high 60fps

      for (let i = 0; i < particleCount && lineIndex < lineMeshMaxPairs * 6; i += step) {
        const x1 = posArr[i * 3];
        const y1 = posArr[i * 3 + 1];
        const z1 = posArr[i * 3 + 2];

        for (let j = i + 1; j < particleCount && lineIndex < lineMeshMaxPairs * 6; j += step) {
          const dx = x1 - posArr[j * 3];
          const dy = y1 - posArr[j * 3 + 1];
          const dz = z1 - posArr[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxLineDist) {
            linePosArr[lineIndex++] = x1;
            linePosArr[lineIndex++] = y1;
            linePosArr[lineIndex++] = z1;

            linePosArr[lineIndex++] = posArr[j * 3];
            linePosArr[lineIndex++] = posArr[j * 3 + 1];
            linePosArr[lineIndex++] = posArr[j * 3 + 2];
          }
        }
      }

      // Clear remaining line indices
      for (let k = lineIndex; k < lineMeshMaxPairs * 6; k++) {
        linePosArr[k] = 0;
      }
      lineGeometry.attributes.position.needsUpdate = true;

      // Rotate floating polyhedra
      polyMeshList.forEach((mesh) => {
        mesh.rotation.x += mesh.rotationSpeed.x;
        mesh.rotation.y += mesh.rotationSpeed.y;
        mesh.rotation.z += mesh.rotationSpeed.z;
      });

      // Update shockwaves
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.life -= delta * 1.5;
        const bPos = sw.geo.attributes.position.array;
        for (let b = 0; b < sw.vels.length; b++) {
          bPos[b * 3] += sw.vels[b].x;
          bPos[b * 3 + 1] += sw.vels[b].y;
          bPos[b * 3 + 2] += sw.vels[b].z;
        }
        sw.geo.attributes.position.needsUpdate = true;
        sw.mesh.material.opacity = Math.max(0, sw.life);

        if (sw.life <= 0) {
          scene.remove(sw.mesh);
          sw.geo.dispose();
          sw.mesh.material.dispose();
          shockwaves.splice(s, 1);
        }
      }

      renderer.render(scene, camera);
    }

    animateBackground();
  }


  /* ==========================================================================
     2. HERO INTERACTIVE 3D HOLOGRAPHIC CORE VIEWPORT (#three-hero-viewport)
     ========================================================================== */
  window.addEventListener('DOMContentLoaded', () => {
    initHeroScene();
  });

  function initHeroScene() {
    const container = document.getElementById('three-hero-viewport');
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 11.5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // Dynamic Lights
    const ambientLight = new THREE.AmbientLight(0x38bdf8, 1.4);
    scene.add(ambientLight);

    const lightCyan = new THREE.PointLight(0x00f5ff, 3.5, 50);
    lightCyan.position.set(8, 8, 8);
    scene.add(lightCyan);

    const lightBlue = new THREE.PointLight(0x2563eb, 3.0, 50);
    lightBlue.position.set(-8, -6, -6);
    scene.add(lightBlue);

    const lightIce = new THREE.DirectionalLight(0xe0f2fe, 1.2);
    lightIce.position.set(0, 10, 5);
    scene.add(lightIce);

    // Root Hologram Group
    const holoGroup = new THREE.Group();
    scene.add(holoGroup);

    // Geometries repository
    const geometries = {
      icosahedron: new THREE.IcosahedronGeometry(2.8, 1),
      torusKnot: new THREE.TorusKnotGeometry(1.9, 0.55, 110, 16),
      sphere: new THREE.SphereGeometry(2.7, 28, 28),
      box: new THREE.BoxGeometry(3.2, 3.2, 3.2)
    };

    let currentShapeKey = 'icosahedron';
    let wireframeOnly = false;
    let rotationSpeedMultiplier = 1.0;

    // Materials
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });

    const innerGlowMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.35,
      metalness: 0.85,
      roughness: 0.2,
      transmission: 0.6,
      transparent: true,
      opacity: 0.45,
      wireframe: false
    });

    // Core Dual Meshes
    let innerMesh = new THREE.Mesh(geometries[currentShapeKey], innerGlowMaterial);
    let wireMesh = new THREE.Mesh(geometries[currentShapeKey], wireframeMaterial);
    wireMesh.scale.set(1.02, 1.02, 1.02);

    holoGroup.add(innerMesh);
    holoGroup.add(wireMesh);

    // Gimbal Tech Rings (Outer Gyro Rings)
    const ringGeo1 = new THREE.TorusGeometry(3.8, 0.04, 16, 64);
    const ringGeo2 = new THREE.TorusGeometry(4.2, 0.04, 16, 64);

    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.7
    });

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      transparent: true,
      opacity: 0.5
    });

    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring1.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 4;

    holoGroup.add(ring1);
    holoGroup.add(ring2);

    // Orbiting Satellite Quantum Dust Particles
    const dustCount = 45;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      const radius = 3.6 + Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      dustPositions[i * 3] = radius * Math.cos(phi) * Math.cos(theta);
      dustPositions[i * 3 + 1] = radius * Math.cos(phi) * Math.sin(theta);
      dustPositions[i * 3 + 2] = radius * Math.sin(phi);
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x00f5ff,
      size: 0.14,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const dustPoints = new THREE.Points(dustGeo, dustMat);
    holoGroup.add(dustPoints);

    // Update Telemetry HUD
    function updateHUDTelemetry() {
      const shapeLabel = document.getElementById('three-hud-shape');
      const vertCountLabel = document.getElementById('three-hud-verts');
      if (shapeLabel) {
        const names = {
          icosahedron: 'PHA LÊ 3D (ICOSA)',
          torusKnot: 'VÒNG LƯỢNG TỬ (KNOT)',
          sphere: 'QUẢ CẦU CYBER (SPHERE)',
          box: 'LẬP PHƯƠNG HYPER (CUBE)'
        };
        shapeLabel.textContent = names[currentShapeKey] || currentShapeKey.toUpperCase();
      }
      if (vertCountLabel) {
        const geo = geometries[currentShapeKey];
        const vCount = geo.attributes.position.count;
        vertCountLabel.textContent = `${vCount} VERTS`;
      }
    }
    updateHUDTelemetry();

    // Shape Morphing Function
    function setShape(shapeKey) {
      if (!geometries[shapeKey] || currentShapeKey === shapeKey) return;
      currentShapeKey = shapeKey;

      innerMesh.geometry = geometries[shapeKey];
      wireMesh.geometry = geometries[shapeKey];

      updateHUDTelemetry();

      // Trigger micro sound effect if available
      if (window.CyberAudio && typeof window.CyberAudio.playBeep === 'function') {
        window.CyberAudio.playBeep(980, 'sine', 0.06);
      }

      // Small bounce scale animation
      holoGroup.scale.set(0.75, 0.75, 0.75);
    }

    // Interactive 360° Drag / Orbit Control
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let dragVelocity = { x: 0, y: 0 };

    container.addEventListener('pointerdown', (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
      dragVelocity = { x: 0, y: 0 };
      container.style.cursor = 'grabbing';
      if (window.CyberAudio && typeof window.CyberAudio.playBeep === 'function') {
        window.CyberAudio.playBeep(640, 'triangle', 0.04);
      }
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      dragVelocity.x = deltaX * 0.007;
      dragVelocity.y = deltaY * 0.007;

      holoGroup.rotation.y += dragVelocity.x;
      holoGroup.rotation.x += dragVelocity.y;

      prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointerup', () => {
      if (isDragging) {
        isDragging = false;
        container.style.cursor = 'grab';
      }
    });

    container.style.cursor = 'grab';

    // Hook Interactive Control Buttons
    const shapeBtns = document.querySelectorAll('[data-three-shape]');
    shapeBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        shapeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const shape = btn.getAttribute('data-three-shape');
        setShape(shape);
      });
    });

    const speedBtn = document.getElementById('three-toggle-speed');
    if (speedBtn) {
      speedBtn.addEventListener('click', () => {
        if (rotationSpeedMultiplier === 1.0) {
          rotationSpeedMultiplier = 2.4;
          speedBtn.innerHTML = '<i class="fas fa-bolt"></i> <span>2.4x</span>';
          speedBtn.classList.add('active');
        } else if (rotationSpeedMultiplier === 2.4) {
          rotationSpeedMultiplier = 0;
          speedBtn.innerHTML = '<i class="fas fa-pause"></i> <span>Tạm dừng</span>';
          speedBtn.classList.remove('active');
        } else {
          rotationSpeedMultiplier = 1.0;
          speedBtn.innerHTML = '<i class="fas fa-play"></i> <span>1.0x</span>';
          speedBtn.classList.remove('active');
        }
        if (window.CyberAudio && typeof window.CyberAudio.playBeep === 'function') {
          window.CyberAudio.playBeep(820, 'sine', 0.05);
        }
      });
    }

    const wireBtn = document.getElementById('three-toggle-wireframe');
    if (wireBtn) {
      wireBtn.addEventListener('click', () => {
        wireframeOnly = !wireframeOnly;
        innerMesh.visible = !wireframeOnly;
        wireBtn.classList.toggle('active', wireframeOnly);
        if (wireframeOnly) {
          wireframeMaterial.opacity = 1.0;
          wireBtn.innerHTML = '<i class="fas fa-vector-square"></i> <span>Lưới thuần</span>';
        } else {
          wireframeMaterial.opacity = 0.85;
          wireBtn.innerHTML = '<i class="fas fa-cube"></i> <span>Khối quang học</span>';
        }
        if (window.CyberAudio && typeof window.CyberAudio.playBeep === 'function') {
          window.CyberAudio.playBeep(740, 'triangle', 0.05);
        }
      });
    }

    const resetBtn = document.getElementById('three-reset-view');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        holoGroup.rotation.set(0, 0, 0);
        holoGroup.scale.set(1, 1, 1);
        rotationSpeedMultiplier = 1.0;
        if (speedBtn) {
          speedBtn.innerHTML = '<i class="fas fa-play"></i> <span>1.0x</span>';
          speedBtn.classList.remove('active');
        }
        if (window.CyberAudio && typeof window.CyberAudio.playBeep === 'function') {
          window.CyberAudio.playBeep(520, 'sine', 0.08);
        }
      });
    }

    // Responsive Resize Handler for Hero Viewport
    window.addEventListener('resize', () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Theme hook for hero scene
    window.addEventListener('themeChanged', (e) => {
      const isLight = e.detail && e.detail.theme === 'light-blue';
      if (isLight) {
        wireframeMaterial.color.setHex(0x0284c7);
        innerGlowMaterial.color.setHex(0x38bdf8);
        innerGlowMaterial.emissive.setHex(0x0284c7);
        ringMat1.color.setHex(0x0284c7);
        ringMat2.color.setHex(0x0ea5e9);
        dustMat.color.setHex(0x0284c7);
      } else {
        wireframeMaterial.color.setHex(0x00f5ff);
        innerGlowMaterial.color.setHex(0x0284c7);
        innerGlowMaterial.emissive.setHex(0x0369a1);
        ringMat1.color.setHex(0x38bdf8);
        ringMat2.color.setHex(0x00f5ff);
        dustMat.color.setHex(0x00f5ff);
      }
    });

    // IntersectionObserver to pause when not visible
    let isHeroInView = true;
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isHeroInView = entry.isIntersecting;
        });
      }, { threshold: 0.1 });
      observer.observe(container);
    }

    // Hero Render Loop with FPS Tracker
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = 0;
    const fpsBadge = document.getElementById('three-hud-fps');

    function animateHero(now) {
      requestAnimationFrame(animateHero);
      if (!isHeroInView || document.hidden) return;

      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Smooth scale restitution
      if (holoGroup.scale.x < 1.0) {
        const s = holoGroup.scale.x + (1.0 - holoGroup.scale.x) * 0.12;
        holoGroup.scale.set(s, s, s);
      }

      // Drag inertia / Auto spin
      if (!isDragging) {
        dragVelocity.x *= 0.94;
        dragVelocity.y *= 0.94;

        holoGroup.rotation.y += dragVelocity.x + (0.005 * rotationSpeedMultiplier);
        holoGroup.rotation.x += dragVelocity.y + (0.0025 * rotationSpeedMultiplier);
      }

      // Rings differential rotation
      ring1.rotation.z += 0.006 * rotationSpeedMultiplier;
      ring2.rotation.x -= 0.005 * rotationSpeedMultiplier;
      dustPoints.rotation.y -= 0.003 * rotationSpeedMultiplier;

      // Subtle breathing pulse
      const breathe = Math.sin(now * 0.002) * 0.035;
      wireMesh.scale.set(1.02 + breathe, 1.02 + breathe, 1.02 + breathe);

      renderer.render(scene, camera);

      // Live FPS display
      frameCount++;
      fpsTimer += delta;
      if (fpsTimer >= 0.5) {
        const currentFps = Math.round(frameCount / fpsTimer);
        if (fpsBadge) fpsBadge.textContent = `${currentFps} FPS`;
        frameCount = 0;
        fpsTimer = 0;
      }
    }

    requestAnimationFrame(animateHero);
  }

  /* ==========================================================================
     3. BRIGHT BLUE THEME CONTROLLER ("MÀU XANH SÁNG")
     Supports:
     - 'luminous-cyan' (Default): Electric Glowing Bright Blue / Cyber Cyan
     - 'light-blue': Refreshing Bright Aqua / Crystal Light Blue
     ========================================================================== */
  window.initBrightBlueTheme = function () {
    const savedTheme = localStorage.getItem('cv_theme_mode') || 'luminous-cyan';
    applyTheme(savedTheme, false);

    // Bind theme toggles
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'luminous-cyan';
        const next = current === 'luminous-cyan' ? 'light-blue' : 'luminous-cyan';
        applyTheme(next, true);

        if (window.CyberAudio && typeof window.CyberAudio.playSuccess === 'function') {
          window.CyberAudio.playSuccess();
        }
        if (typeof window.showCyberToast === 'function') {
          const modeName = next === 'light-blue' ? 'Xanh Sáng Tươi (Light Aqua)' : 'Xanh Sáng Neon (Luminous Cyan)';
          window.showCyberToast(`Đã chuyển sang giao diện: ${modeName}`, '✨');
        }
      });
    });
  };

  function applyTheme(themeName, broadcast) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('cv_theme_mode', themeName);

    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      const isHud = btn.classList.contains('hud-btn');
      if (themeName === 'light-blue') {
        btn.innerHTML = isHud ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-moon mr-1"></i> <span>Xanh Neon</span>';
        btn.setAttribute('title', 'Chuyển sang Xanh Sáng Neon Vũ Trụ');
      } else {
        btn.innerHTML = isHud ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-sun mr-1"></i> <span>Xanh Sáng Tươi</span>';
        btn.setAttribute('title', 'Chuyển sang Xanh Sáng Tươi (Light Aqua Mode)');
      }
    });

    if (broadcast) {
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeName } }));
    }
  }

  // Initialize theme on start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initBrightBlueTheme);
  } else {
    window.initBrightBlueTheme();
  }

})();
