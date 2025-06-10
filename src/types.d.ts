// Magic constants used by Forge's Vite plugin.
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

// Import window types
import "./types/window";

// Extend global namespace for Electron App
declare global {
  namespace Electron {
    interface App {
      isQuitting: boolean;
    }
  }
}

// Preload types
declare module "global" {
  interface ThemeModeContext {
    getThemeMode: () => Promise<"light" | "dark" | "system">;
    setThemeMode: (mode: "light" | "dark" | "system") => Promise<void>;
  }

  interface SidebarContext {
    getState: () => Promise<boolean>;
    setState: (state: boolean) => Promise<void>;
  }

  interface ElectronWindowContext {
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
    close: () => Promise<void>;
    getSize: () => Promise<{ width: number; height: number }>;
    setSize: (width: number, height: number) => Promise<{ width: number; height: number }>;
  }

  interface Window {
    theme: ThemeModeContext;
    sidebar: SidebarContext;
    electronWindow: ElectronWindowContext;
  }
}

// Extend the global Window interface
declare global {
  interface Window {
    theme: ThemeModeContext;
    sidebar: SidebarContext;
    electronWindow: ElectronWindowContext;
  }
}
