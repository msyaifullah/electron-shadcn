import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { MakerDMG } from "@electron-forge/maker-dmg";
import { VitePlugin } from "@electron-forge/plugin-vite";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";
import path from "path";
import fs from "fs";

// Determine if we're in production mode
const isProduction = process.env.NODE_ENV === 'production';

// Get the correct app path based on environment
const getAppPath = () => {
  const basePath = "./out";
  const appName = "electron-shadcn";
  const platform = "darwin-arm64";
  return path.join(basePath, `${appName}-${platform}`, `${appName}.app`);
};

// Check if icon exists
const iconPath = "./assets/icon.icns";
const hasIcon = fs.existsSync(iconPath);

// Base configuration that's common to both development and production
const baseConfig: ForgeConfig = {
  packagerConfig: {
    asar: true,
    // Add app name and executable name
    name: "electron-shadcn",
    executableName: "electron-shadcn",
  },
  rebuildConfig: {},
  makers: [
    new MakerZIP({}, ["darwin"]),
    new MakerDMG({
      format: "ULFO",
      ...(hasIcon && { icon: iconPath }), // Only include icon if it exists
      contents: [
        {
          x: 130,
          y: 220,
          type: "file",
          path: getAppPath(),
        },
        {
          x: 410,
          y: 220,
          type: "link",
          path: "/Applications",
        },
      ],
    }),
  ],
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: "src/main.ts",
          config: "vite.main.config.ts",
          target: "main",
        },
        {
          entry: "src/preload.ts",
          config: "vite.preload.config.ts",
          target: "preload",
        },
      ],
      renderer: [
        {
          name: "main_window",
          config: "vite.renderer.config.mts",
        },
      ],
    }),
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

// Production-specific configuration
if (isProduction) {
  // Check for required environment variables in production
  const requiredEnvVars = {
    APPLE_IDENTITY: process.env.APPLE_IDENTITY,
    APPLE_ID: process.env.APPLE_ID,
    APPLE_ID_PASSWORD: process.env.APPLE_ID_PASSWORD,
    APPLE_TEAM_ID: process.env.APPLE_TEAM_ID,
  };

  // Validate environment variables
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });

  // Add production-specific makers
  baseConfig.makers?.push(
    new MakerSquirrel({}),
    new MakerRpm({}),
    new MakerDeb({})
  );

  // Add production signing configuration
  baseConfig.packagerConfig = {
    ...baseConfig.packagerConfig,
    osxSign: {
      identity: requiredEnvVars.APPLE_IDENTITY,
      hardenedRuntime: true,
      entitlements: "entitlements.plist",
      "entitlements-inherit": "entitlements.plist",
      "signature-flags": "library",
    },
    osxNotarize: {
      tool: "notarytool",
      appleId: requiredEnvVars.APPLE_ID,
      appleIdPassword: requiredEnvVars.APPLE_ID_PASSWORD,
      teamId: requiredEnvVars.APPLE_TEAM_ID,
    },
  };
}

export default baseConfig;
