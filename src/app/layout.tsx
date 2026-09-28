import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ruga Tours — Tailor-made Sri Lanka",
  description: "Arrive as a guest. Leave as a Island family. Tailor-made Sri Lankan journeys planned by real humans.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="font-sans">
        {children}
        <Toaster richColors position="top-right" toastOptions={{ style: { borderRadius: "12px" } }} />
      </body>
    </html>
  );
}
