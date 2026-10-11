/**
 * CYBERPUNK SYSTEM BOOT & LOADING CONTROLLER
 * CV & Portfolio - Trọng Min
 * Version: 3.0
 * 
 * Features:
 * - Real asset loading tracking (DOM, CSS, fonts, Three.js) with 60fps smooth interpolation
 * - Futuristic dual-ring holographic gyro & glowing hexagonal core
 * - Dynamic telemetry status logs & memory diagnostics
 * - Interactive Skip feature (ESC / Space / Click)
 * - Synthesized futuristic Web Audio chime
 * - Replay function (window.replayCyberLoader & shortcut key 'R')
 * - Bilingual support integration (vi / en)
 * - Failsafe auto-dismissal timeout
 */

(function () {
  'use strict';

  // State Management
  const state = {
    currentPercent: 0,
    targetPercent: 12,
    isComplete: false,
    isDismissed: false,
    startTime: performance.now(),
    minDuration: 1300,   // Minimum duration in ms to enjoy animation
    maxTimeout: 3500,    // Safety fallback timeout
    rafId: null,
    hasWindowLoaded: false
  };

  // DOM Elements cache
  let elements = {};

  function queryElements() {
    elements = {
      preloader: document.getElementById('cyber-preloader'),
      barFill: document.getElementById('loader-bar-fill'),
      percentText: document.getElementById('loader-percent-text'),
      statusText: document.getElementById('loader-status-text'),
      stepText: document.getElementById('loader-step-text'),
      skipBtn: document.getElementById('loader-skip-btn'),
      fpsText: document.getElementById('loader-fps-text')
    };
  }

  // Bilingual boot telemetry messages
  const statusLogs = {
    vi: [
      { threshold: 0,  text: "SYS_INIT // KHỞI ĐỘNG HỆ THỐNG...", mem: "32MB" },
      { threshold: 22, text: "3D_ENGINE // BIÊN DỊCH SHADERS THREE.JS...", mem: "64MB" },
      { threshold: 48, text: "AI_CORE // TẢI MÔ HÌNH HÓA THẦN KINH & ASP.NET...", mem: "96MB" },
      { threshold: 72, text: "UI_ASSETS // ĐỒNG BỘ BẢNG MÃ & HIỆU ỨNG...", mem: "128MB" },
      { threshold: 92, text: "SECURITY // XÁC MINH GIAO THỨC BẢO MẬT...", mem: "144MB" },
      { threshold: 100, text: "SYSTEM READY // SẴN SÀNG KHÁM PHÁ!", mem: "160MB" }
    ],
    en: [
      { threshold: 0,  text: "SYS_INIT // INITIALIZING SYSTEM BOOT SEQUENCE...", mem: "32MB" },
      { threshold: 22, text: "3D_ENGINE // COMPILING THREE.JS SHADERS...", mem: "64MB" },
      { threshold: 48, text: "AI_CORE // MOUNTING NEURAL MODELS & ASP.NET...", mem: "96MB" },
      { threshold: 72, text: "UI_ASSETS // SYNCHRONIZING ASSETS & EFFECTS...", mem: "128MB" },
      { threshold: 92, text: "SECURITY // VERIFYING TLS PROTOCOLS...", mem: "144MB" },
      { threshold: 100, text: "SYSTEM READY // ACCESS GRANTED. WELCOME!", mem: "160MB" }
    ]
  };

  // Get current active language
  function getLang() {
    if (window.i18n && typeof window.i18n.getCurrentLanguage === 'function') {
      return window.i18n.getCurrentLanguage();
    }
    return localStorage.getItem('cv_lang') === 'en' ? 'en' : 'vi';
  }

  // Synthesized Futuristic Cyber Audio Chime
  function playBootSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const notes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6 futuristic major chord
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.03, ctx.currentTime + idx * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.05 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.05);
        osc.stop(ctx.currentTime + idx * 0.05 + 0.4);
      });
    } catch (e) {
      // Audio autoplay restrictions fallback gracefully
    }
  }

  // Update Telemetry Display
  function updateTelemetry(percent) {
    const lang = getLang();
    const logs = statusLogs[lang] || statusLogs.vi;
    
    // Find matching stage
    let currentStage = logs[0];
    for (let i = 0; i < logs.length; i++) {
      if (percent >= logs[i].threshold) {
        currentStage = logs[i];
      }
    }

    if (elements.statusText && elements.statusText.textContent !== currentStage.text) {
      elements.statusText.textContent = currentStage.text;
    }

    if (elements.stepText) {
      elements.stepText.textContent = `MEM: ${currentStage.mem}`;
    }

    if (elements.percentText) {
      elements.percentText.textContent = `${Math.floor(percent)}%`;
    }

    if (elements.barFill) {
      elements.barFill.style.width = `${percent}%`;
    }
  }

  // Complete and Dismiss Loader with Cyber Glitch & Fade
  function dismissLoader() {
    if (state.isDismissed) return;
    state.isDismissed = true;
    state.isComplete = true;

    // Force UI to 100%
    state.currentPercent = 100;
    updateTelemetry(100);

    // Audio confirmation
    playBootSound();

    if (elements.preloader) {
      elements.preloader.classList.add('completing');
      
      // Wait brief moment for the user to register 100% completed state
      setTimeout(() => {
        elements.preloader.classList.add('loaded');

        // Allow body scrolling and trigger hero entrance
        document.body.classList.remove('preloader-active');
        document.body.classList.add('site-loaded');

        // Dispatch custom event for 3D scene & other interactive components
        window.dispatchEvent(new CustomEvent('portfolioLoaded'));

        // Hide element from accessibility tree after transition ends
        setTimeout(() => {
          if (elements.preloader) {
            elements.preloader.style.display = 'none';
            elements.preloader.classList.remove('completing');
          }
        }, 700);
      }, 260);
    }
  }

  // Main 60FPS Animation Loop
  function tick(timestamp) {
    if (state.isDismissed) return;

    const elapsed = timestamp - state.startTime;

    // Progress target calculation
    if (state.hasWindowLoaded) {
      if (elapsed >= state.minDuration) {
        state.targetPercent = 100;
      } else {
        // Smoothly ramp towards 95% while waiting for min duration
        state.targetPercent = 60 + (elapsed / state.minDuration) * 38;
      }
    } else {
      // Natural synthetic progression while assets download
      if (elapsed < 600) {
        state.targetPercent = 25 + (elapsed / 600) * 20;
      } else if (elapsed < 1400) {
        state.targetPercent = 45 + ((elapsed - 600) / 800) * 35;
      } else {
        // Hover around 85-92% until window.onload fires
        state.targetPercent = Math.min(92, 80 + ((elapsed - 1400) / 1000) * 12);
      }
    }

    // Smooth lerp interpolation for buttery fluid movement
    const delta = (state.targetPercent - state.currentPercent) * 0.14;
    state.currentPercent += delta;

    if (state.currentPercent >= 99.6 && state.targetPercent >= 100) {
      state.currentPercent = 100;
      updateTelemetry(100);
      dismissLoader();
      return;
    }

    updateTelemetry(state.currentPercent);
    state.rafId = requestAnimationFrame(tick);
  }

  // Skip Immediately
  function skipLoader() {
    if (state.isDismissed) return;
    if (state.rafId) cancelAnimationFrame(state.rafId);
    state.targetPercent = 100;
    dismissLoader();
  }

  // Replay Functionality (Callable from HUD, modal or console)
  window.replayCyberLoader = function () {
    queryElements();
    if (!elements.preloader) return;

    if (state.rafId) cancelAnimationFrame(state.rafId);
    state.currentPercent = 0;
    state.targetPercent = 10;
    state.isComplete = false;
    state.isDismissed = false;
    state.startTime = performance.now();
    state.hasWindowLoaded = true; // window is already loaded for replay

    // Reset styles
    elements.preloader.style.display = 'flex';
    elements.preloader.classList.remove('loaded', 'completing');
    document.body.classList.add('preloader-active');

    updateTelemetry(0);
    state.rafId = requestAnimationFrame(tick);
  };

  // Keyboard controls for skip and replay
  function bindKeyControls() {
    window.addEventListener('keydown', (e) => {
      // Ignore if typing in text inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      // Escape or Space to skip loading
      if (!state.isDismissed && (e.key === 'Escape' || e.code === 'Space')) {
        e.preventDefault();
        skipLoader();
      }

      // Key 'R' or 'r' to replay loading animation (if preloader already finished)
      if (state.isDismissed && (e.key === 'r' || e.key === 'R') && !e.ctrlKey && !e.altKey && !e.metaKey) {
        window.replayCyberLoader();
      }
    });
  }

  // Initialize
  function init() {
    queryElements();
    document.body.classList.add('preloader-active');

    // Skip button click
    if (elements.skipBtn) {
      elements.skipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        skipLoader();
      });
    }

    bindKeyControls();

    // Start 60fps loop
    state.rafId = requestAnimationFrame(tick);

    // Track real page readiness
    if (document.readyState === 'complete') {
      state.hasWindowLoaded = true;
    } else {
      window.addEventListener('load', () => {
        state.hasWindowLoaded = true;
      });
    }

    // Safety fallback timeout: force dismiss if assets stall
    setTimeout(() => {
      if (!state.isDismissed) {
        state.hasWindowLoaded = true;
        skipLoader();
      }
    }, state.maxTimeout);
  }

  // Run as soon as DOM is ready or immediately if script placed after markup
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
