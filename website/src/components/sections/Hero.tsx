"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bg = bgRef.current;
    const section = sectionRef.current;
    const scrollEl = scrollRef.current;
    if (!bg || !section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Add breathing class to scroll indicator after fade-in completes
    if (scrollEl) {
      const timer = setTimeout(() => scrollEl.classList.add("breathing"), 1800);
      return () => clearTimeout(timer);
    }

    const onScroll = () => {
      const r = section.getBoundingClientRect();
      if (r.bottom > 0) {
        bg.style.transform = `translateY(${scrollY * 0.2}px) scale(1.05)`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Separate effect for parallax to avoid cleanup conflict
  useEffect(() => {
    const bg = bgRef.current;
    const section = sectionRef.current;
    if (!bg || !section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onScroll = () => {
      const r = section.getBoundingClientRect();
      if (r.bottom > 0) {
        bg.style.transform = `translateY(${scrollY * 0.2}px) scale(1.05)`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={sectionRef} className="hero">
      <div ref={bgRef} className="hero-bg" aria-hidden="true" />
      <div className="hero-pattern" aria-hidden="true" />

      <div className="hero-top">
        <div className="hero-wordmark">EVA</div>
        <div className="up">Genova, Italia</div>
      </div>

      <div className="hero-content">
        <h1>
          <span>Dove le donne</span>
          <span>si incontrano,</span>
          <span>le cose crescono.</span>
        </h1>
        <div className="hero-bottom">
          <p className="hero-sub">
            Una comunità di donne che genera insieme &mdash; incontri, sinergie
            e&nbsp;bellezza.
          </p>
          <div className="hero-cta">
            <a href="#cta" className="btn btn-solid">
              Entra nel mondo
            </a>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="hero-scroll up" aria-hidden="true">
        Scorri
      </div>
    </section>
  );
}
