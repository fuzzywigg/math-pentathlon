/**
 * Overnight HEAVY leftover after #229 — Prime Gold expressions pass chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { renderExpressions } from '../../src/games/prime-gold/board-ui';

describe('Wave 50 prime — expressions no moves', () => {
  it('shows pass copy when placing with impossible dice', () => {
    // Occupy every reachable value by owning all cells (placements filter empty only).
    const base = createInitialState();
    const cells = new Map(base.cells);
    for (const [k, cell] of cells) {
      cells.set(k, { ...cell, owner: 'player1' });
    }
    const state = {
      ...base,
      cells,
      phase: 'placing' as const,
      diceRoll: { die1: 1, die2: 1, die3: 1 },
    };
    const el = renderExpressions(state, () => undefined);
    expect(el.textContent).toMatch(/No valid moves - pass turn/);
    expect(el.querySelectorAll('.pg-expr-item').length).toBe(0);
  });
});
