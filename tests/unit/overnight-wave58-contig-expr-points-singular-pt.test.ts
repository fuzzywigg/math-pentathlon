/**
 * Wave 58 Contig/SD residual — Contig +1 pt singular label. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getAllPossibleResults,
  getAdjacentPositions,
} from '../../src/games/contig-60/types';
import { renderExpressionSelector } from '../../src/games/contig-60/board-ui';

describe('Wave 58 contig — singular +1 pt', () => {
  it('expr-points text is exactly +1 pt for one owned neighbor', () => {
    const base = createInitialState();
    const cells = new Map(base.cells);
    const owned = [...cells.values()][10]!;
    cells.set(owned.value, { ...owned, owner: 'player1' });

    const adj = getAdjacentPositions(owned.row, owned.col);
    let target: number | null = null;
    for (const { row, col } of adj) {
      const v = base.grid[row]?.[col];
      if (v !== null && v !== undefined) {
        const cell = cells.get(v);
        if (cell && cell.owner === null) {
          target = v;
          break;
        }
      }
    }
    expect(target).not.toBeNull();

    // Find dice whose catalog includes target
    let dice: [number, number, number] | null = null;
    outer: for (let a = 1; a <= 6; a++) {
      for (let b = 1; b <= 6; b++) {
        for (let c = 1; c <= 6; c++) {
          const results = getAllPossibleResults([a, b, c]);
          if (results.some((r) => r.result === target)) {
            dice = [a, b, c];
            break outer;
          }
        }
      }
    }
    expect(dice).not.toBeNull();

    const el = renderExpressionSelector(
      {
        ...base,
        cells,
        phase: 'calculating',
        currentDice: dice!,
      },
      () => undefined,
      () => undefined
    );
    const opt = [...el.querySelectorAll('.contig-expr-option')].find((o) =>
      o.querySelector('.expr-result')?.textContent === String(target)
    );
    expect(opt?.querySelector('.expr-points')?.textContent).toBe('+1 pt');
  });
});
