/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball submitAnswer null challenge identity.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { submitAnswer } from '../../src/games/fraction-pinball/rules';

describe('Wave 55 pinball rules — null challenge identity', () => {
  it('returns same object with no currentChallenge', () => {
    const open = createInitialState();
    expect(open.currentChallenge).toBeNull();
    expect(submitAnswer(open, '0.5')).toBe(open);
  });
});
