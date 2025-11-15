import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAccessToken, isAuthenticated } from "@/lib/token";

type ProtectedRouteProps = {
  children: React.ReactElement;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const [token, setToken] = useState(getAccessToken());

  // Listen for storage changes (token might be cleared by fetcher)
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = getAccessToken();
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

  const authenticated = isAuthenticated();

  // Debug logging
  console.log("ProtectedRoute check:", {
    hasToken: !!token,
    tokenLength: token?.length,
    path: location.pathname,
    isAuthenticated: authenticated,
  });

  if (!authenticated) {
    console.log("No token found, redirecting to login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
