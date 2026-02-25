"use client";

import { useRef, useCallback } from "react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

const events = [
  {
    tag: "Il Salotto",
    title: "La Bellezza Che Nutre",
    meta: "Marzo 2026 — Dimora storica, Carignano",
    image: "/images/dimora-angeli.jpg",
  },
  {
    tag: "Esperienza",
    title: "Ceramica & Conversazione",
    meta: "Aprile 2026 — Laboratorio artigiano, Centro Storico",
    image: "/images/exp-ceramics.jpg",
  },
  {
    tag: "Il Salotto",
    title: "Le Mani Che Creano",
    meta: "Maggio 2026 — Villa privata, Nervi",
    image: "/images/dimora-interni.jpg",
  },
  {
    tag: "Esperienza",
    title: "Profumi & Candele",
    meta: "Giugno 2026 — Atelier segreto, Castelletto",
    image: "/images/exp-candles.jpg",
  },
  {
    tag: "Il Salotto",
    title: "Il Tè delle Quattro",
    meta: "Luglio 2026 — Terrazza panoramica, Boccadasse",
    image: "/images/te-salotto.jpg",
  },
  {
    tag: "Esperienza",
    title: "Arte Viva",
    meta: "Settembre 2026 — Studio d'artista, San Lorenzo",
    image: "/images/exp-artist.jpg",
  },
];

function TiltCard({ ev }: { ev: (typeof events)[number] }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;

    const body = card.querySelector<HTMLDivElement>(".incontri-card-body");
    if (body) body.style.transform = `translateZ(20px)`;
  }, []);

  const onMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "";
    const body = card.querySelector<HTMLDivElement>(".incontri-card-body");
    if (body) body.style.transform = "";
  }, []);

  return (
    <div
      ref={cardRef}
      className="incontri-card"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="incontri-card-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ev.image} alt={ev.title} loading="lazy" />
      </div>
      <div className="incontri-card-overlay" />
      <div className="incontri-card-body">
        <div className="incontri-card-tag">{ev.tag}</div>
        <div className="incontri-card-title">{ev.title}</div>
        <div className="incontri-card-meta">{ev.meta}</div>
      </div>
    </div>
  );
}

export default function GliIncontri() {
  return (
    <section className="incontri">
      <div className="incontri-pattern" aria-hidden="true" />
      <div className="incontri-in">
        <RevealOnScroll className="incontri-header">
          <div className="incontri-label up">Gli incontri</div>
          <h2>Ogni mese, un luogo diverso. Sempre inaspettato.</h2>
          <p className="incontri-sub">
            Il salotto di EVA non ha un indirizzo fisso. Si sposta, si
            trasforma, sorprende. L&rsquo;unica costante: donne che scelgono di
            esserci.
          </p>
        </RevealOnScroll>

        <RevealOnScroll variant="stagger" className="incontri-grid">
          {events.map((ev, i) => (
            <TiltCard key={i} ev={ev} />
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
