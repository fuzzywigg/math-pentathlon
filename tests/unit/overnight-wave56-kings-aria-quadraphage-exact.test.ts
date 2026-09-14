/**
 * Wave 56 leftover after #256 — Kings Quadraphage aria-label exact. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  createInitialGameState,
  selectKing,
  moveKing,
  placeQuadraphage,
} from '../../src/games/kings-quadraphages/game-state';
import { renderBoard } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 kings — quad aria', () => {
  it('B2 Player 1 Quadraphage after place', () => {
    const moved = moveKing(selectKing(createInitialGameState()), { row: 2, col: 5 });
    const placed = placeQuadraphage(moved, { row: 2, col: 2 });
    const el = document.createElement('div');
    renderBoard(placed, el);
    expect(
      el.querySelector('.cell[data-row="2"][data-col="2"]')?.getAttribute('aria-label')
    ).toBe('B2, Player 1 Quadraphage');
  });
});
