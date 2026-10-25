/**
 * CYBERPUNK SYSTEM BOOT & LOADING CONTROLLER
 * Trọng Min Tools Hub (trongmin.io.vn/tool)
 * 
 * Features:
 * - 60fps smooth progress interpolation matching the main CV site
 * - Futuristic holographic gyro rings, glowing hexagonal core, and telemetry
 * - Futuristic Web Audio sound synthesis on completion
 * - Interactive Skip (Phím ESC / Space / Click Bỏ qua)
 * - Auto-dismiss when assets and 3D engine are ready
 */

(function () {
    'use strict';

    const state = {
        currentPercent: 0,
        targetPercent: 15,
        isComplete: false,
        isDismissed: false,
        startTime: performance.now(),
        minDuration: 1100, // Ms to enjoy animation
        maxTimeout: 3000,  // Safety fallback
        rafId: null,
        hasWindowLoaded: false
    };

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

    const statusLogs = [
        { threshold: 0, text: "SYS_BOOT // KHỞI ĐỘNG CÔNG CỤ TRỌNG MIN...", mem: "32MB" },
        { threshold: 24, text: "3D_ENGINE // NẠP MẠNG LƯỚI KHÔNG GIAN THREE.JS...", mem: "64MB" },
        { threshold: 52, text: "DEV_SUITE // TẢI TIỆN ÍCH AI, JSON & BẢO MẬT...", mem: "96MB" },
        { threshold: 76, text: "LOCAL_STORAGE // ĐỒNG BỘ BẢNG NHÁP & WORKSPACE...", mem: "128MB" },
        { threshold: 92, text: "SECURITY // XÁC MINH GIAO THỨC BẢO MẬT 100% CLIENT-SIDE...", mem: "144MB" },
        { threshold: 100, text: "SYSTEM READY // TRỌNG MIN TOOLS ĐÃ SẴN SÀNG!", mem: "160MB" }
    ];

    function playBootSound() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            if (ctx.state === 'suspended') ctx.resume();

            const notes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6 futuristic major chord
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);

                gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.05);
                gain.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + idx * 0.05 + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.05 + 0.35);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(ctx.currentTime + idx * 0.05);
                osc.stop(ctx.currentTime + idx * 0.05 + 0.4);
            });
        } catch (e) {
            // Audio context policy or unavailable
        }
    }

    function updateTelemetry(percent) {
        let activeLog = statusLogs[0];
        for (let i = statusLogs.length - 1; i >= 0; i--) {
            if (percent >= statusLogs[i].threshold) {
                activeLog = statusLogs[i];
                break;
            }
        }

        if (elements.statusText && elements.statusText.innerText !== activeLog.text) {
            elements.statusText.innerText = activeLog.text;
        }

        if (elements.stepText) {
            elements.stepText.innerText = `MEM: ${activeLog.mem}`;
        }
    }

    function dismissPreloader(instant = false) {
        if (state.isDismissed) return;
        state.isDismissed = true;
        cancelAnimationFrame(state.rafId);

        if (elements.barFill) elements.barFill.style.width = '100%';
        if (elements.percentText) elements.percentText.innerText = '100%';
        updateTelemetry(100);

        if (!instant) {
            playBootSound();
            if (elements.preloader) elements.preloader.classList.add('completing');
        }

        setTimeout(() => {
            if (elements.preloader) elements.preloader.classList.add('loaded');
            document.body.classList.remove('preloader-active');

            setTimeout(() => {
                if (elements.preloader && elements.preloader.parentNode) {
                    elements.preloader.parentNode.removeChild(elements.preloader);
                }
            }, 750);
        }, instant ? 50 : 380);
    }

    function animateProgress() {
        const elapsed = performance.now() - state.startTime;

        if (state.hasWindowLoaded) {
            state.targetPercent = 100;
        } else {
            const timeProgress = Math.min(elapsed / state.minDuration, 0.94);
            state.targetPercent = Math.max(state.targetPercent, Math.round(timeProgress * 95));
        }

        // Smooth easing towards target
        const delta = state.targetPercent - state.currentPercent;
        if (delta > 0) {
            state.currentPercent += Math.max(0.7, delta * 0.12);
            if (state.currentPercent > 100) state.currentPercent = 100;
        }

        const displayPercent = Math.floor(state.currentPercent);

        if (elements.barFill) {
            elements.barFill.style.width = `${displayPercent}%`;
        }
        if (elements.percentText) {
            elements.percentText.innerText = `${displayPercent}%`;
        }

        updateTelemetry(displayPercent);

        if (displayPercent >= 100 && elapsed >= state.minDuration) {
            dismissPreloader(false);
            return;
        }

        state.rafId = requestAnimationFrame(animateProgress);
    }

    function init() {
        queryElements();

        if (elements.skipBtn) {
            elements.skipBtn.addEventListener('click', () => dismissPreloader(true));
        }

        window.addEventListener('keydown', (e) => {
            if (!state.isDismissed && (e.key === 'Escape' || e.code === 'Space')) {
                e.preventDefault();
                dismissPreloader(true);
            }
        });

        window.addEventListener('load', () => {
            state.hasWindowLoaded = true;
        });

        // Failsafe timeout
        setTimeout(() => {
            if (!state.isDismissed) {
                state.hasWindowLoaded = true;
                state.targetPercent = 100;
            }
        }, state.maxTimeout);

        state.rafId = requestAnimationFrame(animateProgress);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
