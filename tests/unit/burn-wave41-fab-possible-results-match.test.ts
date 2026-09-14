/**
 * Wave 41 — Fab-a-Diffy getPossibleResults / findMatchingAnswers leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  getPossibleResults,
  findMatchingAnswers,
  calculateResult,
} from '../../src/games/fab-a-diffy/rules';
import type { FractionBar } from '../../src/games/fab-a-diffy/types';

describe('Wave 41 fab-a-diffy — possible results match', () => {
  it('getPossibleResults only emits non-negative results', () => {
    const state = createInitialState();
    const bars = [...state.fractionBars.values()];
    const results = getPossibleResults(bars[0], bars[1]);
    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      expect(r.result.numerator).toBeGreaterThanOrEqual(0);
      expect(['add', 'subtract', 'multiply', 'divide']).toContain(r.operation);
    }
  });

  it('findMatchingAnswers empty for claimed or unmatched fraction', () => {
    const state = createInitialState();
    const [answerId, answer] = [...state.answerBars.entries()][0];
    const claimed = {
      ...state,
      answerBars: new Map(state.answerBars).set(answerId, {
        ...answer,
        claimedBy: 'player1' as const,
      }),
    };
    expect(findMatchingAnswers(claimed, answer.fraction)).toEqual([]);
    expect(
      findMatchingAnswers(state, { numerator: 99, denominator: 100 })
    ).toEqual([]);
  });

  it('findMatchingAnswers hits unclaimed equivalent answer', () => {
    const state = createInitialState();
    const answer = [...state.answerBars.values()][0];
    const matches = findMatchingAnswers(state, answer.fraction);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((id) => state.answerBars.get(id)?.claimedBy === null)).toBe(
      true
    );

    const bar1: FractionBar = {
      id: 'x',
      fraction: { numerator: 1, denominator: 2 },
      owner: null,
      used: false,
    };
    const bar2: FractionBar = {
      id: 'y',
      fraction: { numerator: 1, denominator: 2 },
      owner: null,
      used: false,
    };
    const possible = getPossibleResults(bar1, bar2);
    const add = possible.find((p) => p.operation === 'add');
    expect(add).toBeTruthy();
    expect(calculateResult(bar1.fraction, bar2.fraction, 'add')).toEqual(
      add!.result
    );
  });
});
