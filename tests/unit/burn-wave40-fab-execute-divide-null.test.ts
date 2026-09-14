/**
 * Wave 40 — Fab calculateResult divide-null + executeMove reject matrix.
 * After #177; tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  calculateResult,
  executeMove,
  selectBar1,
  selectBar2,
  selectOperation,
  getPossibleResults,
  findMatchingAnswers,
} from '../../src/games/fab-a-diffy/rules';
import { createFraction } from '../../src/core/fractions/arithmetic';
import type { FractionOperation } from '../../src/core/fractions/types';

describe('Wave 40 fab — divide null / execute rejects', () => {
  it('calculateResult null on divide-by-zero and unknown op', () => {
    const a = createFraction(1, 2);
    const zero = createFraction(0, 1);
    expect(calculateResult(a, zero, 'divide')).toBeNull();
    expect(
      calculateResult(a, createFraction(1, 3), 'modulo' as FractionOperation)
    ).toBeNull();
    const sum = calculateResult(a, createFraction(1, 4), 'add');
    expect(sum?.numerator).toBe(3);
    expect(sum?.denominator).toBe(4);
  });

  it('executeMove identity wrong phase / claimed / non-equivalent', () => {
    const state = createInitialState();
    expect(executeMove(state, 'answer-0')).toBe(state);

    const ids = [...state.fractionBars.keys()];
    let s = selectBar1(state, ids[0]);
    s = selectBar2(s, ids[1]);
    s = selectOperation(s, 'add');
    expect(s.phase).toBe('confirmingMove');

    // Ghost answer id
    expect(executeMove(s, '__nope__')).toBe(s);

    // Claimed answer
    const [ansId, ans] = [...s.answerBars.entries()][0];
    const answers = new Map(s.answerBars);
    answers.set(ansId, { ...ans, claimedBy: 'player2' });
    const claimed = { ...s, answerBars: answers };
    expect(executeMove(claimed, ansId)).toBe(claimed);
  });

  it('getPossibleResults skips zero-div; findMatchingAnswers empty miss', () => {
    const state = createInitialState();
    const bars = [...state.fractionBars.values()];
    const results = getPossibleResults(bars[0], bars[1]);
    expect(results.every((r) => r.result.numerator >= 0)).toBe(true);
    expect(
      findMatchingAnswers(state, createFraction(999, 1))
    ).toHaveLength(0);
  });
});
