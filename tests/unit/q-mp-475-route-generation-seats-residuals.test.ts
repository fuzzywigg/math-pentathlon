/**
 * q-mp-475 — Characterize `route-generation` + `seats` residuals (tests-only).
 *
 * Structural / soft-fail asserts only. No player-facing copy pins. No `src/`
 * product edits. No AI / rules / scoring / timing paths. Hex Hard 450ms
 * untouched. Ownership stays on `src/core/route-generation.ts` +
 * `src/core/seats.ts` only.
 *
 * Live tip re-measure (`cursor/mp-tip-post914` @ `753052a6`):
 * - `route-generation.ts` **19** LOC / **3** dedicated its
 *   (`route-generation.test.ts` + `mutation-ui3-route-generation.test.ts`)
 * - `seats.ts` **11** LOC / **5** top-level its (+ `it.each` game matrix) in
 *   `engine-ui-boundary-seats-characterization.test.ts` (unit-node)
 * Prior suites already saturate statement coverage; this file pins edge /
 * soft-fail residuals those suites leave unstated.
 *
 * Open-PR notes (leave open; do not edit their hosts):
 * - `#864` / `q-mp-383` seat-labels + die-faces — **contained** (UI hosts)
 * - `#935` / `q-mp-456` engine coverage round 15 — **contained** (tutorial focus)
 * - `#353` game-route-mounts soft-fail — mount matrix; this file stays at the
 *   pure generation token helpers only
 *
 * Documented quirks (NOT fixed — pin only):
 * - Forged SeatId values that are not exactly `'player1'` flip to `'player1'`
 *   (strict `=== 'player1'` in `getOpponentSeat`). Opposite collapse direction
 *   from `seat-labels` UI helpers (`#864`), which treat non-player1 as player2.
 * - Out-of-band route-generation tokens (negative, fractional, NaN, Infinity,
 *   never-issued integers) are never current.
 */
import { describe, expect, it, vi } from 'vitest';

import { getOpponentSeat, type SeatId } from '../../src/core/seats';

const CANONICAL_SEATS: SeatId[] = ['player1', 'player2'];

/** Forged seats — not in the SeatId union; exercises strict === 'player1'. */
const FORGED_SEATS = [
  'player3',
  '',
  'Player1',
  'PLAYER1',
  'player 1',
  'player2 ',
] as SeatId[];

async function loadFreshRouteGeneration() {
  vi.resetModules();
  return import('../../src/core/route-generation');
}

// =============================================================================
// 1. route-generation — fresh-module + soft-fail token residuals
// =============================================================================

describe('q-mp-475 route-generation — fresh-module residuals', () => {
  it('starts at generation 0 and treats 0 as current before any next', async () => {
    const mod = await loadFreshRouteGeneration();
    expect(mod.getRouteGeneration()).toBe(0);
    expect(mod.isCurrentRouteGeneration(0)).toBe(true);
    expect(mod.isCurrentRouteGeneration(1)).toBe(false);
  });

  it('getRouteGeneration is a pure peek (does not advance the token)', async () => {
    const mod = await loadFreshRouteGeneration();
    const first = mod.nextRouteGeneration();
    expect(mod.getRouteGeneration()).toBe(first);
    expect(mod.getRouteGeneration()).toBe(first);
    expect(mod.getRouteGeneration()).toBe(first);
    expect(mod.isCurrentRouteGeneration(first)).toBe(true);
  });

  it('first next invalidates the zero token exactly once', async () => {
    const mod = await loadFreshRouteGeneration();
    expect(mod.isCurrentRouteGeneration(0)).toBe(true);
    const gen = mod.nextRouteGeneration();
    expect(gen).toBe(1);
    expect(mod.isCurrentRouteGeneration(0)).toBe(false);
    expect(mod.isCurrentRouteGeneration(gen)).toBe(true);
  });
});

