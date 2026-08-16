"use client";

import { useMemo } from "react";

import "./services.css";

export default function Services() {
  const services = useMemo(
    () => [
      {
        title: "Frontend Engineering",
        value: "08",
        note: "UI systems, interaction quality, responsive builds",
      },
      {
        title: "Backend Architecture",
        value: "02",
        note: "API design, data flow, stability, maintainability",
      },
      {
        title: "Production Systems",
        value: "02",
        note: "Deployment thinking, performance, reliability, scale",
      },
      {
        title: "Problem Solving",
        value: "04",
        note: "Structured delivery across product and engineering",
      },
    ],
    [],
  );

  return (
    <section id="services" className="services">
      <div className="services-shell">
        <div className="services-intro">
          <p className="services-kicker">Expertise & Services</p>
          <h2 className="services-title">
            <span>Building Digital</span>
            <span>Systems That Last</span>
          </h2>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <article key={service.title} className="service-card metric-card">
              <div className="metric-top">
                <span className="metric-dot" />
                <p className="metric-label">{service.title}</p>
              </div>

              <div className="metric-value">{service.value}</div>

              <p className="metric-note">{service.note}</p>
            </article>
          ))}
        </div>

        <div className="services-copy-panel">
          <div className="services-copy-meta">
            <p className="services-copy-label">Operating Notes</p>
            <p>04 Core Capabilities</p>
          </div>

          <div className="services-copy-body">
            <p className="services-copy">
              I turn real-world workflows into production-ready software --
              combining thoughtful product decisions, polished interfaces,
              backend architecture, automation, and reliable application logic.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
