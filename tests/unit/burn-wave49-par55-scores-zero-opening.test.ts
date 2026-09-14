/**
 * Wave 49 — Par55 opening zero scores leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { renderScores } from '../../src/games/par-55/board-ui';

describe('Wave 49 par55 — opening scores', () => {
  it('starts both seats at 0', () => {
    const el = renderScores(createInitialState());
    expect(el.querySelector('.player1 .value')?.textContent).toBe('0');
    expect(el.querySelector('.player2 .value')?.textContent).toBe('0');
  });
});
