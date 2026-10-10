/**
 * q-mp-525 — Characterize `polyomino/transform` soft-fail residuals (tests-only).
 *
 * Live tip re-measure @ `cursor/mp-tip-post949` (`18ee1c96`):
 *   `transform.ts` **519** LOC / **4** dedicated `*transform*` files before this
 *     suite (**36** `it`/`test`); overlay nnnull residual **5** (clear owned by
 *     undrafted `345` — do not clear here). Coverage under existing
 *     `*transform*` + `*polyomino*` suites: stmts/lines/funcs/branches **100%**
 *     — soft-fail residual value is contract ownership, not hole-filling.
 *   Backlog stamp “tip post914 / 4 test-name matches” is stale on post949;
 *     tip already carries folded `q-mp-354` edge char + burn/overnight suites.
 *
 * Ownership (leave alone; do not edit product / competing suites):
 *   Undrafted `345` — nnnull transform clear; leave **contained**
 *   `#950` / `#847` / q-mp-473 / q-mp-354 — polyomino-ui / transform edge char;
 *     leave open **contained** (no comments/labels/closes per worker brief)
 *   `#988` / q-mp-526 — deferred transform residual pins to this ticket
 *   Placement / legal-move (`placement.ts`, undrafted `405` / `#921`/`449`) —
 *     do not edit
 *
 * This suite owns soft-fail residual contracts still thin after those:
 *   source keep-sites (empty early-returns, rotate default, flag soft-omits,
 *   nnnull ×5), empty-input soft-returns, canFlip/canRotate soft-omits,
 *   free-vs-gated API divergence, documented quirks (forged rotation /
 *   missing colOffset NaN / duplicate-cell connected false).
 *
 * Constraints: tests only; zero `src/` edits; pin CURRENT behavior only
 * (document surprises — never “fix”); no nnnull clear; no placement.ts;
 * no AI / rules / scoring / copy / aria pins; Hex Hard 450ms; no network;
 * no ratchet JSON.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  areCellsConnected,
  areCellsInBounds,
  arePolyominoesEquivalent,
  cellsToKey,
  centerCells,
  getAbsoluteCells,
  getAllOrientations,
  getBoundingBox,
  getBounds,
  getCellsAtPosition,
  getCenterOfMass,
  getTransformedCells,
  getTransformedPolyomino,
  nextRotation,
  normalizeCells,
  prevRotation,
  rotateCells,
  transformCells,
  translateCells,
} from '../../src/core/polyomino/transform';
import {
  TETROMINOES,
  getPolyominoesByOrder,
  type Cell,
  type PolyominoShape,
  type Rotation,
} from '../../src/core/polyomino/types';

const TRANSFORM_SRC = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../../src/core/polyomino/transform.ts'
  ),
  'utf8'
);

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
// 1. Source soft-fail keep-sites
// =============================================================================

describe('q-mp-525 polyomino/transform — source soft-fail keep-sites', () => {
  it('keeps empty-input soft-return arms (normalize / bbox / bounds / COM / connected)', () => {
    expect(TRANSFORM_SRC).toMatch(
      /if\s*\(\s*cells\.length\s*===\s*0\s*\)\s*\{\s*return\s*\[\];/
    );
    expect(TRANSFORM_SRC).toMatch(
      /if\s*\(\s*cells\.length\s*===\s*0\s*\)\s*\{\s*return\s*\{\s*width:\s*0/
    );
    expect(TRANSFORM_SRC).toMatch(
      /if\s*\(\s*cells\.length\s*===\s*0\s*\)\s*\{\s*return\s*\{\s*row:\s*0,\s*col:\s*0/
    );
    expect(TRANSFORM_SRC).toMatch(
      /if\s*\(\s*cells\.length\s*===\s*0\s*\)\s*\{\s*return\s*\{\s*minRow:\s*0/
    );
    expect(TRANSFORM_SRC).toMatch(
      /if\s*\(\s*cells\.length\s*<=\s*1\s*\)\s*\{\s*return\s*true;/
    );
  });

  it('keeps rotateCells identity + default soft-copy arms', () => {
    expect(TRANSFORM_SRC).toMatch(
      /if\s*\(\s*rotation\s*===\s*0\s*\)\s*\{\s*return\s*cells\.map/
    );
    expect(TRANSFORM_SRC).toMatch(/default:\s*return\s*\{\s*\.\.\.cell\s*\};/);
  });

  it('keeps canFlip / canRotate flag soft-omit gates in getTransformedCells', () => {
    expect(TRANSFORM_SRC).toMatch(
      /if\s*\(\s*flipped\s*&&\s*shape\.canFlip\s*\)/
    );
    expect(TRANSFORM_SRC).toMatch(/if\s*\(\s*shape\.canRotate\s*\)/);
  });

  it('keeps exactly five nnnull soft-fail sites (clear owned by undrafted 345)', () => {
    // Overlay residual **5** — do not clear here.
    expect(TRANSFORM_SRC).toMatch(/colOffset!/);
    expect(TRANSFORM_SRC).toMatch(/rotations\[\(index \+ 1\) % 4]!/);
    expect(TRANSFORM_SRC).toMatch(/rotations\[\(index \+ 3\) % 4]!/);
    expect(TRANSFORM_SRC).toMatch(/cells\[0]!/);
    expect(TRANSFORM_SRC).toMatch(/queue\.shift\(\)!/);
    // Sanity: eslint densest-file count stays 5 (no accidental sixth).
    const assertionBang = TRANSFORM_SRC.match(
      /(?:colOffset!|cells\[0]!|shift\(\)!|% 4]!)/g
    );
    expect(assertionBang).not.toBeNull();
    expect(assertionBang!.length).toBe(5);
  });

  it('keeps unequal-length short-circuit in arePolyominoesEquivalent', () => {
    expect(TRANSFORM_SRC).toMatch(
      /if\s*\(\s*a\.cells\.length\s*!==\s*b\.cells\.length\s*\)\s*\{\s*return\s*false;/
    );
  });
});

// =============================================================================
// 2. Empty-input soft-return residuals
// =============================================================================

describe('q-mp-525 polyomino/transform — empty-input soft-returns', () => {
  it('normalizeCells / centerCells / flip-path empties soft-return []', () => {
    expect(normalizeCells([])).toEqual([]);
    expect(centerCells([])).toEqual([]);
    expect(rotateCells([], 90)).toEqual([]);
    expect(translateCells([], { row: 1, col: 2 })).toEqual([]);
  });

  it('getBoundingBox / getBounds empty soft-return zero dimensions at origin', () => {
    expect(getBoundingBox([])).toEqual({
      width: 0,
      height: 0,
      minRow: 0,
      minCol: 0,
    });
    expect(getBounds([])).toEqual({
      minRow: 0,
      maxRow: 0,
      minCol: 0,
      maxCol: 0,
      width: 0,
      height: 0,
    });
  });

  it('getCenterOfMass empty soft-returns origin; connected ≤1 soft-returns true', () => {
    expect(getCenterOfMass([])).toEqual({ row: 0, col: 0 });
    expect(areCellsConnected([])).toBe(true);
    expect(areCellsConnected([{ row: 9, col: -4 }])).toBe(true);
  });

  it('areCellsInBounds([]) soft-returns true for any non-negative grid size', () => {
    expect(areCellsInBounds([], 0, 0)).toBe(true);
    expect(areCellsInBounds([], 3, 5)).toBe(true);
  });
});

// =============================================================================
// 3. Flag soft-omit + free/gated API divergence
// =============================================================================

describe('q-mp-525 polyomino/transform — flag soft-omit residuals', () => {
  it('canFlip=false soft-omits flip in getTransformedCells; free transformCells applies', () => {
    const locked = shapeOf('no-flip-L', CHIRAL_L, {
      canRotate: true,
      canFlip: false,
    });
    const gated = cellsToKey(getTransformedCells(locked, 0, true));
    const free = cellsToKey(transformCells(locked.cells, 0, true));
    expect(gated).toBe(cellsToKey(normalizeCells(CHIRAL_L)));
    expect(gated).not.toBe(free);
  });

  it('canRotate=false soft-omits rotation in getTransformedCells; free APIs still rotate', () => {
    const locked = shapeOf('no-rot-L', CHIRAL_L, {
      canRotate: false,
      canFlip: true,
    });
    const gated = cellsToKey(getTransformedCells(locked, 90, false));
    const free = cellsToKey(transformCells(locked.cells, 90, false));
    const viaPoly = cellsToKey(
      getTransformedPolyomino(locked, 90, false).cells
    );
    expect(gated).toBe(cellsToKey(normalizeCells(CHIRAL_L)));
    expect(gated).not.toBe(free);
    expect(viaPoly).toBe(free);
  });

  it('getAbsoluteCells ignores flags; getCellsAtPosition honors canFlip soft-omit', () => {
    const locked = shapeOf('abs-vs-pos', CHIRAL_L, {
      canRotate: true,
      canFlip: false,
    });
    const pos = { row: 1, col: 4 };
    const absFlipped = cellsToKey(getAbsoluteCells(locked, pos, 0, true));
    const gatedFlipped = cellsToKey(getCellsAtPosition(locked, pos, 0, true));
    const absPlain = cellsToKey(getAbsoluteCells(locked, pos, 0, false));
    expect(absFlipped).not.toBe(gatedFlipped);
    expect(gatedFlipped).toBe(absPlain);
  });

  it('getAllOrientations: canRotate false soft-omits rotation orbit (flip-only)', () => {
    const chiral = shapeOf('flip-only-L', CHIRAL_L, {
      canRotate: false,
      canFlip: true,
    });
    const orients = getAllOrientations(chiral);
    expect(orients).toHaveLength(2);
    const keys = orients.map((o) => cellsToKey(o));
    expect(new Set(keys).size).toBe(2);
    expect(keys).toContain(cellsToKey(normalizeCells(CHIRAL_L)));
  });

  it('both flags false soft-collapses getAllOrientations to a single normalized shape', () => {
    const frozen = shapeOf('frozen-L', CHIRAL_L, {
      canRotate: false,
      canFlip: false,
    });
    const orients = getAllOrientations(frozen);
    expect(orients).toHaveLength(1);
    expect(cellsToKey(orients[0]!)).toBe(cellsToKey(normalizeCells(CHIRAL_L)));
  });
});

// =============================================================================
// 4. Rotate default / identity soft-copy residuals
// =============================================================================

describe('q-mp-525 polyomino/transform — rotate soft-copy residuals', () => {
  it('rotation 0 soft-returns a deep copy (identity; not same references)', () => {
    const cells: Cell[] = [
      { row: 0, col: 1 },
      { row: 2, col: 3 },
    ];
    const out = rotateCells(cells, 0);
    expect(out).toEqual(cells);
    expect(out).not.toBe(cells);
    expect(out[0]).not.toBe(cells[0]);
  });

  it('forged non-canonical rotation hits default soft-copy (not rotate math)', () => {
    const cells: Cell[] = [
      { row: 1, col: 0 },
      { row: 0, col: 2 },
    ];
    const out = rotateCells(cells, 135 as Rotation);
    expect(out).toEqual(cells);
    expect(out).not.toBe(cells);
  });
});

// =============================================================================
// 5. Documented quirks (pin current behavior — do not fix)
// =============================================================================

describe('q-mp-525 polyomino/transform — documented quirks (pin, do not fix)', () => {
  it('forged Rotation: next→0 and prev→180 via indexOf(-1) soft wrap', () => {
    // Documented surprise: indexOf(non-canonical) === -1 → modular wrap.
    expect(nextRotation(99 as Rotation)).toBe(0);
    expect(prevRotation(99 as Rotation)).toBe(180);
  });

  it('translateCells dual-number with missing colOffset yields NaN cols', () => {
    // Documented surprise: colOffset! is undefined → row+offset, col+NaN.
    const out = translateCells([{ row: 2, col: 5 }], 1 /* colOffset omitted */);
    expect(out).toHaveLength(1);
    expect(out[0]!.row).toBe(3);
    expect(Number.isNaN(out[0]!.col)).toBe(true);
  });

  it('duplicate cells make areCellsConnected return false (unique BFS vs length)', () => {
    // Documented surprise: visited.size (unique) !== cells.length (with dupes).
    expect(
      areCellsConnected([
        { row: 0, col: 0 },
        { row: 0, col: 0 },
        { row: 0, col: 1 },
      ])
    ).toBe(false);
  });

  it('arePolyominoesEquivalent soft-short-circuits on unequal cell counts', () => {
    const mono = getPolyominoesByOrder(1)[0]!;
    const tetra = TETROMINOES[0]!;
    expect(mono.cells.length).not.toBe(tetra.cells.length);
    expect(arePolyominoesEquivalent(mono, tetra)).toBe(false);
  });

  it('nnnull call-paths still succeed on canonical inputs (345 prerequisite pin)', () => {
    // Structural behavioral pin only — product clear remains undrafted 345.
    expect(translateCells([{ row: 0, col: 0 }], 1, 2)).toEqual([
      { row: 1, col: 2 },
    ]);
    expect(nextRotation(270)).toBe(0);
    expect(prevRotation(0)).toBe(270);
    expect(
      areCellsConnected([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
      ])
    ).toBe(true);
  });
});
