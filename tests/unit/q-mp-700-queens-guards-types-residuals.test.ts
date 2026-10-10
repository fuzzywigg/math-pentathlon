/**
 * q-mp-700 — Close `queens-guards/types` residual gaps under the full
 * related verify glob (tests-only; 0 src).
 *
 * Tip re-measure (`cursor/mp-tip-post1059` @ `ac5577f6`) with
 * `CI=1 npx vitest run --coverage --project unit-shared
 * --coverage.include=src/games/queens-guards/types.ts
 * tests/unit/*queens*types* tests/unit/*queens*`
 * (49 files / 194 tests before this suite):
 *   types.ts **97.14%** lines (68/70) / **85.71%** branches (36/42)
 *   Uncovered lines: **218**, **231** (`createBoard` Map-miss `continue`)
 *   Missing branches: those two `cell === undefined` arms + four
 *   `getAdjacent` else arms (inner-already-present, geometry reject,
 *   non-ring-1 fallthrough, outerPos1===outerPos2).
 *
 * Ownership (leave alone; no comments/labels/closes per worker brief):
 *   Open tip drafts `#1084`–`#1099` do not cover `queens-guards/types`.
 *   Leave board-3d / UI-round queens drafts alone.
 *
 * Constraints: tests only; zero `src/` edits; pin CURRENT behavior only
 * (document surprises — never “fix”); no AI / rules / scoring / copy /
 * aria / legal-move pins; queens-guards is the flaky-AI game — zero AI
 * asserts; Hex Hard 450ms untouched; no network; no ratchet JSON.
 * Map.prototype.get spy restored in afterEach (shared-pool safe pattern).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  CONFIG,
  cellKey,
  cellsInRing,
  createBoard,
  getAdjacent,
  normalizePosition,
} from '../../src/games/queens-guards/types';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('q-mp-700 queens-guards/types — createBoard Map-miss continues', () => {
  it('player1 placement loop continues when cells.get misses (L217–218)', () => {
    const origGet = Map.prototype.get;
    const missKey = cellKey(CONFIG.NUM_RINGS - 1, 1);
    let missHits = 0;
    vi.spyOn(Map.prototype, 'get').mockImplementation(function (
      this: Map<unknown, unknown>,
      key: unknown
    ) {
      if (key === missKey) {
        missHits += 1;
        return undefined;
      }
      return origGet.call(this, key);
    });

    const board = createBoard();
    expect(missHits).toBeGreaterThanOrEqual(1);
    // Structural: board still materializes (creation loop uses set, not get).
    expect(board.size).toBeGreaterThan(0);
    expect(board instanceof Map).toBe(true);
  });

  it('player2 placement loop continues when cells.get misses (L230–231)', () => {
    const origGet = Map.prototype.get;
    const missKey = cellKey(CONFIG.NUM_RINGS - 1, 16);
    let missHits = 0;
    vi.spyOn(Map.prototype, 'get').mockImplementation(function (
      this: Map<unknown, unknown>,
      key: unknown
    ) {
      if (key === missKey) {
        missHits += 1;
        return undefined;
      }
      return origGet.call(this, key);
    });

    const board = createBoard();
    expect(missHits).toBeGreaterThanOrEqual(1);
    expect(board.size).toBeGreaterThan(0);
    expect(board instanceof Map).toBe(true);
  });
});

describe('q-mp-700 queens-guards/types — getAdjacent residual branches', () => {
  it('ring < 1 (non-zero) skips ring-1 throne link and can equalize outer pos', () => {
    // Characterizes CURRENT helper math on out-of-board coords (not a
    // legal-move claim). Hits the else of `else if (ring === 1)` and the
    // `outerPos2 === outerPos1` arm that integer rings 1..4 never take.
    const adj = getAdjacent({ ring: -1, position: 0 });
    expect(Array.isArray(adj)).toBe(true);
    expect(adj.length).toBeGreaterThan(0);
    expect(adj.every((a) => typeof a.ring === 'number')).toBe(true);
    // Same-ring neighbors only — no ring===1 throne push on this path.
    expect(adj.filter((a) => a.ring === -1).length).toBeGreaterThanOrEqual(2);
  });

  it('fractional ring>1 can reject the second inner neighbor (geometry else)', () => {
    // Integer rings 2..5 always take the geometry true arm; ring 1.2 / pos 0
    // is the CURRENT helper path where both geometry clauses are false.
    const adj = getAdjacent({ ring: 1.2, position: 0 });
    expect(Array.isArray(adj)).toBe(true);
    expect(adj.length).toBeGreaterThan(0);
    const inner = adj.filter((a) => a.ring === 1.2 - 1);
    // First inner push still happens; second neighbor is rejected.
    expect(inner.length).toBe(1);
  });
});

describe('q-mp-700 queens-guards/types — documented unreachable arm', () => {
  it('inner nextPos-already-present else is unreachable for integer play rings', () => {
    // The `adjacent.some(...)` true arm (else of `if (!already)`) never
    // fires for integer rings in 0..NUM_RINGS-1: the only prior ring-1
    // push is `innerPos`, and `nextInnerPos = (innerPos+1)%innerCount`
    // equals it only when innerCount===1 (ring===1), which uses the
    // throne branch instead. Documented unreachable — no src change.
    let alreadyTrue = 0;
    for (let ring = 2; ring < CONFIG.NUM_RINGS; ring++) {
      const count = cellsInRing(ring);
      const innerCount = cellsInRing(ring - 1);
      for (let position = 0; position < count; position++) {
        const innerPos = Math.floor((position / count) * innerCount);
        const firstInner = normalizePosition(ring - 1, innerPos);
        const nextInnerPos = (innerPos + 1) % innerCount;
        if (firstInner === nextInnerPos) {
          alreadyTrue += 1;
        }
      }
    }
    expect(alreadyTrue).toBe(0);
    expect(CONFIG.NUM_RINGS).toBe(6);
  });
});
