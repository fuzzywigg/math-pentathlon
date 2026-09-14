/**
 * Wave 52 — Kings checkerboard light/dark leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderBoard } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 kings — checkerboard', () => {
  it('applies cell-light and cell-dark by parity', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderBoard(createInitialGameState(), container);
    expect(
      container
        .querySelector('.cell[data-row="1"][data-col="1"]')
        ?.classList.contains('cell-light')
    ).toBe(true);
    expect(
      container
        .querySelector('.cell[data-row="1"][data-col="2"]')
        ?.classList.contains('cell-dark')
    ).toBe(true);
  });
});
