/**
 * Wave 55 leftover after #249/#250 — FIAR controller movement select/deselect. Tests-only.
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

function forgeMovement(): void {
  const s = getCurrentState();
  for (const [id, n] of s.board.nodes) {
    s.board.nodes.set(id, { ...n, chip: null });
  }
  s.board.nodes.set('0-0', { ...s.board.nodes.get('0-0')!, chip: 'player1' });
  s.board.nodes.set('0-4', { ...s.board.nodes.get('0-4')!, chip: 'player1' });
  s.board.nodes.set('2-0', { ...s.board.nodes.get('2-0')!, chip: 'player1' });
  s.board.nodes.set('2-4', { ...s.board.nodes.get('2-4')!, chip: 'player1' });
  s.board.nodes.set('4-0', { ...s.board.nodes.get('4-0')!, chip: 'player2' });
  s.board.nodes.set('4-4', { ...s.board.nodes.get('4-4')!, chip: 'player2' });
  s.board.nodes.set('0-2', { ...s.board.nodes.get('0-2')!, chip: 'player2' });
  s.board.nodes.set('4-2', { ...s.board.nodes.get('4-2')!, chip: 'player2' });
  s.phase = 'movement';
  s.chipsPlaced = {
    player1: CONFIG.CHIPS_PER_PLAYER,
    player2: CONFIG.CHIPS_PER_PLAYER,
  };
  s.currentPlayer = 'player1';
  s.selectedNode = null;
  s.winner = null;
}

describe('Wave 55 fiar — movement select deselect', () => {
  it('selects own chip, deselects on re-click, switches to other own chip', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.appendChild(board);
    document.body.appendChild(status);
    initGame(board, status);
    forgeMovement();

    board.querySelector('[data-node-id="0-0"]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(getCurrentState().selectedNode).toBe('0-0');
    expect(status.querySelector('.fiar-status')?.textContent).toMatch(
      /Click a green node/
    );

    board.querySelector('[data-node-id="0-0"]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(getCurrentState().selectedNode).toBeNull();
    expect(status.querySelector('.fiar-status')?.textContent).toMatch(
      /Select a chip to move/
    );

    board.querySelector('[data-node-id="0-0"]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    board.querySelector('[data-node-id="0-4"]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(getCurrentState().selectedNode).toBe('0-4');

    const hist = getCurrentState().moveHistory.length;
    board.querySelector('[data-node-id="4-0"]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(getCurrentState().selectedNode).toBe('0-4');
    expect(getCurrentState().moveHistory.length).toBe(hist);
  });
});
