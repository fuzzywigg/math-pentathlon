/**
 * Wave 57 leftover after #267 — Pent occupied cell aria Red owner.
 * Distinct from wave56 Blue occupied leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { renderBoard } from '../../src/games/pent-em-in/board-ui';

describe('Wave 57 pent — occupied aria Red', () => {
  it('announces 0,0, Red on player2 occupied interaction cell', () => {
    const state = createInitialState();
    state.placedPieces = [
      {
        id: 'p2-I5',
        shapeId: 'I5',
        player: 'player2',
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
    const cell = svg.querySelector(
      '.interaction [data-row="0"][data-col="0"]'
    )!;
    expect(cell.getAttribute('aria-label')).toBe('0,0, Red');
  });
});
