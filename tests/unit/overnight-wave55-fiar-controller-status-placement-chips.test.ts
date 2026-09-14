/**
 * Wave 55 leftover after #249/#250 — FIAR placement status + chips-info copy. Tests-only.
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

describe('Wave 55 fiar — placement status chips', () => {
  it('opening status lists Blue place remaining; place flips seat and count', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.appendChild(board);
    document.body.appendChild(status);
    initGame(board, status);

    expect(status.querySelector('.fiar-status')?.textContent).toMatch(
      /Blue's turn: Place a chip \(4 left\)/
    );
    expect(status.textContent).toMatch(/Blue: 0\/4/);
    expect(status.textContent).toMatch(/Red: 0\/4/);

    const node = board.querySelector('[data-node-id="2-2"]');
    expect(node).toBeTruthy();
    node!.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(getCurrentState().chipsPlaced.player1).toBe(1);
    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(status.querySelector('.fiar-status')?.textContent).toMatch(
      /Red's turn: Place a chip \(4 left\)/
    );
    expect(status.textContent).toMatch(/Blue: 1\/4/);
  });
});
