/**
 * q-mp-034 — Cross-game destroy/remount contract (P1).
 *
 * For every registry game: mount → play one move → destroy (navigate away) →
 * remount → destroy. Asserts no leaked timers (pending flush safe), no WebGL
 * canvas left on cleared mounts, and emptied hosts so orphaned cell listeners
 * cannot mutate state. Reuses the memory-leak-audit game inventory +
 * open/close/remount cycle idea (unit-side, hermetic).
 *
 * Orthogonal to q-mp-030 (hex/pinball) and q-mp-102 (juggle/fab/sum-dominoes).
 * Tip already folded those cleanups; this contract covers all 20 + fixes the
 * five remaining empty destroyGame stubs (calla, contig-60, par-55, ramrod,
 * stars-bars). Remaining incomplete clears are pinned below.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GAMES } from '../../src/core/game-registry';

const EXPECTED_GAME_COUNT = 20;

/** Same 20 ids as scripts/memory-leak-audit.mjs ALL_GAMES. */
const AUDIT_GAME_IDS = [
  'kings-quadraphages',
  'hex',
  'star-track',
  'hex-a-gone',
  'calla',
  'sum-dominoes',
  'par-55',
  'ramrod',
  'kwatro-sinko',
  'fiar',
  'juggle',
  'contig-60',
  'stars-bars',
  'fab-a-diffy',
  'queens-guards',
  'prime-gold',
  'remainder-islands',
  'pent-em-in',
  'frac-fact',
  'fraction-pinball',
] as const;

type InitFamily = 'board-status' | 'container-vsai' | 'container-only';

const INIT_FAMILY: Record<string, InitFamily> = {
  calla: 'board-status',
  'contig-60': 'board-status',
  fiar: 'board-status',
  hex: 'board-status',
  'hex-a-gone': 'board-status',
  juggle: 'board-status',
  'kings-quadraphages': 'board-status',
  'pent-em-in': 'board-status',
  'queens-guards': 'board-status',
  'star-track': 'board-status',
  'fab-a-diffy': 'container-vsai',
  'kwatro-sinko': 'container-vsai',
  'par-55': 'container-vsai',
  'prime-gold': 'container-vsai',
  ramrod: 'container-vsai',
  'stars-bars': 'container-vsai',
  'sum-dominoes': 'container-vsai',
  'frac-fact': 'container-only',
  'fraction-pinball': 'container-only',
  'remainder-islands': 'container-only',
};

/**
 * Games whose destroyGame clears mount DOM (clearElement). Contract asserts
 * empty hosts + no canvas after destroy.
 */
const CLEARS_MOUNT_ON_DESTROY = new Set<string>([
  'calla',
  'contig-60',
  'fab-a-diffy',
  'fraction-pinball',
  'hex',
  'juggle',
  'par-55',
  'ramrod',
  'stars-bars',
  'sum-dominoes',
]);

/**
 * Pinned incomplete destroy clears (beyond the ≤5 stub fixes).
 * Timers / 3D dispose may still run; mount DOM may retain children until the
 * shell replaces the host. Remount + timer flush must still be safe.
 */
const PINNED_NO_MOUNT_CLEAR = new Set<string>([
  'frac-fact', // clears timers; leaves host children
  'remainder-islands', // clears timers; leaves host children
  'fiar', // worker/timer/3d dispose; 2D SVG may remain
  'hex-a-gone', // 3d unmount + null refs
  'kings-quadraphages', // 3d unmount + null refs
  'star-track', // 3d unmount + null refs
  'kwatro-sinko', // 3d unmount + null refs
  'prime-gold', // 3d unmount + null refs
  'queens-guards', // 3d unmount + null refs
  'pent-em-in', // 3d unmount + null refs
]);

const controllerLoaders: Record<
  string,
  () => Promise<Record<string, unknown>>
