/**
 * Wave 39 — handshake: frac-fact answer vs attribute compare.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { startGame, checkAnswer } from '../../src/games/frac-fact/rules';
import { compare, createMathPiece, isPrime } from '../../src/core/attributes';

describe('Wave 39 handshake — frac × attr', () => {
  it('correct frac answer stays equivalent; denom primes via attr', () => {
    const state = startGame(createInitialState('easy'));
    const ans = state.currentProblem!.correctAnswer;
    expect(checkAnswer(state.currentProblem!, ans)).toBe(true);
    const piece = createMathPiece(ans.denominator);
    expect(piece.attributes.number).toBe(ans.denominator);
    expect(piece.attributes.isPrime).toBe(isPrime(ans.denominator));
    expect(compare(ans.denominator, 'greater_than', 0)).toBe(true);
  });
});
