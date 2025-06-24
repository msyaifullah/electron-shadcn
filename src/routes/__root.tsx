import React, { useEffect } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import BaseLayout from "@/layouts/BaseLayout";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { useAuth } from "@/contexts/auth-context";

export const RootRoute = createRootRoute({
  component: Root,
});

function Root() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user is authenticated and trying to access login page, redirect to dashboard
    if (isAuthenticated && location.pathname === "/") {
      navigate({ to: "/dashboard" });
    }
    // If user is not authenticated and trying to access protected routes, redirect to login
    else if (!isAuthenticated && location.pathname !== "/") {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    <BaseLayout>
      <Outlet />
    </BaseLayout>
  );
}
