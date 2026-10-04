import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * Build + PWA for offline play after first visit.
 *
 * Code splitting: games (and demos) are dynamic-imported from main.ts so the
 * landing/menu does not download every game. manualChunks still emit stable
 * per-game / core / ui / three files. Three.js stays under dist/vendor/ so the
 * CI dist/assets 250 kB budget applies to always-loaded app chunks.
 *
 * Offline: Workbox precaches the full build (shell + every game/3D chunk) so
 * after one online visit any game works in airplane mode. Updates use
 * autoUpdate (skipWaiting + clientsClaim) so a new deploy is not stuck behind
 * a stale tab forever — see src/pwa/register.ts.
 */
export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      // Manual registration via src/pwa/bootstrap.ts (update + reload policy).
      injectRegister: false,
      includeAssets: [
        'favicon.ico',
        'favicon.svg',
        'king.svg',
        'health.txt',
        'CNAME',
        'fonts/*.woff2',
      ],
      // Keep existing index.html link href (/site.webmanifest).
      manifestFilename: 'site.webmanifest',
      manifest: {
        name: 'Math Pentathlon',
        short_name: 'Math Pentathlon',
        description:
          'Educational math strategy games — play offline vs the computer.',
        theme_color: '#102a43',
        background_color: '#102a43',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        lang: 'en',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/favicon.ico',
            sizes: '32x32',
            type: 'image/x-icon',
          },
        ],
      },
      workbox: {
        // Precache everything needed for full offline play after first visit.
        // Includes Vite-emitted AI Web Worker chunks (*.js under assets/).
        globPatterns: ['**/*.{js,css,html,ico,svg,txt,webmanifest,woff,woff2}'],
        // Hash-router SPA: unknown navigations get the shell.
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/health/],
        // Keep SW install reliable on low-end tablets (three.js ~688 kB).
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        // Fonts are self-hosted under /fonts and covered by globPatterns.
        runtimeCaching: [],
      },
      // Keep playwright/dev lightweight unless explicitly enabled.
      devOptions: {
        enabled: process.env.PWA_DEV === '1',
      },
    }),
  ],
  build: {
    // Menu entry should only preload shell deps (core/ui), not games or 3D.
    modulePreload: {
      resolveDependencies(filename, deps) {
        const isMenuEntry =
          filename.includes('/index-') || filename.startsWith('index-');
        if (!isMenuEntry) {
          return deps;
        }
        return deps.filter((dep) => {
          const name = dep.replace(/\\/g, '/');
          return (
            !name.includes('game-') &&
            !name.includes('demo-') &&
            !name.includes('vendor/') &&
            !name.includes('mp3d') &&
            !name.includes('three')
          );
        });
      },
    },
    rollupOptions: {
      output: {
        chunkFileNames(chunkInfo) {
          if (
            chunkInfo.name === 'three' ||
            chunkInfo.name === 'mp3d' ||
            chunkInfo.name === 'vite-preload'
          ) {
            return 'vendor/[name]-[hash].js';
          }
          return 'assets/[name]-[hash].js';
        },
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        manualChunks(id) {
          // Isolate Vite's dynamic-import preload helper so it never lands
          // inside a game or mp3d chunk (which would make the menu import it).
          if (
            id.includes('preload-helper') ||
            id.includes('\0vite/preload-helper')
          ) {
            return 'vite-preload';
          }
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
