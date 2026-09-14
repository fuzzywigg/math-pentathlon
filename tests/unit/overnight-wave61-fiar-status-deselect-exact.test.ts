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

describe('Wave 61 fiar — status deselect exact', () => {
  it('selected movement status is exact deselect copy', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    forgeMovement();
    board.querySelector('[data-node-id="0-0"]')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(status.querySelector('.fiar-status')?.textContent?.trim()).toBe(
      "Blue's turn: Click a green node to move, or click chip again to deselect"
    );
  });
});
