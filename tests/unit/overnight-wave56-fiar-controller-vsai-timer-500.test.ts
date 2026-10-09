/**
 * Wave 56 leftover after #255/#256 — FIAR vsAI 500ms place handoff. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fiarAiClient from '../../src/games/fiar/ai-client';
import {
  initGame,
  newGameVsAI,
  newGameVsHuman,
  destroyGame,
  getCurrentState,
} from '../../src/games/fiar/game-controller';

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllTimers();
});

afterEach(() => {
  // Invalidate in-flight AI generation + drop mounts before clearing timers.
  try {
    newGameVsHuman();
  } catch {
    // controller may not be mounted
  }
  destroyGame();
  vi.clearAllTimers();
  vi.useRealTimers();
  // Targeted only — restoreAllMocks tears down hoisted vi.mock on unit-shared.
  const rnd = Math.random as unknown as { mockRestore?: () => void };
  rnd.mockRestore?.();
  const ai = fiarAiClient.getAIMoveAsync as unknown as {
    mockRestore?: () => void;
  };
  ai.mockRestore?.();
  vi.clearAllMocks();
  document.body.innerHTML = '';
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 56 fiar — vsAI 500ms timer', () => {
  it('after P1 place, AI place runs at 500ms via mocked getAIMoveAsync', async () => {
    // Force human (player1) to start — vsAI now picks starter at random
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    vi.spyOn(fiarAiClient, 'getAIMoveAsync').mockResolvedValue({
      type: 'place',
      nodeId: 'c2r1',
      chipKind: 'plain',
    });

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsAI('easy');
    // Human starts — discard any stale AI handoff timers from the shared graph.
    vi.clearAllTimers();
    expect(getCurrentState().currentPlayer).toBe('player1');

    board
      .querySelector('[data-node-id="c3r3"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(getCurrentState().chipsPlaced.player1).toBe(1);
    expect(getCurrentState().chipsPlaced.player2).toBe(0);

    await vi.advanceTimersByTimeAsync(499);
    expect(getCurrentState().chipsPlaced.player2).toBe(0);

    await vi.advanceTimersByTimeAsync(1);
    expect(fiarAiClient.getAIMoveAsync).toHaveBeenCalled();
    expect(getCurrentState().chipsPlaced.player2).toBe(1);
    expect(getCurrentState().board.nodes.get('c2r1')?.chip).toBe('player2');
    expect(getCurrentState().currentPlayer).toBe('player1');
  });
});
