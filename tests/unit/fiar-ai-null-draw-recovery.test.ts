/**
 * FIAR — AI null-move / draw recovery after worker AI (#381).
 * A null worker reply must not soft-lock the Red seat; Draw chrome must paint.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import * as fiarAiClient from '../../src/games/fiar/ai-client';
import * as fiarAi from '../../src/games/fiar/ai';
import {
  initGame,
  newGameVsAI,
  getCurrentState,
  destroyGame,
} from '../../src/games/fiar/game-controller';
import { CONFIG } from '../../src/games/fiar/types';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  destroyGame();
  document.body.innerHTML = '';
  document.getElementById('fiar-styles')?.remove();
});

function jamMovementForCurrentPlayer(): void {
  const s = getCurrentState();
  for (const [id, n] of s.board.nodes) {
    s.board.nodes.set(id, { ...n, chip: 'player1' });
  }
  // Leave Red with chips but no empty neighbors → no legal moves.
  s.board.nodes.set('c2r5', {
    ...s.board.nodes.get('c2r5')!,
    chip: 'player2',
  });
  s.board.nodes.set('c6r5', {
    ...s.board.nodes.get('c6r5')!,
    chip: 'player2',
  });
  s.phase = 'movement';
  s.chipsPlaced = {
    player1: CONFIG.CHIPS_PER_PLAYER,
    player2: CONFIG.CHIPS_PER_PLAYER,
  };
  s.currentPlayer = 'player2';
  s.selectedNode = null;
  s.winner = null;
}

describe('FIAR AI null / draw recovery', () => {
  it('paints Draw when AI seat has no moves (worker returns null)', async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.9); // AI (player2) starts
    vi.spyOn(fiarAiClient, 'getAIMoveAsync').mockResolvedValue(null);
    vi.spyOn(fiarAi, 'getAIMove').mockReturnValue(null);

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsAI('easy');
    jamMovementForCurrentPlayer();

    await vi.advanceTimersByTimeAsync(500);
    await Promise.resolve();

    expect(status.textContent).toMatch(/Draw! No valid moves available/);
    expect(status.querySelector('.status-ai-thinking')).toBeNull();
  });

  it('falls back to sync getAIMove when the worker returns null mid-game', async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.1); // human starts
    vi.spyOn(fiarAiClient, 'getAIMoveAsync').mockResolvedValue(null);
    const sync = vi.spyOn(fiarAi, 'getAIMove').mockReturnValue({
      type: 'place',
      nodeId: 'c2r1',
      chipKind: 'plain',
    });

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsAI('easy');

    board
      .querySelector('[data-node-id="c3r3"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().currentPlayer).toBe('player2');

    await vi.advanceTimersByTimeAsync(500);
    await Promise.resolve();

    expect(sync).toHaveBeenCalled();
    expect(getCurrentState().board.nodes.get('c2r1')?.chip).toBe('player2');
    expect(getCurrentState().currentPlayer).toBe('player1');
    expect(status.textContent).not.toMatch(/Computer is thinking/);
  });

  it('shows thinking chrome while the AI search is in flight', async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    let resolveMove!: (value: fiarAi.AIMove | null) => void;
    vi.spyOn(fiarAiClient, 'getAIMoveAsync').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveMove = resolve;
        })
    );

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsAI('easy');

    const turnPromise = vi.advanceTimersByTimeAsync(500);
    await Promise.resolve();
    await turnPromise;
    await Promise.resolve();

    expect(status.textContent).toMatch(/Computer is thinking/);
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();

    resolveMove({ type: 'place', nodeId: 'c2r1', chipKind: 'plain' });
    await Promise.resolve();
    await Promise.resolve();

    expect(status.textContent).not.toMatch(/Computer is thinking/);
    expect(getCurrentState().chipsPlaced.player2).toBe(1);
  });
});
