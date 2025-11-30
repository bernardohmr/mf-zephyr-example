import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { withZephyr } from 'zephyr-rsbuild-plugin';

export default defineConfig({
  plugins: [
    pluginReact(),
    withZephyr(),
    pluginModuleFederation({
      name: 'federation_provider',
      exposes: {
        './button': './src/Button.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  server: {
    port: 3000,
  },
  output: {
    assetPrefix: 'auto',
  },
});
