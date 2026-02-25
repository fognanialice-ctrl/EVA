"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = ref.current;
    if (!cursor || !window.matchMedia("(pointer: fine)").matches) return;

    let cx = -100, cy = -100, tx = -100, ty = -100;
    let rafId: number;

    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest("a, button, input, textarea"))
        cursor.classList.add("hover");
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest("a, button, input, textarea"))
        cursor.classList.remove("hover");
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    function loop() {
      cx += (tx - cx) * 0.35;
      cy += (ty - cy) * 0.35;
      cursor!.style.left = cx + "px";
      cursor!.style.top = cy + "px";
      rafId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <svg viewBox="0 0 44 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <mask id="apple-mask">
            <rect width="44" height="48" fill="white" />
            {/* bite cutout — smooth arc on the right side */}
            <circle cx="37" cy="20" r="7.5" fill="black" />
          </mask>
        </defs>
        {/* stem — graceful S-curve, warm muted tone */}
        <path
          d="M21.5 11 C21.2 7.5, 22.5 4.5, 25 2.5 C25.8 1.8, 26.8 1.3, 27.5 1"
          stroke="var(--muted-soft, #7A756F)"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.9"
        />
        {/* leaf — elegant teardrop, forest green */}
        <path
          d="M25 3 C27 1.5, 30 1.2, 32 2.5 C31 4.5, 28 5.8, 25.5 5 C25.2 4.3, 25 3.5, 25 3 Z"
          fill="var(--forest-light, #2A5440)"
          opacity="0.8"
        />
        {/* leaf vein */}
        <path
          d="M25.5 3.8 C27.5 3, 29.5 3, 31 3"
          stroke="var(--forest-light, #2A5440)"
          strokeWidth="0.4"
          strokeLinecap="round"
          opacity="0.35"
        />
        {/* apple body — lush, organic, with top cleft */}
        <path
          mask="url(#apple-mask)"
          d="M7 25
             C7 17.5, 10 12.5, 14 11
             C16 10, 18 10.2, 19.5 11.2
             C20.5 12, 21 12.8, 21.5 12.8
             C22 12.8, 22.5 12, 23.5 11.2
             C25 10.2, 27 10, 29 11
             C33 12.5, 36 17.5, 36 25
             C36 30, 35 34.5, 32 38.5
             C29 42.5, 25.5 45, 21.5 45
             C17.5 45, 14 42.5, 11 38.5
             C8 34.5, 7 30, 7 25 Z"
          fill="currentColor"
        />
        {/* subtle bottom highlight — gives weight/volume */}
        <path
          d="M14 40 C17 43.5, 20 44.5, 21.5 44.5 C23 44.5, 26 43.5, 29 40"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeLinecap="round"
          opacity="0.15"
        />
      </svg>
    </div>
  );
}
