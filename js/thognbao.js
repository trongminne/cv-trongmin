// Hiển thị hướng dẫn phím tắt & giọng nói theo phong cách hiện đại không làm phiền người dùng

function showVoiceGuideModal() {
  const swalInstance = (typeof Swal !== 'undefined') ? Swal : (typeof swal !== 'undefined' ? swal : null);
  if (!swalInstance) return;

  const currentLang = (window.i18n && typeof window.i18n.getCurrentLanguage === 'function') 
    ? window.i18n.getCurrentLanguage() 
    : (localStorage.getItem('cv_lang') || 'vi');
  const isEn = currentLang === 'en';

  if (isEn) {
    swalInstance.fire({
      title: "🎮 SMART CONTROLS HUD",
      html: `
        <div style="text-align: left; font-family: var(--font-mono, monospace); font-size: 0.85rem; line-height: 1.7; color: #cbd5e1;">
          <p style="color: #38bdf8; font-weight: bold; margin-bottom: 6px;">🎙️ VOICE RECOGNITION COMMANDS:</p>
          <ul style="padding-left: 20px; margin-bottom: 15px;">
            <li>Say <b>"Hello"</b>: Start voice recognition</li>
            <li>Say <b>"About"</b>: Scroll to Personal Profile</li>
            <li>Say <b>"Experience"</b>: Scroll to Work Experience</li>
            <li>Say <b>"Education"</b>: Scroll to Education</li>
            <li>Say <b>"Skills"</b>: Scroll to Technical Skills</li>
            <li>Say <b>"Interests"</b>: Scroll to Interests</li>
            <li>Say <b>"Awards"</b>: Scroll to Honors & Awards</li>
            <li>Say <b>"Contact"</b> / <b>"Message"</b>: Scroll to Contact Form</li>
            <li>Say <b>"English"</b> / <b>"Tiếng Việt"</b>: Switch language</li>
            <li>Say <b>"Stop"</b> / <b>"End"</b>: Turn off recognition</li>
          </ul>
          <p style="color: #93c5fd; font-weight: bold; margin-bottom: 6px;">⌨️ QUICK KEYBOARD SHORTCUTS:</p>
          <p>Key <b>1</b>: About | Key <b>2</b>: Experience | Key <b>3</b>: Education</p>
          <p>Key <b>4</b>: Skills | Key <b>5</b>: Interests | Key <b>6</b>: Awards</p>
          <p>Key <b>7</b> or <b>C</b>: Contact | Key <b>L</b>: Switch Lang | Key <b>?</b>: Help</p>
        </div>
      `,
      icon: "info",
      background: "#0f172a",
      color: "#f8fafc",
      confirmButtonColor: "#2563eb",
      confirmButtonText: "ACKNOWLEDGE"
    });
  } else {
    swalInstance.fire({
      title: "🎮 ĐIỀU KHIỂN THÔNG MINH",
      html: `
        <div style="text-align: left; font-family: var(--font-mono, monospace); font-size: 0.85rem; line-height: 1.7; color: #cbd5e1;">
          <p style="color: #38bdf8; font-weight: bold; margin-bottom: 6px;">🎙️ ĐIỀU KHIỂN BẰNG GIỌNG NÓI:</p>
          <ul style="padding-left: 20px; margin-bottom: 15px;">
            <li>Nói <b>"Hello"</b>: Khởi động nhận diện giọng nói</li>
            <li>Nói <b>"Thông tin cá nhân"</b> / <b>"About"</b>: Cuộn tới Hồ sơ</li>
            <li>Nói <b>"Kinh nghiệm"</b> / <b>"Experience"</b>: Cuộn tới Kinh nghiệm</li>
            <li>Nói <b>"Giáo dục"</b> / <b>"Education"</b>: Cuộn tới Học vấn</li>
            <li>Nói <b>"Kỹ năng"</b> / <b>"Skills"</b>: Cuộn tới Kỹ năng</li>
            <li>Nói <b>"Sở thích"</b> / <b>"Interests"</b>: Cuộn tới Sở thích</li>
            <li>Nói <b>"Giải thưởng"</b> / <b>"Awards"</b>: Cuộn tới Giải thưởng</li>
            <li>Nói <b>"Liên hệ"</b> / <b>"Contact"</b>: Cuộn tới Form liên hệ</li>
            <li>Nói <b>"Tiếng Anh"</b> / <b>"English"</b>: Đổi ngôn ngữ</li>
            <li>Nói <b>"Kết thúc"</b> / <b>"Stop"</b>: Tắt nhận diện</li>
          </ul>
          <p style="color: #93c5fd; font-weight: bold; margin-bottom: 6px;">⌨️ PHÍM TẮT ĐIỀU HƯỚNG NHANH:</p>
          <p>Phím <b>1</b>: Thông tin | Phím <b>2</b>: Kinh nghiệm | Phím <b>3</b>: Giáo dục</p>
          <p>Phím <b>4</b>: Kỹ năng | Phím <b>5</b>: Sở thích | Phím <b>6</b>: Giải thưởng</p>
          <p>Phím <b>7</b> hoặc <b>C</b>: Form liên hệ | Phím <b>L</b>: Đổi ngôn ngữ | Phím <b>?</b>: Trợ giúp</p>
        </div>
      `,
      icon: "info",
      background: "#0f172a",
      color: "#f8fafc",
      confirmButtonColor: "#2563eb",
      confirmButtonText: "ĐÃ HIỂU"
    });
  }
}

// Hiển thị toast giới thiệu mượt mà sau khi trang đã tải xong
window.addEventListener('load', () => {
  setTimeout(() => {
    if (typeof showCyberToast === 'function') {
      const currentLang = localStorage.getItem('cv_lang') || 'vi';
      const msg = currentLang === 'en'
        ? '⚡ System Ready! Press keys [1-7], [L] for language, or [?] for shortcuts'
        : '⚡ Hệ thống sẵn sàng! Bấm phím [1-7], [L] đổi tiếng, hoặc [?] xem phím tắt';
      showCyberToast(msg, '⚡');
    }
  }, 1200);
});
