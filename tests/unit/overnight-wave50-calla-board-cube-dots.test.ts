/**
 * Overnight HEAVY leftover — Calla pit cube dots vs count-only for >6.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Overnight wave50 calla — cube dots', () => {
  it('draws dots for 1–6 cubes and skips the cluster above 6', () => {
    const opening = document.createElement('div');
    renderBoard(createInitialState(), opening);
    const p1Zero = opening.querySelector(
      '.calla-pit[data-side="player1"][data-pit-index="0"]'
    );
    expect(p1Zero?.querySelectorAll('.calla-cube').length).toBe(3);
    expect(p1Zero?.querySelector('.calla-pit-count')?.textContent).toBe('3');

    const crowded = document.createElement('div');
    renderBoard(
      {
        ...createInitialState(),
        player1Pits: [7, 1, 0, 6, 2],
      },
      crowded
    );
    const seven = crowded.querySelector(
      '.calla-pit[data-side="player1"][data-pit-index="0"]'
    );
    const one = crowded.querySelector(
      '.calla-pit[data-side="player1"][data-pit-index="1"]'
    );
    const six = crowded.querySelector(
      '.calla-pit[data-side="player1"][data-pit-index="3"]'
    );
    expect(seven?.querySelectorAll('.calla-cube').length).toBe(0);
    expect(seven?.querySelector('.calla-pit-count')?.textContent).toBe('7');
    expect(one?.querySelectorAll('.calla-cube').length).toBe(1);
    expect(six?.querySelectorAll('.calla-cube').length).toBe(6);
  });
});