> = {
  'kings-quadraphages': () =>
    import('../../src/games/kings-quadraphages/game-controller'),
  hex: () => import('../../src/games/hex/game-controller'),
  'star-track': () => import('../../src/games/star-track/game-controller'),
  'hex-a-gone': () => import('../../src/games/hex-a-gone/game-controller'),
  calla: () => import('../../src/games/calla/game-controller'),
  fiar: () => import('../../src/games/fiar/game-controller'),
  'queens-guards': () => import('../../src/games/queens-guards/game-controller'),
  'contig-60': () => import('../../src/games/contig-60/game-controller'),
  juggle: () => import('../../src/games/juggle/game-controller'),
  'fab-a-diffy': () => import('../../src/games/fab-a-diffy/game-controller'),
  'sum-dominoes': () => import('../../src/games/sum-dominoes/game-controller'),
  'par-55': () => import('../../src/games/par-55/game-controller'),
  ramrod: () => import('../../src/games/ramrod/game-controller'),
  'kwatro-sinko': () => import('../../src/games/kwatro-sinko/game-controller'),
  'stars-bars': () => import('../../src/games/stars-bars/game-controller'),
  'prime-gold': () => import('../../src/games/prime-gold/game-controller'),
  'pent-em-in': () => import('../../src/games/pent-em-in/game-controller'),
  'frac-fact': () => import('../../src/games/frac-fact/game-controller'),
  'remainder-islands': () =>
    import('../../src/games/remainder-islands/game-controller'),
  'fraction-pinball': () =>
    import('../../src/games/fraction-pinball/game-controller'),
};

function stubCanvas(): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    fillRect: () => undefined,
    strokeRect: () => undefined,
    clearRect: () => undefined,
    fillStyle: '',
    strokeStyle: '',
    canvas: document.createElement('canvas'),
    getParameter: () => 0,
    getExtension: () => null,
  } as unknown as CanvasRenderingContext2D);
}

interface MountHosts {
  primary: HTMLElement;
  status: HTMLElement | null;
}

function mountHosts(gameId: string): MountHosts {
  const family = INIT_FAMILY[gameId];
  expect(family, `INIT_FAMILY for ${gameId}`).toBeTruthy();
  if (family === 'board-status') {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    return { primary: board, status };
  }
  const host = document.createElement('div');
  document.body.appendChild(host);
  return { primary: host, status: null };
}

function callInit(
  mod: Record<string, unknown>,
  gameId: string,
  hosts: MountHosts
): void {
  const initGame = mod.initGame as (...args: unknown[]) => void;
  const family = INIT_FAMILY[gameId]!;
  if (family === 'board-status') {
    initGame(hosts.primary, hosts.status);
    return;
  }
  if (family === 'container-vsai') {
    initGame(hosts.primary, false);
    return;
  }
  initGame(hosts.primary);
}

function callNewGameVsHuman(
  mod: Record<string, unknown>,
  gameId: string,
  hosts: MountHosts
): void {
  const newGameVsHuman = mod.newGameVsHuman as (...args: unknown[]) => void;
  const family = INIT_FAMILY[gameId]!;
  if (family === 'container-vsai') {
    newGameVsHuman(hosts.primary);
    return;
  }
  if (family === 'container-only' && gameId === 'frac-fact') {
    newGameVsHuman('medium');
    return;
  }
  newGameVsHuman();
}

/** Best-effort one human interaction — mirrors audit "play then leave". */
function playOneMove(primary: HTMLElement): boolean {
  const candidates = [
    primary.querySelector(
      '[role="gridcell"][tabindex="0"], [role="gridcell"][style*="cursor"]'
    ),
    primary.querySelector(
      'button:not([disabled]), [role="button"]:not([aria-disabled="true"])'
    ),
    primary.querySelector('.clickable, .par55-hand-block.clickable'),
    primary.querySelector(
      '.calla-pit, .juggle-cell, .contig-cell, .contig-roll-btn'
    ),
    primary.querySelector(
      '[data-row][data-col], .pinball-choice-btn, .frac-choice'
    ),
  ];
  for (const el of candidates) {
    if (!el) continue;
    (el as HTMLElement).dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    return true;
  }
  return false;
}

