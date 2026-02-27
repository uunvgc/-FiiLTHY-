import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Leads from "./pages/Leads.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/leads" replace />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="*" element={<Navigate to="/leads" replace />} />
      </Routes>
    </Router>
  );
}
