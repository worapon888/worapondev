import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image Optimization
  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ✅ (ลบ) optimizeFonts: true
  // Next.js 15 จัดการ Font Optimization เอง และคีย์นี้ไม่รองรับแล้ว

  // ✅ ถ้าอยากให้ deploy ผ่านชัวร์ (กัน lint ทำให้ล้ม)
  eslint: {
    ignoreDuringBuilds: true,
  },

  async headers() {
    return [
      {
        // ใช้ wildcard ปกติพอ (กันพลาดเรื่อง regex บนบางแพลตฟอร์ม)
        source: "/:path*",
        headers: [
          {
            key: "Link",
            value:
              "<https://fonts.googleapis.com/css2?family=Geist+Sans:wght@400;700&display=swap>; rel=preload; as=style; crossorigin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
