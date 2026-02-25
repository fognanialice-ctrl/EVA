import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function Alice() {
  return (
    <section className="alice">
      <RevealOnScroll variant="slide-left" className="alice-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/alice.png" alt="Alice, fondatrice di EVA" loading="lazy" />
      </RevealOnScroll>

      <div className="alice-body">
        <RevealOnScroll variant="text">
          <div className="alice-label up">Chi c&rsquo;è dietro</div>
        </RevealOnScroll>

        <RevealOnScroll variant="text">
          <h2>Questa è Alice.</h2>
        </RevealOnScroll>

        <RevealOnScroll variant="text">
          <p>
            Per quasi vent&rsquo;anni ha disegnato eventi di alto livello per gli
            altri. Poi è arrivato un momento in cui ha sentito il bisogno di
            fermarsi, camminare, e chiedersi: cosa voglio creare per me?
          </p>
        </RevealOnScroll>

        <RevealOnScroll variant="text">
          <p>
            La risposta è stata EVA. Nasce dalla stessa cura e dalla stessa
            visione di sempre, ma con un&rsquo;energia nuova &mdash; più
            personale, più libera, più vera.
          </p>
        </RevealOnScroll>

        <RevealOnScroll variant="text">
          <p className="alice-quote">
            &ldquo;Ho passato la vita a creare esperienze belle per gli altri.
            EVA è lo spazio dove creo qualcosa di bello anche per me.&rdquo;
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
