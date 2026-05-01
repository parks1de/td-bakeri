import type { Metadata } from "next";
import "./globals.css";
import { LangProvider } from "@/components/LangContext";
import { CartProvider } from "@/components/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: { default: "T&D Bakeri", template: "%s | T&D Bakeri" },
  description: "Heimelaga brod og bakverk i Kaupanger. Bestill kake og utforsk menyen var.",
  keywords: ["bakeri", "kake", "brod", "Kaupanger", "Sogndal", "T&D Bakeri"],
  metadataBase: new URL("https://tdbakeri.no"),
  openGraph: {
    title: "T&D Bakeri",
    description: "Heimelaga brod og bakverk i Kaupanger.",
    images: ["/images/logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/images/logo.png" />
      </head>
      <body>
        <LangProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}
