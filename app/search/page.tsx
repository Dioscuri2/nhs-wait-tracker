"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Search, ExternalLink, TrendingDown, TrendingUp, Minus, Filter } from "lucide-react";
import { SPECIALTIES } from "@/lib/supabase";
import type { WaitTime } from "@/lib/supabase";

function waitBadgeClass(weeks: number | null) {
  if (weeks === null) return "";
  if (weeks <= 10) return "wait-good";
  if (weeks <= 18) return "wait-warning";
  return "wait-danger";
}

function WaitCell({ weeks }: { weeks: number | null }) {
  if (weeks === null) return <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>—</span>;
  return (
    <span
      className={waitBadgeClass(weeks)}
      style={{ padding: "4px 10px", borderRadius: 999, fontSize: "0.82rem", fontWeight: 700 }}
    >
      {weeks}w
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {[220, 100, 80, 80, 80, 80].map((w, i) => (
        <td key={i} style={{ padding: "16px 16px" }}>
          <div className="skeleton" style={{ height: 18, width: w, borderRadius: 6 }} />
        </td>
      ))}
    </tr>
  );
}

function SearchContent() {
  const params = useSearchParams();
  const router = useRouter();

  const [postcode, setPostcode] = useState(params.get("postcode") || "");
  const [specialty, setSpecialty] = useState(params.get("specialty") || "Orthopaedics");
  const [results, setResults] = useState<WaitTime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const pc = params.get("postcode");
    const sp = params.get("specialty");
    if (pc && sp) {
      setPostcode(pc);
      setSpecialty(sp);
      doSearch(pc, sp);
    }
  }, []);

  async function doSearch(pc: string, sp: string) {
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const res = await fetch(`/api/search?postcode=${encodeURIComponent(pc)}&specialty=${encodeURIComponent(sp)}`);
      const data = await res.json();
      if (data.error) { setError(data.error); setResults([]); }
      else setResults(data.results || []);
    } catch {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!postcode.trim()) return;
    const pc = postcode.trim().toUpperCase();
    router.push(`/search?postcode=${encodeURIComponent(pc)}&specialty=${encodeURIComponent(specialty)}`);
    doSearch(pc, specialty);
  }

  const best = results[0]?.treatment_avg;
  const worst = results[results.length - 1]?.treatment_avg;
  const spread = best != null && worst != null ? Math.round(worst - best) : null;

  return (
    <div style={{ minHeight: "80vh", background: "var(--neutral)", padding: "40px 24px 80px" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>

        {/* Search bar */}
        <div
          className="card-shadow"
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "24px",
            marginBottom: 32,
            border: "1px solid rgba(26,58,74,0.07)",
          }}
        >
          <form onSubmit={handleSearch}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ position: "relative", flex: "1 1 200px" }}>
                <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
                <input
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="Postcode e.g. SW1A 1AA"
                  style={{
                    width: "100%",
                    padding: "12px 14px 12px 40px",
                    borderRadius: 10,
                    border: "1.5px solid rgba(26,58,74,0.15)",
                    fontSize: "0.95rem",
                    background: "var(--neutral)",
                  }}
                />
              </div>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                style={{
                  flex: "1 1 200px",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1.5px solid rgba(26,58,74,0.15)",
                  fontSize: "0.95rem",
                  background: "var(--neutral)",
                  cursor: "pointer",
                }}
              >
                {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button type="submit" className="btn-primary" style={{ padding: "12px 24px" }}>
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Summary banner */}
        {!loading && searched && results.length > 0 && spread !== null && (
          <div
            style={{
              background: "var(--secondary)",
              borderRadius: 14,
              padding: "18px 24px",
              marginBottom: 24,
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", marginBottom: 4 }}>
                {specialty} · {postcode}
              </p>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: "1rem" }}>
                {results.length} hospitals found · Fastest wait: <span style={{ color: "var(--accent)" }}>{best}w</span>
              </p>
            </div>
            <div
              style={{
                background: "rgba(0,201,167,0.15)",
                border: "1px solid rgba(0,201,167,0.3)",
                borderRadius: 10,
                padding: "10px 18px",
                textAlign: "center",
              }}
            >
              <p style={{ color: "var(--accent)", fontSize: "1.5rem", fontWeight: 800, lineHeight: 1 }}>{spread}w</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem" }}>difference between best & worst</p>
            </div>
          </div>
        )}

        {/* Results table */}
        <div
          className="card-shadow"
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(26,58,74,0.07)",
            overflow: "hidden",
          }}
        >
          {error && (
            <div style={{ padding: 32, textAlign: "center", color: "var(--danger)" }}>{error}</div>
          )}

          {!searched && !loading && (
            <div style={{ padding: 64, textAlign: "center" }}>
              <p style={{ fontSize: "1.1rem", color: "var(--muted)" }}>
                Enter a postcode and specialty above to find hospitals ranked by wait time.
              </p>
            </div>
          )}

          {(loading || searched) && !error && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--neutral)", borderBottom: "1px solid rgba(26,58,74,0.08)" }}>
                    {["#", "Hospital", "Region", "Out. Avg", "Out. 8/10", "Treat. Avg", "Treat. 8/10"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          textAlign: h === "#" || h === "Region" || h.includes("Out") || h.includes("Treat") ? "center" : "left",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "var(--muted)",
                          letterSpacing: "0.07em",
                          textTransform: "uppercase",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                    <th style={{ padding: "12px 16px", width: 40 }} />
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                    : results.map((r, i) => (
                        <tr
                          key={r.id}
                          style={{
                            borderBottom: "1px solid rgba(26,58,74,0.05)",
                            background: i === 0 ? "rgba(0,201,167,0.03)" : "transparent",
                          }}
                        >
                          <td style={{ padding: "16px 16px", textAlign: "center" }}>
                            <span
                              style={{
                                width: 26,
                                height: 26,
                                borderRadius: "50%",
                                background: i === 0 ? "var(--accent)" : "var(--neutral)",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                color: i === 0 ? "var(--secondary)" : "var(--muted)",
                              }}
                            >
                              {i + 1}
                            </span>
                          </td>
                          <td style={{ padding: "16px 16px" }}>
                            <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text)", marginBottom: 2 }}>
                              {r.hospital_name}
                            </p>
                            {r.last_updated && (
                              <p style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Updated {r.last_updated}</p>
                            )}
                          </td>
                          <td style={{ padding: "16px 16px", textAlign: "center" }}>
                            <span style={{ fontSize: "0.8rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                              {r.region}
                            </span>
                          </td>
                          <td style={{ padding: "16px 16px", textAlign: "center" }}><WaitCell weeks={r.outpatient_avg} /></td>
                          <td style={{ padding: "16px 16px", textAlign: "center" }}><WaitCell weeks={r.outpatient_8in10} /></td>
                          <td style={{ padding: "16px 16px", textAlign: "center" }}><WaitCell weeks={r.treatment_avg} /></td>
                          <td style={{ padding: "16px 16px", textAlign: "center" }}><WaitCell weeks={r.treatment_8in10} /></td>
                          <td style={{ padding: "16px 12px" }}>
                            <a
                              href={r.hospital_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "var(--muted)", display: "flex", alignItems: "center" }}
                            >
                              <ExternalLink size={14} />
                            </a>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Legend */}
        {results.length > 0 && (
          <div style={{ marginTop: 20, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Wait time key:</span>
            {[["≤10w · Short", "wait-good"], ["11–18w · Moderate", "wait-warning"], [">18w · Long", "wait-danger"]].map(([label, cls]) => (
              <span key={label} className={cls} style={{ padding: "3px 10px", borderRadius: 999, fontSize: "0.75rem", fontWeight: 600 }}>
                {label}
              </span>
            ))}
            <span style={{ fontSize: "0.78rem", color: "var(--muted)", marginLeft: "auto" }}>
              Data: NHS England · Open Government Licence
            </span>
          </div>
        )}

        {/* Switch Pack CTA */}
        {results.length > 0 && (
          <div
            style={{
              marginTop: 32,
              background: "var(--secondary)",
              borderRadius: 16,
              padding: "28px 32px",
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: "1.05rem", marginBottom: 6 }}>
                Found a shorter wait? Now switch.
              </p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>
                GP re-referral letter template + step-by-step guide + 90 days of alerts for £15.
              </p>
            </div>
            <a
              href="/pricing"
              style={{
                background: "var(--accent)",
                color: "var(--secondary)",
                fontWeight: 700,
                padding: "13px 24px",
                borderRadius: 12,
                textDecoration: "none",
                fontSize: "0.95rem",
                whiteSpace: "nowrap",
              }}
            >
              Get the Switch Pack →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: 64, textAlign: "center", color: "var(--muted)" }}>Loading…</div>}>
      <SearchContent />
    </Suspense>
  );
}
