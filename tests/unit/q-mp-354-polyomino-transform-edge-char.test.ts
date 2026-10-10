/**
 * q-mp-354 — Characterize polyomino/transform edge residuals (tests-only).
 *
 * Pins CURRENT behavior on tip post785 for `src/core/polyomino/transform.ts`
 * edge / orientation / invalid-input paths. Prerequisite characterization for
 * q-mp-345 (nnnull clear) — does NOT edit transform.ts or placement/legal-move.
 *
 * Gaps under verify glob `tests/unit/*polyomino*` (tip HEAD before this file):
 *   rotateCells default arm (L23), normalizeCells([]) (L48),
 *   getTransformedPolyomino (L438), arePolyominoesEquivalent length short-circuit (L473).
 *
 * Documented quirks (not fixed here — see PR body):
 *   - nextRotation/prevRotation on forged non-canonical Rotation via indexOf(-1)
 *   - translateCells dual-number overload with missing colOffset → NaN cols
 *   - getAbsoluteCells / getTransformedPolyomino ignore canFlip/canRotate flags
 *     while getCellsAtPosition / getTransformedCells respect them
 *   - areCellsConnected returns false when the input list has duplicate cells
 *     (unique BFS size vs cells.length) — already noted in wave28 connectivity
 */
import { describe, it, expect } from 'vitest';

import {
  rotateCells,
  normalizeCells,
  translateCells,
  nextRotation,
  prevRotation,
  getTransformedCells,
  getTransformedPolyomino,
  getCellsAtPosition,
  getAbsoluteCells,
  transformCells,
  arePolyominoesEquivalent,
  areCellsConnected,
  cellsToKey,
  getAllOrientations,
  areCellsInBounds,
} from '../../src/core/polyomino/transform';
import {
  TETROMINOES,
  getPolyominoesByOrder,
  type Cell,
  type PolyominoShape,
  type Rotation,
} from '../../src/core/polyomino/types';

function shapeOf(
  id: string,
  cells: Cell[],
  opts: Partial<Pick<PolyominoShape, 'canRotate' | 'canFlip'>> = {}
): PolyominoShape {
  return {
    id,
    name: id,
    cells,
    color: '#000',
    canRotate: opts.canRotate ?? true,
    canFlip: opts.canFlip ?? true,
    size: cells.length,
    order: cells.length,
  };
}

const CHIRAL_L: Cell[] = [
  { row: 0, col: 0 },
  { row: 1, col: 0 },
  { row: 1, col: 1 },
];

// =============================================================================
// 1. Invalid / empty input residuals (*polyomino* glob gaps)
// =============================================================================

describe('q-mp-354 polyomino/transform — invalid + empty residuals', () => {
  it('rotateCells default arm deep-copies cells for forged non-canonical rotation', () => {
    const cells: Cell[] = [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
    ];
    // Rotation is typed 0|90|180|270; forge an out-of-union value.
    const out = rotateCells(cells, 45 as Rotation);
    expect(out).toEqual(cells);
    expect(out).not.toBe(cells);
    expect(out[0]).not.toBe(cells[0]);
  });

  it('normalizeCells([]) returns empty (origin-min short-circuit)', () => {
    expect(normalizeCells([])).toEqual([]);
  });

  it('arePolyominoesEquivalent short-circuits on unequal cell counts', () => {
    const mono = getPolyominoesByOrder(1)[0]!;
    const domino = getPolyominoesByOrder(2)[0]!;
    expect(mono.cells.length).not.toBe(domino.cells.length);
    expect(arePolyominoesEquivalent(mono, domino)).toBe(false);
  });

  it('getTransformedPolyomino matches free transformCells and preserves meta', () => {
    const L = TETROMINOES.find((s) => s.id === 'L')!;
    const out = getTransformedPolyomino(L, 90, true);
    expect(out.id).toBe(L.id);
    expect(out.name).toBe(L.name);
    expect(out.canRotate).toBe(L.canRotate);
    expect(out.canFlip).toBe(L.canFlip);
    expect(cellsToKey(out.cells)).toBe(
      cellsToKey(transformCells(L.cells, 90, true))
    );
  });
});

// =============================================================================
// 2. nnnull call-path pins (q-mp-345 prerequisite — structural only)
// =============================================================================

describe('q-mp-354 polyomino/transform — nnnull call-path pins', () => {
  it('translateCells dual-number overload shifts by (rowOffset, colOffset)', () => {
    // Hits colOffset! at transform.ts dual-number arm.
    const cells: Cell[] = [
      { row: 1, col: 2 },
      { row: 3, col: -1 },
    ];
    expect(translateCells(cells, 4, -2)).toEqual([
      { row: 5, col: 0 },
      { row: 7, col: -3 },
    ]);
  });

  it('nextRotation / prevRotation wrap the canonical quartet (index ±1 % 4)', () => {
    // Hits rotations[(index±1|±3)%4]! arms.
    const cycle: Rotation[] = [0, 90, 180, 270];
    for (let i = 0; i < 4; i++) {
      expect(nextRotation(cycle[i]!)).toBe(cycle[(i + 1) % 4]);
      expect(prevRotation(cycle[i]!)).toBe(cycle[(i + 3) % 4]);
    }
  });

  it('areCellsConnected multi-cell BFS visits every unique key (cells[0]! / shift!)', () => {
    const bar: Cell[] = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ];
    expect(areCellsConnected(bar)).toBe(true);
    expect(
      areCellsConnected([
        { row: 0, col: 0 },
        { row: 0, col: 2 },
      ])
    ).toBe(false);
  });
});

