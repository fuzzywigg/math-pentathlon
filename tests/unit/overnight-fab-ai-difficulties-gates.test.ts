/**
 * Overnight TOKENMAXX — Fab AI difficulty / isAITurn / execute leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import {
  getAIMove,
  isAITurn,
  executeAITurn,
  applyAIMoveSteps,
} from '../../src/games/fab-a-diffy/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight fab — AI gates', () => {
  it('isAITurn only in human-vs-ai on AI seat', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn({ ...state, phase: 'gameOver' }, 'player1', 'human-vs-ai')).toBe(false);
  });

  it('getAIMove null on wrong seat / gameOver', () => {
    const state = createInitialState();
    expect(getAIMove(state, 'player2', 'hard')).toBeNull();
    expect(getAIMove({ ...state, phase: 'gameOver' }, 'player1')).toBeNull();
  });

  it('hard prefers a legal move; executeAITurn advances or passes', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99); // low randomness branch
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const next = executeAITurn(state, 'player1', 'hard');
    expect(next).not.toBe(state);
    expect(['selectingBar1', 'gameOver']).toContain(next.phase);
  });

  it('applyAIMoveSteps passes on bogus bar ids', () => {
    const state = createInitialState();
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const next = applyAIMoveSteps(state, {
      bar1Id: 'nope',
      bar2Id: 'nope2',
      operation: 'add',
      answerId: 'nope3',
    });
    expect(next.currentPlayer).toBe('player2');
    spy.mockRestore();
  });

  it('easy teaching can return a move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    const move = getAIMove(createInitialState(), 'player1', 'easy');
    expect(move).not.toBeNull();
  });
});
