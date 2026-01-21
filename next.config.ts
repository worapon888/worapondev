import type { NextConfig } from "next";

// next.config.ts - เพิ่มการตั้งค่า
const nextConfig: NextConfig = {
  // Image Optimization
  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Font Optimization
  optimizeFonts: true,

  // Preload critical resources
  headers: async () => [
    {
      source: "/:path((?!_next/static|favicon.ico).*)",
      headers: [
        {
          key: "Link",
          value:
            "<https://fonts.googleapis.com/css2?family=Geist+Sans:wght@400;700&display=swap>; rel=preload; as=style",
        },
      ],
    },
  ],
};

export default nextConfig;
