export type ToolCategory = 'all' | 'security' | 'dev' | 'design'

export interface ToolMeta {
  slug: string
  name: string
  shortName: string
  category: Exclude<ToolCategory, 'all'>
  categoryLabel: string
  tagline: string
  description: string
  icon: string
  accentClass: string
  badgeBgClass: string
  tags: string[]
  isNew?: boolean
}

export const toolsCatalog: ToolMeta[] = [
  {
    slug: 'steganography',
    name: 'Giấu Tin Nhắn Bí Mật Trong Ảnh',
    shortName: 'Steganography',
    category: 'security',
    categoryLabel: 'Cyber Security',
    tagline: 'LSB Steganography + AES-256-GCM',
    description:
      'Nhúng văn bản bí mật (có hỗ trợ mật khẩu mã hóa AES-256) vào sâu từng pixel của bức ảnh PNG mà mắt thường không thể nhận ra, hoặc giải mã ảnh để đọc tin ẩn.',
    icon: 'fluent-emoji:locked-with-key',
    accentClass: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/12',
    badgeBgClass: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/35',
    tags: ['LSB Pixel', 'AES-256', 'PNG Lossless', '100% Offline'],
    isNew: true,
  },
  {
    slug: 'exif-spy',
    name: 'Soi & Xóa Dữ Liệu Ẩn Trong Ảnh (EXIF / GPS)',
    shortName: 'EXIF GPS Spy',
    category: 'security',
    categoryLabel: 'Privacy & Forensics',
    tagline: 'Kiểm tra tọa độ GPS, thiết bị chụp & xóa sạch metadata',
    description:
      'Bóc tách toàn bộ thông tin EXIF ẩn trong ảnh chụp (máy ảnh, ống kính, ngày giờ, tọa độ GPS) và xuất bản ảnh sạch 100% metadata trước khi đăng mạng xã hội.',
    icon: 'fluent-emoji:detective',
    accentClass: 'text-rose-400 border-rose-400/40 bg-rose-400/12',
    badgeBgClass: 'bg-rose-400/15 text-rose-300 border-rose-400/35',
    tags: ['EXIF Parser', 'GPS Map', 'Privacy Cleaner', 'Client-side'],
    isNew: true,
  },
  {
    slug: 'code-sandbox',
    name: 'Mini Sandbox HTML / CSS / JS Trực Tiếp',
    shortName: 'Cyber CodePen',
    category: 'dev',
    categoryLabel: 'Web Playground',
    tagline: 'Gõ code & xem kết quả trực tiếp kèm Live Console',
    description:
      'Môi trường lập trình web trực tiếp trên trình duyệt với 3 tab HTML/CSS/JS, Live Preview đa kích thước (Desktop/Tablet/Mobile), bắt lỗi Console và xuất file HTML hoàn chỉnh.',
    icon: 'fluent-emoji:laptop',
    accentClass: 'text-cyan-400 border-cyan-400/40 bg-cyan-400/12',
    badgeBgClass: 'bg-cyan-400/15 text-cyan-300 border-cyan-400/35',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Live Console'],
    isNew: true,
  },
  {
    slug: 'qr-code',
    name: 'Tạo Mã QR Tức Thì',
    shortName: 'QR Generator',
    category: 'dev',
    categoryLabel: 'Utilities',
    tagline: 'Tạo & tùy biến màu mã QR độ nét cao cho link, text, Wi-Fi',
    description:
      'Sinh mã QR Code sắc nét ngay lập tức cho URL website, văn bản hoặc cấu hình Wi-Fi, tùy chọn màu sắc, độ phân giải HD và tải ảnh PNG về máy.',
    icon: 'fluent-emoji:framed-picture',
    accentClass: 'text-amber-400 border-amber-400/40 bg-amber-400/12',
    badgeBgClass: 'bg-amber-400/15 text-amber-300 border-amber-400/35',
    tags: ['QR HD', 'Wi-Fi QR', 'Custom Color', 'Download PNG'],
  },
  {
    slug: 'color-converter',
    name: 'Bảng Màu & Chuyển Đổi CSS',
    shortName: 'Color Studio',
    category: 'design',
    categoryLabel: 'UI & Design',
    tagline: 'HEX ↔ RGB ↔ HSL, Shades Palette & CSS Gradient',
    description:
      'Chuyển đổi chính xác mã màu HEX, RGB, HSL, tự động sinh dải sắc độ (tints/shades), kiểm tra độ tương phản chữ và sao chép nhanh mã CSS/Tailwind.',
    icon: 'fluent-emoji:artist-palette',
    accentClass: 'text-purple-400 border-purple-400/40 bg-purple-400/12',
    badgeBgClass: 'bg-purple-400/15 text-purple-300 border-purple-400/35',
    tags: ['HEX / RGB / HSL', 'Contrast Check', 'Shades', 'CSS Ready'],
  },
]

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return toolsCatalog.find((t) => t.slug === slug)
}
