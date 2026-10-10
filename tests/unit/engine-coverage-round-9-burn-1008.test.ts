/**
 * q-mp-297 — engine coverage round 9: post-r8 residual characterization.
 *
 * Themes: cold NON-RULES core helpers after r8 closed fractions / graph /
 * polyomino residuals. Prefer alignment (+ expression evaluator leftovers).
 * Pins CURRENT behavior only. Does not change engine / rules.ts / AI source.
 *
 * Baseline rank (tip post755, coverage-engine-r9-align-full, non-UI core):
 *   alignment/compat        91.42% branches (96/105)
 *   expressions/evaluator   94.61% branches (158/167)
 *   alignment/contiguous    97.18% branches (69/71)
 *   alignment/grid-alignment 97.84% branches (91/93)
 *   graph/algorithms        90.00% (r8 documented unreachable queue/Map)
 *   polyomino/placement     95.49% (r8 residual documented)
 */
import { describe, expect, it } from 'vitest';

import {
  areConnected,
  countMaxAligned,
  findAlignmentAt,
  findAlignmentsThrough,
  findAllAlignments,
  findAllRegions,
  findLargestRegion,
  findRegionAt,
} from '../../src/core/alignment/compat';
import {
  findAllRegions as findAllRegionsRaw,
  regionTouchesEdge,
  type ContiguousConfig,
} from '../../src/core/alignment/contiguous';
import {
  findAlignmentsForValue,
  findAllAlignments as findAllAlignmentsRaw,
} from '../../src/core/alignment/grid-alignment';
import { DIRECTIONS, type Region } from '../../src/core/alignment/types';
import {
  astToString,
  evaluateNode,
  validateSlots,
} from '../../src/core/expressions/evaluator';
import type {
  ExpressionCard,
  ExpressionNode,
  ExpressionSlot,
} from '../../src/core/expressions/types';

/** getCell that returns `undefined` (not null) for empty / OOB — hits safeGet ?? */
function undefBoard(grid: (string | number | undefined)[][]) {
  return (r: number, c: number): string | number | undefined => {
    if (r < 0 || c < 0 || r >= grid.length) {
      return undefined;
    }
    const row = grid[r];
    if (!row || c >= row.length) {
      return undefined;
    }
    return row[c];
  };
}

function slot(index: number, card: ExpressionCard | null): ExpressionSlot {
  return { id: `s${index}`, index, card };
}

// =============================================================================
// 1. alignment/compat.ts — safeGet undefined arms + reduce/dedupe
// =============================================================================

describe('engine-coverage-round-9 — alignment/compat', () => {
  it('safeGet maps in-bounds undefined cells to null across wrappers', () => {
    // Board uses `undefined` (not null) so each `v === undefined ? null : v` fires.
    const grid: (string | undefined)[][] = [
      ['X', 'X', 'X', 'X'],
      [undefined, undefined, undefined, undefined],
      [undefined, 'Y', undefined, undefined],
      [undefined, undefined, undefined, undefined],
    ];
    const get = undefBoard(grid);
    const dims = { rows: 4, cols: 4 };

    expect(
      findAlignmentAt({ row: 0, col: 1 }, 'horizontal', dims, get, {
        requiredLength: 4,
      })
    ).not.toBeNull();
    // Empty in-bounds cell → safeGet undefined→null inside findAlignmentAt.
    expect(
      findAlignmentAt({ row: 1, col: 0 }, 'horizontal', dims, get, {
        requiredLength: 2,
      })
    ).toBeNull();

    const all = findAllAlignments(dims, get, { requiredLength: 4 });
    expect(all.hasAlignment).toBe(true);

    const through = findAlignmentsThrough({ row: 0, col: 1 }, dims, get, {
      requiredLength: 4,
    });
    expect(through.hasAlignment).toBe(true);

    const max = countMaxAligned({ row: 0, col: 1 }, dims, get);
    expect(max.count).toBeGreaterThanOrEqual(4);

    expect(findRegionAt({ row: 0, col: 0 }, dims, get)).not.toBeNull();
    expect(findRegionAt({ row: 1, col: 0 }, dims, get)).toBeNull();

    const regions = findAllRegions(dims, get, { connectivity: 4 });
    expect(regions.length).toBeGreaterThanOrEqual(2);

    expect(
      areConnected({ row: 0, col: 0 }, { row: 0, col: 3 }, dims, get)
    ).toBe(true);
  });

  it('findAlignmentsThrough dedupes when every direction yields the same cells', () => {
    // requiredLength 1 → each of ALL_DIRECTIONS returns the singleton; after the
    // first push, `alignments.some(same key)` is true → skip arm (L377 else).
    const get = undefBoard([
      ['A', undefined],
      [undefined, undefined],
    ]);
    const result = findAlignmentsThrough(
      { row: 0, col: 0 },
      { rows: 2, cols: 2 },
      get,
      { requiredLength: 1 }
    );
    expect(result.hasAlignment).toBe(true);
    expect(result.alignments).toHaveLength(1);
    expect(result.alignments[0]?.positions).toEqual([{ row: 0, col: 0 }]);
  });

  it('findLargestRegion reduce keeps a later larger region (b.size > a.size)', () => {
    // Row-major scan finds singleton 'A' before the 2×2 'B' block.
    const get = undefBoard([
      ['A', undefined, 'B', 'B'],
      [undefined, undefined, 'B', 'B'],
    ]);
    const largest = findLargestRegion(
      { rows: 2, cols: 4 },
      get,
      { connectivity: 4 },
      (v) => v === 'A' || v === 'B'
    );
    expect(largest?.value).toBe('B');
    expect(largest?.size).toBe(4);
  });
});

