"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<HTMLAnchorElement[]>([]);
  linkRefs.current = [];

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Services", href: "#services" },
    { name: "Projects", href: "#showcase" },
    { name: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    gsap.set(menuRef.current, {
      scaleY: 0,
      autoAlpha: 0,
      transformOrigin: "top",
    });
    linkRefs.current.forEach((el) => gsap.set(el, { y: 20, opacity: 0 }));
  }, []);

  const toggleMenu = () => {
    if (!menuRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (!isOpen) {
      tl.to(menuRef.current, {
        scaleY: 1,
        autoAlpha: 1,
        duration: 0.4,
      });
      tl.to(
        linkRefs.current,
        {
          y: 0,
          opacity: 1,
          stagger: 0.07,
          duration: 0.3,
        },
        "-=0.2"
      );
    } else {
      tl.to(linkRefs.current.slice().reverse(), {
        y: 20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.2,
      });
      tl.to(
        menuRef.current,
        {
          scaleY: 0,
          autoAlpha: 0,
          duration: 0.3,
        },
        "-=0.1"
      );
    }

    setIsOpen(!isOpen);
  };

  const addToRefs = (el: HTMLAnchorElement | null) => {
    if (el && !linkRefs.current.includes(el)) {
      linkRefs.current.push(el);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="text-xl font-bold text-white">
              <Image
                src="/Logo_worapon.png"
                alt="Logo"
                width={150}
                height={150}
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger */}
              <svg
                className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close */}
              <svg
                className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        ref={menuRef}
        className="md:hidden origin-top overflow-hidden bg-black/90 backdrop-blur-sm transform"
      >
        <div className="px-4 pt-4 pb-6 space-y-2 sm:px-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              ref={addToRefs}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
