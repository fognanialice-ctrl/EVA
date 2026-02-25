"use client";

import { useEffect, useRef } from "react";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    const bar = barRef.current;
    const hero = document.querySelector(".hero");
    if (!nav || !bar || !hero) return;

    let ticking = false;
    let lastMilestone = -1;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - innerHeight;
        const pct = h > 0 ? (scrollY / h) * 100 : 0;
        bar.style.width = pct + "%";

        nav.classList.toggle(
          "on",
          hero.getBoundingClientRect().bottom < innerHeight * 0.15
        );

        // Milestone pulses at 25/50/75/100%
        const milestone = [25, 50, 75, 100].findIndex(
          (m) => pct >= m - 1 && pct <= m + 1
        );
        if (milestone !== -1 && milestone !== lastMilestone) {
          lastMilestone = milestone;
          bar.classList.add("milestone");
          setTimeout(() => bar.classList.remove("milestone"), 600);
        }
        if (milestone === -1) lastMilestone = -1;

        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div ref={barRef} className="progress" aria-hidden="true" />
      <nav ref={navRef} className="nav">
        <div className="nav-in">
          <div className="nav-logo">EVA</div>
          <a href="#cta" className="btn">
            Parliamone
          </a>
        </div>
      </nav>
    </>
  );
}
