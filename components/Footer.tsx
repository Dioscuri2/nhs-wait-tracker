import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "var(--secondary)", color: "rgba(255,255,255,0.7)", marginTop: "auto" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "48px 24px 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 40,
            marginBottom: 40,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: 13,
                  color: "var(--secondary)",
                }}
              >
                SW
              </div>
              <span style={{ fontWeight: 700, color: "#fff", fontSize: "0.95rem" }}>ShorterWait</span>
            </div>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.7, maxWidth: 220 }}>
              Helping NHS patients exercise their legal right to choose a hospital with a shorter wait.
              Built by a practising NHS GP.
            </p>
          </div>

          <div>
            <p style={{ color: "#fff", fontWeight: 600, fontSize: "0.85rem", marginBottom: 16, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Tool
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[["Search hospitals", "/search"], ["GP Tips", "/gp-tips"], ["Switch Pack", "/pricing"], ["Pricing", "/pricing"]].map(([label, href]) => (
                <Link key={href} href={href} style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", textDecoration: "none" }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p style={{ color: "#fff", fontWeight: 600, fontSize: "0.85rem", marginBottom: 16, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Legal
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[["Privacy Policy", "/privacy"], ["Terms of Use", "/terms"]].map(([label, href]) => (
                <Link key={href} href={href} style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", textDecoration: "none" }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 24,
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.78rem",
          }}
        >
          <p>© 2026 ShorterWait. Not medical advice. Always consult your GP.</p>
          <p>Data sourced from NHS England under Open Government Licence v3.0</p>
        </div>
      </div>
    </footer>
  );
}
