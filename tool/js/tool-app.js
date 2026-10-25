/**
 * TRỌNG MIN TOOLS HUB - CLIENT APPLICATION LOGIC
 * Includes interactive tools, quick scratchpad, real-time action logs,
 * telemetry clock, and search filters.
 */

(function () {
    'use strict';

    // Action Log System
    const logs = [];
    const MAX_LOGS = 12;

    function addActionLog(actionText, iconClass = 'fas fa-check') {
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];
        logs.unshift({ time: timeStr, text: actionText, icon: iconClass });
        if (logs.length > MAX_LOGS) logs.pop();
        renderActionLogs();
    }

    function renderActionLogs() {
        const logContainer = document.getElementById('action-logs-list');
        if (!logContainer) return;

        if (logs.length === 0) {
            logContainer.innerHTML = '<div class="log-empty">Chưa có thao tác nào gần đây.</div>';
            return;
        }

        logContainer.innerHTML = logs.map(item => `
            <div class="log-item">
                <span class="log-time">[${item.time}]</span>
                <span class="log-msg"><i class="${item.icon}"></i> ${item.text}</span>
            </div>
        `).join('');
    }

    // Toast Notification
    window.showToast = function (message) {
        const toast = document.getElementById('cyber-toast');
        const msgEl = document.getElementById('toast-msg');
        if (!toast || !msgEl) return;

        msgEl.innerText = message || 'Đã sao chép vào clipboard!';
        toast.classList.add('show');
        clearTimeout(window._toastTimeout);
        window._toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    };

    // Generic Clipboard Copy
    window.copyFromOutput = function (elementId, logLabel = 'Dữ liệu') {
        const el = document.getElementById(elementId);
        if (!el) return;
        const text = el.innerText || el.value;
        if (!text || text.includes('...') || text.includes('Đang tạo...')) return;

        navigator.clipboard.writeText(text).then(() => {
            showToast('Đã sao chép vào bộ nhớ tạm!');
            addActionLog(`Sao chép ${logLabel}`, 'fas fa-copy');
        }).catch(err => {
            console.error('Copy failed:', err);
        });
    };

    // Quick Scratchpad (Auto-persisted in LocalStorage)
    const SCRATCHPAD_KEY = 'tm_cyber_scratchpad_v1';
    function initScratchpad() {
        const pad = document.getElementById('scratchpad-textarea');
        const countEl = document.getElementById('scratchpad-count');
        if (!pad) return;

        // Restore saved note
        const saved = localStorage.getItem(SCRATCHPAD_KEY);
        if (saved) {
            pad.value = saved;
            if (countEl) countEl.innerText = `${saved.length} ký tự`;
        }

        pad.addEventListener('input', () => {
            const val = pad.value;
            localStorage.setItem(SCRATCHPAD_KEY, val);
            if (countEl) countEl.innerText = `${val.length} ký tự`;
        });
    }

    window.clearScratchpad = function () {
        const pad = document.getElementById('scratchpad-textarea');
        const countEl = document.getElementById('scratchpad-count');
        if (!pad) return;
        pad.value = '';
        localStorage.removeItem(SCRATCHPAD_KEY);
        if (countEl) countEl.innerText = '0 ký tự';
        showToast('Đã xóa bảng nháp');
        addActionLog('Xóa sạch bảng nháp', 'fas fa-trash-can');
    };

    window.copyScratchpad = function () {
        const pad = document.getElementById('scratchpad-textarea');
        if (!pad || !pad.value) return;
        navigator.clipboard.writeText(pad.value).then(() => {
            showToast('Đã sao chép bảng nháp!');
            addActionLog('Sao chép toàn bộ bảng nháp', 'fas fa-copy');
        });
    };

    // Live Telemetry & Clocks
    function updateClock() {
        const clockEl = document.getElementById('telemetry-clock');
        const pingEl = document.getElementById('telemetry-ping');
        const now = new Date();
        const dateStr = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const timeStr = now.toTimeString().split(' ')[0];

        if (clockEl) {
            clockEl.innerText = `${timeStr} (GMT+7)`;
        }
        if (pingEl && Math.random() < 0.15) {
            const ping = Math.floor(Math.random() * 8 + 12);
            pingEl.innerText = `${ping}ms`;
        }
    }

    // Tool 1: AI Prompt Studio
    window.generateEnhancedPrompt = function () {
        const role = document.getElementById('prompt-role').value;
        const input = document.getElementById('prompt-input').value.trim() || 'viết api đăng nhập jwt';
        
        const enhanced = `Bạn là một ${role} xuất sắc với hơn 10 năm kinh nghiệm thực chiến.
Mục tiêu bài toán: "${input}"

Yêu cầu thực hiện:
1. Phân tích kiến trúc tối ưu (Clean Architecture, SOLID, Design Patterns).
2. Viết mã nguồn hoàn chỉnh, chuẩn Clean Code, kèm xử lý ngoại lệ (Exception Handling) và logging.
3. Nêu rõ các edge cases và lưu ý về bảo mật (Security), tối ưu hiệu năng (Performance).
4. Diễn giải bằng tiếng Việt súc tích, chuyên nghiệp.`;

        const outputEl = document.getElementById('prompt-output');
        if (outputEl) {
            outputEl.innerText = enhanced;
            showToast('Đã sinh Prompt AI thành công!');
            addActionLog(`Tạo AI Prompt (${role.split(' ')[0]})`, 'fas fa-robot');
        }
    };

    // Tool 2: Password Generator
    window.generateSecurePassword = function () {
        const lengthEl = document.getElementById('pwd-length');
        const length = lengthEl ? parseInt(lengthEl.value) : 20;

        const useUpper = document.getElementById('pwd-upper').checked;
        const useLower = document.getElementById('pwd-lower').checked;
        const useNum = document.getElementById('pwd-num').checked;
        const useSym = document.getElementById('pwd-sym').checked;

        let chars = '';
        if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
        if (useNum) chars += '0123456789';
        if (useSym) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
        if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

        let pwd = '';
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);
        for (let i = 0; i < length; i++) {
            pwd += chars[array[i] % chars.length];
        }

        const out = document.getElementById('pwd-output');
        if (out) {
            out.innerText = pwd;
            addActionLog(`Tạo mật khẩu (${length} ký tự)`, 'fas fa-key');
        }
    };

    // Tool 3: JSON Formatter
    window.formatJson = function (pretty) {
        const raw = document.getElementById('json-input').value.trim();
        const output = document.getElementById('json-output');
        if (!raw) {
            output.innerText = 'Vui lòng dán dữ liệu JSON vào ô nhập!';
            return;
        }
        try {
            const parsed = JSON.parse(raw);
            output.innerText = pretty ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed);
            output.style.color = 'var(--accent-blue-light)';
            showToast(pretty ? 'Đã làm đẹp JSON!' : 'Đã nén JSON!');
            addActionLog(pretty ? 'Format JSON (Prettify)' : 'Minify JSON', 'fas fa-code');
        } catch (err) {
            output.innerText = 'LỖI CÚ PHÁP: ' + err.message;
            output.style.color = 'var(--accent-rose)';
            addActionLog('Lỗi kiểm tra JSON', 'fas fa-triangle-exclamation');
        }
    };

    // Tool 4: Base64 & URL
    window.processCodec = function (action) {
        const input = document.getElementById('codec-input').value;
        const output = document.getElementById('codec-output');
        if (!input) {
            output.innerText = 'Vui lòng nhập chuỗi văn bản!';
            return;
        }

        try {
            if (action === 'b64-encode') {
                output.innerText = btoa(unescape(encodeURIComponent(input)));
                showToast('Đã mã hóa Base64!');
                addActionLog('Encode Base64', 'fas fa-exchange-alt');
            } else if (action === 'b64-decode') {
                output.innerText = decodeURIComponent(escape(atob(input)));
                showToast('Đã giải mã Base64!');
                addActionLog('Decode Base64', 'fas fa-exchange-alt');
            } else if (action === 'url-encode') {
                output.innerText = encodeURIComponent(input);
                showToast('Đã URL Encode!');
                addActionLog('Encode URL', 'fas fa-link');
            } else if (action === 'url-decode') {
                output.innerText = decodeURIComponent(input);
                showToast('Đã URL Decode!');
                addActionLog('Decode URL', 'fas fa-link');
            }
        } catch (e) {
            output.innerText = 'Lỗi xử lý: ' + e.message;
        }
    };

    // Tool 5: QR Code Generator
    let qrDebounce = null;
    window.generateQrCode = function () {
        clearTimeout(qrDebounce);
        qrDebounce = setTimeout(() => {
            const val = document.getElementById('qr-input').value.trim() || 'https://trongmin.io.vn';
            const encoded = encodeURIComponent(val);
            const url = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encoded}`;
            const hdUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encoded}`;
            document.getElementById('qr-img').src = url;
            document.getElementById('qr-download-btn').href = hdUrl;
            addActionLog('Tạo mã QR Code', 'fas fa-qrcode');
        }, 300);
    };

    // Tool 6: UUID & Timestamp
    window.generateUuid = function () {
        const uuid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
        const out = document.getElementById('uuid-output');
        if (out) {
            out.innerText = uuid;
            addActionLog('Sinh UUID v4 mới', 'fas fa-fingerprint');
        }
    };

    function updateTimestamp() {
        const now = Math.floor(Date.now() / 1000);
        const dateStr = new Date().toLocaleString('vi-VN');
        const out = document.getElementById('timestamp-output');
        if (out) out.innerText = `${now} (${dateStr})`;
    }

    // Tool 7: Regex Pattern Tester
    window.testRegexPattern = function () {
        const patStr = document.getElementById('regex-pattern').value;
        const flags = document.getElementById('regex-flags').value;
        const text = document.getElementById('regex-input').value;
        const out = document.getElementById('regex-output');
        const countEl = document.getElementById('regex-count');

        if (!patStr || !text) {
            out.innerText = 'Nhập biểu thức và chuỗi kiểm tra...';
            if (countEl) countEl.innerText = '0 match';
            return;
        }

        try {
            const regex = new RegExp(patStr, flags);
            const matches = [...text.matchAll(new RegExp(patStr, flags.includes('g') ? flags : flags + 'g'))];

            if (matches.length > 0) {
                if (countEl) countEl.innerText = `${matches.length} khớp`;
                const list = matches.map((m, idx) => `[#${idx + 1}] "${m[0]}" (vị trí: ${m.index})`).join('\n');
                out.innerText = list;
                out.style.color = 'var(--accent-cyan)';
                addActionLog(`Regex: Tìm thấy ${matches.length} kết quả`, 'fas fa-vial');
            } else {
                if (countEl) countEl.innerText = '0 khớp';
                out.innerText = 'Không có kết quả nào trùng khớp.';
                out.style.color = 'var(--text-muted)';
            }
        } catch (e) {
            out.innerText = 'LỖI REGEX: ' + e.message;
            out.style.color = 'var(--accent-rose)';
        }
    };

    window.applyRegexPreset = function (pattern, flags) {
        document.getElementById('regex-pattern').value = pattern;
        document.getElementById('regex-flags').value = flags;
        testRegexPattern();
    };

    // Tool 8: Color Converter
    window.convertHexColor = function (hexVal) {
        const cleanHex = hexVal.replace('#', '').trim();
        const preview = document.getElementById('color-preview-box');
        const rgbOut = document.getElementById('color-rgb-output');
        const hslOut = document.getElementById('color-hsl-output');

        if (cleanHex.length === 6) {
            const r = parseInt(cleanHex.substring(0, 2), 16);
            const g = parseInt(cleanHex.substring(2, 4), 16);
            const b = parseInt(cleanHex.substring(4, 6), 16);
            if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
                if (preview) preview.style.backgroundColor = `#${cleanHex}`;
                if (rgbOut) rgbOut.innerText = `rgb(${r}, ${g}, ${b})`;

                // HSL conversion
                const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
                const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
                let h, s, l = (max + min) / 2;
                if (max === min) {
                    h = s = 0;
                } else {
                    const d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    switch (max) {
                        case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
                        case gNorm: h = (bNorm - rNorm) / d + 2; break;
                        case bNorm: h = (rNorm - gNorm) / d + 4; break;
                    }
                    h /= 6;
                }
                if (hslOut) hslOut.innerText = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
            }
        }
    };

    // Search and Category Filtering
    window.filterTools = function () {
        const input = document.getElementById('tool-search-input');
        if (!input) return;
        const query = input.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.tool-card');

        let matchCount = 0;
        cards.forEach(card => {
            const title = card.querySelector('h3') ? card.querySelector('h3').innerText.toLowerCase() : '';
            const desc = card.querySelector('p') ? card.querySelector('p').innerText.toLowerCase() : '';
            const keywords = card.getAttribute('data-keywords') || '';
            const match = title.includes(query) || desc.includes(query) || keywords.includes(query);
            card.style.display = match ? 'flex' : 'none';
            if (match) matchCount++;
        });

        const countEl = document.getElementById('search-result-count');
        if (countEl) {
            countEl.innerText = query ? `${matchCount} công cụ phù hợp` : '';
        }
    };

    window.setCategory = function (cat, el) {
        // Sync active state in both top chips and sidebar nav links
        document.querySelectorAll('.filter-btn, .sidebar-nav-link').forEach(b => {
            if (b.getAttribute('data-category') === cat || (cat === 'all' && b.getAttribute('data-category') === 'all')) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });

        const cards = document.querySelectorAll('.tool-card');
        cards.forEach(card => {
            if (cat === 'all' || card.getAttribute('data-category') === cat) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });

        // Clear search input on category select
        const searchInput = document.getElementById('tool-search-input');
        if (searchInput && searchInput.value) {
            searchInput.value = '';
            filterTools();
        }
    };

    // Keyboard Shortcuts (Ctrl+K to search, Esc to clear)
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('tool-search-input');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        } else if (e.key === 'Escape') {
            const searchInput = document.getElementById('tool-search-input');
            if (searchInput && document.activeElement === searchInput) {
                searchInput.value = '';
                filterTools();
                searchInput.blur();
            }
        }
    });

    // Lifecycle initialization
    window.addEventListener('DOMContentLoaded', () => {
        initScratchpad();
        generateSecurePassword();
        generateUuid();
        updateTimestamp();
        setInterval(updateTimestamp, 1000);
        updateClock();
        setInterval(updateClock, 1000);
        addActionLog('Hệ thống Tool Hub đã khởi động', 'fas fa-power-off');
    });

})();
