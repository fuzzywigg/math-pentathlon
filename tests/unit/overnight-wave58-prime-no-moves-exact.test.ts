/**
 * Wave 58 leftover after #267 — Prime exact No valid moves - pass turn.
 * Distinct from wave50 soft regex leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { renderExpressions } from '../../src/games/prime-gold/board-ui';

describe('Wave 58 prime — no moves exact', () => {
  it('full-owned board yields exact pass-turn copy', () => {
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
    const line = [...el.querySelectorAll('div')].find((d) =>
      (d.textContent ?? '').includes('No valid moves')
    );
    expect(line?.textContent).toBe('No valid moves - pass turn');
  });
});
