/**
 * Wave 55 leftover after #250 — Kings exact aria-labels for king / empty / valid move. Tests-only.
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

describe('Wave 55 kings — aria labels', () => {
  it('E1 King, A1 empty, selected dest includes valid move', () => {
    const el = document.createElement('div');
    renderBoard(createInitialGameState(), el);
    expect(
      el.querySelector('.cell[data-row="1"][data-col="5"]')?.getAttribute('aria-label')
    ).toBe('E1, Player 1 King');
    expect(
      el.querySelector('.cell[data-row="1"][data-col="1"]')?.getAttribute('aria-label')
    ).toBe('A1, empty');
    renderBoard(selectKing(createInitialGameState()), el);
    expect(
      el.querySelector('.cell[data-row="2"][data-col="5"]')?.getAttribute('aria-label')
    ).toBe('E2, empty, valid move');
  });
});
