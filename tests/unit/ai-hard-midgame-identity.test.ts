/**
 * Hard time-box (hex / queens-guards): mid-game chosen moves must match
 * unlimited Hard search on the hand-built benchmark states.
 *
 * The identity loops are offline/local keepers: under GitHub Actions they burn
 * several minutes (queens alone ~4–5m) and trip the unit step's 8m timeout.
 * Deadline asserts still run in CI.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState as createHex } from '../../src/games/hex/types';
import { makeMove as hexMove } from '../../src/games/hex/rules';
import {
  searchBestMove as hexSearch,
  AI_PLAY_DEADLINE_MS as HEX_MS,
} from '../../src/games/hex/ai';
import { createInitialState as createQueens } from '../../src/games/queens-guards/types';
import {
  searchAIMove as queensSearch,
  applyAIMove as queensApply,
  AI_PLAY_DEADLINE_MS as QUEENS_MS,
} from '../../src/games/queens-guards/ai';

const SEEDS = [1, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29] as const;

/** Heavy unlimited-Hard identity loops — skip on CI runners (step 8m budget). */
const skipIdentityUnderCi = !!process.env.CI;

export function hexMidgameBenchmarkState() {
  let s = createHex(11);
  s = hexMove(s, { row: 5, col: 5 });
  s = hexMove(s, { row: 5, col: 6 });
  s = hexMove(s, { row: 4, col: 5 });
  s = hexMove(s, { row: 6, col: 5 });
  s = hexMove(s, { row: 4, col: 6 });
  s = hexMove(s, { row: 6, col: 6 });
  return s;
}

export function queensMidgameBenchmarkState() {
  let s = createQueens();
  for (let i = 0; i < 4; i++) {
    const m = queensSearch(s, s.currentPlayer, 'easy', { seed: 10 + i }).move;
    if (!m) break;
    s = queensApply(s, m);
  }
  return s;
}

function pct(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.min(
    sorted.length - 1,
    Math.max(0, Math.ceil((p / 100) * sorted.length) - 1)
  );
  return sorted[idx];
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Hex Hard mid-game time-box identity', () => {
  it('Hard play deadline is ≤450ms (≤500ms wall target)', () => {
    expect(HEX_MS.hard).toBeLessThanOrEqual(450);
  });

  it.skipIf(skipIdentityUnderCi)(
    'budgeted Hard mid moves match unlimited Hard (before/after time-box)',
    () => {
      const state = hexMidgameBenchmarkState();
      const times: number[] = [];
      for (const seed of SEEDS) {
        const before = hexSearch(state, 'player1', 'hard', { seed });
        const t0 = performance.now();
        const after = hexSearch(state, 'player1', 'hard', {
          seed,
          deadlineMs: HEX_MS.hard,
        });
        times.push(performance.now() - t0);
        expect(after.move).toEqual(before.move);
      }
      const p95 = pct(
        [...times].sort((a, b) => a - b),
        95
      );
      expect(p95).toBeLessThanOrEqual(500);
    },
    180_000
  );
});

describe('Queens Hard mid-game time-box identity', () => {
  it('Hard play deadline is ≤2500ms (alpha restore option)', () => {
    expect(QUEENS_MS.hard).toBeLessThanOrEqual(2500);
  });

  it.skipIf(skipIdentityUnderCi)(
    'budgeted Hard mid moves match unlimited Hard (before/after time-box)',
    () => {
      const state = queensMidgameBenchmarkState();
      const times: number[] = [];
      for (const seed of SEEDS) {
        const before = queensSearch(state, state.currentPlayer, 'hard', {
          seed,
        });
        const t0 = performance.now();
        const after = queensSearch(state, state.currentPlayer, 'hard', {
          seed,
          deadlineMs: QUEENS_MS.hard,
        });
        times.push(performance.now() - t0);
        expect(after.move).toEqual(before.move);
      }
      const p95 = pct(
        [...times].sort((a, b) => a - b),
        95
      );
      expect(p95).toBeLessThanOrEqual(500);
    },
    600_000
  );
});
