/**
 * Wave 57 leftover after #257 — FIAR status DOM seat class. Tests-only.
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

describe('Wave 57 fiar — status seat class', () => {
  it('opening player1; after place flips to player2', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);

    expect(status.querySelector('.fiar-status.player1')).toBeTruthy();
    expect(status.querySelector('.fiar-status.player2')).toBeNull();

    board
      .querySelector('[data-node-id="2-2"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(status.querySelector('.fiar-status.player2')).toBeTruthy();
    expect(status.querySelector('.fiar-status.player1')).toBeNull();
  });
});
