import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProductHistory from "../pages/ProductHistory";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* default */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* private */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products/:id"
        element={
          <ProtectedRoute>
            <ProductHistory />
          </ProtectedRoute>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
