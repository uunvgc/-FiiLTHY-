import React from "react";

export default function TopBar({ projectId, onRefresh }) {
  return (
    <div style={{ padding: "20px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>FIILTHY</div>
          <div className="muted" style={{ marginTop: 6 }}>
            Live lead feed • project: <span className="badge">{projectId || "missing"}</span>
          </div>
        </div>

        <button className="btn" onClick={onRefresh}>Refresh</button>
      </div>
      <hr className="hr" />
    </div>
  );
}
