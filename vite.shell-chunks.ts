/**
 * Menu-shell chunk policy for Vite.
 *
 * Games already dynamic-import, but a single `core` / `ui` manualChunks bucket
 * still pulled game-only subsystems into the menu modulepreload graph. Keep
 * shell chunks small; load dice/fractions/owl/3D only on demand.
 */

/** Core subsystems that must not block the landing/menu entry. */
export const DEFERRED_CORE_PREFIXES = [
  'dice',
  'fractions',
  'polyomino',
  'graph',
  'attributes',
  'expressions',
  'alignment',
  'hex',
  'ai-worker',
  'owl',
  // Progress store — games/owl/stats load it on demand; menu only peeks one flag.
  'storage',
] as const;

/**
 * Return true when a dependency of the menu entry should be modulepreloaded.
 */
export function shouldPreloadMenuDependency(dep: string): boolean {
  const name = dep.replace(/\\/g, '/');

  if (name.includes('game-') || name.includes('demo-')) return false;
  // Tiny Vite preload helper lives under vendor/ but is a shell sync dep.
  if (name.includes('vite-preload')) return true;
  if (
    name.includes('vendor/') ||
    name.includes('mp3d') ||
    name.includes('three')
  ) {
    return false;
  }

  // Owl UI + core owl chunk (lazy after first paint).
  if (/(^|\/)owl(-|$)/.test(name) || name.includes('owl-ui')) return false;

  // Stats route CSS/JS (lazy on /stats).
  if (name.includes('stats-dashboard') || name.includes('stats-')) {
    return false;
  }

  // Game route mounts + play CSS (lazy on /game/:id).
  if (
    name.includes('game-routes') ||
    name.includes('game-play') ||
    name.includes('game-route-mounts')
  ) {
    return false;
  }

  // Shared game chrome (header/modals/player colors) — lazy with the game route.
  if (name.includes('game-shell') || name.includes('player-colors')) {
    return false;
  }

  for (const prefix of DEFERRED_CORE_PREFIXES) {
    if (name.includes(`core-${prefix}`) || name.includes(`/core-${prefix}`)) {
      return false;
    }
  }

  return true;
}

/**
 * Assign a stable manual chunk name for modules under /src/core/.
 * Returns undefined when the id is not a core module.
 */
export function coreManualChunkName(id: string): string | undefined {
  const normalized = id.replace(/\\/g, '/');
  if (!normalized.includes('/src/core/')) return undefined;

  for (const prefix of DEFERRED_CORE_PREFIXES) {
    if (normalized.includes(`/src/core/${prefix}/`)) {
      if (prefix === 'owl') return 'owl';
      // storage → core-storage (not folded into menu `core`)
      return `core-${prefix}`;
    }
  }

  return 'core';
}

/**
 * Shared mp3d helpers only. Per-game `*-board-3d` / `*-pieces` stay unnamed so
 * they ride their dynamic-import graph — forcing them into `mp3d` created
 * circular chunks when a game controller also statically imports tablet-gl
 * (mp3d → game-* via board rules, game-* → mp3d via tablet-gl).
 */
export const MP3D_SHARED_MODULES = ['tablet-gl', 'load-three'] as const;

/**
 * Assign a stable manual chunk name for modules under /src/ui/ (non-three).
 */
export function uiManualChunkName(id: string): string | undefined {
  const normalized = id.replace(/\\/g, '/');
  if (!normalized.includes('/src/ui/')) return undefined;
  if (normalized.includes('/src/ui/three/')) {
    for (const name of MP3D_SHARED_MODULES) {
      if (normalized.includes(`/src/ui/three/${name}`)) {
        return 'mp3d';
      }
    }
    // Per-game 3D boards/pieces: leave unnamed (async with board-3d-loader).
    return undefined;
  }
  if (normalized.includes('/src/ui/owl/')) return 'owl-ui';
  if (normalized.includes('/src/ui/stats-dashboard')) return 'stats';
  if (normalized.includes('/src/ui/styles/stats-dashboard')) return 'stats';
  // Keep help HTML + per-game mounts out of the menu `ui` chunk.
  if (normalized.includes('/src/ui/game-route-mounts')) {
    return 'game-routes';
  }
  // Shared game chrome — only needed after navigating to /game/:id.
  if (
    normalized.includes('/src/ui/components/game-shell') ||
    normalized.includes('/src/ui/player-colors')
  ) {
    return 'game-shell';
  }
  // Dynamic play CSS — leave unnamed so Vite emits an async stylesheet
  // instead of folding it into the menu `ui` CSS.
  if (normalized.includes('/src/ui/styles/game-play')) {
    return undefined;
  }
  return 'ui';
}
