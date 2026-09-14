/**
 * Wave 49 — Kings cell-last-move class leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderBoard } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => { document.body.innerHTML = ''; });

describe('Wave 49 kings — last-move class', () => {
  it('marks destination of last history entry', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const state = {
      ...createInitialGameState(),
      moveHistory: [
        {
          player: 'player1' as const,
          action: 'placeQuadraphage' as const,
          from: null,
          to: { row: 4, col: 4 },
        },
      ],
    };
    renderBoard(state, container);
    expect(
      container.querySelector('.cell[data-row="4"][data-col="4"]')?.classList.contains('cell-last-move')
    ).toBe(true);
  });
});
