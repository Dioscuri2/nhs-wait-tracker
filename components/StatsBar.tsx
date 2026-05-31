export default function StatsBar() {
  const stats = [
    { value: "496", label: "NHS hospitals" },
    { value: "3,921", label: "wait time records" },
    { value: "14", label: "specialties covered" },
    { value: "Weekly", label: "NHS data refresh" },
  ];

  return (
    <div
      style={{
        background: "var(--secondary)",
        borderBottom: "2px solid rgba(0,201,167,0.3)",
      }}
    >
      <div
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          flexWrap: "wrap",
          gap: 0,
        }}
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            style={{
              flex: "1 1 140px",
              padding: "20px 24px",
              borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "var(--accent)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {s.value}
            </span>
            <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em" }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
