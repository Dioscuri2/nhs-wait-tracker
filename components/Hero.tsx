"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Clock, TrendingDown } from "lucide-react";
import { SPECIALTIES } from "@/lib/supabase";

const SAMPLE_RESULTS = [
  { name: "Royal Free Hospital", region: "London", wait: 7, trend: "down" },
  { name: "St George's University Hospital", region: "London", wait: 14, trend: "same" },
  { name: "King's College Hospital", region: "London", wait: 26, trend: "up" },
];

function waitBadgeClass(weeks: number) {
  if (weeks <= 10) return "wait-good";
  if (weeks <= 18) return "wait-warning";
  return "wait-danger";
}

export default function Hero() {
  const router = useRouter();
  const [postcode, setPostcode] = useState("");
  const [specialty, setSpecialty] = useState("Orthopaedics");
  const [loading, setLoading] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!postcode.trim()) return;
    setLoading(true);
    router.push(`/search?postcode=${encodeURIComponent(postcode.trim().toUpperCase())}&specialty=${encodeURIComponent(specialty)}`);
  }

  return (
    <section className="grid-bg" style={{ padding: "72px 24px 80px", minHeight: "80vh", display: "flex", alignItems: "center" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", width: "100%" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
          className="hero-grid"
        >
          {/* Left: copy + search */}
          <div>
            <div className="badge-teal" style={{ marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
              NHS Data · GP-Founded · Updated Weekly
            </div>

            <h1
              style={{
                fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                color: "var(--secondary)",
                letterSpacing: "-0.03em",
                marginBottom: 20,
              }}
            >
              Find an NHS hospital
              <br />
              with a{" "}
              <span
                style={{
                  textDecoration: "underline",
                  textDecorationColor: "var(--accent)",
                  textDecorationThickness: 5,
                  textUnderlineOffset: 6,
                }}
              >
                shorter wait.
              </span>
            </h1>

            <p
              style={{
                fontSize: "1.1rem",
                color: "var(--muted)",
                lineHeight: 1.7,
                marginBottom: 36,
                maxWidth: 460,
              }}
            >
              You have a legal right to choose your NHS hospital. We rank 496 hospitals
              by real waiting times so you can switch in minutes, not months.
            </p>

            {/* Search form */}
            <form onSubmit={handleSearch}>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  marginBottom: 16,
                }}
              >
                <input
                  type="text"
                  placeholder="Postcode e.g. SW1A 1AA"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  style={{
                    flex: "1 1 180px",
                    padding: "14px 18px",
                    borderRadius: 12,
                    border: "1.5px solid rgba(26,58,74,0.15)",
                    fontSize: "1rem",
                    background: "#fff",
                    color: "var(--text)",
                  }}
                />
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  style={{
                    flex: "1 1 180px",
                    padding: "14px 18px",
                    borderRadius: 12,
                    border: "1.5px solid rgba(26,58,74,0.15)",
                    fontSize: "1rem",
                    background: "#fff",
                    color: "var(--text)",
                    cursor: "pointer",
                  }}
                >
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}
                >
                  <Search size={18} />
                  {loading ? "Searching…" : "Search"}
                </button>
              </div>
            </form>

            <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
              Built by a practising NHS GP · Not medical advice · Always consult your GP
            </p>
          </div>

          {/* Right: floating results preview */}
          <div style={{ position: "relative" }} className="hero-preview">
            <div
              className="card-shadow-lg"
              style={{
                background: "#fff",
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid rgba(26,58,74,0.08)",
              }}
            >
              {/* Card header */}
              <div
                style={{
                  background: "var(--secondary)",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", marginBottom: 2 }}>
                    Orthopaedics · London
                  </p>
                  <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}>
                    3 hospitals ranked by wait
                  </p>
                </div>
                <Clock size={18} color="var(--accent)" />
              </div>

              {/* Results */}
              <div style={{ padding: "8px 0" }}>
                {SAMPLE_RESULTS.map((r, i) => (
                  <div
                    key={r.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 20px",
                      borderBottom: i < SAMPLE_RESULTS.length - 1 ? "1px solid rgba(26,58,74,0.06)" : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: i === 0 ? "var(--accent)" : "var(--neutral)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: i === 0 ? "var(--secondary)" : "var(--muted)",
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </span>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text)", lineHeight: 1.3 }}>
                          {r.name}
                        </p>
                        <p style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{r.region}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {r.trend === "down" && <TrendingDown size={14} color="var(--accent)" />}
                      <span
                        className={waitBadgeClass(r.wait)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 999,
                          fontSize: "0.8rem",
                          fontWeight: 700,
                        }}
                      >
                        {r.wait}w
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div
                style={{
                  background: "var(--neutral)",
                  padding: "12px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                  Sample data · Real search shows live NHS figures
                </p>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "var(--accent)",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  19w difference →
                </span>
              </div>
            </div>

            {/* Floating stat bubble */}
            <div
              className="card-shadow"
              style={{
                position: "absolute",
                bottom: -20,
                left: -20,
                background: "#fff",
                borderRadius: 14,
                padding: "12px 18px",
                border: "1px solid rgba(0,201,167,0.2)",
              }}
            >
              <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: 2 }}>Avg difference found</p>
              <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--secondary)", lineHeight: 1 }}>
                13 weeks
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-preview { display: none; }
        }
      `}</style>
    </section>
  );
}
