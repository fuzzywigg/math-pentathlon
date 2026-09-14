/**
 * Wave 44 — Fab-a-Diffy findMatchingAnswers equivalent fractions leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  findMatchingAnswers,
  calculateResult,
} from '../../src/games/fab-a-diffy/rules';
import type { FabADiffyState } from '../../src/games/fab-a-diffy/types';

describe('Wave 44 Fab — findMatchingAnswers equivalents', () => {
  it('matches unsimplified result to simplified answer bar', () => {
    const state = createInitialState();
    const answerBars = new Map(state.answerBars);
    answerBars.clear();
    answerBars.set('half', {
      id: 'half',
      fraction: { numerator: 1, denominator: 2 },
      claimedBy: null,
    });
    const synth: FabADiffyState = { ...state, answerBars };
    // 2/4 is equivalent to 1/2
    const matches = findMatchingAnswers(synth, {
      numerator: 2,
      denominator: 4,
    });
    expect(matches).toEqual(['half']);
  });

  it('skips claimed equivalents; keeps other unclaimed', () => {
    const state = createInitialState();
    const answerBars = new Map(state.answerBars);
    answerBars.clear();
    answerBars.set('a', {
      id: 'a',
      fraction: { numerator: 1, denominator: 2 },
      claimedBy: 'player1',
    });
    answerBars.set('b', {
      id: 'b',
      fraction: { numerator: 2, denominator: 4 },
      claimedBy: null,
    });
    const synth: FabADiffyState = { ...state, answerBars };
    expect(findMatchingAnswers(synth, { numerator: 1, denominator: 2 })).toEqual([
      'b',
    ]);
  });

  it('calculateResult simplify feeds findMatchingAnswers', () => {
    const state = createInitialState();
    const answerBars = new Map(state.answerBars);
    answerBars.clear();
    answerBars.set('whole', {
      id: 'whole',
      fraction: { numerator: 1, denominator: 1 },
      claimedBy: null,
    });
    const synth: FabADiffyState = { ...state, answerBars };
    const result = calculateResult(
      { numerator: 1, denominator: 2 },
      { numerator: 1, denominator: 2 },
      'add'
    )!;
    expect(findMatchingAnswers(synth, result)).toEqual(['whole']);
  });
});
