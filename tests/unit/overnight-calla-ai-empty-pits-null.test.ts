/**
 * Overnight TOKENMAXX — Calla empty pits AI leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getAIMove, analyzeMoves } from '../../src/games/calla/ai';

describe('Overnight calla — empty pits AI', () => {
  it('all-zero own pits → null / empty analysis', () => {
    const s = createInitialState();
    s.player1Pits = [0, 0, 0, 0, 0];
    expect(analyzeMoves(s, 'player1')).toEqual([]);
    expect(getAIMove(s, 'player1', 'easy')).toBeNull();
  });
});
