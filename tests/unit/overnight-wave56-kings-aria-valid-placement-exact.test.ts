/**
 * Wave 56 leftover after #256 — Kings place-phase valid placement aria. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  createInitialGameState,
  selectKing,
  moveKing,
} from '../../src/games/kings-quadraphages/game-state';
import { renderBoard } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 kings — placement aria', () => {
  it('empty A1 includes valid placement in place phase', () => {
    const moved = moveKing(selectKing(createInitialGameState()), { row: 2, col: 5 });
    const el = document.createElement('div');
    renderBoard(moved, el);
    expect(
      el.querySelector('.cell[data-row="1"][data-col="1"]')?.getAttribute('aria-label')
    ).toBe('A1, empty, valid placement');
  });
});
