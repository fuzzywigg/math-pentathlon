/**
 * Wave 57 leftover after #257 — FIAR movement-phase vsAI 500ms handoff. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import * as fiarAiClient from '../../src/games/fiar/ai-client';
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
  s.moveHistory = [];
}

describe('Wave 57 fiar — movement AI timer 500', () => {
  it('after P1 move, AI move runs at 500ms via mocked getAIMoveAsync', async () => {
    vi.useFakeTimers();
    vi.spyOn(fiarAiClient, 'getAIMoveAsync').mockResolvedValue({
      type: 'move',
      from: 'c2r5',
      to: 'c2r4',
    });

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsAI('easy');
    forgeMovement();

    board
      .querySelector('[data-node-id="c2r1"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    board
      .querySelector('[data-node-id="c2r2"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(getCurrentState().board.nodes.get('c2r2')?.chip).toBe('player1');
    expect(getCurrentState().board.nodes.get('c2r5')?.chip).toBe('player2');

    await vi.advanceTimersByTimeAsync(499);
    expect(getCurrentState().board.nodes.get('c2r5')?.chip).toBe('player2');
    expect(getCurrentState().board.nodes.get('c2r4')?.chip).toBeNull();

    await vi.advanceTimersByTimeAsync(1);
    expect(fiarAiClient.getAIMoveAsync).toHaveBeenCalled();
    expect(getCurrentState().board.nodes.get('c2r5')?.chip).toBeNull();
    expect(getCurrentState().board.nodes.get('c2r4')?.chip).toBe('player2');
    expect(getCurrentState().currentPlayer).toBe('player1');
  });
});
