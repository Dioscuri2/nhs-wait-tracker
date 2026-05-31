"use client";
import { MapPin, BarChart2, Bell, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: MapPin,
    title: "Search by postcode",
    stat: "496 hospitals ranked",
    body: "Enter your postcode and specialty. We rank every NHS hospital in your region by real treatment waiting times — not headlines.",
    href: "/search",
  },
  {
    icon: BarChart2,
    title: "Compare side by side",
    stat: "Average vs 8-in-10 wait",
    body: "See the average wait and the 8-in-10 week figure for every hospital. Spot the trust that can treat you weeks sooner, with data to back it up.",
    href: "/search",
  },
  {
    icon: Bell,
    title: "Get alerted when waits drop",
    stat: "Weekly alerts · 90 days",
    body: "Save a search. We email you every Monday when NHS figures update — so you catch a shorter wait the moment it opens.",
    href: "/pricing",
  },
];

export default function FeatureCards() {
  return (
    <section style={{ padding: "80px 24px", background: "#fff" }}>
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
            How it works
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "1.05rem", maxWidth: 500, margin: "0 auto" }}>
            Three steps between you and a hospital with a shorter wait.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.title}
                href={f.href}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="card-shadow"
                  style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: "32px",
                    border: "1px solid rgba(26,58,74,0.07)",
                    height: "100%",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(28,43,54,0.14)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: "rgba(0,201,167,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                    }}
                  >
                    <Icon size={22} color="var(--primary)" />
                  </div>

                  <div
                    style={{
                      display: "inline-block",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                      marginBottom: 10,
                    }}
                  >
                    {f.stat}
                  </div>

                  <h3
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      color: "var(--secondary)",
                      marginBottom: 12,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>{f.body}</p>

                  <div
                    style={{
                      marginTop: 24,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "var(--primary)",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                    }}
                  >
                    Get started <ArrowRight size={15} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
