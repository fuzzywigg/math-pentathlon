/**
 * Wave 56 leftover after #255/#256 — FIAR vsAI 500ms place handoff. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import * as fiarAi from '../../src/games/fiar/ai';
import {
  initGame,
  newGameVsAI,
  getCurrentState,
} from '../../src/games/fiar/game-controller';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 56 fiar — vsAI 500ms timer', () => {
  it('after P1 place, AI place runs at 500ms via mocked getAIMove', () => {
    vi.useFakeTimers();
    vi.spyOn(fiarAi, 'getAIMove').mockReturnValue({
      type: 'place',
      nodeId: '0-0',
    });

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsAI('easy');

    board
      .querySelector('[data-node-id="2-2"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(getCurrentState().chipsPlaced.player1).toBe(1);
    expect(getCurrentState().chipsPlaced.player2).toBe(0);

    vi.advanceTimersByTime(499);
    expect(getCurrentState().chipsPlaced.player2).toBe(0);

    vi.advanceTimersByTime(1);
    expect(fiarAi.getAIMove).toHaveBeenCalled();
    expect(getCurrentState().chipsPlaced.player2).toBe(1);
    expect(getCurrentState().board.nodes.get('0-0')?.chip).toBe('player2');
    expect(getCurrentState().currentPlayer).toBe('player1');
  });
});
