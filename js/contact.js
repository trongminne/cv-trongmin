/**
 * Contact Form & Cyber Interactive Controls
 * Handles modern form validation, topic chip selection, copy-to-clipboard,
 * audio feedback, localStorage draft, and keyboard shortcuts modal.
 */

// Cyber Web Audio Synthesizer for futuristic micro-interactions
const CyberAudio = {
  ctx: null,
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  playBeep(freq = 880, type = 'sine', duration = 0.08) {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  },
  playSuccess() {
    this.playBeep(523.25, 'triangle', 0.08);
    setTimeout(() => this.playBeep(659.25, 'triangle', 0.08), 80);
    setTimeout(() => this.playBeep(783.99, 'triangle', 0.15), 160);
  }
};

// Cyber Toast notification helper
function showCyberToast(message, icon = '✓') {
  let toast = document.getElementById('cyberToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cyberToast';
    toast.className = 'cyber-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span style="color: var(--accent-blue); font-weight:bold;">${icon}</span> <span>${message}</span>`;
  toast.classList.add('show');
  CyberAudio.playBeep(1200, 'sine', 0.05);

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// Copy to Clipboard with Feedback
function copyToClipboard(text, element, label = 'Đã sao chép!') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showCopySuccess(element, label);
    }).catch(() => {
      fallbackCopy(text, element, label);
    });
  } else {
    fallbackCopy(text, element, label);
  }
}

function fallbackCopy(text, element, label) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showCopySuccess(element, label);
  } catch (err) {
    showCyberToast("Không thể sao chép tự động!", "✕");
  }
  document.body.removeChild(textArea);
}

function showCopySuccess(element, label) {
  if (element) {
    const originalText = element.innerHTML;
    element.classList.add('copied');
    // Chỉ hiện nút tích (checkmark icon), không hiện chữ
    element.innerHTML = `<i class="fas fa-check"></i>`;
    if (window.CyberAudio && typeof window.CyberAudio.playBeep === 'function') {
      window.CyberAudio.playBeep(920, 'triangle', 0.05);
    }
    setTimeout(() => {
      element.classList.remove('copied');
      element.innerHTML = originalText;
    }, 1600);
  }
}

// Shortcut Modal Management
function openShortcutModal() {
  const modal = document.getElementById('shortcutModal');
  if (modal) {
    modal.classList.add('open');
    CyberAudio.playBeep(700, 'triangle', 0.08);
  }
}

function closeShortcutModal() {
  const modal = document.getElementById('shortcutModal');
  if (modal) {
    modal.classList.remove('open');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Copy Buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const text = btn.dataset.copyText;
      if (text) {
        e.preventDefault();
        copyToClipboard(text, btn, "Đã sao chép");
      }
    });
  });

  // 2. Character Counter for Message
  const messageInput = document.getElementById('contactMessage');
  const charCounter = document.getElementById('charCount');
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      charCounter.textContent = messageInput.value.length;
      // Auto save draft
      localStorage.setItem('cv_contact_message', messageInput.value);
    });

    // Restore draft if exists
    const savedMsg = localStorage.getItem('cv_contact_message');
    if (savedMsg) {
      messageInput.value = savedMsg;
      charCounter.textContent = savedMsg.length;
    }
  }

  // Restore name & email draft
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  if (nameInput) {
    const savedName = localStorage.getItem('cv_contact_name');
    if (savedName) nameInput.value = savedName;
    nameInput.addEventListener('input', () => localStorage.setItem('cv_contact_name', nameInput.value));
  }
  if (emailInput) {
    const savedEmail = localStorage.getItem('cv_contact_email');
    if (savedEmail) emailInput.value = savedEmail;
    emailInput.addEventListener('input', () => localStorage.setItem('cv_contact_email', emailInput.value));
  }

  // 3. Topic Chips Interaction
  document.querySelectorAll('.topic-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      CyberAudio.playBeep(950, 'sine', 0.04);
    });
  });

  // 4. Contact Form Submission
  const contactForm = document.getElementById('cyberContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasError = false;
      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';
      const phoneInput = document.getElementById('contactPhone');
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const selectedTopic = document.querySelector('input[name="topic"]:checked');
      const topicValue = selectedTopic ? selectedTopic.value : 'Trao đổi chung';

      // Clear previous errors
      document.querySelectorAll('.cyber-input-group').forEach(group => group.classList.remove('has-error'));

      // Validate Name
      if (!name) {
        document.getElementById('groupName').classList.add('has-error');
        hasError = true;
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        document.getElementById('groupEmail').classList.add('has-error');
        hasError = true;
      }

      // Validate Message
      if (!message || message.length < 5) {
        document.getElementById('groupMessage').classList.add('has-error');
        hasError = true;
      }

      if (hasError) {
        CyberAudio.playBeep(320, 'sawtooth', 0.15);
        showCyberToast("Vui lòng điền đầy đủ và chính xác thông tin!", "✕");
        return;
      }

      // Submit Animation State
      const submitBtn = document.getElementById('submitContactBtn');
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ĐANG TRUYỀN DỮ LIỆU...`;
      CyberAudio.playBeep(600, 'square', 0.1);

      // Simulate transmission process
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
        CyberAudio.playSuccess();

        // Clear draft
        localStorage.removeItem('cv_contact_message');
        if (messageInput) {
          messageInput.value = '';
          charCounter.textContent = '0';
        }

        // Show SweetAlert Cyber notification
        if (typeof Swal !== 'undefined' || typeof swal !== 'undefined') {
          const swalInstance = (typeof Swal !== 'undefined') ? Swal : swal;
          swalInstance.fire({
            title: "TRUYỀN TIN THÀNH CÔNG!",
            html: `
              <div style="text-align: left; font-family: var(--font-mono, monospace); font-size: 0.9rem; line-height: 1.6; color: #cbd5e1;">
                <p style="color: #38bdf8; margin-bottom: 8px;"><b>> TRANSMISSION RECEIVED</b></p>
                <p>Cảm ơn <b>${escapeHtml(name)}</b> đã gửi liên hệ về chủ đề <b>[${escapeHtml(topicValue)}]</b>.</p>
                <p style="margin-top: 8px; color: #93c5fd;">Trọng Min sẽ phản hồi lại bạn qua địa chỉ <u>${escapeHtml(email)}</u> trong thời gian sớm nhất!</p>
              </div>
            `,
            icon: "success",
            background: "#0f172a",
            color: "#f8fafc",
            confirmButtonColor: "#2563eb",
            confirmButtonText: "HOÀN TẤT",
            customClass: {
              popup: 'cyber-swal-popup'
            }
          });
        } else {
          showCyberToast("Tin nhắn đã được gửi thành công!", "✓");
        }
      }, 1200);
    });
  }

  // 5. Shortcut modal overlay click to close
  const shortcutModal = document.getElementById('shortcutModal');
  if (shortcutModal) {
    shortcutModal.addEventListener('click', (e) => {
      if (e.target === shortcutModal) {
        closeShortcutModal();
      }
    });
  }

  // Helper escape HTML
  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
