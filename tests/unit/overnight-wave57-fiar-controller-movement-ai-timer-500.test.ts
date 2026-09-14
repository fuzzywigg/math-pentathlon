/**
 * Wave 57 leftover after #257 — FIAR movement-phase vsAI 500ms handoff. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import * as fiarAi from '../../src/games/fiar/ai';
import {
  initGame,
  newGameVsAI,
  getCurrentState,
} from '../../src/games/fiar/game-controller';
import { CONFIG } from '../../src/games/fiar/types';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
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

describe('Wave 57 fiar — movement AI timer 500', () => {
  it('after P1 move, AI move runs at 500ms via mocked getAIMove', () => {
    vi.useFakeTimers();
    vi.spyOn(fiarAi, 'getAIMove').mockReturnValue({
      type: 'move',
      from: '4-0',
      to: '3-0',
    });

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsAI('easy');
    forgeMovement();

    board
      .querySelector('[data-node-id="0-0"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    board
      .querySelector('[data-node-id="1-0"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(getCurrentState().board.nodes.get('1-0')?.chip).toBe('player1');
    expect(getCurrentState().board.nodes.get('4-0')?.chip).toBe('player2');

    vi.advanceTimersByTime(499);
    expect(getCurrentState().board.nodes.get('4-0')?.chip).toBe('player2');
    expect(getCurrentState().board.nodes.get('3-0')?.chip).toBeNull();

    vi.advanceTimersByTime(1);
    expect(fiarAi.getAIMove).toHaveBeenCalled();
    expect(getCurrentState().board.nodes.get('4-0')?.chip).toBeNull();
    expect(getCurrentState().board.nodes.get('3-0')?.chip).toBe('player2');
    expect(getCurrentState().currentPlayer).toBe('player1');
  });
});
