import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function LeEsperienze() {
  return (
    <section className="split">
      <div className="split-pattern" aria-hidden="true" />

      <RevealOnScroll variant="slide-left" className="split-visual">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/dimora-almayer-salotto.jpeg"
          alt="Dimora Almayer — il salotto con soffitti affrescati"
          loading="lazy"
        />
      </RevealOnScroll>

      <div className="split-text">
        <RevealOnScroll variant="slide-right">
          <div className="split-label up">La visione</div>
        </RevealOnScroll>

        <RevealOnScroll variant="slide-right">
          <h2>
            Tu porti quello che sai fare. Noi portiamo le donne giuste nella
            stanza giusta.
          </h2>
        </RevealOnScroll>

        <RevealOnScroll variant="slide-right">
          <div>
            <p>
              Immagina una stanza. Un appartamento con i soffitti affrescati, la
              luce del pomeriggio. Venticinque donne. Una ceramista,
              un&rsquo;avvocata, una chef, una psicologa. Ognuna ha portato
              qualcosa &mdash; le sue mani, il suo sapere, la sua curiosità.
              Quello che ha portato è diventato parte del pomeriggio: lo senti
              nei dettagli, nelle conversazioni, in quello che porti a casa.
            </p>
            <p>
              EVA sta costruendo una comunità con continuità. Non compri un
              biglietto per un evento &mdash; entri in un cerchio che si incontra
              ogni mese, in un luogo diverso, con la stessa intenzione. Chi entra
              adesso è parte di quel processo &mdash; le prime, quelle che stanno
              costruendo qualcosa insieme ad Alice.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
