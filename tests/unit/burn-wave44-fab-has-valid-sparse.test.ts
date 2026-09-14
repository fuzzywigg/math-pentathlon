/**
 * Wave 44 — Fab-a-Diffy hasAnyValidMove sparse bars leftovers.
 * Distinct from wave41: incompatible pairs vs claimed-only answers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  hasAnyValidMove,
  getPossibleResults,
  findMatchingAnswers,
} from '../../src/games/fab-a-diffy/rules';
import type { FabADiffyState, FractionBar } from '../../src/games/fab-a-diffy/types';

describe('Wave 44 Fab — hasAnyValidMove sparse bars', () => {
  it('two bars whose results miss sparse answers → false', () => {
    const state = createInitialState();
    // 1/11 and 1/13 produce results unlikely in answer set; use exotic answers only
    const fractionBars = new Map<string, FractionBar>([
      [
        'a',
        {
          id: 'a',
          fraction: { numerator: 1, denominator: 11 },
          owner: null,
          used: false,
        },
      ],
      [
        'b',
        {
          id: 'b',
          fraction: { numerator: 1, denominator: 13 },
          owner: null,
          used: false,
        },
      ],
    ]);
    const answerBars = new Map(state.answerBars);
    answerBars.clear();
    answerBars.set('odd', {
      id: 'odd',
      fraction: { numerator: 7, denominator: 17 },
      claimedBy: null,
    });
    const sparse: FabADiffyState = { ...state, fractionBars, answerBars };
    const results = getPossibleResults(
      fractionBars.get('a')!,
      fractionBars.get('b')!
    );
    for (const { result } of results) {
      expect(findMatchingAnswers(sparse, result)).toEqual([]);
    }
    expect(hasAnyValidMove(sparse)).toBe(false);
  });

  it('sparse bars with one matching multiply answer → true', () => {
    const state = createInitialState();
    const fractionBars = new Map<string, FractionBar>([
      [
        'a',
        {
          id: 'a',
          fraction: { numerator: 1, denominator: 2 },
          owner: null,
          used: false,
        },
      ],
      [
        'b',
        {
          id: 'b',
          fraction: { numerator: 1, denominator: 4 },
          owner: null,
          used: false,
        },
      ],
      [
        'used',
        {
          id: 'used',
          fraction: { numerator: 3, denominator: 4 },
          owner: null,
          used: true,
        },
      ],
    ]);
    const answerBars = new Map(state.answerBars);
    answerBars.clear();
    answerBars.set('eighth', {
      id: 'eighth',
      fraction: { numerator: 1, denominator: 8 },
      claimedBy: null,
    });
    const sparse: FabADiffyState = { ...state, fractionBars, answerBars };
    expect(hasAnyValidMove(sparse)).toBe(true);
  });

  it('exactly two unused among many used still searches that pair', () => {
    const state = createInitialState();
    const bars = new Map(state.fractionBars);
    const ids = [...bars.keys()];
    ids.forEach((id, i) => {
      bars.set(id, { ...bars.get(id)!, used: i > 1 });
    });
    // Force first two to known matching pair
    bars.set(ids[0], {
      id: ids[0],
      fraction: { numerator: 1, denominator: 2 },
      owner: null,
      used: false,
    });
    bars.set(ids[1], {
      id: ids[1],
      fraction: { numerator: 1, denominator: 2 },
      owner: null,
      used: false,
    });
    const answers = new Map(state.answerBars);
    // ensure whole exists unclaimed
    let wholeId: string | null = null;
    for (const [id, a] of answers) {
      if (a.fraction.numerator === 1 && a.fraction.denominator === 1) {
        wholeId = id;
        answers.set(id, { ...a, claimedBy: null });
      } else {
        answers.set(id, { ...a, claimedBy: 'player2' });
      }
    }
    if (!wholeId) {
      answers.set('whole', {
        id: 'whole',
        fraction: { numerator: 1, denominator: 1 },
        claimedBy: null,
      });
    }
    const sparse: FabADiffyState = {
      ...state,
      fractionBars: bars,
      answerBars: answers,
    };
    expect(hasAnyValidMove(sparse)).toBe(true);
  });
});
