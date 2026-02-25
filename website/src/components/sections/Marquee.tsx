"use client";

import { useEffect, useRef } from "react";

const values = [
  "Coraggio",
  "Autenticità",
  "Bellezza",
  "Connessione",
  "Artigianato",
  "Cura",
  "Radici",
  "Intenzionalità",
  "Gioia",
  "Generosità",
];

function MarqueeItems() {
  return (
    <>
      {values.map((v, i) => (
        <span key={i}>
          <span className="marquee-item">{v}</span>
          <span className="marquee-dot">&bull;</span>
        </span>
      ))}
    </>
  );
}

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let scrolling = false;
    let timeout: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      if (!scrolling) {
        scrolling = true;
        track.style.animationDuration = "18s";
      }
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        scrolling = false;
        track.style.animationDuration = "30s";
      }, 200);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="marquee" aria-hidden="true">
      <div ref={trackRef} className="marquee-track">
        <MarqueeItems />
        <MarqueeItems />
      </div>
    </div>
  );
}
