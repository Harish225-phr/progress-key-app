import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const user = sessionStorage.getItem("user");
  const token = sessionStorage.getItem("token");

  // If not logged in, redirect to login
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, check role if specified
  if (allowedRoles && allowedRoles.length > 0) {
    try {
      const userData = JSON.parse(user);
      const userRole = userData.role;

      if (!allowedRoles.includes(userRole)) {
        // User is logged in but doesn't have the right role
        return <Navigate to="/" replace />;
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      return <Navigate to="/login" replace />;
    }
  }

  // User is authorized, render the component
  return <>{children}</>;
};
