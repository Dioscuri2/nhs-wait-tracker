import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "ShorterWait — Find an NHS Hospital With a Shorter Wait",
  description:
    "Search by postcode and specialty. See real NHS waiting times across 496 hospitals. Get alerted when waits drop. Built by a practising NHS GP.",
  keywords: "NHS waiting times, hospital choice, patient rights, NHS e-referral, shorter waiting list",
  openGraph: {
    title: "ShorterWait — NHS Wait Time Navigator",
    description: "Your legal right to choose. Find a hospital near you with a shorter wait.",
    url: "https://shorterwait.org",
    siteName: "ShorterWait",
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={inter.className}>
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
