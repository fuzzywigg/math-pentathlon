/**
 * q-mp-657 — Close `polyomino/types` residual lines under the *polyomino*
 * verify glob (tests-only; 0 src).
 *
 * Tip re-measure (`cursor/mp-tip-post1059` @ `be822e75`) with
 * `npm run test:unit:coverage -- --coverage.include=src/core/polyomino/types.ts
 * tests/unit/*polyomino*` (18 files / 263 tests before this suite):
 *   types.ts **90.0%** lines (9/10) / **100%** branches / **85.71%** stmts
 *   (12/14) / **75%** funcs (6/8). Sole uncovered line: **504**
 *   (`getShapesBySize` body + filter predicate).
 *
 * `burn-wave28-poly-catalog-symmetry` already exercises `getShapesBySize` but
 * does **not** match `*polyomino*` — same gap pattern as other glob-scoped
 * residual tickets. This suite owns the residual under the verify glob.
 *
 * Ownership (leave alone; no comments/labels/closes per worker brief):
 *   `#1070`/`635` transform + `#1073`/`626` placement — **contained**
 *   (this ticket is `types.ts` helpers only; characterize lookup outputs,
 *   no legal-move expectations that differ from current outputs).
 *
 * Constraints: tests only; zero `src/` edits; pin CURRENT behavior only
 * (document surprises — never “fix”); no AI / rules / scoring / copy /
 * aria pins; Hex Hard 450ms; no network; no ratchet JSON.
 */
import { describe, expect, it } from 'vitest';

import {
  PENTOMINOES,
  SIMPLE_SHAPES,
  TETROMINOES,
  getShapeById,
  getShapesBySize,
  type PolyominoShape,
} from '../../src/core/polyomino/types';

function stubShape(
  id: string,
  size: number,
  order: number = size
): PolyominoShape {
  return {
    id,
    name: id,
    cells: Array.from({ length: size }, (_, i) => ({ row: 0, col: i })),
    color: '#000000',
    canRotate: true,
    canFlip: true,
    size,
    order,
  };
}

describe('q-mp-657 polyomino/types — getShapesBySize residual (L504)', () => {
  it('filters TETROMINOES by size === 4 and returns empty for size 5', () => {
    // Exercises src/core/polyomino/types.ts ~500–504 under *polyomino* glob.
    const size4 = getShapesBySize(4, TETROMINOES);
    expect(size4).toHaveLength(7);
    expect(size4.every((s) => s.size === 4)).toBe(true);
    expect(getShapesBySize(5, TETROMINOES)).toEqual([]);
  });

  it('filters PENTOMINOES / SIMPLE_SHAPES by catalog size fields', () => {
    const pent5 = getShapesBySize(5, PENTOMINOES);
    expect(pent5).toHaveLength(12);
    expect(pent5.every((s) => s.size === 5)).toBe(true);

    const mono = getShapesBySize(1, SIMPLE_SHAPES);
    expect(mono).toHaveLength(1);
    expect(mono[0]?.id).toBe('monomino');

    expect(getShapesBySize(2, SIMPLE_SHAPES)).toHaveLength(1);
    expect(getShapesBySize(3, SIMPLE_SHAPES)).toHaveLength(2);
    expect(getShapesBySize(99, SIMPLE_SHAPES)).toEqual([]);
  });

  it('filters by .size (not .order) on a custom set', () => {
    // Characterizes the size predicate only — no placement / legal-move claim.
    const custom: PolyominoShape[] = [
      stubShape('a', 2, 9),
      stubShape('b', 3, 2),
      stubShape('c', 2, 2),
    ];
    const size2 = getShapesBySize(2, custom);
    expect(size2.map((s) => s.id)).toEqual(['a', 'c']);
    expect(getShapesBySize(3, custom).map((s) => s.id)).toEqual(['b']);
    expect(getShapesBySize(9, custom)).toEqual([]);
  });
});

describe('q-mp-657 polyomino/types — getShapeById under *polyomino* glob', () => {
  it('finds within a set and misses cross-set / unknown ids', () => {
    // Already covered via q-mp-635 imports under *polyomino*; pin lookup
    // contract next to getShapesBySize so the helpers stay co-characterized.
    expect(getShapeById('T', TETROMINOES)?.name).toBe('T-tetromino');
    expect(getShapeById('T', PENTOMINOES)).toBeUndefined();
    expect(getShapeById('X', PENTOMINOES)?.order).toBe(5);
    expect(getShapeById('___missing___', SIMPLE_SHAPES)).toBeUndefined();
  });
});
