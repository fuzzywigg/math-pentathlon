/**
 * Wave 42 — Fab-a-Diffy findMatchingAnswers claimed excluded. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  findMatchingAnswers,
} from '../../src/games/fab-a-diffy/rules';
import type { FabADiffyState } from '../../src/games/fab-a-diffy/types';

describe('Wave 42 fab — match claimed excluded', () => {
  it('unclaimed equivalent answers are returned', () => {
    const state = createInitialState();
    const answer = [...state.answerBars.values()][0];
    const matches = findMatchingAnswers(state, answer.fraction);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches).toContain(answer.id);
  });

  it('claimed answers drop out of matches', () => {
    const state = createInitialState();
    const [id, answer] = [...state.answerBars.entries()][0];
    const claimed: FabADiffyState = {
      ...state,
      answerBars: new Map(state.answerBars).set(id, {
        ...answer,
        claimedBy: 'player2',
      }),
    };
    expect(findMatchingAnswers(claimed, answer.fraction)).not.toContain(id);
  });

  it('all matching answers claimed yields empty list', () => {
    const state = createInitialState();
    const target = [...state.answerBars.values()][0].fraction;
    const answers = new Map(state.answerBars);
    for (const [id, a] of answers) {
      // claim anything equivalent to target
      const matches = findMatchingAnswers(state, target);
      if (matches.includes(id)) {
        answers.set(id, { ...a, claimedBy: 'player1' });
      }
    }
    const claimed: FabADiffyState = { ...state, answerBars: answers };
    expect(findMatchingAnswers(claimed, target)).toEqual([]);
  });
});
