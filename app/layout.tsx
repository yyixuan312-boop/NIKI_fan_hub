import type { Metadata } from "next";
import { Readex_Pro } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

const readexPro = Readex_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-readex-pro",
});

export const metadata: Metadata = {
  title: "Rikito Nishimura — Fan Info Hub",
  description:
    "your go-to english hub for all things rikito — fan art, videos, and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${readexPro.variable} antialiased`}>
      <body className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
