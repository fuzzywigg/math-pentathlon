/**
 * q-mp-702 — Close `star-track/types` residual gaps under the
 * `*star-track*types*` / `*star*` verification glob (tests-only; 0 src).
 *
 * Tip re-measure (`cursor/mp-tip-post1059` @ `ac5577f6`) with
 * `CI=1 npx vitest run --coverage --project unit-shared
 * --coverage.include=src/games/star-track/types.ts
 * tests/unit/*star-track*types* tests/unit/*star*` (159 files / 443 tests
 * before this suite):
 *   types.ts **95.0%** lines (19/20) / **83.33%** branches (5/6) /
 *   **95.65%** stmts (22/23) / **100%** funcs.
 *   Sole uncovered line: **86** (`shuffleArray` hole-guard `continue`).
 *
 * `shuffleArray` is module-private and only receives the dense 24-chain
 * bucket from `createChainBucket`. Rounds 3–7 documented the arm as
 * unreachable under a normal random stream; this suite forces
 * `Math.random() === NaN` so `j` is `NaN`, `result[j]` is `undefined`, and
 * the `b === undefined` continue arm executes — characterizing CURRENT
 * defensive behavior without `src/` edits or prototype spies.
 *
 * Ownership (leave alone; no comments/labels/closes per worker brief):
 *   `#616` / star-track board-3d residuals — **contained**
 *   (this ticket is `types.ts` helpers only).
 *
 * Constraints: tests only; zero `src/` edits; pin CURRENT behavior only
 * (document surprises — never “fix”); no AI / rules / scoring / copy /
 * aria pins; Hex Hard 450ms; no network; no ratchet JSON.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  CHAINS_PER_LENGTH,
  TRACK_LENGTH,
  createChainBucket,
  createInitialState,
  getOpponent,
  getPlayerPosition,
} from '../../src/games/star-track/types';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('q-mp-702 star-track/types — shuffle hole-guard residual (L86)', () => {
  it('createChainBucket continues when Fisher-Yates partner b is undefined', () => {
    // Math.random → NaN ⇒ j = Math.floor(NaN * (i+1)) = NaN ⇒ result[j]
    // is undefined while result[i] stays a dense ChainLink → continue @ L86.
    vi.spyOn(Math, 'random').mockReturnValue(Number.NaN);
    const bucket = createChainBucket();
    expect(bucket).toHaveLength(24);
    expect(TRACK_LENGTH).toBe(12);
    expect(CHAINS_PER_LENGTH).toBe(4);
    for (let len = 1; len <= 6; len++) {
      expect(bucket.filter((c) => c.length === len)).toHaveLength(4);
    }
    expect(new Set(bucket.map((c) => c.id)).size).toBe(24);
  });

  it('dense bucket under a finite random stream keeps the same multiset', () => {
    // Contrasts the NaN path: every swap partner is defined, so the if @ L85
    // takes the false arm (already covered by *star* suites; pinned here so
    // the residual file owns both sides of the hole-guard under its glob).
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const bucket = createChainBucket();
    expect(bucket).toHaveLength(24);
    expect(bucket.every((c) => c.length >= 1 && c.length <= 6)).toBe(true);
    expect(bucket.map((c) => c.id).sort((a, b) => a - b)).toEqual(
      Array.from({ length: 24 }, (_, i) => i)
    );
  });
});

describe('q-mp-702 star-track/types — helpers under *star-track*types* glob', () => {
  it('createInitialState / getOpponent / getPlayerPosition keep tip identities', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    expect(state.phase).toBe('drawChains');
    expect(state.currentPlayer).toBe('player1');
    expect(state.player1Position).toBe(0);
    expect(state.player2Position).toBe(0);
    expect(state.drawnChains).toBeNull();
    expect(state.selectedChain).toBeNull();
    expect(state.winner).toBeNull();
    expect(state.moveHistory).toEqual([]);
    expect(state.chainBucket).toHaveLength(24);
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
    expect(getPlayerPosition(state, 'player1')).toBe(0);
    expect(getPlayerPosition({ ...state, player2Position: 7 }, 'player2')).toBe(
      7
    );
  });
});
