"use client";

import RevealOnScroll from "@/components/ui/RevealOnScroll";
import CountUp from "@/components/ui/CountUp";

const stats = [
  { num: 20, suffix: " anni", label: "di esperienze curate da Alice", countUp: true },
  { num: 25, prefix: "Max ", label: "donne per incontro. Sempre.", countUp: true },
  { num: 100, suffix: "%", label: "curato a mano, dal territorio", countUp: true },
  { text: "Zero", label: "spazi convenzionali", countUp: false },
];

export default function Stats() {
  return (
    <RevealOnScroll variant="stagger" className="stats">
      {stats.map((s, i) => (
        <div key={i} className="stat">
          <div className="stat-num">
            {s.countUp ? (
              <CountUp
                end={s.num!}
                suffix={s.suffix || ""}
                prefix={s.prefix || ""}
              />
            ) : (
              s.text
            )}
          </div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </RevealOnScroll>
  );
}
