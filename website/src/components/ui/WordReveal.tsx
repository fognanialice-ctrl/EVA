"use client";

import { useEffect, useRef } from "react";

export default function WordReveal({
  text,
  goldWords = 0,
}: {
  text: string;
  goldWords?: number;
}) {
  const ref = useRef<HTMLElement>(null);

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
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const lines = text.split("/").map((l) => l.trim());
  const allWords: { word: string; breakAfter: boolean }[] = [];

  lines.forEach((line, li) => {
    const words = line.split(" ");
    words.forEach((word, wi) => {
      allWords.push({
        word,
        breakAfter: wi === words.length - 1 && li < lines.length - 1,
      });
    });
  });

  const totalWords = allWords.length;
  const goldStart = goldWords > 0 ? totalWords - goldWords : totalWords;

  return (
    <section ref={ref} className="statement">
      <p>
        {allWords.map((w, i) => (
          <span key={i}>
            <span
              className="w"
              style={
                i >= goldStart ? { transitionDelay: `${i * 0.08}s`, color: "var(--gold)" } : { transitionDelay: `${i * 0.08}s` }
              }
            >
              {w.word}
            </span>
            {w.breakAfter ? (
              <span className="br" aria-hidden="true" />
            ) : i < allWords.length - 1 ? (
              " "
            ) : null}
          </span>
        ))}
      </p>
    </section>
  );
}
