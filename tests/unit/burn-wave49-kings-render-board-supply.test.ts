/**
 * Wave 49 leftover after #221/#226/#227 — Kings renderBoard 9x9 cells. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderBoard } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 49 kings — renderBoard', () => {
  it('creates 81 cells with king pieces stamped', () => {
    const container = document.createElement('div');
    renderBoard(createInitialGameState(), container);
    const cells = container.querySelectorAll('.board > .cell');
    expect(cells.length).toBe(81);
    expect(container.querySelector('.cell[data-row="1"][data-col="5"]')).toBeTruthy();
  });
});
