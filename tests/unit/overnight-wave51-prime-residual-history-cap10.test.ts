/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — Prime Gold history cap-10 + newest-first.
 * Distinct from wave50 empty+single entry. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { renderMoveHistory } from '../../src/games/prime-gold/board-ui';

describe('Wave 51 prime residual — history cap 10', () => {
  it('shows at most 10 items with newest first', () => {
    const moves = Array.from({ length: 12 }, (_, i) => ({
      player: (i % 2 === 0 ? 'player1' : 'player2') as 'player1' | 'player2',
      dice: { die1: 1, die2: 2, die3: 3 },
      expression: `expr-${i}`,
      result: i + 1,
      row: 0,
      col: 0,
    }));
    const el = renderMoveHistory({
      ...createInitialState(),
      moveHistory: moves,
    });
    const items = [...el.querySelectorAll('.pg-move-item')];
    expect(items.length).toBe(10);
    expect(items[0].textContent ?? '').toMatch(/expr-11/);
    expect(items[9].textContent ?? '').toMatch(/expr-2/);
    expect(el.textContent ?? '').not.toMatch(/expr-0/);
    expect(el.textContent ?? '').not.toMatch(/expr-1(?!\d)/);
  });
});
