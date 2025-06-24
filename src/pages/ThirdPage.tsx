import React from "react";

import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import GymMuscleApp from "@/components/muscle/GymMuscleApp";

export default function ThirdPage() {
  const { t } = useTranslation();

  return (
    <DashboardLayout>
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <h1 className="text-4xl font-bold">{t("titleSecondPage")}</h1>        
        <GymMuscleApp />
      </div>      
    </div>
    </DashboardLayout>
  );
}
