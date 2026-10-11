
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
    } // Xử lý khi người dùng nói 'kết thúc' để dừng việc ghi âm
    else if (isRecording && transcript.toLowerCase().includes("kết thúc")) {
      console.log("Kết thúc ghi âm");
      isRecording = false;
      recordedText = ""; // Reset giá trị recordedText
      recognition.stop(); // Dừng việc nhận diện giọng nói
      swal.fire({
        title: "Kết thúc",
        text: "Kết thúc ghi âm",
        icon: "info",
        showConfirmButton: false, // Tắt nút OK
      });

      // Đặt thời gian độ trễ 0.5s và sau đó ẩn thông báo
      setTimeout(() => {
        const swalOverlay = document.querySelector(".swal2-container");
        if (swalOverlay) {
          swalOverlay.remove(); // Loại bỏ lớp chứa hộp thoại để ẩn đi
        }
      }, 2000);

    }
    // Xử lý khi đang ghi âm và người dùng nói các từ để chuyển đến liên kết tương ứng
    else if (isRecording) {
      recordedText += transcript;
      if (transcript.toLowerCase().includes("thông tin cá nhân")) { 
        window.location.href = "#about";
        animateLink("#about");
      } else if (transcript.toLowerCase().includes('kinh nghiệm')) {
        window.location.href = "#experience";
        animateLink("#experience");
      } else if (transcript.toLowerCase().includes("giáo dục")) {
        window.location.href = "#education";
        animateLink("#education");
      } else if (transcript.toLowerCase().includes("kỹ năng")) {
        window.location.href = "#skills";
        animateLink("#skills");
      } else if (transcript.toLowerCase().includes("sở thích")) {
        window.location.href = "#interests";
        animateLink("#interests");
      } else if (transcript.toLowerCase().includes("giải thưởng")) {
        window.location.href = "#awards";
        animateLink("#awards");
      } else if (
        transcript.toLowerCase().includes("liên hệ") ||
        transcript.toLowerCase().includes("tin nhắn") ||
        transcript.toLowerCase().includes("contact")
      ) {
        window.location.href = "#contact";
        animateLink("#contact");
      } else if (transcript.toLowerCase().includes("facebook")) {
        window.location.href =
          "https://m.facebook.com/profile.php/?id=100023433405773";
      } else if (transcript.toLowerCase().includes("8")) {
        window.location.href =
          "https://m.youtube.com/channel/UCG2AfXQ9zIggntyjNa9_z5w";
      } else if (transcript.toLowerCase().includes("9")) {
        window.location.href = "https://www.tiktok.com/@trongmin12";
      } else if (transcript.toLowerCase().includes("ai")) {
        window.location.href = "https://ca7f-27-67-93-178.ngrok-free.app";
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
