/**
 * Wave 52 — Kings cell-valid-move leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  createInitialGameState,
  selectKing,
} from '../../src/games/kings-quadraphages/game-state';
import { renderBoard } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 kings — cell-valid-move', () => {
  it('marks adjacent empty cells as valid move targets', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const state = selectKing(createInitialGameState());
    renderBoard(state, container);
    expect(
      container.querySelectorAll('.cell-valid-move').length
    ).toBeGreaterThan(0);
    expect(
      container
        .querySelector('.cell[data-row="2"][data-col="5"]')
        ?.classList.contains('cell-valid-move')
    ).toBe(true);
  });
});
