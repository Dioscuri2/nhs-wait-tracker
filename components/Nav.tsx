"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(26,58,74,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 16,
              color: "var(--secondary)",
            }}
          >
            SW
          </div>
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--secondary)", letterSpacing: "-0.02em" }}>
            ShorterWait
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="hidden md:flex">
          <Link href="/gp-tips" style={{ color: "var(--muted)", fontWeight: 500, fontSize: "0.9rem", textDecoration: "none" }}>
            GP Tips
          </Link>
          <Link href="/pricing" style={{ color: "var(--muted)", fontWeight: 500, fontSize: "0.9rem", textDecoration: "none" }}>
            Pricing
          </Link>
          <Link
            href="/search"
            style={{
              background: "var(--accent)",
              color: "var(--secondary)",
              fontWeight: 700,
              fontSize: "0.875rem",
              padding: "8px 20px",
              borderRadius: 10,
              textDecoration: "none",
            }}
          >
            Search hospitals →
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen(!open)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--secondary)" }}
          className="md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            background: "#fff",
            borderTop: "1px solid rgba(26,58,74,0.08)",
            padding: "16px 24px 24px",
          }}
          className="md:hidden"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Link href="/gp-tips" onClick={() => setOpen(false)} style={{ color: "var(--text)", fontWeight: 500, textDecoration: "none" }}>
              GP Tips
            </Link>
            <Link href="/pricing" onClick={() => setOpen(false)} style={{ color: "var(--text)", fontWeight: 500, textDecoration: "none" }}>
              Pricing
            </Link>
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              style={{
                background: "var(--accent)",
                color: "var(--secondary)",
                fontWeight: 700,
                padding: "12px 20px",
                borderRadius: 10,
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Search hospitals →
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
