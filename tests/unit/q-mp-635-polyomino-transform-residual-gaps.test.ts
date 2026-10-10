/**
 * q-mp-635 — Close `polyomino/transform` residual gaps (tests-only).
 *
 * Live tip re-measure @ `cursor/mp-tip-post1023` (`166d132d`) under the
 * backlog verify glob `tests/unit/*transform*` (5 files / 57 tests before this
 * suite): `transform.ts` **67.33%** lines / **75%** branches / **59.64%**
 * funcs. Backlog stamp “76.0% lines / 82.1% branches” is stale on post1023 —
 * named residual clusters ~414–424 / 475–484 remain; additional uncovered
 * helpers under this narrow glob include flipCellsVertical, getAllRotations,
 * areCellsEquivalent, isAdjacent, sort/canonicalize, rotateCells90CW,
 * non-empty bbox/bounds/COM/center, Cell-object translate, canRotate=true
 * orientation orbit, and BFS revisit continue.
 *
 * Ownership (leave alone; do not edit product / competing suites):
 *   Undrafted `345` — nnnull transform clear; leave **contained**
 *   `#990`/`525` soft-fail + `#847`/`354` edge char — leave open **contained**
 *     (no comments/labels/closes per worker brief)
 *   Placement / legal-move — do not edit
 *
 * This suite owns residual gap contracts still thin under `*transform*`:
 *   rotatePolyomino / flipPolyomino (414–424), arePolyominoesEquivalent
 *   positive path + getSymmetryCount (475–484), and the helper residuals
 *   listed above. Pins CURRENT behavior only.
 *
 * Constraints: tests only; zero `src/` edits; pin CURRENT behavior only
 * (document surprises — never “fix”); no nnnull clear; no placement.ts;
 * no AI / rules / scoring / copy / aria pins; Hex Hard 450ms; no network;
 * no ratchet JSON.
 */
import { describe, expect, it } from 'vitest';

