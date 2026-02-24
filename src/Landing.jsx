export default function Landing() {
  return (
    <div style={s.page}>
      <div style={s.shell}>
        <header style={s.header}>
          <div style={s.logo}>$</div>
          <div>
            <div style={s.brand}>FiiLTHY</div>
            <div style={s.tag}>Open your sub vault</div>
          </div>
        </header>

        <div style={s.panel}>
          <div style={s.big}>Vault Access</div>
          <div style={s.small}>
            Leads • Scoring • Auto-messages • Pipeline • Analytics
          </div>

          <div style={s.row}>
            <a href="/login" style={s.primary}>Sign In</a>
            <a href="/dashboard" style={s.secondary}>Enter Vault</a>
          </div>

          <div style={s.hint}>
            If your app doesn’t have routes yet, these buttons still render fine.
          </div>
        </div>

        <footer style={s.footer}>
          © {new Date().getFullYear()} FiiLTHY
        </footer>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#050505",
    color: "#EDEDED",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
  },
  shell: { width: "100%", maxWidth: 560 },
  header: {
    display: "flex",
    gap: 14,
    alignItems: "center",
    marginBottom: 14,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    background: "#D4AF37",
    color: "#050505",
    fontWeight: 900,
    display: "grid",
    placeItems: "center",
    fontSize: 26,
  },
  brand: { fontSize: 40, fontWeight: 950, color: "#00FF88", letterSpacing: 1 },
  tag: { opacity: 0.75, marginTop: 2 },
  panel: {
    background: "#0F0F0F",
    border: "1px solid #1F1F1F",
    borderRadius: 18,
    padding: 20,
    boxShadow: "0 14px 40px rgba(0,0,0,.55)",
  },
  big: { fontSize: 22, fontWeight: 850 },
  small: { marginTop: 8, opacity: 0.75, lineHeight: 1.4 },
  row: { display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" },
  primary: {
    flex: 1,
    minWidth: 160,
    textAlign: "center",
    padding: "12px 14px",
    borderRadius: 12,
    background: "#00FF88",
    color: "#050505",
    fontWeight: 900,
    textDecoration: "none",
  },
  secondary: {
    flex: 1,
    minWidth: 160,
    textAlign: "center",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #2B2B2B",
    color: "#EDEDED",
    fontWeight: 800,
    textDecoration: "none",
    background: "transparent",
  },
  hint: { marginTop: 12, fontSize: 12, opacity: 0.6 },
  footer: { marginTop: 14, fontSize: 12, opacity: 0.6, textAlign: "center" },
};
