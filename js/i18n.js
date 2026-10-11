/**
 * Cyber Bilingual Engine (i18n) - English & Vietnamese
 * CV & Portfolio Trọng Min
 * Handles instant dynamic language switching, localStorage persistence,
 * UI updates, tooltips, placeholders, and keyboard/voice integration.
 */

(function () {
  'use strict';

  const translations = {
    vi: {
      // Document
      doc_title: "Trọng Min - Software Engineer & AI Developer | CV & Portfolio",
      doc_meta_desc: "Hồ sơ cá nhân và portfolio của Trọng Min - Kỹ sư phần mềm chuyên về ASP.NET Core, giải pháp tích hợp AI và phát triển web hiện đại. Liên hệ hợp tác ngay!",
      
      // Sidebar Navigation
      nav_status: "Sẵn sàng nhận dự án",
      nav_about: "Thông tin cá nhân",
      nav_experience: "Kinh nghiệm",
      nav_education: "Giáo dục",
      nav_skills: "Kỹ năng",
      nav_interests: "Sở thích",
      nav_awards: "Giải thưởng",
      nav_contact: "Liên hệ & Gửi tin",
      nav_badge_new: "Mới",
      nav_voice: "Giọng nói",
      nav_shortcuts: "Phím tắt",
      nav_voice_title: "Xem hướng dẫn giọng nói",
      nav_shortcuts_title: "Xem phím tắt nhanh (Bấm ? hoặc H)",
      theme_btn_light: "Tone Xanh Sáng",
      theme_btn_neon: "Tone Xanh Neon",
      theme_btn_title: "Chuyển tone Xanh Sáng Tươi / Xanh Sáng Neon",

      // Section 1: About
      hero_tag: "SYS_INIT // PERSONAL_PROFILE.LOG",
      hero_greeting: "👋 Xin chào, tôi là",
      hero_role1: "Kỹ Sư Phần Mềm",
      hero_role2: "ASP.NET Core & Web Developer",
      hero_role3: "AI Solutions",
      hero_bio: "\"Sự hài lòng của bạn về sản phẩm là mục tiêu của tôi! Tôi đam mê xây dựng các giải pháp web hiệu năng cao, tích hợp trí tuệ nhân tạo (AI) và kiến trúc ứng dụng an toàn, tin cậy để giải quyết các bài toán thực tiễn.\"",
      stat_1_val: "3.45 / 4.0",
      stat_1_label: "ĐH Sao Đỏ (GPA Giỏi)",
      stat_2_val: "AI Integration",
      stat_2_label: "Text-to-Image & Chatbot",
      stat_3_val: "ASP.NET Core",
      stat_3_label: "Kiến trúc Web & Bảo mật",
      stat_4_val: "Việt Nam",
      stat_4_label: "Hà Nội / Hải Dương",
      btn_contact: "LIÊN HỆ & GỬI TIN NHẮN",
      btn_experience: "XEM KINH NGHIỆM",
      btn_copy_email: "SAO CHÉP EMAIL",

      // Section 2: Experience
      exp_tag: "EXEC_PATH // WORK_EXPERIENCE.DAT",
      exp_title: "Kinh nghiệm & Dự án thực tế",
      exp_1_date: "2024 - Hiện tại",
      exp_1_title: "Triển khai Website ứng dụng Trí Tuệ Nhân Tạo (AI)",
      exp_1_role: "Dự án Trọng điểm: Tạo ảnh nghệ thuật từ văn bản (Text-to-Image)",
      exp_1_desc: "Nghiên cứu, phát triển và triển khai toàn diện giải pháp website áp dụng trí tuệ nhân tạo (AI) cho phép người dùng nhập mô tả văn bản để tạo ra hình ảnh chất lượng cao. Ứng dụng kiến thức chuyên sâu về xử lý ngôn ngữ tự nhiên (NLP) và thị giác máy tính (Computer Vision) nhằm mang lại trải nghiệm tương tác trực quan và tốc độ xử lý vượt trội.",
      tag_ai: "Trí tuệ nhân tạo (AI)",
      exp_2_date: "Tháng 11 - 2023",
      exp_2_title: "Lập trình Website & Kiến trúc Bảo mật Nâng cao",
      exp_2_role: "ASP.NET & ASP.NET Core MVC",
      exp_2_desc: "Có kinh nghiệm thực chiến với hệ sinh thái ASP.NET, ASP.NET Core MVC; áp dụng các cơ chế xác thực, phân quyền chặt chẽ, tối ưu hóa truy vấn cơ sở dữ liệu và triển khai các giải pháp bảo mật nâng cao nhằm ngăn ngừa các lỗ hổng web phổ biến (CSRF, XSS, SQL Injection).",
      exp_3_date: "Tháng 05 - 2023",
      exp_3_title: "Phát triển ứng dụng Desktop tích hợp Web",
      exp_3_role: "WPF & Windows Forms",
      exp_3_desc: "Thiết kế và lập trình phần mềm Desktop sử dụng công nghệ WPF và Windows Forms. Tích hợp tương tác đồng bộ dữ liệu hai chiều với các trang web và API ASP.NET, tạo ra trải nghiệm người dùng liền mạch và giải quyết hiệu quả nhu cầu quản lý doanh nghiệp.",

      // Section 3: Education
      edu_tag: "ACADEMIC // EDUCATION_HISTORY.SYS",
      edu_title: "Học vấn & Đào tạo",
      edu_1_school: "Trường Đại học Sao Đỏ",
      edu_1_date: "2023 - Hiện tại",
      edu_1_major: "Chuyên ngành: Kỹ sư phần mềm (Software Engineering)",
      edu_1_desc: "Chuyên sâu về nghiên cứu và phát triển phần mềm, kiến trúc website hiện đại, cơ sở dữ liệu quan hệ, và ứng dụng trí tuệ nhân tạo. Tích cực tham gia các phong trào nghiên cứu khoa học cấp trường.",
      edu_1_gpa: "Điểm TBTL (GPA): <b>3.45 / 4.0</b> (Xếp loại Giỏi)",
      edu_2_school: "Trường THPT Nam Cao",
      edu_2_date: "Tốt nghiệp: Tháng 06 - 2020",
      edu_2_major: "Khối Khoa học Tự nhiên & Học tốt Toán",
      edu_2_desc: "Nền tảng tư duy toán học và giải quyết vấn đề logic vững chắc. Điểm trung bình các môn học tự nhiên đạt mức xuất sắc (~ 7.9).",

      // Section 4: Skills
      skills_tag: "TECH_STACK // CAPABILITIES_MATRIX",
      skills_title: "Kỹ năng chuyên môn",
      skills_cat1: "Backend & Frameworks",
      skills_cat2: "Môi trường & IDE",
      skills_cat3: "Quản lý mã nguồn & Hỗ trợ",

      // Section 5: Interests
      interests_tag: "LIFESTYLE // INTERESTS_AND_ACTIVITIES",
      interests_title: "Sở thích cá nhân",
      interest_1_title: "Thể dục & Chạy bộ",
      interest_1_desc: "Dành thời gian rèn luyện thể chất ngoài trời, chạy bộ để giải tỏa áp lực và duy trì năng lượng tích cực cho công việc.",
      interest_2_title: "Đam mê Công nghệ",
      interest_2_desc: "Luôn theo dõi và tìm hiểu các công nghệ mới, đặc biệt là các mô hình trí tuệ nhân tạo (AI), thị giác máy tính và kiến trúc web hiện đại.",
      interest_3_title: "Gaming & Esports",
      interest_3_desc: "Chơi các tựa game MOBA chiến thuật (Liên Quân Mobile) cùng bạn bè để rèn luyện tinh thần đồng đội và phản xạ nhạy bén.",
      interest_4_title: "Phim ảnh & Thư giãn",
      interest_4_desc: "Thưởng thức phim điện ảnh và các nội dung sáng tạo để nuôi dưỡng cảm hứng thẩm mỹ và thiết kế.",

      // Section 6: Awards
      awards_tag: "ACHIEVEMENTS // HONORS_AND_AWARDS",
      awards_title: "Giải thưởng & Chứng nhận",
      award_1_badge: "HỌC BỔNG XUẤT SẮC",
      award_1_title: "Học bổng Xuất Sắc Kỳ I (Khoa CNTT)",
      award_1_desc: "Đạt học bổng xuất sắc dành cho sinh viên có thành tích học tập và rèn luyện dẫn đầu khoa năm học 2020 - 2021.",
      award_2_badge: "KHEN THƯỞNG HỌC TẬP",
      award_2_title: "Sinh viên giỏi phát triển ứng dụng Web",
      award_2_desc: "Ghi nhận năng lực vượt trội trong các đồ án lập trình và thiết kế ứng dụng web thực tế.",
      award_3_badge: "GIẢI ĐẤU ESPORTS",
      award_3_title: "Á Quân Giải đấu Liên Quân Khoa",
      award_3_desc: "Giải Nhì chung cuộc giải đấu thể thao điện tử cấp khoa, thể hiện tinh thần phối hợp đồng đội xuất sắc.",
      award_4_badge: "NGHIÊN CỨU KHOA HỌC",
      award_4_title: "Đề tài NCKH Quản Lý Nhà Trọ AI",
      award_4_desc: "Tham gia nghiên cứu khoa học phát triển hệ thống quản lý nhà trọ sinh viên tích hợp AI tự động hỗ trợ trả lời tin nhắn.",

      // Section 7: Contact Form & HUD
      contact_tag: "DIRECT_TRANSMISSION // INITIATE_CONTACT",
      contact_title: "Liên hệ & Gửi tin nhắn",
      contact_intro: "Bạn đang tìm kiếm một lập trình viên cho dự án mới, muốn tuyển dụng hay trao đổi về công nghệ? Hãy gửi tin nhắn ngay bên dưới hoặc kết nối trực tiếp qua các kênh liên lạc!",
      contact_email_label: "Địa chỉ Email",
      contact_email_sub: "ae12cnamcao@gmail.com",
      contact_phone_label: "Số điện thoại / Zalo",
      contact_location_label: "Khu vực hoạt động",
      contact_location_val: "Hà Nội / Hải Dương, Việt Nam",
      sys_status: "SYSTEM STATUS: OPERATIONAL",
      status_line1: "• Thời gian phản hồi trung bình: Dưới 24 giờ.",
      status_line2: "• Hỗ trợ làm việc từ xa (Remote) hoặc On-site linh hoạt.",
      status_line3: "• Sẵn sàng tham gia phát triển dự án Web, ASP.NET, và ứng dụng AI.",
      contact_social_label: "MẠNG XÃ HỘI:",
      form_title: "Gửi tin nhắn trực tiếp",
      form_desc: "Điền thông tin vào biểu mẫu, dữ liệu sẽ được truyền trực tiếp đến Trọng Min.",
      topic_label: "Chủ đề liên hệ:",
      topic_web: "Dự án Web",
      topic_ai: "Giải pháp AI",
      topic_job: "Tuyển dụng",
      topic_other: "Khác",
      label_name: "Họ và tên",
      placeholder_name: "Ví dụ: Nguyễn Văn A",
      err_name: "Vui lòng nhập họ và tên của bạn!",
      label_email: "Địa chỉ Email",
      placeholder_email: "your.email@example.com",
      err_email: "Vui lòng nhập địa chỉ email hợp lệ!",
      label_phone: "Số điện thoại / Zalo",
      label_optional: "(Tùy chọn)",
      placeholder_phone: "Ví dụ: 0912 345 678",
      label_message: "Nội dung tin nhắn",
      placeholder_message: "Mô tả tóm tắt yêu cầu dự án, cơ hội làm việc hoặc câu hỏi của bạn...",
      char_suffix: "ký tự",
      err_message: "Vui lòng nhập nội dung tin nhắn ít nhất 5 ký tự!",
      btn_submit: "GỬI TIN NHẮN / TRANSMIT",
      btn_transmitting: "ĐANG TRUYỀN DỮ LIỆU...",

      // Shortcut Modal
      modal_sc_title: "PHÍM TẮT ĐIỀU HƯỚNG NHANH",
      modal_sc_desc: "Bạn có thể bấm các phím số hoặc chữ cái sau bất kỳ lúc nào để cuộn nhanh đến mục tương ứng:",
      sc_about: "Thông tin cá nhân",
      sc_exp: "Kinh nghiệm & Dự án",
      sc_edu: "Học vấn & Đào tạo",
      sc_skills: "Kỹ năng chuyên môn",
      sc_interests: "Sở thích cá nhân",
      sc_awards: "Giải thưởng & Chứng nhận",
      sc_contact: "Form liên hệ hiện đại",
      sc_lang: "Chuyển đổi ngôn ngữ VN / EN",
      sc_help: "Mở bảng phím tắt này",
      key_1: "Phím 1",
      key_2: "Phím 2",
      key_3: "Phím 3",
      key_4: "Phím 4",
      key_5: "Phím 5",
      key_6: "Phím 6",
      key_7: "Phím 7 hoặc C",
      key_l: "Phím L",
      key_help: "Phím ? hoặc H",
      btn_modal_close: "ĐÃ HIỂU / ĐÓNG",

      // Copy & Form Messages
      copied_text: "Đã sao chép!",
      copied_toast: "Đã sao chép vào bộ nhớ tạm!",
      copy_fail_toast: "Không thể sao chép tự động!",
      fill_required_toast: "Vui lòng điền đầy đủ và chính xác thông tin!",
      form_success_title: "TRUYỀN TIN THÀNH CÔNG!",
      form_success_header: "> TRANSMISSION RECEIVED",
      form_success_thank: "Cảm ơn",
      form_success_regarding: "đã gửi liên hệ về chủ đề",
      form_success_reply: "Trọng Min sẽ phản hồi lại bạn qua địa chỉ",
      form_success_soon: "trong thời gian sớm nhất!",
      form_success_btn: "HOÀN TẤT",
      lang_toast: "Đã chuyển sang Tiếng Việt 🇻🇳",
      theme_switched_toast: "Đã chuyển sang giao diện:"
    },

    en: {
      // Document
      doc_title: "Trong Min - Software Engineer & AI Developer | CV & Portfolio",
      doc_meta_desc: "Personal CV and portfolio of Trong Min - Software Engineer specializing in ASP.NET Core, AI integration solutions, and modern web development. Contact now!",
      
      // Sidebar Navigation
      nav_status: "Available for projects",
      nav_about: "About Me",
      nav_experience: "Experience",
      nav_education: "Education",
      nav_skills: "Skills",
      nav_interests: "Interests",
      nav_awards: "Awards",
      nav_contact: "Contact & Message",
      nav_badge_new: "New",
      nav_voice: "Voice Nav",
      nav_shortcuts: "Shortcuts",
      nav_voice_title: "View voice recognition guide",
      nav_shortcuts_title: "View quick keyboard shortcuts (Press ? or H)",
      theme_btn_light: "Light Aqua Mode",
      theme_btn_neon: "Neon Blue Mode",
      theme_btn_title: "Switch Light Aqua / Cosmic Neon Blue Mode",

      // Section 1: About
      hero_tag: "SYS_INIT // PERSONAL_PROFILE.LOG",
      hero_greeting: "👋 Hello, I am",
      hero_role1: "Software Engineer",
      hero_role2: "ASP.NET Core & Web Developer",
      hero_role3: "AI Solutions",
      hero_bio: "\"Your satisfaction with the product is my ultimate goal! Passionate about building high-performance web solutions, integrating Artificial Intelligence (AI), and architecting secure, reliable systems to solve real-world problems.\"",
      stat_1_val: "3.45 / 4.0",
      stat_1_label: "Sao Do Univ (High Distinction)",
      stat_2_val: "AI Integration",
      stat_2_label: "Text-to-Image & Chatbot",
      stat_3_val: "ASP.NET Core",
      stat_3_label: "Web Architecture & Security",
      stat_4_val: "Vietnam",
      stat_4_label: "Hanoi / Hai Duong",
      btn_contact: "CONTACT & SEND MESSAGE",
      btn_experience: "VIEW EXPERIENCE",
      btn_copy_email: "COPY EMAIL",

      // Section 2: Experience
      exp_tag: "EXEC_PATH // WORK_EXPERIENCE.DAT",
      exp_title: "Experience & Practical Projects",
      exp_1_date: "2024 - Present",
      exp_1_title: "AI-Powered Web Application Deployment",
      exp_1_role: "Key Project: Artistic Text-to-Image Generation Web Platform",
      exp_1_desc: "Researched, developed, and comprehensively deployed an AI-driven web solution enabling users to generate high-resolution artistic imagery from natural language prompts. Leveraged in-depth expertise in Natural Language Processing (NLP) and Computer Vision to deliver intuitive interactions and superior processing latency.",
      tag_ai: "Artificial Intelligence (AI)",
      exp_2_date: "Nov - 2023",
      exp_2_title: "Web Engineering & Advanced Security Architecture",
      exp_2_role: "ASP.NET & ASP.NET Core MVC",
      exp_2_desc: "Hands-on engineering in the ASP.NET and ASP.NET Core MVC ecosystem; implemented robust authentication, granular authorization (RBAC), database query optimizations, and defense-in-depth security mitigations against common web vulnerabilities (CSRF, XSS, SQL Injection).",
      exp_3_date: "May - 2023",
      exp_3_title: "Desktop Application with Web Services Integration",
      exp_3_role: "WPF & Windows Forms",
      exp_3_desc: "Architected and built desktop software utilizing WPF and Windows Forms. Integrated real-time bidirectional data synchronization with ASP.NET web backends and REST APIs, delivering seamless UX and addressing enterprise workflow needs.",

      // Section 3: Education
      edu_tag: "ACADEMIC // EDUCATION_HISTORY.SYS",
      edu_title: "Education & Academic Background",
      edu_1_school: "Sao Do University",
      edu_1_date: "2023 - Present",
      edu_1_major: "Major: Software Engineering",
      edu_1_desc: "Focused on software engineering, modern cloud & web architecture, relational database management, and AI integrations. Actively participating in university-level scientific research movements.",
      edu_1_gpa: "Cumulative GPA: <b>3.45 / 4.0</b> (Distinction Honors)",
      edu_2_school: "Nam Cao High School",
      edu_2_date: "Graduated: June - 2020",
      edu_2_major: "Natural Sciences & Advanced Mathematics Focus",
      edu_2_desc: "Strong foundation in analytical mathematical thinking and structured logical problem solving. Achieved excellent academic ratings across natural sciences (~ 7.9 GPA).",

      // Section 4: Skills
      skills_tag: "TECH_STACK // CAPABILITIES_MATRIX",
      skills_title: "Technical Skills & Tech Stack",
      skills_cat1: "Backend & Web Frameworks",
      skills_cat2: "Environments & IDEs",
      skills_cat3: "Version Control & Collaboration",

      // Section 5: Interests
      interests_tag: "LIFESTYLE // INTERESTS_AND_ACTIVITIES",
      interests_title: "Personal Interests & Activities",
      interest_1_title: "Fitness & Outdoor Running",
      interest_1_desc: "Dedicate time to physical training outdoors and regular jogging to relieve stress, refresh energy, and maintain peak focus for engineering.",
      interest_2_title: "Tech Innovation Enthusiast",
      interest_2_desc: "Continuously exploring emerging tech innovations, state-of-the-art AI foundation models, computer vision systems, and modern web architectures.",
      interest_3_title: "Gaming & Esports",
      interest_3_desc: "Playing strategic MOBA titles (Arena of Valor) with friends to train tactical synergy, quick decision-making, and teamwork under pressure.",
      interest_4_title: "Cinema & Creative Media",
      interest_4_desc: "Enjoying cinematic storytelling and digital artwork to nurture aesthetic inspiration, typography, and contemporary UX design sense.",

      // Section 6: Awards
      awards_tag: "ACHIEVEMENTS // HONORS_AND_AWARDS",
      awards_title: "Honors & Achievements",
      award_1_badge: "TOP SCHOLARSHIP",
      award_1_title: "Outstanding Scholarship - Semester I (Faculty of IT)",
      award_1_desc: "Awarded top academic excellence scholarship for leading both academic rankings and student conduct across the Faculty of IT (2020 - 2021).",
      award_2_badge: "ACADEMIC MERIT",
      award_2_title: "Outstanding Student in Web Application Development",
      award_2_desc: "Recognized for superior technical craftsmanship and practical execution across software engineering course projects.",
      award_3_badge: "ESPORTS TOURNAMENT",
      award_3_title: "Runner-Up - Faculty Arena of Valor Championship",
      award_3_desc: "Second place overall in faculty-wide esports tournament, demonstrating tactical communication and teamwork under high competitive stakes.",
      award_4_badge: "SCIENTIFIC RESEARCH",
      award_4_title: "AI Student Boarding-House Management Research",
      award_4_desc: "Participated in academic research developing a student rental management system integrated with an automated AI support assistant.",

      // Section 7: Contact Form & HUD
      contact_tag: "DIRECT_TRANSMISSION // INITIATE_CONTACT",
      contact_title: "Contact & Direct Transmission",
      contact_intro: "Looking for a dedicated software engineer for your new project, hiring opportunities, or tech discussions? Drop a message below or connect with me directly!",
      contact_email_label: "Email Address",
      contact_email_sub: "ae12cnamcao@gmail.com",
      contact_phone_label: "Phone / WhatsApp / Zalo",
      contact_location_label: "Operating Region",
      contact_location_val: "Hanoi / Hai Duong, Vietnam",
      sys_status: "SYSTEM STATUS: OPERATIONAL",
      status_line1: "• Average response turnaround: Under 24 hours.",
      status_line2: "• Available for Remote or flexible On-site engagements.",
      status_line3: "• Ready for Web, ASP.NET Core, and AI integration engineering.",
      contact_social_label: "SOCIAL MEDIA:",
      form_title: "Direct Transmission Form",
      form_desc: "Fill in the form below; data will be transmitted directly to Trong Min.",
      topic_label: "Subject Topic:",
      topic_web: "Web Project",
      topic_ai: "AI Solutions",
      topic_job: "Recruitment",
      topic_other: "Other",
      label_name: "Full Name",
      placeholder_name: "e.g. John Doe",
      err_name: "Please enter your full name!",
      label_email: "Email Address",
      placeholder_email: "your.email@example.com",
      err_email: "Please enter a valid email address!",
      label_phone: "Phone / Zalo",
      label_optional: "(Optional)",
      placeholder_phone: "e.g. +84 912 345 678",
      label_message: "Message Content",
      placeholder_message: "Briefly describe your project scope, hiring offer, or inquiry...",
      char_suffix: "characters",
      err_message: "Please write a message of at least 5 characters!",
      btn_submit: "SEND MESSAGE / TRANSMIT",
      btn_transmitting: "TRANSMITTING DATA...",

      // Shortcut Modal
      modal_sc_title: "QUICK NAVIGATION SHORTCUTS",
      modal_sc_desc: "Press any of the following number or letter keys at any time to quickly jump to sections:",
      sc_about: "Personal Profile",
      sc_exp: "Work Experience & Projects",
      sc_edu: "Education & Academic",
      sc_skills: "Technical Skills",
      sc_interests: "Personal Interests",
      sc_awards: "Honors & Achievements",
      sc_contact: "Modern Contact Form",
      sc_lang: "Switch Language (VN / EN)",
      sc_help: "Open this Shortcut HUD",
      key_1: "Key 1",
      key_2: "Key 2",
      key_3: "Key 3",
      key_4: "Key 4",
      key_5: "Key 5",
      key_6: "Key 6",
      key_7: "Key 7 or C",
      key_l: "Key L",
      key_help: "Key ? or H",
      btn_modal_close: "GOT IT / CLOSE",

      // Copy & Form Messages
      copied_text: "Copied!",
      copied_toast: "Copied to clipboard!",
      copy_fail_toast: "Failed to copy automatically!",
      fill_required_toast: "Please fill out all required fields correctly!",
      form_success_title: "TRANSMISSION SUCCESSFUL!",
      form_success_header: "> TRANSMISSION RECEIVED",
      form_success_thank: "Thank you",
      form_success_regarding: "for reaching out regarding",
      form_success_reply: "Trong Min will respond to you via",
      form_success_soon: "as soon as possible!",
      form_success_btn: "COMPLETE",
      lang_toast: "Switched language to English 🇺🇸",
      theme_switched_toast: "Switched theme to:"
    }
  };

  // State
  let currentLang = 'vi';

  // Apply translations to DOM
  function applyLanguage(lang, broadcast = true) {
    if (!translations[lang]) lang = 'vi';
    currentLang = lang;
    localStorage.setItem('cv_lang', lang);

    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('data-lang', lang);

    const dict = translations[lang];

    // 1. Text elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        // Preserves HTML formatting if contains tags
        el.innerHTML = dict[key];
      }
    });

    // 2. Placeholders with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // 3. Titles with data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (dict[key] !== undefined) {
        el.setAttribute('title', dict[key]);
      }
    });

    // 4. Update Document Title & Meta Description
    if (dict.doc_title) {
      document.title = dict.doc_title;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && dict.doc_meta_desc) {
      metaDesc.setAttribute('content', dict.doc_meta_desc);
    }

    // 5. Update Language Switch UI elements
    updateSwitcherUI(lang);

    // 6. Update Theme button labels dynamically based on active theme
    updateThemeButtonText(lang);

    if (broadcast) {
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }
  }

  function updateSwitcherUI(lang) {
    // Desktop Sidebar buttons
    document.querySelectorAll('.lang-opt-btn').forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
      }
    });

    // Mobile Navbar button
    const mobileText = document.querySelector('.current-lang-text');
    if (mobileText) {
      mobileText.textContent = lang.toUpperCase();
    }
    const mobileBtn = document.querySelector('.cyber-lang-mobile-btn');
    if (mobileBtn) {
      mobileBtn.setAttribute('title', lang === 'vi' ? 'Chuyển sang English (Switch to EN)' : 'Chuyển sang Tiếng Việt (Switch to VN)');
    }

    // Floating HUD button
    const hudText = document.querySelector('.hud-lang-text');
    if (hudText) {
      hudText.textContent = lang === 'vi' ? 'VN' : 'EN';
    }
    const hudBadge = document.querySelector('.hud-lang-badge');
    if (hudBadge) {
      hudBadge.textContent = lang === 'vi' ? 'VN' : 'EN';
    }
    const hudBtn = document.querySelector('.lang-hud-btn');
    if (hudBtn) {
      hudBtn.setAttribute('title', lang === 'vi' ? 'Chuyển sang English (Phím L)' : 'Switch to Tiếng Việt (Key L)');
    }
  }

  function updateThemeButtonText(lang) {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'luminous-cyan';
    const dict = translations[lang] || translations.vi;
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      const isHud = btn.classList.contains('hud-btn');
      if (isHud) return;
      const span = btn.querySelector('span');
      if (span) {
        span.textContent = currentTheme === 'light-blue' ? dict.theme_btn_neon : dict.theme_btn_light;
      }
    });
  }

  // Toggle Language Helper
  function toggleLanguage() {
    const nextLang = currentLang === 'vi' ? 'en' : 'vi';
    applyLanguage(nextLang, true);

    if (window.CyberAudio && typeof window.CyberAudio.playSuccess === 'function') {
      window.CyberAudio.playSuccess();
    }
    if (typeof window.showCyberToast === 'function') {
      const msg = translations[nextLang].lang_toast;
      window.showCyberToast(msg, nextLang === 'en' ? '🇺🇸' : '🇻🇳');
    }
  }

  // Public API
  window.i18n = {
    setLanguage: applyLanguage,
    toggleLanguage: toggleLanguage,
    getCurrentLanguage: () => currentLang,
    t: (key) => (translations[currentLang] && translations[currentLang][key]) || key,
    getDictionary: (lang) => translations[lang || currentLang]
  };

  window.toggleLanguage = toggleLanguage;

  // Initialize on load
  function init() {
    const savedLang = localStorage.getItem('cv_lang');
    // If user has not explicitly set a language, check browser or default to 'vi'
    const defaultLang = savedLang || 'vi';
    applyLanguage(defaultLang, false);

    // Bind event listeners to all switcher elements
    document.querySelectorAll('.lang-opt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetLang = btn.getAttribute('data-lang');
        if (targetLang && targetLang !== currentLang) {
          applyLanguage(targetLang, true);
          if (window.CyberAudio && typeof window.CyberAudio.playSuccess === 'function') {
            window.CyberAudio.playSuccess();
          }
          if (typeof window.showCyberToast === 'function') {
            window.showCyberToast(translations[targetLang].lang_toast, targetLang === 'en' ? '🇺🇸' : '🇻🇳');
          }
        }
      });
    });

    // Mobile button
    const mobileBtn = document.querySelector('.cyber-lang-mobile-btn');
    if (mobileBtn) {
      mobileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleLanguage();
      });
    }

    // HUD button
    const hudBtn = document.querySelector('.lang-hud-btn');
    if (hudBtn) {
      hudBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleLanguage();
      });
    }

    // Listen to themeChanged event to update theme button label if needed
    window.addEventListener('themeChanged', () => {
      updateThemeButtonText(currentLang);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
