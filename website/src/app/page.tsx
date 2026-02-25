import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import IlProgetto from "@/components/sections/IlProgetto";
import Breakout from "@/components/sections/Breakout";
import Stats from "@/components/sections/Stats";
import Marquee from "@/components/sections/Marquee";
import Statement from "@/components/sections/Statement";
import MembersOnly from "@/components/sections/MembersOnly";
import LeEsperienze from "@/components/sections/LeEsperienze";
import Alice from "@/components/sections/Alice";
import GliIncontri from "@/components/sections/GliIncontri";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <IlProgetto />
      <Breakout />
      <Stats />
      <Marquee />
      <Statement />
      <MembersOnly />
      <LeEsperienze />
      <Alice />
      <GliIncontri />
      <CTA />
      <Footer />
    </main>
  );
}
