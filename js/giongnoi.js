
// Chuyển tab bằng giọng nói
let recognition;
let isRecording = false;
let isInitialOk = false;
let recordedText = ""; // Thêm lại biến recordedText

// Khởi tạo đối tượng SpeechRecognition để nhận diện giọng nói
if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
  recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.continuous = true;

  // Xử lý sự kiện kết quả từ việc nhận diện giọng nói
  recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    console.log("Đã nhận dạng:", transcript);

    // Xử lý khi người dùng nói 'ok' lần đầu để bắt đầu ghi âm
    if (!isRecording && transcript.toLowerCase().includes("hello")) {
      if (!isInitialOk) {
        swal.fire({
          title: "Thành công",
          text: "Nhận dạng giọng nói thành công",
          icon: "success",
          showConfirmButton: false, // Tắt nút OK
        });

        // Đặt thời gian độ trễ 0.5s và sau đó ẩn thông báo
        setTimeout(() => {
          const swalOverlay = document.querySelector(".swal2-container");
          if (swalOverlay) {
            swalOverlay.remove(); // Loại bỏ lớp chứa hộp thoại để ẩn đi
          }
        }, 2000);

        isInitialOk = true;
      }
      console.log("Bắt đầu ghi âm");
      isRecording = true;
      recordedText = ""; // Reset giá trị recordedText
    }
    // Xử lý khi người dùng nói 'kết thúc' hoặc 'stop' để dừng việc ghi âm
    else if (isRecording && (transcript.toLowerCase().includes("kết thúc") || transcript.toLowerCase().includes("stop") || transcript.toLowerCase().includes("end"))) {
      console.log("Kết thúc ghi âm");
      isRecording = false;
      recordedText = ""; // Reset giá trị recordedText
      recognition.stop(); // Dừng việc nhận diện giọng nói
      swal.fire({
        title: "Kết thúc",
        text: "Đã dừng nhận diện giọng nói",
        icon: "info",
        showConfirmButton: false,
      });

      setTimeout(() => {
        const swalOverlay = document.querySelector(".swal2-container");
        if (swalOverlay) {
          swalOverlay.remove();
        }
      }, 2000);

    }
    // Xử lý khi đang ghi âm và người dùng nói các từ để chuyển đến liên kết tương ứng
    else if (isRecording) {
      recordedText += transcript;
      const lower = transcript.toLowerCase();
      if (lower.includes("thông tin cá nhân") || lower.includes("about") || lower.includes("profile")) { 
        window.location.href = "#about";
        animateLink("#about");
      } else if (lower.includes('kinh nghiệm') || lower.includes("experience") || lower.includes("project")) {
        window.location.href = "#experience";
        animateLink("#experience");
      } else if (lower.includes("giáo dục") || lower.includes("education") || lower.includes("học vấn")) {
        window.location.href = "#education";
        animateLink("#education");
      } else if (lower.includes("kỹ năng") || lower.includes("skills") || lower.includes("tech stack")) {
        window.location.href = "#skills";
        animateLink("#skills");
      } else if (lower.includes("sở thích") || lower.includes("interests") || lower.includes("hobby")) {
        window.location.href = "#interests";
        animateLink("#interests");
      } else if (lower.includes("giải thưởng") || lower.includes("awards") || lower.includes("honors")) {
        window.location.href = "#awards";
        animateLink("#awards");
      } else if (
        lower.includes("liên hệ") ||
        lower.includes("tin nhắn") ||
        lower.includes("contact") ||
        lower.includes("message")
      ) {
        window.location.href = "#contact";
        animateLink("#contact");
      } else if (lower.includes("tiếng anh") || lower.includes("english")) {
        if (window.i18n && typeof window.i18n.setLanguage === 'function') {
          window.i18n.setLanguage('en');
        }
      } else if (lower.includes("tiếng việt") || lower.includes("vietnamese")) {
        if (window.i18n && typeof window.i18n.setLanguage === 'function') {
          window.i18n.setLanguage('vi');
        }
      } else if (lower.includes("facebook")) {
        window.location.href =
          "https://m.facebook.com/profile.php/?id=100023433405773";
      } else if (lower.includes("8") || lower.includes("youtube")) {
        window.location.href =
          "https://m.youtube.com/channel/UCG2AfXQ9zIggntyjNa9_z5w";
      } else if (lower.includes("9") || lower.includes("tiktok")) {
        window.location.href = "https://www.tiktok.com/@trongmin12";
      } else if (lower.includes("tool") || lower.includes("công cụ")) {
        window.open("https://tool.trongmin.io.vn", "_blank");
      } else if (lower.includes("ai")) {
        window.location.href = "#experience";
      }
      // Hàm để áp dụng animation và sau đó xóa lớp "animated" sau khi hoàn thành
      function animateLink(link) {
        const linkElement = document.querySelector(link);
        linkElement.classList.add("animated");
        linkElement.addEventListener("animationend", () => {
          linkElement.classList.remove("animated");
        });
      }
    }
  };

  // Xử lý sự kiện khi đối tượng SpeechRecognition kết thúc
  recognition.onend = () => {
    if (isRecording) {
      recognition.start(); // Bắt đầu lại nhận diện sau khi kết thúc
    }
  };

  // Tự động bắt đầu nhận diện khi trang được tải
  window.onload = () => {
    recognition.start();
  };
} else {
  alert("Trình duyệt không hỗ trợ chức năng này.");
}