import {
  areCellsConnected,
  areCellsEquivalent,
  arePolyominoesEquivalent,
  canonicalizeCells,
  cellsToKey,
  centerCells,
  flipCellsHorizontal,
  flipCellsVertical,
  flipPolyomino,
  getAllOrientations,
  getAllRotations,
  getAllTransformations,
  getBoundingBox,
  getBounds,
  getCenterOfMass,
  getSymmetryCount,
  isAdjacent,
  normalizeCells,
  rotateCells,
  rotateCells90CW,
  rotatePolyomino,
  sortCells,
  translateCells,
  transformCells,
} from '../../src/core/polyomino/transform';
import {
  TETROMINOES,
  getPolyominoesByOrder,
  getShapeById,
  type Cell,
  type PolyominoShape,
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
// 1. Named residual clusters ~414–424 (rotatePolyomino / flipPolyomino)
// =============================================================================

describe('q-mp-635 polyomino/transform — rotate/flip shape wrappers (414–424)', () => {
  it('rotatePolyomino applies 90° CW + normalize and preserves meta', () => {
    const L = getShapeById('L', TETROMINOES)!;
    const out = rotatePolyomino(L);
    expect(out.id).toBe(L.id);
    expect(out.name).toBe(L.name);
    expect(out.canRotate).toBe(L.canRotate);
    expect(out.canFlip).toBe(L.canFlip);
    expect(out.color).toBe(L.color);
    expect(cellsToKey(out.cells)).toBe(
      cellsToKey(normalizeCells(rotateCells(L.cells, 90)))
    );
    // Distinct from identity for chiral L.
    expect(cellsToKey(out.cells)).not.toBe(cellsToKey(normalizeCells(L.cells)));
  });

  it('flipPolyomino applies horizontal flip + normalize and preserves meta', () => {
    const L = getShapeById('L', TETROMINOES)!;
    const out = flipPolyomino(L);
    expect(out.id).toBe(L.id);
    expect(out.name).toBe(L.name);
    expect(out.canRotate).toBe(L.canRotate);
    expect(out.canFlip).toBe(L.canFlip);
    expect(cellsToKey(out.cells)).toBe(
      cellsToKey(normalizeCells(flipCellsHorizontal(L.cells)))
    );
  });

  it('rotatePolyomino / flipPolyomino ignore canRotate/canFlip flags (free path)', () => {
    const locked = shapeOf('locked-L', CHIRAL_L, {
      canRotate: false,
      canFlip: false,
    });
    const rotated = rotatePolyomino(locked);
    const flipped = flipPolyomino(locked);
    expect(cellsToKey(rotated.cells)).toBe(
      cellsToKey(normalizeCells(rotateCells(CHIRAL_L, 90)))
    );
    expect(cellsToKey(flipped.cells)).toBe(
      cellsToKey(normalizeCells(flipCellsHorizontal(CHIRAL_L)))
    );
    expect(rotated.canRotate).toBe(false);
    expect(flipped.canFlip).toBe(false);
  });

  it('four rotatePolyomino steps return to the normalized identity', () => {
    const T = getShapeById('T', TETROMINOES)!;
    const identity = cellsToKey(normalizeCells(T.cells));
    let cur = T;
    for (let i = 0; i < 4; i++) {
      cur = rotatePolyomino(cur);
    }
    expect(cellsToKey(cur.cells)).toBe(identity);
  });
});

// =============================================================================
// 2. Named residual clusters ~475–484 (equiv positive path / symmetry)
// =============================================================================

describe('q-mp-635 polyomino/transform — equiv + symmetry residuals (475–484)', () => {
  it('arePolyominoesEquivalent positive path: shape equals itself', () => {
    const L = getShapeById('L', TETROMINOES)!;
    expect(arePolyominoesEquivalent(L, L)).toBe(true);
  });

  it('arePolyominoesEquivalent positive path: L ≡ J under flip orbit', () => {
    const L = getShapeById('L', TETROMINOES)!;
    const J = getShapeById('J', TETROMINOES)!;
    expect(L.cells.length).toBe(J.cells.length);
    expect(arePolyominoesEquivalent(L, J)).toBe(true);
  });

  it('arePolyominoesEquivalent positive path: rotated copy still matches', () => {
    const T = getShapeById('T', TETROMINOES)!;
    const rotated = rotatePolyomino(T);
    expect(arePolyominoesEquivalent(T, rotated)).toBe(true);
  });

  it('arePolyominoesEquivalent false when same size but different free orbits', () => {
    const T = getShapeById('T', TETROMINOES)!;
    const S = getShapeById('S', TETROMINOES)!;
    expect(T.cells.length).toBe(S.cells.length);
    expect(arePolyominoesEquivalent(T, S)).toBe(false);
  });

  it('getSymmetryCount equals getAllTransformations length', () => {
    const O = getShapeById('O', TETROMINOES)!;
    const L = getShapeById('L', TETROMINOES)!;
    expect(getSymmetryCount(O)).toBe(getAllTransformations(O).length);
    expect(getSymmetryCount(L)).toBe(getAllTransformations(L).length);
    // O is more symmetric → fewer unique orientations than chiral L.
    expect(getSymmetryCount(O)).toBeLessThan(getSymmetryCount(L));
  });

  it('getSymmetryCount for monomino is 1', () => {
    const mono = getPolyominoesByOrder(1)[0]!;
    expect(getSymmetryCount(mono)).toBe(1);
  });
});

// =============================================================================
// 3. Helper residuals still uncovered under *transform* glob
// =============================================================================

describe('q-mp-635 polyomino/transform — helper residual gaps', () => {
  it('flipCellsVertical mirrors across X; normalize differs from horizontal for L', () => {
    const vertical = normalizeCells(flipCellsVertical(CHIRAL_L));
    const horizontal = normalizeCells(flipCellsHorizontal(CHIRAL_L));
    expect(cellsToKey(vertical)).not.toBe(cellsToKey(horizontal));
    expect(vertical).toHaveLength(3);
  });

  it('getAllRotations dedupes the O square to a single orientation', () => {
    const O = getShapeById('O', TETROMINOES)!;
    const rots = getAllRotations(O.cells);
    expect(rots).toHaveLength(1);
    expect(cellsToKey(rots[0]!)).toBe(cellsToKey(normalizeCells(O.cells)));
  });

  it('getAllRotations yields four unique keys for chiral L', () => {
    const keys = getAllRotations(CHIRAL_L).map((c) => cellsToKey(c));
    expect(keys).toHaveLength(4);
    expect(new Set(keys).size).toBe(4);
  });

  it('areCellsEquivalent true after normalize-equivalent reorder; false otherwise', () => {
    const a: Cell[] = [
      { row: 1, col: 1 },
      { row: 1, col: 2 },
    ];
    const b: Cell[] = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
    ];
    expect(areCellsEquivalent(a, b)).toBe(true);
    expect(
      areCellsEquivalent(a, [
        { row: 0, col: 0 },
        { row: 1, col: 0 },
      ])
    ).toBe(false);
  });

  it('isAdjacent is 4-way only (orthogonal true; diagonal false)', () => {
    const seed: Cell[] = [{ row: 2, col: 2 }];
    expect(isAdjacent({ row: 2, col: 3 }, seed)).toBe(true);
    expect(isAdjacent({ row: 1, col: 2 }, seed)).toBe(true);
    expect(isAdjacent({ row: 1, col: 1 }, seed)).toBe(false);
    expect(isAdjacent({ row: 2, col: 2 }, seed)).toBe(false);
  });

  it('sortCells is row-major; canonicalizeCells normalizes then sorts', () => {
    const messy: Cell[] = [
      { row: 3, col: 4 },
      { row: 2, col: 5 },
      { row: 2, col: 4 },
    ];
    expect(sortCells(messy)).toEqual([
      { row: 2, col: 4 },
      { row: 2, col: 5 },
      { row: 3, col: 4 },
    ]);
    expect(canonicalizeCells(messy)).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
    ]);
  });

  it('rotateCells90CW matches rotateCells(..., 90) cell-for-cell', () => {
    const cells: Cell[] = [
      { row: 0, col: 1 },
      { row: 2, col: 0 },
    ];
    expect(rotateCells90CW(cells)).toEqual(rotateCells(cells, 90));
  });

  it('non-empty getBoundingBox / getBounds / getCenterOfMass / centerCells', () => {
    const cells: Cell[] = [
      { row: 1, col: 2 },
      { row: 1, col: 3 },
      { row: 2, col: 2 },
    ];
    expect(getBoundingBox(cells)).toEqual({
      width: 2,
      height: 2,
      minRow: 1,
      minCol: 2,
    });
    expect(getBounds(cells)).toEqual({
      minRow: 1,
      maxRow: 2,
      minCol: 2,
      maxCol: 3,
      width: 2,
      height: 2,
    });
    expect(getCenterOfMass(cells)).toEqual({
      row: (1 + 1 + 2) / 3,
      col: (2 + 3 + 2) / 3,
    });
    // centerCells offsets by floor(height/2)+minRow / floor(width/2)+minCol.
    expect(centerCells(cells)).toEqual([
      { row: -1, col: -1 },
      { row: -1, col: 0 },
      { row: 0, col: -1 },
    ]);
  });

  it('translateCells Cell-object overload shifts by offset.row/col', () => {
    const cells: Cell[] = [
      { row: 0, col: 1 },
      { row: 2, col: -1 },
    ];
    expect(translateCells(cells, { row: 3, col: 4 })).toEqual([
      { row: 3, col: 5 },
      { row: 5, col: 3 },
    ]);
  });

  it('getAllOrientations with canRotate=true explores the rotation orbit', () => {
    const free = shapeOf('free-L', CHIRAL_L, {
      canRotate: true,
      canFlip: true,
    });
    const orients = getAllOrientations(free);
    // CURRENT: L tromino free rotate×flip collapses to 4 unique keys
    // (flip orbit is absorbed into the rotation set under normalize).
    expect(orients).toHaveLength(4);
    expect(new Set(orients.map((o) => cellsToKey(o))).size).toBe(4);
  });

  it('areCellsConnected BFS revisit continue on a 2×2 square', () => {
    // Square queues shared neighbors twice → hits visited.has continue.
    const square: Cell[] = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ];
    expect(areCellsConnected(square)).toBe(true);
  });

  it('flip then rotate via wrappers matches free transformCells(…, 90, true)', () => {
    const T = getShapeById('T', TETROMINOES)!;
    const viaWrappers = rotatePolyomino(flipPolyomino(T));
    expect(cellsToKey(viaWrappers.cells)).toBe(
      cellsToKey(transformCells(T.cells, 90, true))
    );
  });
});
