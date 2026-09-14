/**
 * Wave 56 leftover after #255/#256 — FIAR movement destination execute. Tests-only.
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
  s.moveHistory = [];
}

describe('Wave 56 fiar — movement execute', () => {
  it('select then green destination records move with fromNodeId', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    forgeMovement();

    board
      .querySelector('[data-node-id="0-0"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().selectedNode).toBe('0-0');

    board
      .querySelector('[data-node-id="1-0"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const last = getCurrentState().moveHistory.at(-1);
    expect(last?.type).toBe('move');
    expect(last?.fromNodeId).toBe('0-0');
    expect(last?.nodeId).toBe('1-0');
    expect(getCurrentState().board.nodes.get('0-0')?.chip).toBeNull();
    expect(getCurrentState().board.nodes.get('1-0')?.chip).toBe('player1');
    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(getCurrentState().selectedNode).toBeNull();
  });
});
