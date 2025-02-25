import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, token } = useAuth();
  console.log("Token in ProtectedRoute:", token);
  console.log("isAuthenticated:", isAuthenticated);

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
