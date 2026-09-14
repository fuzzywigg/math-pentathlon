/**
 * Wave 48 — Calla getAIMove null when no valid pits (leftover gate). Tests-only.
 * Avoids hard minimax / deep execute loops (#213).
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getAIMove } from '../../src/games/calla/ai';

describe('Wave 48 calla — AI empty valids null', () => {
  it('returns null when current seat has all-zero pits', () => {
    const s = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 0, 0],
      player2Pits: [3, 3, 3, 3, 3],
      phase: 'selectPit' as const,
    };
    expect(getAIMove(s, 'player1', 'easy')).toBeNull();
    expect(getAIMove(s, 'player1', 'medium')).toBeNull();
  });
});
