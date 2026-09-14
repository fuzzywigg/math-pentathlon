/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact getOpponent player2.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getOpponent } from '../../src/games/frac-fact/types';

describe('Wave 55 frac types — opponent p2', () => {
  it('maps player2 back to player1', () => {
    expect(getOpponent('player2')).toBe('player1');
    expect(getOpponent('player1')).toBe('player2');
  });
});
