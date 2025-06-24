import React from "react";
import { createRoute } from "@tanstack/react-router";
import { RootRoute } from "./__root";

const SettingPage = React.lazy(() => import("../pages/SettingPage"));
const SecondPage = React.lazy(() => import("@/pages/SecondPage"));
const ThirdPage = React.lazy(() => import("@/pages/ThirdPage"));
const LoginPage = React.lazy(() => import("@/pages/LoginPage"));
const DashboardPage = React.lazy(() => import("@/pages/DashboardPage"));
const FourthPage = React.lazy(() => import("@/pages/FourthPage"));

// TODO: Steps to add a new route:
// 1. Create a new page component in the '../pages/' directory (e.g., NewPage.tsx)
// 2. Import the new page component at the top of this file
// 3. Define a new route for the page using createRoute()
// 4. Add the new route to the routeTree in RootRoute.addChildren([...])
// 5. Add a new Link in the navigation section of RootRoute if needed

// Example of adding a new route:
// 1. Create '../pages/NewPage.tsx'
// 2. Import: import NewPage from '../pages/NewPage';
// 3. Define route:
//    const NewRoute = createRoute({
//      getParentRoute: () => RootRoute,
//      path: '/new',
//      component: NewPage,
//    });
// 4. Add to routeTree: RootRoute.addChildren([HomeRoute, NewRoute, ...])
// 5. Add Link: <Link to="/new">New Page</Link>

export const LoginRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/",
  component: LoginPage,
});

export const HomeRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/settings",
  component: SettingPage,
});

export const SecondPageRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/second-page",
  component: SecondPage,
});

export const ThirdPageRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/third-page",
  component: ThirdPage,
});

export const FourthPageRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/fourth-page",
  component: FourthPage,
});

export const DashboardRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

export const rootTree = RootRoute.addChildren([
  LoginRoute,
  HomeRoute,
  SecondPageRoute,
  ThirdPageRoute,
  FourthPageRoute,
  DashboardRoute,
]);
