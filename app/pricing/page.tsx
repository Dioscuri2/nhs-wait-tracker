import type { Metadata } from "next";
import PricingSection from "@/components/PricingSection";
import { HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing — ShorterWait",
  description: "Search NHS waiting times for free. Get the Switch Pack for £15 — GP letter template, switching guide, and 90 days of alerts.",
};

const FAQ = [
  {
    q: "Is the search really free?",
    a: "Yes. You can search all 496 hospitals, see full ranked results, and view every wait time record — no paywall, no sign-up required.",
  },
  {
    q: "What is the Switch Pack?",
    a: "A one-time £15 download. Includes a GP re-referral letter template (ready to print and hand to your GP), a step-by-step switching guide, and 90 days of weekly email alerts for your specialty and region.",
  },
  {
    q: "How do I get my GP to re-refer me?",
    a: "Print the letter template, fill in your details, and hand it to your GP at your next appointment. The Switch Pack includes the exact wording GPs expect and the relevant NHS policy references.",
  },
  {
    q: "What is the GP Practice Dashboard?",
    a: "A forthcoming tool for GP surgeries — practice-wide referral insights, bulk patient switching tools, and wait-time trend reports. Join the waitlist to be notified at launch.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PricingSection />

      {/* FAQ */}
      <section style={{ padding: "64px 24px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
            <HelpCircle size={20} color="var(--primary)" />
            <h2
              style={{
                fontSize: "1.6rem",
                fontWeight: 800,
                color: "var(--secondary)",
                letterSpacing: "-0.025em",
              }}
            >
              Frequently asked questions
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {FAQ.map((item) => (
              <div
                key={item.q}
                style={{
                  borderBottom: "1px solid rgba(26,58,74,0.08)",
                  paddingBottom: 20,
                }}
              >
                <p style={{ fontWeight: 700, color: "var(--secondary)", marginBottom: 8, fontSize: "0.95rem" }}>
                  {item.q}
                </p>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.75 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
