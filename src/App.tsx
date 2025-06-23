import React, { useEffect, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { syncThemeWithLocal } from "./helpers/theme_helpers";
import { useTranslation } from "react-i18next";
import "./localization/i18n";
import { updateAppLanguage } from "./helpers/language_helpers";
import { router } from "./routes/router";
import { RouterProvider } from "@tanstack/react-router";
import { SidebarContextProvider } from "./contexts/sidebar-context";
import { AuthProvider } from "./contexts/auth-context";
import { Spinner } from "@/components/ui/minimal-tiptap/components/spinner";

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    syncThemeWithLocal();
    updateAppLanguage(i18n);
  }, [i18n]);

  return (
    <AuthProvider>
      <SidebarContextProvider>
        <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}><Spinner className="w-8 h-8 text-gray-400" /></div>}>
          <RouterProvider router={router} />
        </Suspense>
      </SidebarContextProvider>
    </AuthProvider>
  );
}

const root = createRoot(document.getElementById("app")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
