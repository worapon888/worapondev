"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import "./Nav.css";

// ✅ เพิ่ม: ใช้ transition ก่อนเปลี่ยน route
import { usePageTransition } from "@/components/transition/PageTransition";
import Link from "next/link";

export default function Navbar() {
  const navRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();
  const { go, isTransitioning } = usePageTransition();

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

  const closeMobileMenuSoon = (e: React.MouseEvent) => {
    if (window.innerWidth <= 1000) {
      e.stopPropagation();
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = window.setTimeout(() => {
        setIsOpen(false);
      }, 300);
    }
  };

  // ✅ helper: match route (รองรับ sub-route เช่น /case-studies/xyz)
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  // ✅ handler สำหรับการนำทางแบบมี transition
  const onNav = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();

    // กันกดซ้ำระหว่างกำลังเล่น
    if (isTransitioning) return;

    // กันกด route เดิม (ไม่ต้องเล่นแตกตัว)
    if (href === pathname) {
      closeMobileMenuSoon(e);
      return;
    }

    closeMobileMenuSoon(e);
    go(href); // ✅ เล่น preloader แล้วค่อย push ใน provider
  };

  const onBrandNav = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isTransitioning) return;

    closeMobileMenuSoon(e);
    go("/", { allowSamePath: true });
  };

  return (
    <nav ref={navRef} className={`site-nav ${isOpen ? "nav-open" : ""}`}>
      <button
        type="button"
        className="nav-mobile-header"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-label="Toggle navigation"
      >
        <Image
          src="/Logo_worapon.webp"
          alt="worapon.dev"
          width={120}
          height={24}
          className="nav-logo"
          priority
        />
        <p className="nav-menu-toggle">Menu</p>
      </button>

      <div className="nav-overlay">
        <div className="nav-brand">
          <Link
            href="/"
            onClick={onBrandNav}
            aria-label="Go to home page"
          >
            WORAPON.DEV
          </Link>
          <span>Production Web Systems</span>
        </div>

        <div className="nav-items">
          <div className="nav-item">
            <Link
              href="/"
              onClick={onNav("/")}
              className={isActive("/") ? "is-active" : ""}
              aria-current={isActive("/") ? "page" : undefined}
            >
              Home
            </Link>
          </div>

          <div className="nav-item">
            <a
              href="/case-studies"
              onClick={onNav("/case-studies")}
              className={isActive("/case-studies") ? "is-active" : ""}
              aria-current={isActive("/case-studies") ? "page" : undefined}
            >
              Case Studies
            </a>
          </div>

          <div className="nav-item">
            <a
              href="/about"
              onClick={onNav("/about")}
              className={isActive("/about") ? "is-active" : ""}
              aria-current={isActive("/about") ? "page" : undefined}
            >
              About
            </a>
          </div>

          <div className="nav-item">
            <a
              href="/contact"
              onClick={onNav("/contact")}
              className={`nav-action ${isActive("/contact") ? "is-active" : ""}`}
              aria-current={isActive("/contact") ? "page" : undefined}
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
