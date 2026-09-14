/**
 * Overnight HEAVY leftover after #229 — Pent placed piece rects + shape label. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { renderBoard } from '../../src/games/pent-em-in/board-ui';

describe('Wave 50 pent — placed piece', () => {
  it('draws placed-pieces rects and first-cell shape label', () => {
    const state = createInitialState();
    state.placedPieces = [
      {
        id: 'p1-I5',
        shapeId: 'I5',
        player: 'player1',
        position: { row: 0, col: 0 },
        rotation: 0,
        flipped: false,
        cells: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 0, col: 2 },
          { row: 0, col: 3 },
          { row: 0, col: 4 },
        ],
      },
    ];
    const svg = renderBoard(state, () => undefined, () => undefined);
    expect(svg.querySelectorAll('.placed-pieces rect').length).toBe(5);
    expect(svg.querySelector('.placed-pieces text')?.textContent).toBe('I5');
  });
});
