import { ArrowRight, Info } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GP Tips — Your NHS Patient Rights | ShorterWait",
  description: "Five things your GP should have told you about NHS waiting times and your right to switch hospitals.",
};

const TIPS = [
  {
    n: "01",
    title: "You have a legal right to choose your hospital",
    body: "Under the NHS Constitution and the NHS e-Referral Service, you have the right to choose any NHS or independent sector provider for your first outpatient appointment. Your GP must offer you at least five choices. Most patients are never told this.",
  },
  {
    n: "02",
    title: "Ask your GP to use NHS e-Referral Service",
    body: "When your GP refers you, they should use the NHS e-Referral Service (NHS e-RS, formerly Choose and Book). This lets you pick your provider and appointment time online. If they book directly without giving you a choice, you can ask them to re-refer via e-RS.",
  },
  {
    n: "03",
    title: "Shorter waits are often just 13 miles away",
    body: "NHS data shows the average extra distance to access a significantly shorter wait is just 13 miles. A hospital in the next town may have a wait that is 10–14 weeks shorter for the same procedure.",
  },
  {
    n: "04",
    title: "Independent sector providers count too",
    body: "The NHS commissions many independent (private) hospitals to treat NHS patients at no cost to you. These often have shorter waits and high patient satisfaction scores. They appear on e-RS alongside NHS trusts.",
  },
  {
    n: "05",
    title: "Your GP can write a referral letter to any provider",
    body: "If your preferred hospital is not on e-RS, your GP can write a direct referral letter. This is less common but you are entitled to request it. Bring the hospital name and consultant details if you have them.",
  },
];

export default function GpTipsPage() {
  return (
    <div style={{ background: "var(--neutral)", minHeight: "80vh", padding: "64px 24px 80px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* Header */}
        <div className="badge-teal" style={{ marginBottom: 20 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
          Written by a practising NHS GP
        </div>
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            fontWeight: 800,
            color: "var(--secondary)",
            letterSpacing: "-0.03em",
            marginBottom: 16,
            lineHeight: 1.15,
          }}
        >
          What your GP should have told you
          <br />
          <span
            style={{
              textDecoration: "underline",
              textDecorationColor: "var(--accent)",
              textDecorationThickness: 4,
              textUnderlineOffset: 6,
            }}
          >
            about waiting times.
          </span>
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.75, marginBottom: 48, maxWidth: 600 }}>
          These are facts most patients never hear. The rules exist — your GP should be using them.
        </p>

        {/* Tips */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {TIPS.map((t) => (
            <div
              key={t.n}
              className="card-shadow"
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "28px 32px",
                border: "1px solid rgba(26,58,74,0.07)",
                display: "flex",
                gap: 24,
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "rgba(0,201,167,0.25)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  flexShrink: 0,
                  minWidth: 48,
                }}
              >
                {t.n}
              </span>
              <div>
                <h2
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "var(--secondary)",
                    marginBottom: 10,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {t.title}
                </h2>
                <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.75 }}>{t.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div
          style={{
            marginTop: 40,
            background: "rgba(26,58,74,0.04)",
            border: "1px solid rgba(26,58,74,0.1)",
            borderRadius: 12,
            padding: "16px 20px",
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <Info size={16} color="var(--muted)" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.65 }}>
            This information is for educational purposes only. It is not medical advice and does not constitute a doctor-patient relationship.
            Always consult your own GP before making decisions about your care.
          </p>
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: 40,
            background: "var(--secondary)",
            borderRadius: 16,
            padding: "32px",
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: "1.05rem", marginBottom: 6 }}>
              Ready to find a shorter wait?
            </p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>
              Search 496 hospitals by postcode and specialty. Free — no sign-up required.
            </p>
          </div>
          <Link
            href="/search"
            style={{
              background: "var(--accent)",
              color: "var(--secondary)",
              fontWeight: 700,
              padding: "13px 24px",
              borderRadius: 12,
              textDecoration: "none",
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
            }}
          >
            Search hospitals <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
