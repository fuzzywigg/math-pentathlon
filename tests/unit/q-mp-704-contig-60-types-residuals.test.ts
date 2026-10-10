/**
 * q-mp-704 — Close `contig-60/types` residual gaps (tests-only; 0 src).
 *
 * Tip re-measure (`cursor/mp-tip-post1059` @ `890a9e3f`) with the FULL
 * related verify glob:
 *   `CI=1 npx vitest run --coverage --project unit-shared
 *    tests/unit/*contig*types* tests/unit/*contig*`
 *   → `src/games/contig-60/types.ts`
 *     **93.84%** lines (61/65) / **92.5%** branches (37/40)
 *   Uncovered: **L114** / **L119** (`createBoard` sparse continues) and
 *     **L190–191** (`evaluate` exhaustive `never` default).
 *
 * Backlog stamp (round-25 `q-mp-704`) cited 96.9% / 97.5% (missL=2 /
 * missB=1) — that is the post-sparse-continue residual (never default
 * only). This suite owns the sparse continues under the verify glob and
 * documents the never default as unreachable.
 *
 * Open-draft check: no open draft into `cursor/mp-tip-post1059` covers
 * `contig-60/types` residuals (`#1085` is polyomino/types; leave alone).
 * Serialize note: undrafted `319` no-shadow inventory on same file —
 * tests-only here; no lint/src edits.
 *
 * Constraints: tests only; zero `src/` edits; pin CURRENT behavior only
 * (document surprises — never “fix”); no AI / rules / scoring / legal-move
 * / copy / aria pins; Hex Hard 450ms; no network; no ratchet JSON.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  BOARD_NUMBERS,
  CONFIG,
  createBoard,
} from '../../src/games/contig-60/types';

const TYPES_SRC = readFileSync(
  join(process.cwd(), 'src/games/contig-60/types.ts'),
  'utf8'
);

describe('q-mp-704 contig-60/types — createBoard sparse continues (L114 / L119)', () => {
  it('skips missing numberRows (fewer than GRID_ROWS) without throwing', () => {
    // Exercises `if (numberRow === undefined) continue` at L113–115.
    const short = BOARD_NUMBERS.slice(0, 3);
    const { cells, grid } = createBoard(short);

    expect(grid).toHaveLength(CONFIG.GRID_ROWS);
    expect(grid[0]).toHaveLength(CONFIG.GRID_COLS);
    expect(grid[2]).toHaveLength(CONFIG.GRID_COLS);
    // Missing rows stay as empty arrays allocated before the continue.
    expect(grid[3]).toEqual([]);
    expect(grid[5]).toEqual([]);
    expect(cells.size).toBe(3 * CONFIG.GRID_COLS);
  });

  it('skips missing columns within a short numberRow without throwing', () => {
    // Exercises `if (value === undefined) continue` at L118–120.
    const withShortRow = BOARD_NUMBERS.map((row, rowIndex) =>
      rowIndex === 0 ? row.slice(0, 5) : [...row]
    );
    const { cells, grid } = createBoard(withShortRow);

    expect(grid).toHaveLength(CONFIG.GRID_ROWS);
    expect(grid[0]?.[4]).toBe(BOARD_NUMBERS[0]?.[4]);
    // Columns past the short row are never assigned (sparse hole).
    expect(grid[0]?.[5]).toBeUndefined();
    expect(grid[0]?.[9]).toBeUndefined();
    expect(cells.size).toBe(CONFIG.GRID_ROWS * CONFIG.GRID_COLS - 5);
    const firstCell = BOARD_NUMBERS[0]?.[0];
    const missingCell = BOARD_NUMBERS[0]?.[5];
    expect(firstCell).toBeTypeOf('number');
    expect(missingCell).toBeTypeOf('number');
    expect(cells.has(firstCell as number)).toBe(true);
    expect(cells.has(missingCell as number)).toBe(false);
  });

  it('empty boardNumbers yields GRID_ROWS empty grid rows and zero cells', () => {
    const { cells, grid } = createBoard([]);
    expect(grid).toHaveLength(CONFIG.GRID_ROWS);
    for (const row of grid) {
      expect(row).toEqual([]);
    }
    expect(cells.size).toBe(0);
  });
});

describe('q-mp-704 contig-60/types — evaluate never default documented unreachable', () => {
  it('source keeps never-exhaustive default in evaluate switch', () => {
    // L190–191: TypeScript exhaustiveness on Operator; unreachable via the
    // public API because OPERATORS is a closed `'+'|'-'|'*'|'/ '` const.
    // Acceptance allows documented unreachable in lieu of ≥98% coverage.
    expect(TYPES_SRC).toMatch(
      /case\s+'\/':[\s\S]*?default:\s*\{\s*const _exhaustive:\s*never\s*=\s*op;\s*return _exhaustive;/
    );
  });
});
