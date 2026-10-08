/**
 * burn-1008-mp-mutation-audit — strengthen Fraction Pinball challenge /
 * distractor coverage to kill surviving mutants (tests only).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { COMMON_FRACTIONS } from '../../src/core/fractions/types';
import {
  formatDecimal,
  formatFraction,
  generateChallenge,
  startGame,
  checkAnswer,
  submitAnswer,
  nextChallenge,
} from '../../src/games/fraction-pinball/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

function mockRandomSequence(...values: number[]) {
  let i = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    const v = values[i % values.length];
    i++;
    return v;
  });
}

describe('mutation/fraction-pinball – convertible fraction filter', () => {
  it('challenges only use terminating decimals within 4 places', () => {
    mockRandomSequence(
      0.01, 0.11, 0.21, 0.31, 0.41, 0.51, 0.61, 0.71, 0.81, 0.91, 0.05, 0.15,
      0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95
    );
    for (let n = 0; n < 30; n++) {
      const c = generateChallenge(n);
      const decimal = c.fraction.numerator / c.fraction.denominator;
      const rounded = Math.round(decimal * 10000) / 10000;
      expect(Math.abs(decimal - rounded)).toBeLessThan(0.00001);
      expect(c.decimal).toBeCloseTo(decimal, 10);
      // Must be drawn from COMMON_FRACTIONS
      expect(
        COMMON_FRACTIONS.some(
          (f) =>
            f.numerator === c.fraction.numerator &&
            f.denominator === c.fraction.denominator
        )
      ).toBe(true);
    }
  });

  it('formatDecimal rounds to 4 places and strips trailing zeros', () => {
    expect(formatDecimal(0.5)).toBe('0.5');
    expect(formatDecimal(0.25)).toBe('0.25');
    expect(formatDecimal(1)).toBe('1');
    expect(formatDecimal(0.3333)).toBe('0.3333');
    // 1/3 truncated via *10000 round trip stays within 4 places
    expect(formatDecimal(1 / 8)).toBe('0.125');
    expect(formatDecimal(3 / 4)).toBe('0.75');
  });

  it('formatFraction emits slash form except wholes', () => {
    expect(formatFraction({ numerator: 1, denominator: 2 })).toBe('1/2');
    expect(formatFraction({ numerator: 5, denominator: 1 })).toBe('5');
  });
});

describe('mutation/fraction-pinball – wrong-answer strategies', () => {
  it('fractionToDecimal choices include exact correct decimal and 3 wrongs', () => {
    // Pick early sequence so fraction index 0 (1/2) and strategies vary
    mockRandomSequence(
      0.0, 0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.05, 0.15, 0.25,
      0.35, 0.45, 0.55, 0.65, 0.75, 0.85
    );
    const c = generateChallenge(0); // even → fractionToDecimal
    expect(c.type).toBe('fractionToDecimal');
    expect(c.answerChoices).toHaveLength(4);
    expect(c.answerChoices).toContain(c.correctAnswer);
    expect(c.correctAnswer).toBe(formatDecimal(c.decimal));

    const wrongs = c.answerChoices.filter((a) => a !== c.correctAnswer);
    expect(wrongs).toHaveLength(3);
    for (const w of wrongs) {
      expect(w).not.toBe(c.correctAnswer);
      // Parsed wrongs should stay in the positive range used by generators
      const n = Number(w);
      expect(Number.isFinite(n)).toBe(true);
      expect(n).toBeGreaterThan(0);
      expect(n).toBeLessThan(10);
    }
  });

  it('decimalToFraction choices include simplified correct fraction', () => {
    mockRandomSequence(
      0.0, 0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.05, 0.15, 0.25,
      0.35, 0.45, 0.55, 0.65, 0.75, 0.85
    );
    const c = generateChallenge(1); // odd → decimalToFraction
    expect(c.type).toBe('decimalToFraction');
    expect(c.answerChoices).toHaveLength(4);
    expect(c.answerChoices).toContain(c.correctAnswer);
    expect(c.correctAnswer).toBe(formatFraction(c.fraction));
    const wrongs = c.answerChoices.filter((a) => a !== c.correctAnswer);
    expect(wrongs).toHaveLength(3);
    for (const w of wrongs) {
      expect(w).toMatch(/^\d+(\/\d+)?$/);
    }
  });

  it('forced distractor offsets (±0.1, ×2, /2) stay distinct from correct', () => {
    // Strategy index driven by Math.random * strategies.length
    mockRandomSequence(
      0.0, // fraction pick → 1/2 → 0.5
      0.0,
      0.0, // strategy 0 → +0.1 → 0.6
      0.15, // strategy ~1 → -0.1 → 0.4
      0.3, // strategy ~2 → *2 → 1
      0.45, // strategy ~3 → /2 → 0.25
      0.5,
      0.6,
      0.7,
      0.8,
      0.9
    );
    const c = generateChallenge(0);
    expect(c.type).toBe('fractionToDecimal');
    expect(c.correctAnswer).toBe('0.5');
    expect(c.answerChoices).toContain('0.5');
    expect(new Set(c.answerChoices).size).toBe(4);
    // At least one of the classic offset strategies must appear
    const wrongs = c.answerChoices.filter((a) => a !== '0.5');
    expect(
      wrongs.some((w) => ['0.6', '0.4', '1', '0.25'].includes(w))
    ).toBe(true);
  });

  it('each wrong-decimal strategy family can surface under forced random', () => {
    const expectWrong = (strategyRandom: number, expectedWrong: string) => {
      vi.restoreAllMocks();
      mockRandomSequence(
        0.0, // 1/2
        strategyRandom,
        strategyRandom,
        strategyRandom,
        strategyRandom,
        strategyRandom,
        0.5,
        0.6,
        0.7,
        0.8,
        0.9,
        0.1,
        0.2,
        0.3
      );
      const c = generateChallenge(0);
      expect(c.correctAnswer).toBe('0.5');
      expect(c.answerChoices).toContain(expectedWrong);
    };

    // 8 strategies: +0.1, -0.1, *2, /2, round*10/10+0.05, 1-correct, +0.25, -0.25
    expectWrong(0.0, '0.6');
    expectWrong(0.14, '0.4');
    expectWrong(0.26, '1');
    expectWrong(0.39, '0.25');
    expectWrong(0.76, '0.75');
    expectWrong(0.89, '0.25');
  });
});

describe('mutation/fraction-pinball – game flow gates', () => {
  it('startGame / submitAnswer / nextChallenge stay phase-consistent', () => {
    mockRandomSequence(
      0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.15, 0.25, 0.35
    );
    const started = startGame(createInitialState());
    expect(started.phase).toBe('answering');
    expect(started.currentChallenge).not.toBeNull();
    expect(started.currentChallenge!.answerChoices).toHaveLength(4);

    const challenge = started.currentChallenge!;
    expect(checkAnswer(challenge, challenge.correctAnswer)).toBe(true);
    expect(checkAnswer(challenge, 'not-it')).toBe(false);

    const correct = submitAnswer(started, challenge.correctAnswer);
    expect(correct.phase).toBe('showResult');
    expect(correct.isCorrect).toBe(true);

    const advanced = nextChallenge(correct);
    expect(['answering', 'gameOver']).toContain(advanced.phase);
  });
});