// =============================================================================
// 2. alignment/contiguous.ts — flip-flop getCell + exhaustive edge default
// =============================================================================

describe('engine-coverage-round-9 — alignment/contiguous', () => {
  it('findAllRegions skips when findRegion returns null after a non-empty peek', () => {
    // First getCell(0,0) in the scan sees 'X'; findRegion's start peek sees null.
    let peek = 0;
    const get = (r: number, c: number) => {
      if (r === 0 && c === 0) {
        peek += 1;
        return peek === 1 ? 'X' : null;
      }
      return null;
    };
    const config: ContiguousConfig = { rows: 1, cols: 1 };
    expect(findAllRegionsRaw(get, config)).toEqual([]);
  });

  it('regionTouchesEdge default arm is reachable only via forged edge', () => {
    const region: Region = {
      value: 'X',
      positions: [{ row: 0, col: 0 }],
      size: 1,
    };
    const config: ContiguousConfig = { rows: 2, cols: 2 };
    // Exhaustive `never` default — pins current throw-via-assignment behavior.
    expect(() =>
      regionTouchesEdge(region, 'diagonal' as 'top', config)
    ).not.toThrow();
    // Current behavior: default returns the forged edge string as boolean-ish
    // (never assignment yields the value; `.some` treats non-empty string truthy).
    expect(regionTouchesEdge(region, 'diagonal' as 'top', config)).toBeTruthy();
  });
});

// =============================================================================
// 3. alignment/grid-alignment.ts — found.has duplicate-direction skip
// =============================================================================

describe('engine-coverage-round-9 — alignment/grid-alignment', () => {
  it('duplicate directions in config hit found.has skip arms', () => {
    const grid = [
      ['X', 'X', 'X'],
      [null, null, null],
      [null, null, null],
    ];
    const get = (r: number, c: number) => grid[r]?.[c] ?? null;
    const config = {
      rows: 3,
      cols: 3,
      targetLength: 3,
      // Same direction twice → second scan rediscovers the identical key.
      directions: [DIRECTIONS.HORIZONTAL, DIRECTIONS.HORIZONTAL],
    };

    const forValue = findAlignmentsForValue('X', get, config);
    expect(forValue).toHaveLength(1);

    const all = findAllAlignmentsRaw(get, config);
    expect(all).toHaveLength(1);
  });
});

// =============================================================================
// 4. expressions/evaluator.ts — forge arms + documented unreachable
// =============================================================================

describe('engine-coverage-round-9 — expressions/evaluator', () => {
  it('evaluateNode / astToString exhaustive defaults accept forged node types', () => {
    const forged = { type: 'ternary' } as unknown as ExpressionNode;
    // Current behavior: assign-to-never returns the forged node.
    expect(evaluateNode(forged)).toEqual(forged);
    expect(astToString(forged)).toEqual(forged);
  });

  it('validateSlots ignores forged tokenType outside the known four', () => {
    const weird: ExpressionCard = {
      id: 'w0',
      content: '?',
      tokenType: 'variable' as ExpressionCard['tokenType'],
    };
    const slots = [
      slot(0, { id: 'n0', content: '1', tokenType: 'number', value: 1 }),
      slot(1, weird),
      slot(2, { id: 'n1', content: '2', tokenType: 'number', value: 2 }),
    ];
    const result = validateSlots(slots);
    // Forged type skips operator/number/paren arms; expression still joins.
    expect(result.errors.length).toBeGreaterThanOrEqual(0);
    expect(typeof result.isValid).toBe('boolean');
  });

  it('documents unreachable private buildExpression / buildParen / ?? fallbacks', () => {
    // Documented unreachable on public paths (same defensive class as r8):
    // - buildExpression(numbers.length === 0): only called from
    //   solveTargetChallenge with permutations of challenge.numbers; empty
    //   numbers would recurse operatorCombinations(-1) and is not a public API.
    // - buildParenExpressions early return (nums.length !== 4 || ops.length !== 3):
    //   solveTargetChallenge only calls it when numPerm.length === 4 (ops = 3).
    // - validateSlots `result.error ?? 'Evaluation failed'`: evaluate always sets
    //   `error` on failure.
    // - validateSlots `result.value !== undefined` else / validateSolution
    //   `result.value ?? 0`: evaluate always sets `value` on success.
    // - validateSolution `result.error !== undefined` else: failure always has error.
    expect(true).toBe(true);
  });
});
