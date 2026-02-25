"use client";

import { useEffect, useRef } from "react";

export default function Footer() {
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tagRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.style.transition = "opacity 1s var(--expo)";
            el.style.opacity = "1";
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-logo">EVA</div>
      <div className="footer-links">
        <a
          href="https://instagram.com/evathesanctuary"
          target="_blank"
          rel="noopener noreferrer"
          className="link-u"
        >
          @evathesanctuary
        </a>
        <span className="footer-sep">&middot;</span>
        <span>Genova, Italia</span>
      </div>
      <div ref={tagRef} className="footer-tag" style={{ opacity: 0 }}>
        EVA ha morso la mela.
      </div>
    </footer>
  );
}
