/**
 * Wave 58 leftover after #267 — Prime owned Blue prime aria.
 * Distinct from wave50 owner class leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { renderBoard } from '../../src/games/prime-gold/board-ui';

describe('Wave 58 prime — owned Blue aria', () => {
  it('announces 2, Blue, prime after owner mutate', () => {
    const state = createInitialState();
    let key: string | null = null;
    for (const [k, cell] of state.cells) {
      if (cell.value === 2) {
        key = k;
        state.cells.set(k, { ...cell, owner: 'player1' });
        break;
      }
    }
    expect(key).toBeTruthy();
    const el = renderBoard(state, () => undefined);
    expect(el.querySelector('.pg-cell[data-value="2"]')?.getAttribute('aria-label')).toBe(
      '2, Blue, prime'
    );
  });
});
