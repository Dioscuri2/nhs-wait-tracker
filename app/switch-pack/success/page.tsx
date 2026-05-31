import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Purchase Complete — ShorterWait" };

export default function SuccessPage() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 24px",
        background: "var(--neutral)",
      }}
    >
      <div style={{ maxWidth: 520, textAlign: "center" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "rgba(0,201,167,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <CheckCircle size={36} color="var(--accent)" />
        </div>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: "var(--secondary)",
            letterSpacing: "-0.03em",
            marginBottom: 12,
          }}
        >
          You&apos;re all set.
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.75, marginBottom: 36 }}>
          Your Switch Pack is on its way to your inbox. Check your email for the GP letter template,
          switching guide, and how to activate your alerts.
        </p>
        <Link
          href="/search"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--accent)",
            color: "var(--secondary)",
            fontWeight: 700,
            padding: "14px 28px",
            borderRadius: 12,
            textDecoration: "none",
            fontSize: "0.95rem",
          }}
        >
          Search hospitals now <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
