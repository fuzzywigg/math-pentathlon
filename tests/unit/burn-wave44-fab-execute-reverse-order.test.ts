/**
 * Wave 44 — Fab-a-Diffy executeMove reverse-order mismatch leftovers.
 * executeMove uses bar1 op bar2 only; reverse may match getPossibleResults
 * but not execute unless bars selected in that order.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
  getPossibleResults,
  calculateResult,
  findMatchingAnswers,
} from '../../src/games/fab-a-diffy/rules';
import type { FabADiffyState } from '../../src/games/fab-a-diffy/types';
import { areEquivalent } from '../../src/core/fractions/arithmetic';

describe('Wave 44 Fab — execute vs reverse possible results', () => {
  function board(): FabADiffyState {
    const state = createInitialState();
    const fractionBars = new Map(state.fractionBars);
    const answerBars = new Map(state.answerBars);
    fractionBars.clear();
    answerBars.clear();
    // small then large: forward subtract negative; reverse 7/8-1/8=3/4
    fractionBars.set('small', {
      id: 'small',
      fraction: { numerator: 1, denominator: 8 },
      owner: null,
      used: false,
    });
    fractionBars.set('large', {
      id: 'large',
      fraction: { numerator: 7, denominator: 8 },
      owner: null,
      used: false,
    });
    answerBars.set('threeFour', {
      id: 'threeFour',
      fraction: { numerator: 3, denominator: 4 },
      claimedBy: null,
    });
    return { ...state, fractionBars, answerBars };
  }

  it('getPossibleResults exposes reverse subtract match', () => {
    const state = board();
    const results = getPossibleResults(
      state.fractionBars.get('small')!,
      state.fractionBars.get('large')!
    );
    expect(
      results.some(
        (r) =>
          r.operation === 'subtract' &&
          areEquivalent(r.result, { numerator: 3, denominator: 4 })
      )
    ).toBe(true);
    expect(
      findMatchingAnswers(state, { numerator: 3, denominator: 4 })
    ).toEqual(['threeFour']);
  });

  it('selecting small then large with subtract fails execute (negative/null path)', () => {
    let state = board();
    state = selectBar1(state, 'small');
    state = selectBar2(state, 'large');
    state = selectOperation(state, 'subtract');
    const forward = calculateResult(
      { numerator: 1, denominator: 8 },
      { numerator: 7, denominator: 8 },
      'subtract'
    );
    // may be negative simplified — not equivalent to 3/4
    if (forward) {
      expect(areEquivalent(forward, { numerator: 3, denominator: 4 })).toBe(false);
    }
    const next = executeMove(state, 'threeFour');
    expect(next).toBe(state); // identity — mismatch
  });

  it('selecting large then small with subtract succeeds', () => {
    let state = board();
    state = selectBar1(state, 'large');
    state = selectBar2(state, 'small');
    state = selectOperation(state, 'subtract');
    const next = executeMove(state, 'threeFour');
    expect(next.answerBars.get('threeFour')?.claimedBy).toBe('player1');
    expect(next.scores.player1).toBe(1);
  });
});
