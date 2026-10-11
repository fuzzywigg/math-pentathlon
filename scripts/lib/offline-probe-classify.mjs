/**
 * Shared failed-request URL classifier for offline resilience probes
 * (q-mp-1251 / q-mp-1252).
 *
 * Prod and dev probes historically drifted on `*.worker*` and never recognized
 * Vite `assets/game-<id>-<hash>.js` chunks (manualChunks name `game-${id}`).
 * Keep mode-specific 3d / css / js ordering; share lazy-game-chunk detection.
 */

/**
 * Vite emits `assets/game-<name>-<hash>.js` for per-game (and game-shell /
 * game-routes) manual chunks. Hash may include `_` (e.g. `DWW_girN`).
 * Requires a final `-<hash>.js` segment so bare `game-controller.js` stays out.
 */
const VITE_GAME_CHUNK_RE =
  /\/game-[A-Za-z0-9][\w-]*-[A-Za-z0-9_-]+\.js(?:\?|$)/i;

/**
 * Controllers, workers, `/games/` module paths, and Vite game-* chunks.
 */
const LAZY_GAME_CHUNK_RE = /game-controller|\.worker|\/games\//i;

/**
 * @param {string} url
 * @returns {boolean}
 */
export function isOfflineProbeLazyGameChunk(url) {
  return LAZY_GAME_CHUNK_RE.test(url) || VITE_GAME_CHUNK_RE.test(url);
}

/**
 * @param {string} url
 * @param {{ mode?: 'prod' | 'dev' }} [opts]
 * @returns {'font' | '3d-asset' | 'lazy-game-chunk' | 'js' | 'css' | 'other'}
 */
export function classifyOfflineProbeUrl(url, opts = {}) {
  const mode = opts.mode === 'dev' ? 'dev' : 'prod';
  if (/\/fonts\/|\.woff2?(?:\?|$)/i.test(url)) return 'font';
  if (mode === 'dev') {
    if (/three|board-3d|\/ui\/three/i.test(url)) return '3d-asset';
  } else if (/three|board-3d|vendor\/three/i.test(url)) {
    return '3d-asset';
  }
  if (isOfflineProbeLazyGameChunk(url)) return 'lazy-game-chunk';
  if (mode === 'dev') {
    if (/\.css(\?|$)/i.test(url)) return 'css';
    if (/\.js|\.ts(\?|$)/i.test(url)) return 'js';
  } else {
    if (/\.js(\?|$)/i.test(url)) return 'js';
    if (/\.css(\?|$)/i.test(url)) return 'css';
  }
  return 'other';
}
