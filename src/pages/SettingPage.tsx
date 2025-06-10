import React from "react";
import ToggleTheme from "@/components/ToggleTheme";
import { useTranslation } from "react-i18next";
import LangToggle from "@/components/LangToggle";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import WindowSizeSettings from "@/components/WindowSizeSettings";

export default function SettingPage() {
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <div className="flex h-full flex-col">
        <h1 className="font-mono text-4xl font-bold">{t("appName")}</h1>
        <p
          className="text-muted-foreground text-end text-sm uppercase"
          data-testid="pageTitle"
        >
          {t("titleHomePage")}
        </p>
        <div className="grid gap-6">
          <WindowSizeSettings />
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <h2 className="text-lg font-medium">Theme</h2>
              <p className="text-muted-foreground text-sm">
                Toggle between light and dark mode
              </p>
            </div>
            <ToggleTheme />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <h2 className="text-lg font-medium">Language</h2>
              <p className="text-muted-foreground text-sm">
                Change the application language
              </p>
            </div>
            <LangToggle />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
