/**
 * Wave 42 — Hex AI null on full board for all difficulties + random.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { getValidMoves } from '../../src/games/hex/rules';
import { getBestMove, getRandomMove } from '../../src/games/hex/ai';

describe('Wave 42 Hex AI — full board null', () => {
  it('easy/medium/hard/random all null when no empties', () => {
    const full = {
      ...createInitialState(2),
      winner: null,
      board: [
        ['player1', 'player2'],
        ['player2', 'player1'],
      ] as ReturnType<typeof createInitialState>['board'],
      currentPlayer: 'player1' as const,
    };
    expect(getValidMoves(full)).toHaveLength(0);
    expect(getBestMove(full, 'player1', 'easy')).toBeNull();
    expect(getBestMove(full, 'player1', 'medium')).toBeNull();
    expect(getBestMove(full, 'player2', 'hard')).toBeNull();
    expect(getRandomMove(full)).toBeNull();
  });
});
