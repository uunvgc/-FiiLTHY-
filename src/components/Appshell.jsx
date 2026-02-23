import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({ title, subtitle, right, children }) {
  return (
    <div className="container">
      <div className="shell">
        <div className="card sidebar">
          <div className="card-inner">
            <Sidebar />
          </div>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          <div className="card">
            <div className="card-inner">
              <Topbar title={title} subtitle={subtitle} right={right} />
            </div>
          </div>

          <div className="card">
            <div className="card-inner">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
