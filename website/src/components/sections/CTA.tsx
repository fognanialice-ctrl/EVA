"use client";

import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function CTA() {
  return (
    <section className="cta" id="cta">
      <div className="cta-in">
        <RevealOnScroll>
          <h2>Parliamone.</h2>
        </RevealOnScroll>

        <RevealOnScroll>
          <p className="cta-sub">
            Se quello che hai letto ti parla, ci sono due modi per iniziare una
            conversazione.
          </p>
        </RevealOnScroll>

        <RevealOnScroll>
          <p className="cta-urgency">
            Il primo incontro è a marzo 2026. €30. Venticinque posti.
          </p>
        </RevealOnScroll>

        <div className="cta-grid">
          <RevealOnScroll className="cta-block">
            <div className="cta-block-num up">01</div>
            <div className="cta-block-title">Scrivimi su WhatsApp</div>
            <p className="cta-block-desc">
              Preferisci parlare? Scrivimi &mdash; sono Alice, e mi fa piacere
              conoscerti.
            </p>
            <a
              href="https://wa.me/393485284327?text=Ciao%20Alice%2C%20ho%20visto%20il%20sito%20EVA%20e%20mi%20piacerebbe%20parlarne."
              className="btn-wa"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Scrivimi
            </a>
          </RevealOnScroll>

          <RevealOnScroll delay={1} className="cta-block">
            <div className="cta-block-num up">02</div>
            <div className="cta-block-title">Raccontami di te</div>
            <p className="cta-block-desc">
              Cosa fai, cosa crei, cosa ti ha portata qui.
            </p>
            <form className="cta-form" action="#" method="POST">
              <div>
                <label htmlFor="name">Nome</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="work">Cosa fai</label>
                <input
                  type="text"
                  id="work"
                  name="work"
                  placeholder="avvocata, designer, insegnante, imprenditrice..."
                />
              </div>
              <div>
                <label htmlFor="city">Città</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  autoComplete="address-level2"
                />
              </div>
              <div>
                <label htmlFor="discovery">Come hai scoperto EVA</label>
                <input type="text" id="discovery" name="discovery" />
              </div>
              <div>
                <label htmlFor="message">Cosa ti incuriosisce di EVA?</label>
                <textarea id="message" name="message" rows={2} />
              </div>
              <button type="submit" className="btn-send">
                Invia{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </form>
          </RevealOnScroll>
        </div>

        <RevealOnScroll>
          <p className="cta-close">
            Ogni conversazione nasce da un gesto. Il primo incontro è a marzo
            &mdash; questo potrebbe essere il tuo momento.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
