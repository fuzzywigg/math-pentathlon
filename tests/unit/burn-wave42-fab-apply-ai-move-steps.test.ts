/**
 * Wave 42 leftovers B — Fab-a-Diffy applyAIMoveSteps success + pass fallbacks.
 * Rules matrix already wave41; AI steps leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  applyAIMoveSteps,
  executeAITurn,
  getAIMove,
  isAITurn,
  type AIMove,
} from '../../src/games/fab-a-diffy/ai';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 42 fab — applyAIMoveSteps', () => {
  it('valid getAIMove applies through execute and claims answer', () => {
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const next = applyAIMoveSteps(state, move!);
    expect(next).not.toBe(state);
    expect(next.phase).not.toBe('confirmingMove');
    const claimed = [...next.answerBars.values()].some((a) => a.claimedBy);
    expect(claimed).toBe(true);
  });

  it('bogus bar1Id falls back to passTurn (seat flips)', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const state = createInitialState();
    const bad: AIMove = {
      bar1Id: 'missing-bar',
      bar2Id: 'also-missing',
      operation: 'add',
      answerId: 'nope',
    };
    const next = applyAIMoveSteps(state, bad);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('selectingBar1');
  });

  it('bogus answerId after valid bars falls back to pass', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const next = applyAIMoveSteps(state, { ...move!, answerId: 'fake-answer' });
    expect(next.currentPlayer).toBe('player2');
  });

  it('executeAITurn / isAITurn gates', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
    expect(getAIMove(state, 'player2', 'easy')).toBeNull();
    const over = { ...state, phase: 'gameOver' as const };
    expect(getAIMove(over, 'player1', 'medium')).toBeNull();
    const passed = executeAITurn(over, 'player1', 'easy');
    expect(passed.currentPlayer).toBe('player2');
  });
});
