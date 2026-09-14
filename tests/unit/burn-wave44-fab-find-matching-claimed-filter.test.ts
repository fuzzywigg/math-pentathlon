/**
 * Wave 44 overnight HEAVY — Fab findMatchingAnswers skips claimed.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, findMatchingAnswers } from '../../src/games/fab-a-diffy/rules';

describe('Wave 44 fab — findMatchingAnswers', () => {
  it('returns unclaimed equivalents only', () => {
    const s = createInitialState();
    const halfIds = [...s.answerBars.entries()]
      .filter(([, a]) => a.fraction.numerator === 1 && a.fraction.denominator === 2)
      .map(([id]) => id);
    expect(halfIds.length).toBeGreaterThan(0);
    const open = findMatchingAnswers(s, { numerator: 1, denominator: 2 });
    expect(open).toEqual(halfIds);

    const claimed = {
      ...s,
      answerBars: new Map(s.answerBars).set(halfIds[0], {
        ...s.answerBars.get(halfIds[0])!,
        claimedBy: 'player1',
      }),
    };
    expect(findMatchingAnswers(claimed, { numerator: 1, denominator: 2 })).not.toContain(halfIds[0]);
  });
});
