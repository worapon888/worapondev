"use client";

import "./Showcase.css";

const projects = [
  {
    title: "MinimalMart",
    description:
      "Production-style e-commerce system built to handle real-world challenges such as flash-sale concurrency, inventory reservation, payment retry flows, and webhook reliability.",
    image: "/projects/Minimalmart3.mp4",
    link: "https://minimart-three.vercel.app/",
  },
  {
    title: "NanoDashboard",
    description:
      "A production-style full-stack crypto dashboard with draggable layouts, real-time market data, JWT authentication, and Redis caching, built for performance and scalability.",
    image: "/projects/nanodashboard.mp4",
    link: "https://nano-dashboard-pi.vercel.app/",
  },
  {
    title: "Luxe-One | Premium Digital",
    description:
      "A premium brand experience designed with strong visual direction, refined motion, and polished interface systems for high-end digital presentation.",
    image: "/projects/luxe-one.mp4",
    link: "https://luxe-one-tau.vercel.app/",
  },
  {
    title: "Futuristic Landing Page",
    description:
      "An experimental landing page exploring immersive UI, motion design, and modern frontend storytelling for a distinctive developer identity.",
    image: "/projects/tech-futuristic-landing.mp4",
    link: "https://tech-futuristic-landing.vercel.app/",
  },
];

export default function Showcase() {
  return (
    <section
      id="projects"
      className="showcase-section relative z-10 mt-20 overflow-hidden"
    >
      <div className="showcase-shell">
        <div className="showcase-heading">
          <div className="showcase-status">
            <p>Control Surface / Selected Work</p>
            <p>04 Active Projects</p>
          </div>

          <div className="showcase-heading-grid">
            <h2 className="showcase-header">
              Featured
              <span>Projects.</span>
            </h2>
            <p className="showcase-subtitle">
              Selected work across production systems, full-stack applications,
              and immersive digital experiences
            </p>
          </div>
        </div>

        <div className="showcase-projects">
          {projects.map((project, index) => (
            <article
              key={project.title}
              className="showcase-card"
            >
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="showcase-media"
                aria-label={`Open ${project.title}`}
              >
                <video
                  src={project.image}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="showcase-video"
                />
              </a>

              <div className="showcase-copy">
                <div className="showcase-card-meta">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>Live Project</span>
                </div>

                <h3>{project.title}</h3>
                <p>{project.description}</p>

                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="showcase-link"
                >
                  View project
                  <span aria-hidden="true">-&gt;</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
