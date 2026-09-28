import { defineConfig } from 'vite';

/**
 * Thin build peel for #10: split the monolithic entry so no single JS chunk
 * trips Vite's 500 kB warning. Games stay statically imported from main.ts;
 * Rollup emits separate files without changing load order or game APIs.
 *
 * Three.js is an optional lazy dependency (board3d flag). It is emitted under
 * `dist/vendor/` so the CI `dist/assets` 250 kB budget still applies to the
 * always-loaded app graph; the lazy three chunk is only fetched when enabled.
 */
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        chunkFileNames(chunkInfo) {
          if (chunkInfo.name === 'three' || chunkInfo.name === 'mp3d') {
            return 'vendor/[name]-[hash].js';
          }
          return 'assets/[name]-[hash].js';
        },
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        manualChunks(id) {
          if (id.includes('/node_modules/three')) {
            return 'three';
          }
          if (id.includes('/src/ui/three/')) {
            return 'mp3d';
          }
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
