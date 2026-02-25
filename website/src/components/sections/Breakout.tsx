import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function Breakout() {
  return (
    <section className="breakout">
      <div className="breakout-bg" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/dimora-finestra.jpg"
          alt=""
          loading="lazy"
        />
      </div>
      <div className="breakout-content">
        <RevealOnScroll variant="expand">
          <p>Il luogo è parte dell&rsquo;esperienza.</p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
