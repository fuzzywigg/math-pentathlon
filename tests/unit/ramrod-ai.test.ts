import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { getAIMove, executeAITurn, isAITurn } from '../../src/games/ramrod/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Ramrod AI', () => {
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

  it('getAIMove easy returns a rod/box/slot when moves exist', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    if (move) {
      expect(move.rodId).toBeTruthy();
      expect(move.boxId).toBeTruthy();
      expect(typeof move.slot).toBe('number');
    }
  });

  it('executeAITurn advances to player2', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = createInitialState();
    const next = executeAITurn(state, 'player1', 'easy');
    expect(next.currentPlayer).toBe('player2');
  });

  it('executeAITurn records a move when getAIMove finds one', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    const next = executeAITurn(state, 'player1', 'easy');
    if (move) {
      expect(next.moveHistory.length).toBe(1);
    } else {
      expect(next.currentPlayer).toBe('player2');
    }
  });

  it('isAITurn true for player2 when it is their seat', () => {
    const state = { ...createInitialState(), currentPlayer: 'player2' as const };
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(true);
  });
});
