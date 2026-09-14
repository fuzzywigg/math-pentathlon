/**
 * Wave 48 — Pinball generateChallenge type parity. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { generateChallenge, checkAnswer } from '../../src/games/fraction-pinball/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 pinball — generate parity', () => {
  it('even → F→D; odd → D→F; correct answer in choices', () => {
    // Sequenced random — constant Math.random OOMs generateWrong* fill loops.
    let i = 0;
    const seq = [0.11, 0.22, 0.33, 0.44, 0.55, 0.66, 0.77, 0.88, 0.19, 0.28, 0.37, 0.46, 0.57, 0.68, 0.79];
    vi.spyOn(Math, 'random').mockImplementation(() => seq[i++ % seq.length]);
    const even = generateChallenge(2);
    expect(even.type).toBe('fractionToDecimal');
    expect(even.answerChoices).toContain(even.correctAnswer);
    expect(checkAnswer(even, even.correctAnswer)).toBe(true);
    const odd = generateChallenge(3);
    expect(odd.type).toBe('decimalToFraction');
    expect(odd.answerChoices.length).toBe(4);
  });
});
