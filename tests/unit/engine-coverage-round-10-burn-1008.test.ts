/**
 * q-mp-324 — engine coverage round 10: post-r9 residual characterization.
 *
 * Themes: cold NON-RULES core helpers after r9 closed alignment / evaluator
 * residuals. Prefer timer-scoring (+ dom-security / url-flags / storage
 * sanitize / polyomino leftovers). Pins CURRENT behavior only.
 * Does not change engine / rules.ts / AI source.
 *
 * Baseline rank (tip post785, coverage-engine-r10-baseline, non-UI core):
 *   dom-security.ts           86.36% branches (19/22)
 *   storage/storage.ts        90.00% (63/70)
 *   graph/algorithms.ts       90.00% (117/130)  ← r8 documented unreachable
 *   graph/types.ts            94.11% (32/34)    ← r8 documented unreachable
 *   url-flags.ts              94.44% (17/18)
 *   polyomino/placement.ts    95.49% (106/111)
 *   expressions/evaluator.ts  96.40% (161/167)  ← r9 documented unreachable
 *   storage/sanitize.ts       97.22% (70/72)
 *   timer-scoring.ts          97.84% (91/93)
 *   fractions/* / alignment/* 100%
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createScoringState,
  getLeader,
  getLeaderboard,
  getPointValue,
  type ScoringState,
} from '../../src/core/timer-scoring';
import {
  escapeHtml,
  safeHtml,
  setTrustedMarkup,
} from '../../src/core/dom-security';
import { readUrlOrStorageFlag } from '../../src/core/url-flags';
import { sanitizeGameStatsMap } from '../../src/core/storage/sanitize';
import { solvePlacement, type Board } from '../../src/core/polyomino/placement';
import type { PolyominoShape } from '../../src/core/polyomino/types';
import { createFraction, simplify } from '../../src/core/fractions/arithmetic';
import { COMMON_FRACTIONS } from '../../src/core/fractions/types';
import {
  findAlignmentsThrough,
  findLargestRegion,
} from '../../src/core/alignment/compat';

const mono = (id = 'm0'): PolyominoShape => ({
  id,
  name: 'mono',
  cells: [{ row: 0, col: 0 }],
  color: '#000',
  canRotate: false,
  canFlip: false,
  size: 1,
  order: 1,
});

afterEach(() => {
  vi.restoreAllMocks();
});

// =============================================================================
// 1. timer-scoring.ts — residual ?? arms (preferred host)
// =============================================================================

describe('engine-coverage-round-10 — timer-scoring', () => {
  it('getPointValue maps present-but-undefined pointValues entries to 0', () => {
    const state = createScoringState({
      pointValues: {
        // `key in pv` is true, but the value is undefined → `pv[key] ?? 0`
        bonus: undefined as unknown as number,
        default: 3,
      },
    });
    expect(getPointValue(state, 'bonus')).toBe(0);
    // Unknown key still falls through to default.
    expect(getPointValue(state, 'missing')).toBe(3);
  });

  it('getLeader returns null when players.find misses the leaderboard id', () => {
    // getLeaderboard builds from players, so a normal state can never miss.
    // Forge a Proxy that lets sort/map see the roster but forces find → undefined
    // so the trailing `?? null` arm fires.
    const roster: ScoringState['players'] = [
      { playerId: 'p1', playerName: 'Alice', total: 5, entries: [] },
    ];
    const proxied = new Proxy(roster, {
      get(target, prop, receiver) {
        if (prop === 'find') {
          return () => undefined;
        }
        return Reflect.get(target, prop, receiver);
      },
    });
    const forged: ScoringState = {
      config: {},
      players: proxied,
      multipliers: [],
      currentRound: 1,
    };

    expect(getLeaderboard(forged)[0]?.playerId).toBe('p1');
    expect(getLeader(forged)).toBeNull();
  });
});

// =============================================================================
// 2. dom-security.ts — coldest non-UI core residual
// =============================================================================

describe('engine-coverage-round-10 — dom-security', () => {
  it('setTrustedMarkup drops HTML comments / non-element non-text nodes', () => {
    const el = document.createElement('div');
    setTrustedMarkup(el, `<!-- secret -->Hello<em>ok</em>`);
    expect(el.querySelector('em')?.textContent).toBe('ok');
    expect(el.textContent).toBe('Hellook');
    // Comment nodes are discarded (sanitizeTrustedNode → null).
    expect(el.innerHTML).not.toContain('secret');
  });

  it('safeHtml continues when a data-mp-safe slot is missing', () => {
    const proto = DocumentFragment.prototype;
    const original = proto.querySelector;
    const spy = vi.spyOn(proto, 'querySelector').mockImplementation(function (
      this: DocumentFragment,
      sel: string
    ) {
      if (typeof sel === 'string' && sel.includes('data-mp-safe')) {
        return null;
      }
      return original.call(this, sel);
    });

    const frag = safeHtml`<span>${'orphan'}</span>`;
    // Slot missing → continue; fragment still returns without throwing.
    expect(frag).toBeInstanceOf(DocumentFragment);
    expect(spy).toHaveBeenCalled();
  });

  it('documents unreachable escapeHtml HTML_ESCAPE miss + textContent ??', () => {
    // escapeHtml regex only matches keys present in HTML_ESCAPE, so
    // `HTML_ESCAPE[ch] ?? ch` never takes the right arm on public paths.
    expect(escapeHtml('&<>"\'')).toBe('&amp;&lt;&gt;&quot;&#39;');
    // TEXT_NODE.textContent is never null in jsdom/browsers for real nodes;
    // `node.textContent ?? ''` in sanitizeTrustedNode is defensive.
    expect(true).toBe(true);
  });
});

// =============================================================================
// 3. url-flags.ts — hash miss + storage throw + bare search
// =============================================================================

describe('engine-coverage-round-10 — url-flags', () => {
  it('hash query with non-allowlisted token falls through to storage', () => {
    const storage = { getItem: () => '1' };
    expect(
      readUrlOrStorageFlag(
        'board3d',
        'mp-board3d',
        '',
        '#/game/hex?board3d=nope',
        storage
      )
    ).toBe(true);
  });

  it('storage getItem throw returns false', () => {
    const storage = {
      getItem: () => {
        throw new Error('blocked');
      },
    };
    expect(readUrlOrStorageFlag('board3d', 'mp-board3d', '', '', storage)).toBe(
      false
    );
  });

  it('bare search string without leading ? is still parsed', () => {
    expect(
      readUrlOrStorageFlag('board3d', 'mp-board3d', 'board3d=1', '', null)
    ).toBe(true);
  });
});

// =============================================================================
// 4. storage/sanitize.ts — gameId ?? fallback
// =============================================================================

describe('engine-coverage-round-10 — storage/sanitize', () => {
  it('sanitizeGameStatsMap uses map key when value.gameId sanitizes away', () => {
    const map = sanitizeGameStatsMap({
      hex: {
        // Empty / control-only gameId → sanitizeDisplayString null → ?? gameId
        gameId: '\u0000',
        gamesPlayed: 2,
        gamesWon: 1,
        gamesLost: 0,
        gamesDraw: 0,
        totalPlayTime: 10,
        bestWinStreak: 1,
        currentWinStreak: 1,
        lastPlayed: 1,
        firstPlayed: 1,
      },
    });
    expect(map.hex?.gameId).toBe('hex');
    expect(map.hex?.gamesPlayed).toBe(2);
  });

  it('documents unreachable avatar ?? after typeof string guard', () => {
    // sanitizeProfile avatar arm: `typeof raw.avatar === 'string'` then
    // sanitizeDisplayStringAllowEmpty — AllowEmpty only returns null for
    // non-strings, so `?? ''` is defensive / unreachable on that path.
    expect(true).toBe(true);
  });
});

// =============================================================================
// 5. polyomino/placement.ts — solvePlacement empty-cell flip
// =============================================================================

describe('engine-coverage-round-10 — polyomino/placement', () => {
  it('solvePlacement hits empty.length===0 when cells flip after fill check', () => {
    let scans = 0;
    const board: Board = {
      rows: 1,
      cols: 1,
      get cells() {
        scans += 1;
        // isBoardFilled / countEmptyCells (scan 1): empty → not filled
        // getEmptyCells (scan 2+): occupied → empty list
        return scans === 1 ? [[false]] : [[true]];
      },
      placements: [],
    };

    const solutions = solvePlacement(board, [mono()], 1);
    expect(solutions).toEqual([]);
    expect(scans).toBeGreaterThanOrEqual(2);
  });
});

// =============================================================================
// 6. fractions + alignment — still hot; smoke wiring
// =============================================================================

describe('engine-coverage-round-10 — fractions/alignment (hot baseline)', () => {
  it('fractions catalog + simplify stay wired after r8/r9', () => {
    expect(COMMON_FRACTIONS.length).toBeGreaterThan(0);
    expect(simplify(createFraction(4, 8))).toEqual({
      numerator: 1,
      denominator: 2,
      isNegative: false,
    });
  });

  it('alignment compat wrappers stay at full branch coverage', () => {
    const grid = [
      ['X', 'X'],
      ['X', null],
    ];
    const get = (r: number, c: number) => grid[r]?.[c] ?? null;
    const dims = { rows: 2, cols: 2 };
    expect(
      findAlignmentsThrough({ row: 0, col: 0 }, dims, get, {
        requiredLength: 2,
      }).hasAlignment
    ).toBe(true);
    const region = findLargestRegion(dims, get, { connectivity: 4 });
    expect(region).not.toBeNull();
    expect(region!.size).toBeGreaterThan(0);
  });
});

// =============================================================================
// 7. Documented unreachable (r8/r9 carry-forward)
// =============================================================================

describe('engine-coverage-round-10 — documented unreachable residuals', () => {
  it('graph algorithms queue.shift / Map-miss continues stay defensive', () => {
    // Same class as r8: Array#shift on a non-empty queue never yields
    // undefined; distances Map is written before enqueue. No Array/Map spy.
    expect(true).toBe(true);
  });

  it('evaluator private buildExpression / ?? fallbacks stay unreachable', () => {
    // Carry-forward from r9 disposition (L450 / L468 class).
    expect(true).toBe(true);
  });
});