// =============================================================================
// 3. Orientation / flag edge matrix (current behavior pins)
// =============================================================================

describe('q-mp-354 polyomino/transform — orientation + flag edges', () => {
  it('getTransformedCells respects canRotate/canFlip; transformCells ignores both', () => {
    const locked = shapeOf('locked-L', CHIRAL_L, {
      canRotate: false,
      canFlip: false,
    });
    const free = shapeOf('free-L', CHIRAL_L, {
      canRotate: true,
      canFlip: true,
    });

    // Flag-aware path: locked ignores requested 90 + flip.
    expect(cellsToKey(getTransformedCells(locked, 90, true))).toBe(
      cellsToKey(normalizeCells(CHIRAL_L))
    );
    // Free transformCells always applies flip then rotate.
    expect(cellsToKey(transformCells(locked.cells, 90, true))).toBe(
      cellsToKey(transformCells(free.cells, 90, true))
    );
    expect(cellsToKey(getTransformedCells(free, 90, true))).toBe(
      cellsToKey(transformCells(free.cells, 90, true))
    );
  });

  it('getAbsoluteCells ignores canFlip:false; getCellsAtPosition honors it', () => {
    const locked = shapeOf('abs-locked', CHIRAL_L, {
      canRotate: true,
      canFlip: false,
    });
    const pos = { row: 2, col: 3 };
    const abs = cellsToKey(getAbsoluteCells(locked, pos, 0, true));
    const gated = cellsToKey(getCellsAtPosition(locked, pos, 0, true));
    expect(abs).not.toBe(gated);
    // Gated path matches unflipped absolute.
    expect(gated).toBe(cellsToKey(getAbsoluteCells(locked, pos, 0, false)));
  });

  it('getTransformedPolyomino ignores canRotate/canFlip flags (free transform)', () => {
    const locked = shapeOf('meta-locked', CHIRAL_L, {
      canRotate: false,
      canFlip: false,
    });
    // 180° unflipped differs from identity for this L; free APIs still rotate.
    const viaPoly = getTransformedPolyomino(locked, 180, false);
    const viaFree = transformCells(locked.cells, 180, false);
    const viaGated = getTransformedCells(locked, 180, false);
    expect(cellsToKey(viaPoly.cells)).toBe(cellsToKey(viaFree));
    expect(cellsToKey(viaPoly.cells)).not.toBe(cellsToKey(viaGated));
    expect(cellsToKey(viaGated)).toBe(cellsToKey(normalizeCells(CHIRAL_L)));
  });

  it('getAllOrientations: canRotate false + canFlip true dedupes symmetric flip', () => {
    // Horizontal bar flip == identity under normalize → single orientation.
    const bar = shapeOf(
      'h-bar',
      [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ],
      { canRotate: false, canFlip: true }
    );
    const orients = getAllOrientations(bar);
    expect(orients).toHaveLength(1);
    expect(orients[0]).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ]);
  });

  it('areCellsInBounds rejects negative and exclusive upper edges; empty is in-bounds', () => {
    expect(areCellsInBounds([], 0, 0)).toBe(true);
    expect(areCellsInBounds([{ row: 0, col: 0 }], 1, 1)).toBe(true);
    expect(areCellsInBounds([{ row: -1, col: 0 }], 2, 2)).toBe(false);
    expect(areCellsInBounds([{ row: 0, col: -1 }], 2, 2)).toBe(false);
    expect(areCellsInBounds([{ row: 2, col: 0 }], 2, 2)).toBe(false);
    expect(areCellsInBounds([{ row: 0, col: 2 }], 2, 2)).toBe(false);
  });
});

// =============================================================================
// 4. Documented quirks (pins only — do not "fix" in product)
// =============================================================================

describe('q-mp-354 polyomino/transform — documented quirks (pin, do not fix)', () => {
  it('forged non-canonical Rotation: next→0 and prev→180 via indexOf(-1)', () => {
    // indexOf(45) === -1 → ( -1+1 )%4 === 0 → rotations[0] === 0
    //                      ( -1+3 )%4 === 2 → rotations[2] === 180
    expect(nextRotation(45 as Rotation)).toBe(0);
    expect(prevRotation(45 as Rotation)).toBe(180);
  });

  it('translateCells dual-number with missing colOffset yields NaN cols', () => {
    // colOffset! is undefined at runtime when the 2-arg number form is misused.
    const out = translateCells([{ row: 1, col: 2 }], 3 /* colOffset omitted */);
    expect(out).toHaveLength(1);
    expect(out[0]!.row).toBe(4);
    expect(Number.isNaN(out[0]!.col)).toBe(true);
  });

  it('duplicate cells make areCellsConnected return false (unique BFS vs length)', () => {
    const cells: Cell[] = [
      { row: 0, col: 0 },
      { row: 0, col: 0 },
      { row: 0, col: 1 },
    ];
    expect(areCellsConnected(cells)).toBe(false);
  });
});
