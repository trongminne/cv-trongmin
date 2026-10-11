/**
 * SPATIAL DEPTH & CENTRIFUGAL GYROSCOPE ENGINE (HIỆU ỨNG CHIỀU SÂU IPHONE & LY TÂM VƯƠNG GIẢ VINH DIỆU)
 * Inspired by:
 * 1. Apple iOS 16/17 Lock Screen Spatial Depth Effect & Apple TV 3D Layered Parallax Tilt
 * 2. Honor of Kings (Vương Giả Vinh Diệu - 王者荣耀) 2.5D Centrifugal Gyroscope Character Cards
 * 
 * Features:
 * - Multi-planar 3D translation with independent Z-depths for icons, titles, and card surfaces
 * - Centrifugal radial distortion (lực ly tâm dạt góc theo bán kính)
 * - Dynamic specular holographic glare flare moving across crystal glass
 * - Full DeviceOrientation Gyroscope support for mobile devices (iPhone & Android)
 * - High-performance requestAnimationFrame lerp physics loop (silky 60FPS)
 */

(function () {
  'use strict';

  // Config options
  const CONFIG = {
    maxTilt: 14,             // Maximum rotation in degrees
    perspective: 1100,       // CSS perspective in px
    centrifugalFactor: 1.35, // Multiplier for outward centrifugal shift
    glareOpacity: 0.35,      // Holographic glare intensity
    lerpSpeed: 0.12,         // Smooth damping interpolation speed
    mobileSensitivity: 0.65  // Gyroscope tilt sensitivity
  };

  class DepthCardInstance {
    constructor(element) {
      this.el = element;
      this.rect = null;
      this.isHovered = false;

      // Target transforms
      this.targetRotateX = 0;
      this.targetRotateY = 0;
      this.targetScale = 1.0;
      this.targetGlareX = 50;
      this.targetGlareY = 50;
      this.targetGlareOpacity = 0;

      // Current interpolated transforms
      this.currentRotateX = 0;
      this.currentRotateY = 0;
      this.currentScale = 1.0;
      this.currentGlareX = 50;
      this.currentGlareY = 50;
      this.currentGlareOpacity = 0;

      // Layer elements
      this.iconEl = this.el.querySelector('.cyber-stat-icon, .contact-card-icon, .award-icon, .interest-icon, .avatar-container, .hero-3d-header, .timeline-node');
      this.titleEl = this.el.querySelector('.card-title, .cyber-stat-value, .interest-title, .award-title, .hero-title, .contact-card-info h4');
      this.badgeEl = this.el.querySelector('.cyber-date-badge, .cyber-tag-list, .cyber-status-badge, .telemetry-chip, .award-badge-top');

      this.initDom();
      this.bindEvents();
    }

    initDom() {
      this.el.classList.add('spatial-depth-card');
      
      // Inject specular glare element
      this.glare = document.createElement('div');
      this.glare.className = 'depth-specular-glare';
      this.el.appendChild(this.glare);

      // Mark depth layers
      if (this.iconEl) this.iconEl.classList.add('depth-layer-foreground');
      if (this.titleEl) this.titleEl.classList.add('depth-layer-midground');
      if (this.badgeEl) this.badgeEl.classList.add('depth-layer-pop');
    }

    bindEvents() {
      this.el.addEventListener('pointerenter', (e) => this.onPointerEnter(e));
      this.el.addEventListener('pointermove', (e) => this.onPointerMove(e));
      this.el.addEventListener('pointerleave', () => this.onPointerLeave());
    }

    updateRect() {
      this.rect = this.el.getBoundingClientRect();
    }

    onPointerEnter(e) {
      this.isHovered = true;
      this.updateRect();
      this.targetScale = 1.025;
      this.targetGlareOpacity = CONFIG.glareOpacity;
      this.onPointerMove(e);
    }

    onPointerMove(e) {
      if (!this.rect) this.updateRect();

      const clientX = e.clientX;
      const clientY = e.clientY;

      // Normalized coordinates from card center (-1 to 1)
      const normX = ((clientX - this.rect.left) / this.rect.width - 0.5) * 2;
      const normY = ((clientY - this.rect.top) / this.rect.height - 0.5) * 2;

      // Centrifugal radial factor (lực ly tâm: càng xa tâm xoay càng mạnh)
      const distFromCenter = Math.min(1.4, Math.sqrt(normX * normX + normY * normY));
      const centrifugal = 1 + (distFromCenter * (CONFIG.centrifugalFactor - 1));

      // 3D Rotations
      this.targetRotateX = -normY * CONFIG.maxTilt * centrifugal;
      this.targetRotateY = normX * CONFIG.maxTilt * centrifugal;

      // Specular glare follows opposite light reflection angle
      this.targetGlareX = ((clientX - this.rect.left) / this.rect.width) * 100;
      this.targetGlareY = ((clientY - this.rect.top) / this.rect.height) * 100;
    }

    onPointerLeave() {
      this.isHovered = false;
      this.targetRotateX = 0;
      this.targetRotateY = 0;
      this.targetScale = 1.0;
      this.targetGlareOpacity = 0;
    }

    setGyroTilt(tiltX, tiltY) {
      // Gyroscope tilt from device orientation (normalized -1 to 1)
      const normX = Math.max(-1, Math.min(1, tiltX));
      const normY = Math.max(-1, Math.min(1, tiltY));

      const dist = Math.sqrt(normX * normX + normY * normY);
      const centrifugal = 1 + (dist * (CONFIG.centrifugalFactor - 1));

      this.targetRotateX = -normY * CONFIG.maxTilt * centrifugal;
      this.targetRotateY = normX * CONFIG.maxTilt * centrifugal;
      this.targetScale = 1.015;
      this.targetGlareOpacity = Math.min(CONFIG.glareOpacity, dist * 0.4);
      this.targetGlareX = 50 + normX * 35;
      this.targetGlareY = 50 + normY * 35;
    }

    update() {
      // Interpolate with smooth spring damping
      this.currentRotateX += (this.targetRotateX - this.currentRotateX) * CONFIG.lerpSpeed;
      this.currentRotateY += (this.targetRotateY - this.currentRotateY) * CONFIG.lerpSpeed;
      this.currentScale += (this.targetScale - this.currentScale) * CONFIG.lerpSpeed;
      this.currentGlareX += (this.targetGlareX - this.currentGlareX) * CONFIG.lerpSpeed;
      this.currentGlareY += (this.targetGlareY - this.currentGlareY) * CONFIG.lerpSpeed;
      this.currentGlareOpacity += (this.targetGlareOpacity - this.currentGlareOpacity) * CONFIG.lerpSpeed;

      // Only apply styles if there is perceptible difference
      const isMoving = Math.abs(this.targetRotateX - this.currentRotateX) > 0.01 ||
                       Math.abs(this.targetRotateY - this.currentRotateY) > 0.01 ||
                       this.isHovered;

      if (isMoving || this.currentGlareOpacity > 0.01) {
        // Main card 3D tilt
        this.el.style.transform = `perspective(${CONFIG.perspective}px) rotateX(${this.currentRotateX.toFixed(2)}deg) rotateY(${this.currentRotateY.toFixed(2)}deg) scale3d(${this.currentScale.toFixed(3)}, ${this.currentScale.toFixed(3)}, ${this.currentScale.toFixed(3)})`;

        // Specular Glare update
        if (this.glare) {
          this.glare.style.opacity = this.currentGlareOpacity.toFixed(3);
          this.glare.style.background = `radial-gradient(circle at ${this.currentGlareX.toFixed(1)}% ${this.currentGlareY.toFixed(1)}%, rgba(255, 255, 255, 0.45) 0%, rgba(56, 189, 248, 0.22) 30%, transparent 68%)`;
        }
      } else if (!this.isHovered && Math.abs(this.currentRotateX) < 0.02) {
        this.el.style.transform = '';
        if (this.glare) this.glare.style.opacity = '0';
      }
    }
  }

  /* ==========================================================================
     GLOBAL SPATIAL DEPTH MANAGER
     ========================================================================== */
  const SpatialManager = {
    instances: [],
    hasGyro: false,
    gyroX: 0,
    gyroY: 0,

    init() {
      // Gather all interactive cards
      const selectors = [
        '.cyber-card',
        '.cyber-stat-card',
        '.cyber-terminal-box',
        '.hero-3d-card',
        '.contact-direct-card',
        '.award-card',
        '.interest-card',
        '.cyber-contact-card'
      ];

      const elements = document.querySelectorAll(selectors.join(','));
      elements.forEach(el => {
        this.instances.push(new DepthCardInstance(el));
      });

      // Cards are tracked in instances. Avatar is kept in standard circular frame to prevent clipping break.

      // Initialize Gyroscope & Mobile Orientation
      this.initDeviceOrientation();

      // Start silky 60FPS loop
      this.animate();

      // Centrifugal physics connection to Three.js
      this.initCentrifugalThreeBridge();
    },

    initDeviceOrientation() {
      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e) => {
          if (e.gamma !== null && e.beta !== null) {
            this.hasGyro = true;
            // Gamma: left to right (-90 to 90)
            // Beta: front to back (-180 to 180, normal viewing is ~45deg)
            const rawGamma = e.gamma || 0;
            const rawBeta = (e.beta || 45) - 45; // calibrate for holding angle

            this.gyroX = (rawGamma / 35) * CONFIG.mobileSensitivity;
            this.gyroY = (rawBeta / 35) * CONFIG.mobileSensitivity;

            // Apply gyro tilt to cards near viewport
            this.instances.forEach(inst => {
              if (inst.isHovered) return; // Touch/hover takes priority
              const r = inst.el.getBoundingClientRect();
              if (r.top < window.innerHeight && r.bottom > 0) {
                inst.setGyroTilt(this.gyroX, this.gyroY);
              }
            });

            // Dispatch global event for Three.js scene
            window.dispatchEvent(new CustomEvent('spatialCentrifugalTilt', {
              detail: { x: this.gyroX, y: this.gyroY }
            }));
          }
        }, { passive: true });
      }
    },

    initCentrifugalThreeBridge() {
      // Mouse velocity tracker for centrifugal burst
      let lastX = 0;
      let lastY = 0;
      let lastTime = performance.now();

      window.addEventListener('mousemove', (e) => {
        const now = performance.now();
        const dt = Math.max(16, now - lastTime);
        const vx = (e.clientX - lastX) / dt;
        const vy = (e.clientY - lastY) / dt;
        const speed = Math.sqrt(vx * vx + vy * vy);

        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = now;

        // When moving fast, send centrifugal pulse to Three.js
        if (speed > 1.2) {
          window.dispatchEvent(new CustomEvent('centrifugalForcePulse', {
            detail: {
              intensity: Math.min(2.5, speed),
              originX: (e.clientX / window.innerWidth - 0.5) * 2,
              originY: (e.clientY / window.innerHeight - 0.5) * 2
            }
          }));
        }
      }, { passive: true });
    },

    animate() {
      requestAnimationFrame(() => this.animate());
      for (let i = 0; i < this.instances.length; i++) {
        this.instances[i].update();
      }
    }
  };

  // Launch once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SpatialManager.init());
  } else {
    SpatialManager.init();
  }

})();
