import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

type ProtectedRouteProps = {
  children: React.ReactElement;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem("access_token"));

  // Listen for storage changes (token might be cleared by fetcher)
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("access_token");
      setToken(newToken);
    };

    // Listen for custom events when token is cleared
    window.addEventListener("storage", handleStorageChange);

    // Also check periodically in case of same-tab changes
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const isAuthenticated = Boolean(token);

  // Debug logging
  console.log("ProtectedRoute check:", {
    hasToken: !!token,
    tokenLength: token?.length,
    path: location.pathname,
  });

  if (!isAuthenticated) {
    console.log("No token found, redirecting to login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
