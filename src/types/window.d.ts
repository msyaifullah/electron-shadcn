export interface ThemeModeContext {
  getThemeMode: () => Promise<"light" | "dark" | "system">;
  setThemeMode: (mode: "light" | "dark" | "system") => Promise<void>;
}

export interface SidebarContext {
  getState: () => Promise<boolean>;
  setState: (state: boolean) => Promise<void>;
}

declare global {
  interface Window {
    theme: ThemeModeContext;
    sidebar: SidebarContext;
  }
} 