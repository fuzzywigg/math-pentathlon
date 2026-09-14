/**
 * Wave 59 Contig/SD residual — Contig +2 pts plural label. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getAllPossibleResults,
  getAdjacentPositions,
} from '../../src/games/contig-60/types';
import { renderExpressionSelector } from '../../src/games/contig-60/board-ui';

describe('Wave 59 contig — plural +2 pts', () => {
  it('expr-points text is exactly +2 pts for two owned neighbors', () => {
    const base = createInitialState();
    const cells = new Map(base.cells);
    // Own two neighbors of a target cell in the middle of row 0
    const targetCell = cells.get(5)!;
    const adj = getAdjacentPositions(targetCell.row, targetCell.col);
    let owned = 0;
    for (const { row, col } of adj) {
      const v = base.grid[row]?.[col];
      if (v == null) continue;
      const cell = cells.get(v);
      if (!cell || cell.owner) continue;
      cells.set(v, { ...cell, owner: 'player1' });
      owned += 1;
      if (owned >= 2) break;
    }
    expect(owned).toBe(2);

    let dice: [number, number, number] | null = null;
    outer: for (let a = 1; a <= 6; a++) {
      for (let b = 1; b <= 6; b++) {
        for (let c = 1; c <= 6; c++) {
          if (getAllPossibleResults([a, b, c]).some((r) => r.result === 5)) {
            dice = [a, b, c];
            break outer;
          }
        }
      }
    }
    expect(dice).not.toBeNull();
    const el = renderExpressionSelector(
      { ...base, cells, phase: 'calculating', currentDice: dice! },
      () => undefined,
      () => undefined
    );
    const opt = [...el.querySelectorAll('.contig-expr-option')].find(
      (o) => o.querySelector('.expr-result')?.textContent === '5'
    );
    expect(opt?.querySelector('.expr-points')?.textContent).toBe('+2 pts');
  });
});
