/**
 * Wave 67 leftover after tip/#316 — FIAR draw status exact.
 * Wave55 soft toMatch Draw; lock exact copy leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  getCurrentState,
} from '../../src/games/fiar/game-controller';
import { CONFIG } from '../../src/games/fiar/types';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 67 fiar — controller draw status exact', () => {
  it('jammed movement paints exact Draw copy', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);

    const jammed = getCurrentState();
    for (const [id, n] of jammed.board.nodes) {
      jammed.board.nodes.set(id, { ...n, chip: 'player2' });
    }
    jammed.phase = 'movement';
    jammed.chipsPlaced = {
      player1: CONFIG.CHIPS_PER_PLAYER,
      player2: CONFIG.CHIPS_PER_PLAYER,
    };
    jammed.currentPlayer = 'player1';
    jammed.selectedNode = '2-2';
    jammed.winner = null;

    board.querySelector('[data-node-id="2-2"]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(status.querySelector('.fiar-status')?.textContent?.trim()).toBe(
      'Draw! No valid moves available.'
    );
  });
});
