import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', '@tanstack/react-router'],
          'vendor-ui-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-toggle',
            '@radix-ui/react-slot',
            '@radix-ui/react-separator',
            '@radix-ui/react-select',
            '@radix-ui/react-avatar',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-label',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-tabs'
          ],
          'vendor-ui-other': ['class-variance-authority', 'clsx', 'tailwind-merge'],
          'vendor-charts': [
            'recharts',
            'd3-array',
            'd3-color',
            'd3-ease',
            'd3-format',
            'd3-interpolate',
            'd3-path',
            'd3-scale',
            'd3-shape',
            'd3-time',
            'd3-time-format',
            'd3-timer'
          ],
          'vendor-icons': ['lucide-react', '@tabler/icons-react'],
          'vendor-utils': ['lodash', 'date-fns', 'zod'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1000, // Increase the warning limit to 1000kb
  }
});
