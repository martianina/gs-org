import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  tsconfig: './tsconfig.build.json', // Use build-specific tsconfig
  sourcemap: true,
  clean: false, // Don't clean dist folder before building
  format: ['esm'], // Ensure you're targeting CommonJS
  dts: true, // Skip DTS generation to avoid external import issues // Ensure you're targeting CommonJS
  external: [
    'dotenv', // Externalize dotenv to prevent bundling
    'node:fs', // Externalize fs to use Node.js built-in module
    'node:https',
    'node:path', // Externalize other built-ins if necessary
    'node:http',
    '@elizaos/plugin-cli',
    '@elizaos/core',
    'node:events',
    'zod',
  ],
});
