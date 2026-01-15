export type PriceRange = {
  currency: "USD" | "THB";
  from: number;
  to?: number;
  note?: string;
};

export type ServiceAccent = {
  // rgb แบบแยกช่อง: [r,g,b] เช่น [120,255,255]
  rgb: [number, number, number];
};

export type ServiceItem = {
  id: string;
  code: string;
  name: string;
  tag: string;
  image: string;

  headline: string;
  description: string;

  deliverables: string[];
  scope?: string[];
  timeline: string;
  price: PriceRange;

  highlights?: string[];
  tech?: string[];

  accent: ServiceAccent; // ✅ เพิ่ม
};
