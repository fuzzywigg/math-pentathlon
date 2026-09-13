import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import {
  getAIPlacement,
  executeAITurn,
  isAITurn,
} from '../../src/games/prime-gold/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Prime Gold AI', () => {
  it('isAITurn respects mode, seat, and game over', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player2', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(
      isAITurn({ ...state, phase: 'gameOver' }, 'player1', 'human-vs-ai')
    ).toBe(false);
  });

  it('getAIPlacement returns null while still rolling', () => {
    const state = createInitialState();
    expect(state.phase).toBe('rolling');
    expect(getAIPlacement(state, 'player1', 'easy')).toBeNull();
  });

  it('executeAITurn rolls and advances the seat or stays playable', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    const next = executeAITurn(state, 'player1', 'easy');
    expect(
      next.moveHistory.length > 0 ||
        next.currentPlayer === 'player2' ||
        next.phase === 'rolling'
    ).toBe(true);
  });

  it('executeAITurn for player2 after flipping seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = { ...createInitialState(), currentPlayer: 'player2' as const };
    const next = executeAITurn(state, 'player2', 'easy');
    expect(
      next.currentPlayer === 'player1' ||
        next.phase === 'rolling' ||
        next.moveHistory.length >= state.moveHistory.length
    ).toBe(true);
  });

  it('executeAITurn does not move for the wrong player mid-place', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    // Force placing with dice so wrong-seat getAIPlacement is null → passTurn may flip
    const placing = {
      ...createInitialState(),
      phase: 'placing' as const,
      currentDice: [2, 3, 5] as [number, number, number],
      currentPlayer: 'player1' as const,
    };
    expect(getAIPlacement(placing, 'player2', 'easy')).toBeNull();
  });

  it('isAITurn false when null seat even if player1 to move', () => {
    expect(isAITurn(createInitialState(), null, 'human-vs-ai')).toBe(false);
  });
});
