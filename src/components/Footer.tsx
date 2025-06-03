"use client";

import { useEffect, useRef } from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import gsap from "gsap";
import Link from "next/link";

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (footerRef.current) {
      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.2 }
      );
    }
  }, []);

  const socialLinks = [
    {
      icon: <FaGithub />,
      href: "https://github.com/worapon888",
    },
    {
      icon: <FaLinkedin />,
      href: "https://www.linkedin.com/in/worapon-jintajirakul-83229625b",
    },
    {
      icon: <FaTwitter />,
      href: "https://x.com/jintajirakul88",
    },
    {
      icon: <FaEnvelope />,
      href: "mailto:worapon088@gmail.com",
    },
  ];

  return (
    <footer
      ref={footerRef}
      className="bg-black text-white border-t border-white/10 py-10"
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Worapon Jintajirakul. All rights
          reserved.
        </p>

        <div className="flex space-x-6 text-lg">
          {socialLinks.map(({ icon, href }, i) => (
            <Link
              key={i}
              href={href}
              passHref
              target="_blank"
              rel="noopener noreferrer"
              className="group relative text-cyan-300 hover:text-white transition-transform duration-300 hover:scale-125"
            >
              <span className="absolute inset-0 blur-sm opacity-0 group-hover:opacity-40 group-hover:blur-md transition-all duration-300 rounded-full bg-cyan-400"></span>
              <span className="relative z-10">{icon}</span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
