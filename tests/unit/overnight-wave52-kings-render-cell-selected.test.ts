/**
 * Wave 52 — Kings cell-selected leftover. Tests-only.
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

describe('Wave 52 kings — cell-selected', () => {
  it('adds cell-selected on selected king cell', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const state = selectKing(createInitialGameState());
    renderBoard(state, container);
    expect(
      container
        .querySelector('.cell[data-row="1"][data-col="5"]')
        ?.classList.contains('cell-selected')
    ).toBe(true);
  });
});
