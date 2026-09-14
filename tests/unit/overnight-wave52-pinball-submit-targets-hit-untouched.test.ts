/**
 * Overnight HEAVY leftover after #234 — submitAnswer never flips targets[].hit.
 * Hit weights tested; dead hit field never asserted post-submit. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { submitAnswer } from '../../src/games/fraction-pinball/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 52 pinball — targets hit field', () => {
  it('keeps every target.hit false after a correct submit', () => {
    // Vary random so hitRandomTarget does not hang; avoid generateChallenge loops.
    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      n += 1;
      return ((n * 17) % 89) / 89;
    });
    const state = submitAnswer(
      {
        ...createInitialState(),
        phase: 'answering',
        currentChallenge: {
          id: 'hit-field',
          type: 'fractionToDecimal',
          fraction: { numerator: 1, denominator: 2 },
          decimal: 0.5,
          answerChoices: ['0.5', '0.25', '0.75', '1'],
          correctAnswer: '0.5',
        },
      },
      '0.5'
    );
    expect(state.isCorrect).toBe(true);
    expect(state.targets.every((t) => t.hit === false)).toBe(true);
  });
});
