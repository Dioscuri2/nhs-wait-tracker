"use client";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

const rights = [
  "You have a legal right to choose any NHS hospital for your first outpatient appointment",
  "Your GP must offer at least five provider choices via NHS e-Referral",
  "Independent sector providers (private hospitals treating NHS patients) are included",
  "The average extra distance to a significantly shorter wait is just 13 miles",
];

export default function GpRightsSection() {
  return (
    <section className="grid-bg-dark" style={{ padding: "80px 24px" }}>
      <div
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
        className="rights-grid"
      >
        <div>
          <div className="badge-teal" style={{ marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
            Know your rights
          </div>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.03em",
              marginBottom: 16,
              lineHeight: 1.15,
            }}
          >
            Most patients are never
            <br />
            <span style={{ color: "var(--accent)" }}>told they can switch.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem", lineHeight: 1.75, marginBottom: 32 }}>
            Under the NHS Constitution and NHS e-Referral Service, you have the right to choose where
            you're referred. ShorterWait makes that choice easy — with real data and a GP-written guide.
          </p>
          <Link
            href="/gp-tips"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--accent)",
              color: "var(--secondary)",
              fontWeight: 700,
              padding: "14px 24px",
              borderRadius: 12,
              textDecoration: "none",
              fontSize: "0.95rem",
            }}
          >
            Read all GP tips <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {rights.map((r, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: "18px 20px",
              }}
            >
              <CheckCircle size={20} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.9rem", lineHeight: 1.65 }}>{r}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .rights-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
