import type { Metadata } from "next";
import { Playfair_Display, Space_Grotesk, Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/layout/CustomCursor";
import FilmGrain from "@/components/layout/FilmGrain";
import Navbar from "@/components/layout/Navbar";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "EVA — Dove le donne si incontrano, le cose crescono",
  description:
    "EVA è una comunità femminile che crea incontri, sinergie e bellezza. A Genova, e presto oltre.",
  openGraph: {
    title: "EVA — Dove le donne si incontrano, le cose crescono",
    description:
      "Una comunità femminile che crea incontri, sinergie e bellezza. A Genova, e presto oltre.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${playfair.variable} ${spaceGrotesk.variable} ${cormorant.variable} ${dmSans.variable}`}
      >
        <CustomCursor />
        <FilmGrain />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
