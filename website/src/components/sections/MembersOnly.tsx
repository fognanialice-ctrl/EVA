import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function MembersOnly() {
  return (
    <section className="members-only">
      <div className="members-only-pattern" aria-hidden="true" />
      <div className="members-only-content">
        <RevealOnScroll variant="scale">
          <h3>
            <span>MEMBERS</span>
            <span>ONLY</span>
            <span>CLUB</span>
          </h3>
        </RevealOnScroll>
        <RevealOnScroll variant="scale">
          <p className="members-only-sub">
            Non è per tutte. È per quelle che scelgono di esserci.
          </p>
        </RevealOnScroll>
        <RevealOnScroll variant="scale">
          <p className="members-only-info">
            Come funziona: un incontro al mese, in un luogo diverso. Community
            WhatsApp. Scrivi ad Alice per entrare.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
