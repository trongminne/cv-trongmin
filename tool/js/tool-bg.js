/**
 * THREE.JS 3D CONSTELLATION & CYBER PARTICLES BACKGROUND
 * Trọng Min Tools Hub (trongmin.io.vn/tool)
 * Renders stardust particles, dynamic connecting lines, floating wireframe polyhedra,
 * and mouse parallax identical to the main portfolio.
 */

(function () {
    'use strict';

    function isWebGLAvailable() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    if (!isWebGLAvailable() || typeof THREE === 'undefined') {
        console.warn('[Tool 3D] Three.js or WebGL not available. Background rendered in 2D mode.');
        return;
    }

    const bgCanvas = document.getElementById('three-bg-canvas');
    if (!bgCanvas) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 240;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: bgCanvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle Cloud
    const particleCount = window.innerWidth < 768 ? 130 : 260;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    const baseVelocities = [];

    const range = 360;
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * range * 1.5;
        positions[i * 3 + 1] = (Math.random() - 0.5) * range;
        positions[i * 3 + 2] = (Math.random() - 0.5) * range;

        const bVx = (Math.random() - 0.5) * 0.055;
        const bVy = (Math.random() - 0.5) * 0.055;
        const bVz = (Math.random() - 0.5) * 0.045;
        velocities.push({ x: bVx, y: bVy, z: bVz });
        baseVelocities.push({ x: bVx, y: bVy, z: bVz });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Soft glowing radial sprite
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = 32;
    spriteCanvas.height = 32;
    const ctx = spriteCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(0, 245, 255, 1)');
    grad.addColorStop(0.35, 'rgba(56, 189, 248, 0.7)');
    grad.addColorStop(1, 'rgba(14, 165, 233, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const pTexture = new THREE.CanvasTexture(spriteCanvas);

    const pMaterial = new THREE.PointsMaterial({
        size: 4.8,
        map: pTexture,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(geometry, pMaterial);
    scene.add(particles);

    // Dynamic Connecting Constellation Lines
    const maxLineDist = 45;
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

    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);

    // Floating Cyber Polyhedra (Icosahedron & Octahedron)
    const polyGroup = new THREE.Group();
    scene.add(polyGroup);

    const polyCount = window.innerWidth < 768 ? 3 : 6;
    const polys = [];

    for (let i = 0; i < polyCount; i++) {
        const isIco = i % 2 === 0;
        const geom = isIco
            ? new THREE.IcosahedronGeometry(Math.random() * 8 + 6, 0)
            : new THREE.OctahedronGeometry(Math.random() * 7 + 5, 0);

        const wireMat = new THREE.MeshBasicMaterial({
            color: i % 3 === 0 ? 0x00f5ff : (i % 3 === 1 ? 0x38bdf8 : 0x818cf8),
            wireframe: true,
            transparent: true,
            opacity: 0.28
        });

        const mesh = new THREE.Mesh(geom, wireMat);
        mesh.position.set(
            (Math.random() - 0.5) * range * 1.3,
            (Math.random() - 0.5) * range * 0.9,
            (Math.random() - 0.5) * 120 - 40
        );

        mesh.userData = {
            rotX: (Math.random() - 0.5) * 0.008,
            rotY: (Math.random() - 0.5) * 0.01,
            rotZ: (Math.random() - 0.5) * 0.006,
            driftY: (Math.random() - 0.5) * 0.03
        };

        polyGroup.add(mesh);
        polys.push(mesh);
    }

    // Mouse Tracking with Smooth Inertia
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
        targetCameraX = mouseX * 22;
        targetCameraY = mouseY * 18;
    }, { passive: true });

    // Animation Loop
    let animFrameId;
    function animate() {
        animFrameId = requestAnimationFrame(animate);

        // Camera gentle drift
        camera.position.x += (targetCameraX - camera.position.x) * 0.03;
        camera.position.y += (targetCameraY - camera.position.y) * 0.03;
        camera.lookAt(0, 0, 0);

        // Move stardust
        const posArr = geometry.attributes.position.array;
        let lineIdx = 0;

        for (let i = 0; i < particleCount; i++) {
            const idx = i * 3;
            posArr[idx] += velocities[i].x;
            posArr[idx + 1] += velocities[i].y;
            posArr[idx + 2] += velocities[i].z;

            // Boundary wrapping
            const bound = range * 0.75;
            if (posArr[idx] > bound) posArr[idx] = -bound;
            if (posArr[idx] < -bound) posArr[idx] = bound;
            if (posArr[idx + 1] > bound) posArr[idx + 1] = -bound;
            if (posArr[idx + 1] < -bound) posArr[idx + 1] = bound;
            if (posArr[idx + 2] > bound) posArr[idx + 2] = -bound;
            if (posArr[idx + 2] < -bound) posArr[idx + 2] = bound;

            // Connect nearby points
            if (lineIdx < lineMeshMaxPairs * 6) {
                for (let j = i + 1; j < Math.min(i + 14, particleCount); j++) {
                    const jIdx = j * 3;
                    const dx = posArr[idx] - posArr[jIdx];
                    const dy = posArr[idx + 1] - posArr[jIdx + 1];
                    const dz = posArr[idx + 2] - posArr[jIdx + 2];
                    const distSq = dx * dx + dy * dy + dz * dz;

                    if (distSq < maxLineDist * maxLineDist && lineIdx < lineMeshMaxPairs * 6) {
                        linePositions[lineIdx++] = posArr[idx];
                        linePositions[lineIdx++] = posArr[idx + 1];
                        linePositions[lineIdx++] = posArr[idx + 2];
                        linePositions[lineIdx++] = posArr[jIdx];
                        linePositions[lineIdx++] = posArr[jIdx + 1];
                        linePositions[lineIdx++] = posArr[jIdx + 2];
                    }
                }
            }
        }

        geometry.attributes.position.needsUpdate = true;

        // Zero out unused line segments
        for (let k = lineIdx; k < lineMeshMaxPairs * 6; k++) {
            linePositions[k] = 0;
        }
        lineGeometry.attributes.position.needsUpdate = true;

        // Rotate polyhedra
        for (let m = 0; m < polys.length; m++) {
            const p = polys[m];
            p.rotation.x += p.userData.rotX;
            p.rotation.y += p.userData.rotY;
            p.rotation.z += p.userData.rotZ;
            p.position.y += p.userData.driftY;
            if (p.position.y > range * 0.5) p.position.y = -range * 0.5;
            if (p.position.y < -range * 0.5) p.position.y = range * 0.5;
        }

        renderer.render(scene, camera);
    }

    animate();

    // Window Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();
