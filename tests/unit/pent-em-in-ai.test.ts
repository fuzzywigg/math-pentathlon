import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { getAIMove, isAITurn } from '../../src/games/pent-em-in/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Pent\'Em In AI', () => {
  it('isAITurn respects seat and game over', () => {
    const state = createInitialState();
    expect(isAITurn(state, null)).toBe(false);
    expect(isAITurn(state, 'player1')).toBe(true);
    expect(isAITurn(state, 'player2')).toBe(false);
    expect(isAITurn({ ...state, phase: 'gameOver' }, 'player1')).toBe(false);
  });

  it('getAIMove returns null for wrong player or game over', () => {
    const state = createInitialState();
    expect(getAIMove(state, 'player2', 'easy')).toBeNull();
    expect(
      getAIMove({ ...state, phase: 'gameOver' }, 'player1', 'easy')
    ).toBeNull();
  });

  it('getAIMove easy on empty board returns a placeable shape (fast path only)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.shapeId).toBeTruthy();
    expect(typeof move!.position.row).toBe('number');
    expect(typeof move!.position.col).toBe('number');
    expect(typeof move!.rotation).toBe('number');
    expect(typeof move!.flipped).toBe('boolean');
  });

  it('isAITurn true for player2 on their turn', () => {
    const state = { ...createInitialState(), currentPlayer: 'player2' as const };
    expect(isAITurn(state, 'player2')).toBe(true);
  });

  it('getAIMove easy position stays on the board', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.position.row).toBeGreaterThanOrEqual(0);
    expect(move!.position.col).toBeGreaterThanOrEqual(0);
  });
});
