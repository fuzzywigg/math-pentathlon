import { defineConfig, type PluginOption } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import {
  coreManualChunkName,
  shouldPreloadMenuDependency,
  uiManualChunkName,
} from './vite.shell-chunks';
import { securityHeadersPlugin } from './vite.security-headers';

/**
 * Build + PWA for offline play after first visit.
 *
 * Code splitting: games (and demos) are dynamic-imported from main.ts so the
 * landing/menu does not download every game. Per-game help/mounts live in
 * game-route-mounts (lazy). Play CSS is dynamic-imported on /game/:id.
 * manualChunks emit stable per-game / shell-core / deferred-core / ui /
 * game-routes / game-shell / three files. Three.js stays under dist/vendor/
 * so the CI dist/assets 250 kB budget applies to always-loaded app chunks.
 *
 * Offline: Workbox precaches the full build (shell + every game/3D chunk) so
 * after one online visit any game works in airplane mode. Updates use
 * autoUpdate (skipWaiting + clientsClaim) so a new deploy is not stuck behind
 * a stale tab forever — see src/pwa/register.ts.
 *
 * Reproducibility (build-config only; see docs/build-repro-2026-10-08.md):
 * - base `/` matches absolute asset URLs in index.html + site.webmanifest
 * - sourcemaps off (no absolute path leakage via .map files)
 * - esbuild legalComments none (no license banner path variance)
 * - Workbox precache manifest sorted by URL (stable SW across FS order)
 * - manualChunks + [name]-[hash] keep chunk names content-addressed
 *
 * Optional treemap: PERF_VISUALIZE=1 npm run build → test-results/perf/stats.html
 * Report-only dual-build audit: npm run check:build
 */
const visualize = process.env.PERF_VISUALIZE === '1';

/**
 * Dedupe + sort Workbox precache entries so sw.js is stable across filesystem
 * readdir order. (includeAssets are appended afterward by workbox-build — keep
 * that list free of glob overlaps; see includeAssets below.)
 */
function sortPrecacheManifest<T extends { url: string }>(
  entries: T[]
): { manifest: T[]; warnings: string[] } {
  const seen = new Set<string>();
  const deduped: T[] = [];
  for (const entry of entries) {
    if (seen.has(entry.url)) continue;
    seen.add(entry.url);
    deduped.push(entry);
  }
  deduped.sort((a, b) => (a.url < b.url ? -1 : a.url > b.url ? 1 : 0));
  return { manifest: deduped, warnings: [] };
}

const plugins: PluginOption[] = [
  securityHeadersPlugin(),
  VitePWA({
    registerType: 'autoUpdate',
    // Manual registration via src/pwa/bootstrap.ts (update + reload policy).
    injectRegister: false,
    // SW registration scope must match deploy base path (site is served at /).
    scope: '/',
    base: '/',
    // Only list assets NOT already matched by workbox.globPatterns.
    // workbox-build appends includeAssets + manifest icons + the generated
    // webmanifest AFTER manifestTransforms — overlapping entries become
    // unsorted duplicate tails on sw.js.
    includeAssets: [
      // No file extension → not covered by globPatterns.
      'CNAME',
    ],
    // Icons are already matched by globPatterns (`*.png` / favicon.*).
    includeManifestIcons: false,
    // Keep existing index.html link href (/site.webmanifest).
    manifestFilename: 'site.webmanifest',
    manifest: {
      name: 'Math Pentathlon',
      short_name: 'Math Pentathlon',
      description:
        'Educational math strategy games — play offline vs the computer.',
      // Stable install identity (Chrome); keep aligned with start_url/scope.
      id: '/',
      theme_color: '#102a43',
      background_color: '#102a43',
      display: 'standalone',
      // Tablets rotate; do not lock portrait.
      orientation: 'any',
      start_url: '/',
      scope: '/',
      lang: 'en',
      icons: [
        {
          src: '/icons/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icons/icon-512-maskable.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
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
      // png: tablet install icons under /icons (Add to Home Screen).
      // Omit webmanifest: vite-plugin-pwa always injects site.webmanifest via
      // additionalManifestEntries (MD5 of the manifest JSON). Including it in
      // the glob duplicated the URL with a different revision.
      globPatterns: ['**/*.{js,css,html,ico,svg,png,txt,woff,woff2}'],
      // Skip heavier Inter weights from first SW install so cheap tablets
      // finish precache sooner; weights cache on first use.
      globIgnores: [
        '**/inter-latin-500-normal.woff2',
        '**/inter-latin-600-normal.woff2',
        '**/inter-latin-700-normal.woff2',
      ],
      // Drop previous precache revisions so deploys do not leave a stale shell.
      cleanupOutdatedCaches: true,
      // Hash-router SPA: unknown navigations get the shell.
      navigateFallback: '/index.html',
      navigateFallbackDenylist: [/^\/api\//, /^\/health/],
      // Keep SW install reliable on low-end tablets (three.js ~688 kB).
      maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      // Stable SW bytes: glob/includeAssets order can vary by filesystem.
      manifestTransforms: [sortPrecacheManifest],
      // Fonts: CacheFirst for non-precached Inter weights.
      // Do NOT add a redundant CacheFirst for /assets/*.js — Workbox
      // precacheAndRoute already serves those. A second route does not fix
      // Playwright WebKit setOffline (controlled fetch() fails despite
      // caches.match); see docs/webkit-offline-pwa-2026-10-07.md. Menu
      // idle-warm covers the SPA soft-nav path instead.
      runtimeCaching: [
        {
          urlPattern: /\/fonts\/inter-latin-(500|600|700)-normal\.woff2$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'inter-weights',
            expiration: {
              maxEntries: 6,
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
    // Keep playwright/dev lightweight unless explicitly enabled.
    devOptions: {
      enabled: process.env.PWA_DEV === '1',
    },
  }),
];

if (visualize) {
  plugins.push(
    visualizer({
      filename: 'test-results/perf/stats.html',
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
    })
  );
}

export default defineConfig({
  // Absolute asset URLs in index.html / manifest assume site root hosting
  // (Cloudflare Pages + custom domain). Do not switch to relative base without
  // updating public/ links and PWA start_url/scope/icons.
  base: '/',
  // Production: no .map files (avoids absolute path leakage; kids do not need
  // browser sourcemaps). Enable locally only when debugging a prod bundle.
  esbuild: {
    legalComments: 'none',
  },
  plugins,
  build: {
    sourcemap: false,
    // Menu entry should only preload shell deps (core/ui), not games or 3D.
    modulePreload: {
      resolveDependencies(filename, deps) {
        const isMenuEntry =
          filename.includes('/index-') || filename.startsWith('index-');
        if (!isMenuEntry) {
          return deps;
        }
        return deps.filter((dep) => shouldPreloadMenuDependency(dep));
      },
    },
    rollupOptions: {
      output: {
        // Content-hashed names; manualChunks below keep logical names stable.
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
          if (id.includes('/node_modules/')) {
            return 'vendor';
          }
          const uiChunk = uiManualChunkName(id);
          if (uiChunk) return uiChunk;
          const coreChunk = coreManualChunkName(id);
          if (coreChunk) return coreChunk;
          if (id.includes('/src/games/')) {
            const match = id.match(/\/src\/games\/([^/]+)/);
            return match ? `game-${match[1]}` : 'games';
          }
          return undefined;
        },
      },
    },
  },
});
