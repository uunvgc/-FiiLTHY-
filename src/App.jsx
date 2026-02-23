import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { RequireAuth } from "./lib/auth";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Automations from "./pages/Automations";
import Billing from "./pages/Billing";

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
        path="/automations"
        element={
          <RequireAuth>
            <Automations />
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
