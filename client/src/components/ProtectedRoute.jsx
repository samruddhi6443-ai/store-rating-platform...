import React from "react";
import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../services/auth";

const ProtectedRoute = ({ children, roles }) => {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
