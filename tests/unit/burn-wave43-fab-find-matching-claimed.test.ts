/**
 * Wave 43 TOKENMAXX — Fab findMatchingAnswers claimed/equiv leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  findMatchingAnswers,
} from '../../src/games/fab-a-diffy/rules';

describe('Wave 43 fab — findMatchingAnswers', () => {
  it('returns unclaimed equivalents and skips claimed', () => {
    const state = createInitialState();
    const target = { numerator: 1, denominator: 2 };
    const matches = findMatchingAnswers(state, target);
    expect(matches.length).toBeGreaterThan(0);
    for (const id of matches) {
      expect(state.answerBars.get(id)?.claimedBy).toBeNull();
    }

    const claimed = {
      ...state,
      answerBars: new Map(state.answerBars),
    };
    for (const id of matches) {
      claimed.answerBars.set(id, {
        ...claimed.answerBars.get(id)!,
        claimedBy: 'player1',
      });
    }
    expect(findMatchingAnswers(claimed, target)).toEqual([]);
  });

  it('treats 2/4 as equivalent to 1/2', () => {
    const state = createInitialState();
    const a = findMatchingAnswers(state, { numerator: 1, denominator: 2 });
    const b = findMatchingAnswers(state, { numerator: 2, denominator: 4 });
    expect(a).toEqual(b);
  });
});
