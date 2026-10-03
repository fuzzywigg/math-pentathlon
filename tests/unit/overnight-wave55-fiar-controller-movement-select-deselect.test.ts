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
  s.board.nodes.set('c2r1', { ...s.board.nodes.get('c2r1')!, chip: 'player1' });
  s.board.nodes.set('c6r1', { ...s.board.nodes.get('c6r1')!, chip: 'player1' });
  s.board.nodes.set('c2r3', { ...s.board.nodes.get('c2r3')!, chip: 'player1' });
  s.board.nodes.set('c6r3', { ...s.board.nodes.get('c6r3')!, chip: 'player1' });
  s.board.nodes.set('c2r5', { ...s.board.nodes.get('c2r5')!, chip: 'player2' });
  s.board.nodes.set('c6r5', { ...s.board.nodes.get('c6r5')!, chip: 'player2' });
  s.board.nodes.set('c4r1', { ...s.board.nodes.get('c4r1')!, chip: 'player2' });
  s.board.nodes.set('c4r5', { ...s.board.nodes.get('c4r5')!, chip: 'player2' });
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

    board.querySelector('[data-node-id="c2r1"]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(getCurrentState().selectedNode).toBe('c2r1');
    expect(status.querySelector('.fiar-status')?.textContent).toMatch(
      /Click a green node/
    );

    board.querySelector('[data-node-id="c2r1"]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(getCurrentState().selectedNode).toBeNull();
    expect(status.querySelector('.fiar-status')?.textContent).toMatch(
      /Select a chip to move/
    );

    board.querySelector('[data-node-id="c2r1"]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    board.querySelector('[data-node-id="c6r1"]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(getCurrentState().selectedNode).toBe('c6r1');

    const hist = getCurrentState().moveHistory.length;
    board.querySelector('[data-node-id="c2r5"]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(getCurrentState().selectedNode).toBe('c6r1');
    expect(getCurrentState().moveHistory.length).toBe(hist);
  });
});
