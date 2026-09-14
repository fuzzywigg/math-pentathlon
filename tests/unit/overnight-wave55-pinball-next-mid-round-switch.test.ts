/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball nextChallenge mid-round player switch.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { startGame, nextChallenge } from '../../src/games/fraction-pinball/rules';

describe('Wave 55 pinball rules — next mid switch', () => {
  it('advances round and seats player2 leftover', () => {
    const started = startGame(createInitialState());
    const next = nextChallenge(started);
    expect(next.phase).toBe('answering');
    expect(next.currentPlayer).toBe('player2');
    expect(next.roundNumber).toBe(2);
    expect(next.currentChallenge?.id).toBe('challenge-2');
    expect(next.selectedAnswer).toBeNull();
  });
});
