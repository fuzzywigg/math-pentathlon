/**
 * Overnight HEAVY leftover — Calla P2 pits render right-to-left indices.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Overnight wave50 calla — p2 reverse indices', () => {
  it('DOM-orders P2 pits as 4,3,2,1,0 and P1 as 0..4', () => {
    const el = document.createElement('div');
    renderBoard(
      {
        ...createInitialState(),
        currentPlayer: 'player2',
        player2Pits: [1, 2, 3, 4, 5],
      },
      el
    );
    const p2 = [
      ...el.querySelectorAll('.calla-pit[data-side="player2"]'),
    ].map((n) => n.getAttribute('data-pit-index'));
    const p1 = [
      ...el.querySelectorAll('.calla-pit[data-side="player1"]'),
    ].map((n) => n.getAttribute('data-pit-index'));
    expect(p2).toEqual(['4', '3', '2', '1', '0']);
    expect(p1).toEqual(['0', '1', '2', '3', '4']);
    const valid = el.querySelectorAll('.calla-pit-valid');
    expect(valid.length).toBe(5);
    valid.forEach((n) => expect(n.getAttribute('data-side')).toBe('player2'));
  });
});
