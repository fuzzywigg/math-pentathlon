/**
 * FIAR — opening AI-seat timer must be tracked so destroyGame/remount
 * cannot leave a stale setTimeout that starts aiTurn after teardown.
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

describe('FIAR input-race — opening AI timer vs destroy/remount', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('fiar-styles')?.remove();
    vi.useFakeTimers();
  });

  afterEach(() => {
    try {
      newGameVsHuman();
    } catch {
      // controller may already be torn down
    }
    destroyGame();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
    document.getElementById('fiar-styles')?.remove();
  });

  it('destroyGame cancels the opening AI timer when Red starts', async () => {
    // Force computer (player2) to start
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    const aiSpy = vi.spyOn(fiarAiClient, 'getAIMoveAsync').mockResolvedValue({
      type: 'place',
      nodeId: 'c2r1',
      chipKind: 'plain',
    });

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsAI('easy');
    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(getCurrentState().chipsPlaced.player2).toBe(0);

    destroyGame();

    await vi.advanceTimersByTimeAsync(500);
    expect(aiSpy).not.toHaveBeenCalled();
    expect(getCurrentState().chipsPlaced.player2).toBe(0);
  });

  it('remount after AI-start does not let a stale opening timer place', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    const aiSpy = vi.spyOn(fiarAiClient, 'getAIMoveAsync').mockResolvedValue({
      type: 'place',
      nodeId: 'c2r1',
      chipKind: 'plain',
    });

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsAI('easy');
    expect(getCurrentState().currentPlayer).toBe('player2');

    destroyGame();

    // Fresh human-start game on remount
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    initGame(board, status);
    newGameVsAI('easy');
    expect(getCurrentState().currentPlayer).toBe('player1');
    expect(getCurrentState().chipsPlaced.player2).toBe(0);

    // Former opening delay — must not fire a stale AI place
    await vi.advanceTimersByTimeAsync(500);
    expect(getCurrentState().chipsPlaced.player2).toBe(0);
    expect(getCurrentState().currentPlayer).toBe('player1');
    // Only a human place should arm the (tracked) AI handoff later
    expect(aiSpy).not.toHaveBeenCalled();
  });
});
