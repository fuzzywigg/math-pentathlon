/**
 * Wave 57 leftover after #263 — Kings P2 Quadraphage aria exact. Tests-only.
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

describe('Wave 57 kings — P2 quad aria', () => {
  it('Player 2 Quadraphage after P2 place', () => {
    let s = createInitialGameState();
    s = placeQuadraphage(moveKing(selectKing(s), { row: 2, col: 5 }), {
      row: 2,
      col: 2,
    });
    s = placeQuadraphage(moveKing(selectKing(s), { row: 8, col: 5 }), {
      row: 8,
      col: 3,
    });
    const el = document.createElement('div');
    renderBoard(s, el);
    expect(
      el.querySelector('.cell[data-row="8"][data-col="3"]')?.getAttribute('aria-label')
    ).toBe('C8, Player 2 Quadraphage');
  });
});
