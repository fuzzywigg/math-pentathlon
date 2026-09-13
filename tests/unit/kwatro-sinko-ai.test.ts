import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import {
  getAIMove,
  executeAITurn,
  isAITurn,
} from '../../src/games/kwatro-sinko/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Kwatro Sinko AI', () => {
  it('isAITurn respects mode, seat, and game over', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player2', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(
      isAITurn({ ...state, phase: 'gameOver' }, 'player1', 'human-vs-ai')
    ).toBe(false);
  });

  it('getAIMove returns null for wrong player or game over', () => {
    const state = createInitialState();
    expect(getAIMove(state, 'player2', 'easy')).toBeNull();
    expect(
      getAIMove({ ...state, phase: 'gameOver' }, 'player1', 'easy')
    ).toBeNull();
  });

  it('getAIMove easy returns chipId + nodeId', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.chipId).toBeTruthy();
    expect(move!.nodeId).toBeTruthy();
  });

  it('executeAITurn advances to player2 and records history', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = createInitialState();
    const next = executeAITurn(state, 'player1', 'easy');
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory.length).toBeGreaterThanOrEqual(1);
  });

  it('executeAITurn for player2 after seat flip', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    let state = createInitialState();
    state = executeAITurn(state, 'player1', 'easy');
    expect(state.currentPlayer).toBe('player2');
    const next = executeAITurn(state, 'player2', 'easy');
    expect(next.currentPlayer).toBe('player1');
  });

  it('isAITurn true for player2 on their turn', () => {
    const state = { ...createInitialState(), currentPlayer: 'player2' as const };
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(true);
  });
});
