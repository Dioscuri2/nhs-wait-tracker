"use client";
import { Check, Zap } from "lucide-react";
import { useState } from "react";

const FREE_FEATURES = [
  "Search all 496 NHS hospitals",
  "Full ranked results — no paywall",
  "Average and 8-in-10 wait data",
  "14 specialties",
];

const PACK_FEATURES = [
  "GP re-referral letter template (PDF)",
  "Step-by-step switching guide",
  "90 days of weekly email alerts",
  "Priority regions and specialties",
];

export default function PricingSection() {
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(false);
    }
  }

  return (
    <section style={{ padding: "80px 24px", background: "var(--neutral)" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
              fontWeight: 800,
              color: "var(--secondary)",
              letterSpacing: "-0.025em",
              marginBottom: 12,
            }}
          >
            Search is always free
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "1.05rem" }}>
            Pay only if you want help acting on what you find.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            maxWidth: 800,
            margin: "0 auto",
          }}
        >
          {/* Free */}
          <div
            className="card-shadow"
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 32,
              border: "1px solid rgba(26,58,74,0.07)",
            }}
          >
            <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--secondary)", marginBottom: 6 }}>Free</p>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 20 }}>For all patients</p>
            <p style={{ fontSize: "2.8rem", fontWeight: 800, color: "var(--secondary)", marginBottom: 28, lineHeight: 1 }}>
              £0
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {FREE_FEATURES.map((f) => (
                <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <Check size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: "0.875rem", color: "var(--text)" }}>{f}</span>
                </div>
              ))}
            </div>
            <a
              href="/search"
              style={{
                display: "block",
                textAlign: "center",
                padding: "13px",
                borderRadius: 12,
                border: "1.5px solid rgba(26,58,74,0.2)",
                fontWeight: 600,
                fontSize: "0.9rem",
                color: "var(--secondary)",
                textDecoration: "none",
              }}
            >
              Start searching
            </a>
          </div>

          {/* Switch Pack */}
          <div
            className="card-shadow-lg"
            style={{
              background: "var(--secondary)",
              borderRadius: 20,
              padding: 32,
              border: "2px solid var(--accent)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -14,
                left: "50%",
                transform: "translateX(-50%)",
                background: "var(--accent)",
                color: "var(--secondary)",
                fontWeight: 700,
                fontSize: "0.75rem",
                padding: "4px 14px",
                borderRadius: 999,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
              }}
            >
              <Zap size={12} /> Recommended
            </div>
            <p style={{ fontWeight: 700, fontSize: "1rem", color: "#fff", marginBottom: 6 }}>Switch Pack</p>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", marginBottom: 20 }}>One-time payment</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
              <p style={{ fontSize: "2.8rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>£15</p>
            </div>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginBottom: 28 }}>
              One-time · no subscription · instant download
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {PACK_FEATURES.map((f) => (
                <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <Check size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.85)" }}>{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleBuy}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 12,
                border: "none",
                background: "var(--accent)",
                color: "var(--secondary)",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: loading ? "wait" : "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {loading ? "Loading…" : "Get the Switch Pack →"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
