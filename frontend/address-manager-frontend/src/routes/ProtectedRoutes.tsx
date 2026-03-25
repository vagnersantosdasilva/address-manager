// src/routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";

import type { JSX } from "react";
import { getUser, isAuthenticated } from "../utils/auth";

interface Props {
  children: JSX.Element;
  allowedRoles?: ('ADMIN' | 'COMMON')[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const authenticated = isAuthenticated();
  const user = getUser();

  // Não está logado
  if (!authenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Não tem permissão
  if (allowedRoles && !allowedRoles.includes(user.userType)) {
    return <Navigate to="/" replace />;
  }

  // Pode acessar
  return children;
}