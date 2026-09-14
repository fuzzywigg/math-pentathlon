/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball startGame challenge-1 leftover.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { startGame } from '../../src/games/fraction-pinball/rules';

describe('Wave 55 pinball rules — startGame challenge-1', () => {
  it('does not mutate input and ids challenge-1', () => {
    const open = createInitialState();
    const started = startGame(open);
    expect(open.currentChallenge).toBeNull();
    expect(started).not.toBe(open);
    expect(started.currentChallenge?.id).toBe('challenge-1');
    expect(started.currentChallenge?.type).toBe('decimalToFraction');
    expect(started.phase).toBe('answering');
  });
});
