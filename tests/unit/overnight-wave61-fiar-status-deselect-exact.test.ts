/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — FIAR deselect status exact.
 * Wave55 uses toMatch; deepen exact deselect copy leftover. Tests-only.
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

describe('Wave 61 fiar — status deselect exact', () => {
  it('selected movement status is exact deselect copy', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    forgeMovement();
    board.querySelector('[data-node-id="c2r1"]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(status.querySelector('.fiar-status')?.textContent?.trim()).toBe(
      "Blue's turn: Move phase — Click a green node to move, or click chip again to deselect"
    );
    expect(
      status.querySelector('.fiar-phase-banner[data-phase="movement"]')
        ?.textContent?.trim()
    ).toBe('Move phase');
  });
});
