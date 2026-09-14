/**
 * Overnight HEAVY leftover — Calla store active class follows current seat.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Overnight wave50 calla — store-active', () => {
  it('activates only the current player store', () => {
    const p1 = document.createElement('div');
    renderBoard(createInitialState(), p1);
    expect(p1.querySelector('.calla-store-p1.calla-store-active')).toBeTruthy();
    expect(p1.querySelector('.calla-store-p2.calla-store-active')).toBeNull();
    expect(p1.querySelector('.calla-store-p1 .calla-store-count')?.textContent).toBe(
      '0'
    );

    const p2 = document.createElement('div');
    renderBoard(
      { ...createInitialState(), currentPlayer: 'player2', player2Calla: 4 },
      p2
    );
    expect(p2.querySelector('.calla-store-p2.calla-store-active')).toBeTruthy();
    expect(p2.querySelector('.calla-store-p1.calla-store-active')).toBeNull();
    expect(p2.querySelector('.calla-store-p2 .calla-store-count')?.textContent).toBe(
      '4'
    );
  });
});
