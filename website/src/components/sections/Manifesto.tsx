import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function Manifesto() {
  return (
    <section className="manifesto">
      <div className="manifesto-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/dimora-interni.jpg"
          alt=""
          loading="lazy"
          aria-hidden="true"
        />
      </div>
      <div className="manifesto-overlay" />

      <div className="manifesto-content">
        <RevealOnScroll variant="curtain">
          <div className="manifesto-label up">Il manifesto</div>
        </RevealOnScroll>

        <RevealOnScroll variant="curtain">
          <h2>
            WE&rsquo;RE
            <br />
            GOING
            <br />
            <span className="gold">ALL IN.</span>
          </h2>
        </RevealOnScroll>

        <RevealOnScroll variant="curtain">
          <span className="manifesto-script">
            una comunità, non un evento
          </span>
        </RevealOnScroll>
      </div>
    </section>
  );
}
