import { defineConfig } from 'vite';

/**
 * Thin build peel for #10: split the monolithic entry so no single JS chunk
 * trips Vite's 500 kB warning. Games stay statically imported from main.ts;
 * Rollup emits separate files without changing load order or game APIs.
 */
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/')) {
            return 'vendor';
          }
          if (id.includes('/src/games/')) {
            const match = id.match(/\/src\/games\/([^/]+)/);
            return match ? `game-${match[1]}` : 'games';
          }
          if (id.includes('/src/core/')) {
            return 'core';
          }
          if (id.includes('/src/ui/')) {
            return 'ui';
          }
          return undefined;
        },
      },
    },
  },
});
