"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "./Nav.css";
import Image from "next/image";
import { useNavIntro } from "./useNavIntro"; // ✅ สำคัญ: ต้อง import แบบนี้

export default function Navbar() {
  const navRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  // ✅ intro motion
  useNavIntro({ navRef });

  // close on resize > 1000
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1000) setIsOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // cleanup pending timer
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  // keep class in sync
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    nav.classList.toggle("nav-open", isOpen);
  }, [isOpen]);

  const toggleMenu = (e: React.MouseEvent) => {
    if (window.innerWidth <= 1000) {
      e.stopPropagation();
      setIsOpen((v) => !v);
    }
  };

  const onLinkClick = (e: React.MouseEvent) => {
    if (window.innerWidth <= 1000) {
      e.stopPropagation();
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = window.setTimeout(() => {
        setIsOpen(false);
      }, 300);
    }
  };

  return (
    <nav ref={navRef} className={`nav--preload ${isOpen ? "nav-open" : ""}`}>
      <div className="nav-container">
        <div className="nav-bg" />
      </div>

      <div className="nav-mobile-header" onClick={toggleMenu}>
        <Image
          src="/Logo_worapon.png"
          alt="worapon.dev"
          width={120}
          height={24}
          className="nav-logo"
        />
        <p className="nav-menu-toggle">Menu</p>
      </div>

      <div className="nav-overlay">
        <div className="nav-items">
          <div className="nav-item">
            <Link href="/" onClick={onLinkClick}>
              Work / Projects
            </Link>
          </div>

          <div className="nav-item">
            <Link href="/observatory" onClick={onLinkClick}>
              Case Studies
            </Link>
          </div>

          <div className="nav-item">
            <Link href="/expedition" onClick={onLinkClick}>
              About
            </Link>
          </div>

          <div className="nav-item">
            <Link href="/traces" onClick={onLinkClick}>
              Services
            </Link>
          </div>

          <div className="nav-item">
            <Link href="/contact" onClick={onLinkClick}>
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
