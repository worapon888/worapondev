"use client";

import "./Footer.css";
import Image from "next/image";
import Link from "next/link";
import packageInfo from "../../../package.json";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/worapon.dev/",
  },
  {
    label: "YouTube Signals",
    href: "https://www.youtube.com/@worapondev",
  },
  {
    label: "Twitter",
    href: "https://x.com/jintajirakul88",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/worapon-dev/",
  },
  {
    label: "GitHub Repository",
    href: "https://github.com/worapon888",
  },
  {
    label: "Contact",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=worapon088@gmail.com",
  },
];

export default function FooterSection() {
  const buildMonth = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <footer>
      <div className="footer-container">
        <div className="footer-content">
          <section className="footer-lead" aria-labelledby="footer-heading">
            <p className="footer-kicker">Connection Port</p>
            <h3 id="footer-heading">Send a signal if you want to connect</h3>

            <div className="footer-form">
              <input
                type="text"
                placeholder="Project Brief / Contact"
                aria-label="Project brief or contact"
              />

              <Link href="/contact" className="footer-link">
                Start a Project
                <span aria-hidden="true">-&gt;</span>
              </Link>
            </div>
          </section>

          <section className="footer-about" aria-label="Portfolio summary">
            <p className="bodyCopy">
              Worapon.dev is a full-stack engineering portfolio focused on
              building production-ready systems, thoughtful user experiences,
              and digital products that solve real-world problems with clarity
              and precision.
            </p>
          </section>

          <section
            className="footer-socials"
            aria-label="Social links"
            role="navigation"
          >
            {socialLinks.map((item, index) => (
              <Link
                className="footer-social"
                href={item.href}
                key={item.label}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
              >
                <span className="footer-social-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="footer-social-label">{item.label}</span>
              </Link>
            ))}
          </section>

          <section className="footer-bottom" aria-label="Site metadata">
            <div className="footer-meta">
              <p>[ Constructed by Worapon.dev ]</p>
              <p>[ System Build / {buildMonth} / v{packageInfo.version} ]</p>
            </div>

            <div className="footer-brand">
              <Image
                src="/Logo_worapon.webp"
                alt="worapon.dev"
                width={500}
                height={500}
                priority
              />
            </div>
          </section>
        </div>
      </div>
    </footer>
  );
}
