import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function IlProgetto() {
  return (
    <section className="editorial">
      <div className="editorial-in">
        <RevealOnScroll variant="text">
          <div className="editorial-label up">Il progetto</div>
        </RevealOnScroll>

        <RevealOnScroll variant="text">
          <p className="editorial-opening">
            EVA organizza incontri per piccoli gruppi di donne in luoghi che non
            ti aspetti. Appartamenti creativi, dimore storiche, spazi con
            carattere.
          </p>
        </RevealOnScroll>

        <RevealOnScroll variant="text">
          <p>
            Ogni donna porta qualcosa &mdash; un sapere, un talento, una
            passione. Non è una fiera: quello che porta diventa parte
            dell&rsquo;esperienza stessa. Le tazze da cui bevi, i profumi nella
            stanza, la musica, la conversazione. Ogni incontro è diverso, perché
            le donne sono diverse.
          </p>
        </RevealOnScroll>

        <RevealOnScroll variant="text">
          <p>
            Chi porta i propri talenti non è un&rsquo;&ldquo;espositrice&rdquo;:
            è parte dell&rsquo;incontro, della serata, dello scambio. Al centro
            c&rsquo;è la conversazione &mdash; profonda, vera, senza fretta. Da
            lì nascono legami reali, collaborazioni, idee che non sarebbero nate
            altrove.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
