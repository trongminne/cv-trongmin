// Hiển thị hướng dẫn phím tắt & giọng nói theo phong cách hiện đại không làm phiền người dùng

function showVoiceGuideModal() {
  const swalInstance = (typeof Swal !== 'undefined') ? Swal : (typeof swal !== 'undefined' ? swal : null);
  if (!swalInstance) return;

  swalInstance.fire({
    title: "🎮 ĐIỀU KHIỂN THÔNG MINH",
    html: `
      <div style="text-align: left; font-family: var(--font-mono, monospace); font-size: 0.85rem; line-height: 1.7; color: #cbd5e1;">
        <p style="color: #38bdf8; font-weight: bold; margin-bottom: 6px;">🎙️ ĐIỀU KHIỂN BẰNG GIỌNG NÓI:</p>
        <ul style="padding-left: 20px; margin-bottom: 15px;">
          <li>Nói <b>"Hello"</b>: Khởi động nhận diện giọng nói</li>
          <li>Nói <b>"Thông tin cá nhân"</b>: Cuộn tới Hồ sơ</li>
          <li>Nói <b>"Kinh nghiệm"</b>: Cuộn tới Kinh nghiệm</li>
          <li>Nói <b>"Giáo dục"</b>: Cuộn tới Học vấn</li>
          <li>Nói <b>"Kỹ năng"</b>: Cuộn tới Kỹ năng</li>
          <li>Nói <b>"Sở thích"</b>: Cuộn tới Sở thích</li>
          <li>Nói <b>"Giải thưởng"</b>: Cuộn tới Giải thưởng</li>
          <li>Nói <b>"Liên hệ"</b> / <b>"Tin nhắn"</b>: Cuộn tới Form liên hệ</li>
          <li>Nói <b>"Kết thúc"</b>: Tắt nhận diện</li>
        </ul>
        <p style="color: #93c5fd; font-weight: bold; margin-bottom: 6px;">⌨️ PHÍM TẮT ĐIỀU HƯỚNG NHANH:</p>
        <p>Phím <b>1</b>: Thông tin | Phím <b>2</b>: Kinh nghiệm | Phím <b>3</b>: Giáo dục</p>
        <p>Phím <b>4</b>: Kỹ năng | Phím <b>5</b>: Sở thích | Phím <b>6</b>: Giải thưởng</p>
        <p>Phím <b>7</b> hoặc <b>C</b>: Form liên hệ | Phím <b>?</b>: Mở trợ giúp</p>
      </div>
    `,
    icon: "info",
    background: "#0f172a",
    color: "#f8fafc",
    confirmButtonColor: "#2563eb",
    confirmButtonText: "ĐÃ HIỂU"
  });
}

// Hiển thị toast giới thiệu mượt mà sau khi trang đã tải xong
window.addEventListener('load', () => {
  setTimeout(() => {
    if (typeof showCyberToast === 'function') {
      showCyberToast('⚡ Hệ thống sẵn sàng! Bấm phím [1-7] hoặc [?] để xem phím tắt', '⚡');
    }
  }, 1200);
});
