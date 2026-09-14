/**
 * Wave 51 leftover after #233 — Stars-Bars history entry score copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/stars-bars/rules';
import { renderMoveHistory } from '../../src/games/stars-bars/board-ui';

describe('Wave 51 stars — history entry', () => {
  it('formats Blue shape at (r,C) = +N', () => {
    const base = createInitialState();
    const card = { ...base.playerHands.player1[0], shape: 'hexagon' as const };
    const state = {
      ...base,
      moveHistory: [
        { player: 'player1' as const, row: 0, col: 0, card, score: 4 },
      ],
    };
    const el = renderMoveHistory(state);
    expect(el.querySelector('.stars-move-item.player1')?.textContent).toBe(
      'Blue: hexagon at (1,A) = +4'
    );
  });
});
