import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import RequireAuth from "./lib/auth";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Leads from "./pages/Leads.jsx";
import Automation from "./pages/Automation.jsx";
import Billing from "./pages/Billing.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />

      <Route
        path="/leads"
        element={
          <RequireAuth>
            <Leads />
          </RequireAuth>
        }
      />

      <Route
        path="/automation"
        element={
          <RequireAuth>
            <Automation />
          </RequireAuth>
        }
      />

      <Route
        path="/billing"
        element={
          <RequireAuth>
            <Billing />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