describe('q-mp-475 route-generation — out-of-band / stale token soft-fail', () => {
  it('out-of-band tokens are never current after a fresh bump', async () => {
    const mod = await loadFreshRouteGeneration();
    const current = mod.nextRouteGeneration();
    const outOfBand = [
      -1,
      -0,
      0.5,
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.MAX_SAFE_INTEGER,
      current + 1,
      current - 1,
    ];
    for (const token of outOfBand) {
      expect(mod.isCurrentRouteGeneration(token)).toBe(false);
    }
    expect(mod.isCurrentRouteGeneration(current)).toBe(true);
  });

  it('stale-completion pattern: captured gen goes stale after a later next', async () => {
    const mod = await loadFreshRouteGeneration();
    const mountGen = mod.nextRouteGeneration();
    // Simulate navigate-away before async import resolves.
    const laterGen = mod.nextRouteGeneration();
    expect(mod.isCurrentRouteGeneration(mountGen)).toBe(false);
    expect(mod.isCurrentRouteGeneration(laterGen)).toBe(true);
    expect(mod.getRouteGeneration()).toBe(laterGen);
    // Idempotent soft-fail: repeated stale checks stay false.
    expect(mod.isCurrentRouteGeneration(mountGen)).toBe(false);
    expect(mod.isCurrentRouteGeneration(mountGen)).toBe(false);
  });

  it('many sequential next calls stay strictly +1 and keep only the tip current', async () => {
    const mod = await loadFreshRouteGeneration();
    const seen: number[] = [];
    for (let i = 0; i < 8; i += 1) {
      seen.push(mod.nextRouteGeneration());
    }
    for (let i = 1; i < seen.length; i += 1) {
      expect(seen[i]! - seen[i - 1]!).toBe(1);
    }
    const tip = seen[seen.length - 1]!;
    expect(mod.getRouteGeneration()).toBe(tip);
    expect(mod.isCurrentRouteGeneration(tip)).toBe(true);
    for (const stale of seen.slice(0, -1)) {
      expect(mod.isCurrentRouteGeneration(stale)).toBe(false);
    }
  });
});

// =============================================================================
// 2. seats — forged / involution / structural residuals
// =============================================================================

describe('q-mp-475 seats — forged SeatId soft-fail residuals', () => {
  it('forged SeatId values collapse to player1 (else branch of === player1)', () => {
    for (const forged of FORGED_SEATS) {
      expect(getOpponentSeat(forged)).toBe('player1');
      // Never the player1→player2 arm.
      expect(getOpponentSeat(forged)).not.toBe('player2');
    }
  });

  it('empty-string seat is treated as non-player1 (same as other forgeries)', () => {
    const empty = '' as SeatId;
    expect(getOpponentSeat(empty)).toBe('player1');
    expect(getOpponentSeat(empty)).toBe(getOpponentSeat('player3' as SeatId));
  });

  it('forged flip then canonical flip lands on player2', () => {
    for (const forged of FORGED_SEATS) {
      const once = getOpponentSeat(forged);
      expect(once).toBe('player1');
      expect(getOpponentSeat(once)).toBe('player2');
    }
  });
});

describe('q-mp-475 seats — canonical involution + structural residuals', () => {
  it('getOpponentSeat is an involution on every canonical SeatId', () => {
    for (const seat of CANONICAL_SEATS) {
      expect(getOpponentSeat(getOpponentSeat(seat))).toBe(seat);
    }
  });

  it('canonical seats always flip to the other distinct SeatId', () => {
    expect(getOpponentSeat('player1')).toBe('player2');
    expect(getOpponentSeat('player2')).toBe('player1');
    for (const seat of CANONICAL_SEATS) {
      const opp = getOpponentSeat(seat);
      expect(opp).not.toBe(seat);
      expect(CANONICAL_SEATS).toContain(opp);
    }
  });

  it('return value is always exactly player1 or player2 for any forged input', () => {
    for (const seat of [...CANONICAL_SEATS, ...FORGED_SEATS]) {
      const opp = getOpponentSeat(seat);
      expect(typeof opp).toBe('string');
      expect(opp === 'player1' || opp === 'player2').toBe(true);
    }
  });

  it('SeatId canonical set is exactly two seats (structural; no copy pins)', () => {
    expect(CANONICAL_SEATS).toHaveLength(2);
    expect(new Set(CANONICAL_SEATS).size).toBe(2);
    expect(CANONICAL_SEATS[0]).toBe('player1');
    expect(CANONICAL_SEATS[1]).toBe('player2');
  });
});
