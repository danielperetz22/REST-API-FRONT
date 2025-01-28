import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem("accessToken");

  console.log("Token in ProtectedRoute:", token);

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
