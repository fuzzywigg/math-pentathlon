/**
 * Wave 41 — Fab-a-Diffy hasAnyValidMove edge leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  hasAnyValidMove,
  getPossibleResults,
  findMatchingAnswers,
} from '../../src/games/fab-a-diffy/rules';
import type { FabADiffyState, FractionBar } from '../../src/games/fab-a-diffy/types';

describe('Wave 41 fab-a-diffy — hasAnyValidMove edges', () => {
  it('opening state typically has at least one valid move', () => {
    const state = createInitialState();
    expect(hasAnyValidMove(state)).toBe(true);
  });

  it('false when fewer than two unused bars', () => {
    const state = createInitialState();
    const bars = new Map(state.fractionBars);
    const ids = [...bars.keys()];
    ids.forEach((id, i) => {
      const b = bars.get(id)!;
      bars.set(id, { ...b, used: i !== 0 });
    });
    const oneLeft: FabADiffyState = { ...state, fractionBars: bars };
    expect(hasAnyValidMove(oneLeft)).toBe(false);

    const none: FabADiffyState = {
      ...state,
      fractionBars: new Map(
        [...bars.entries()].map(([id, b]) => [id, { ...b, used: true }])
      ),
    };
    expect(hasAnyValidMove(none)).toBe(false);
  });

  it('false when answers all claimed even if bars remain', () => {
    const state = createInitialState();
    const answers = new Map(state.answerBars);
    for (const [id, a] of answers) {
      answers.set(id, { ...a, claimedBy: 'player1' });
    }
    const claimed: FabADiffyState = { ...state, answerBars: answers };
    // Pairs may compute results but findMatchingAnswers is empty
    const unused = [...claimed.fractionBars.values()].filter((b) => !b.used);
    if (unused.length >= 2) {
      const results = getPossibleResults(unused[0], unused[1]);
      for (const { result } of results) {
        expect(findMatchingAnswers(claimed, result)).toEqual([]);
      }
    }
    expect(hasAnyValidMove(claimed)).toBe(false);
  });

  it('two synthetic bars with matching answer report true', () => {
    const state = createInitialState();
    const barA: FractionBar = {
      id: 'syn-a',
      fraction: { numerator: 1, denominator: 2 },
      owner: null,
      used: false,
    };
    const barB: FractionBar = {
      id: 'syn-b',
      fraction: { numerator: 1, denominator: 2 },
      owner: null,
      used: false,
    };
    const fractionBars = new Map<string, FractionBar>([
      ['syn-a', barA],
      ['syn-b', barB],
    ]);
    // Keep an answer that matches 1/2+1/2=1
    const answerBars = new Map(state.answerBars);
    // Ensure whole exists
    let hasWhole = false;
    for (const a of answerBars.values()) {
      if (a.fraction.numerator === 1 && a.fraction.denominator === 1) {
        hasWhole = true;
        break;
      }
    }
    if (!hasWhole) {
      answerBars.set('whole', {
        id: 'whole',
        fraction: { numerator: 1, denominator: 1 },
        claimedBy: null,
      });
    }
    const synthetic: FabADiffyState = {
      ...state,
      fractionBars,
      answerBars,
    };
    expect(hasAnyValidMove(synthetic)).toBe(true);
  });
});
