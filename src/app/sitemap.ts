import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.worapon.dev";
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily", // หน้าแรกอาจมีการอัปเดตบ่อย
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9, // เพิ่ม Priority ให้สูงขึ้นเพราะเป็นหน้าทำเงิน
    },
    {
      url: `${baseUrl}/case-studies`, // เพิ่มจากโครงสร้างไฟล์ที่คุณมี
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
