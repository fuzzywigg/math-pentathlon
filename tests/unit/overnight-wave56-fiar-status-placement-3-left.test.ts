/**
 * Wave 56 leftover after #255/#256 — FIAR placement status after full seat cycle. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  getCurrentState,
} from '../../src/games/fiar/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 56 fiar — placement (3 left)', () => {
  it('Blue second turn shows 3 left after both seats placed once', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.appendChild(board);
    document.body.appendChild(status);
    initGame(board, status);

    board
      .querySelector('[data-node-id="0-0"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    board
      .querySelector('[data-node-id="0-1"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(getCurrentState().chipsPlaced.player1).toBe(1);
    expect(getCurrentState().chipsPlaced.player2).toBe(1);
    expect(getCurrentState().currentPlayer).toBe('player1');
    expect(status.querySelector('.fiar-status')?.textContent).toMatch(
      /Blue's turn: Place a chip \(3 left\)/
    );
    expect(status.textContent).toMatch(/Blue: 1\/4/);
    expect(status.textContent).toMatch(/Red: 1\/4/);
  });
});
