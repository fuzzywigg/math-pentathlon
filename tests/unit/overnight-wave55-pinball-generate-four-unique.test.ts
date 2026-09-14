/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball generateChallenge 4 unique choices.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { generateChallenge } from '../../src/games/fraction-pinball/rules';

describe('Wave 55 pinball rules — four unique choices', () => {
  it('includes correctAnswer among 4 unique leftover choices', () => {
    for (const n of [0, 1, 2, 7, 8]) {
      const c = generateChallenge(n);
      expect(c.answerChoices).toHaveLength(4);
      expect(new Set(c.answerChoices).size).toBe(4);
      expect(c.answerChoices).toContain(c.correctAnswer);
      expect(c.id).toBe(`challenge-${n}`);
    }
  });
});