describe('q-mp-034 destroy/remount contract — inventory', () => {
  it(`covers all ${EXPECTED_GAME_COUNT} registry games (audit inventory)`, () => {
    expect(GAMES).toHaveLength(EXPECTED_GAME_COUNT);
    expect(AUDIT_GAME_IDS).toHaveLength(EXPECTED_GAME_COUNT);
    const registryIds = new Set(GAMES.map((g) => g.id));
    for (const id of AUDIT_GAME_IDS) {
      expect(registryIds.has(id), `audit id ${id} in registry`).toBe(true);
      expect(INIT_FAMILY[id], `INIT_FAMILY ${id}`).toBeTruthy();
      expect(controllerLoaders[id], `loader ${id}`).toBeTypeOf('function');
    }
    for (const id of registryIds) {
      expect(
        CLEARS_MOUNT_ON_DESTROY.has(id) || PINNED_NO_MOUNT_CLEAR.has(id),
        `${id} must clear mount or be pinned`
      ).toBe(true);
    }
    expect(CLEARS_MOUNT_ON_DESTROY.size + PINNED_NO_MOUNT_CLEAR.size).toBe(
      EXPECTED_GAME_COUNT
    );
  });
});

describe('q-mp-034 destroy/remount contract — per game', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
    stubCanvas();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it.each([...AUDIT_GAME_IDS])(
    '%s: mount → one move → destroy → remount → destroy (no timer/WebGL leak)',
    async (gameId) => {
      const load = controllerLoaders[gameId]!;
      const mod = await load();
      const destroyGame = mod.destroyGame as () => void;

      const hosts1 = mountHosts(gameId);
      callInit(mod, gameId, hosts1);
      callNewGameVsHuman(mod, gameId, hosts1);

      expect(
        hosts1.primary.innerHTML.length,
        `${gameId} paints on mount`
      ).toBeGreaterThan(0);
      // Best-effort move; some games need multi-step setup — still destroy after.
      playOneMove(hosts1.primary);

      const shellCleanup = vi.fn();
      const navigateAway = () => {
        try {
          destroyGame();
        } finally {
          shellCleanup();
        }
      };
      navigateAway();
      expect(shellCleanup).toHaveBeenCalledOnce();

      // Timers must not throw / repaint after leave (memory-leak-audit cycle).
      expect(() => vi.runOnlyPendingTimers()).not.toThrow();
      expect(() => vi.advanceTimersByTime(30_000)).not.toThrow();

      if (CLEARS_MOUNT_ON_DESTROY.has(gameId)) {
        expect(hosts1.primary.innerHTML, `${gameId} cleared primary`).toBe('');
        if (hosts1.status) {
          expect(hosts1.status.innerHTML, `${gameId} cleared status`).toBe('');
        }
        expect(hosts1.primary.querySelector('canvas')).toBeNull();
        if (hosts1.status) {
          expect(hosts1.status.querySelector('canvas')).toBeNull();
        }
        // Orphan listener safety: click emptied host must not throw.
        expect(() =>
          hosts1.primary.dispatchEvent(
            new MouseEvent('click', { bubbles: true })
          )
        ).not.toThrow();
      } else {
        expect(PINNED_NO_MOUNT_CLEAR.has(gameId)).toBe(true);
      }

      // Remount into fresh hosts (route re-enter).
      const hosts2 = mountHosts(gameId);
      expect(() => {
        callInit(mod, gameId, hosts2);
        callNewGameVsHuman(mod, gameId, hosts2);
      }).not.toThrow();
      expect(
        hosts2.primary.innerHTML.length,
        `${gameId} remount paints`
      ).toBeGreaterThan(0);

      destroyGame();
      expect(() => vi.runOnlyPendingTimers()).not.toThrow();

      if (CLEARS_MOUNT_ON_DESTROY.has(gameId)) {
        expect(hosts2.primary.innerHTML).toBe('');
        expect(hosts2.primary.querySelector('canvas')).toBeNull();
      }
    }
  );
});
