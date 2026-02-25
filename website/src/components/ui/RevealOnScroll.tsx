"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Variant =
  | "default"
  | "text"
  | "curtain"
  | "expand"
  | "slide-left"
  | "slide-right"
  | "scale"
  | "stagger";

const variantClass: Record<Variant, string> = {
  default: "rv",
  text: "rv-text",
  curtain: "rv-curtain",
  expand: "rv-expand",
  "slide-left": "rv-slide-left",
  "slide-right": "rv-slide-right",
  scale: "rv-scale",
  stagger: "rv-stagger",
};

export default function RevealOnScroll({
  children,
  className = "",
  delay,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: Variant;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("on");
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("on");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -4% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const delayClass = delay === 1 ? "rv-d1" : delay === 2 ? "rv-d2" : delay === 3 ? "rv-d3" : "";
  const rvClass = variantClass[variant];

  return (
    <div ref={ref} className={`${rvClass} ${delayClass} ${className}`}>
      {children}
    </div>
  );
}
