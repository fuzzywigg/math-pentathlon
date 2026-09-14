/**
 * Wave 57 leftover after #263 — Kings P2 King aria exact. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderBoard } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 57 kings — P2 king aria', () => {
  it('E9 Player 2 King at opening', () => {
    const el = document.createElement('div');
    renderBoard(createInitialGameState(), el);
    expect(
      el.querySelector('.cell[data-row="9"][data-col="5"]')?.getAttribute('aria-label')
    ).toBe('E9, Player 2 King');
  });
});
