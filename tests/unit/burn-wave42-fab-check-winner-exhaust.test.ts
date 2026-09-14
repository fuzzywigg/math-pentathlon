/**
 * Wave 42 — Fab-a-Diffy checkWinner all claimed / bars nearly exhausted. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState, checkWinner } from '../../src/games/fab-a-diffy/rules';
import type { AnswerBar, FractionBar } from '../../src/games/fab-a-diffy/types';

describe('Wave 42 fab — checkWinner exhaust', () => {
  it('all answers claimed crowns the higher claim count', () => {
    const state = createInitialState();
    const answers = new Map<string, AnswerBar>();
    let i = 0;
    for (const [, a] of state.answerBars) {
      answers.set(`ans-${i}`, {
        ...a,
        id: `ans-${i}`,
        claimedBy: i < state.answerBars.size - 3 ? 'player1' : 'player2',
      });
      i++;
    }
    expect(checkWinner(answers, state.fractionBars)).toBe('player1');
  });

  it('nearly exhausted bars with lead returns leader', () => {
    const state = createInitialState();
    const bars = new Map<string, FractionBar>();
    const all = [...state.fractionBars.values()];
    all.forEach((b, idx) => {
      bars.set(b.id, { ...b, used: idx < all.length - 1 });
    });
    const answers = new Map<string, AnswerBar>([
      [
        'p1',
        {
          id: 'p1',
          fraction: { numerator: 1, denominator: 2 },
          claimedBy: 'player1',
        },
      ],
      [
        'p2',
        {
          id: 'p2',
          fraction: { numerator: 1, denominator: 3 },
          claimedBy: 'player2',
        },
      ],
      [
        'open',
        {
          id: 'open',
          fraction: { numerator: 1, denominator: 4 },
          claimedBy: null,
        },
      ],
    ]);
    // equal claims → null under near-exhaust path when tied
    expect(checkWinner(answers, bars)).toBeNull();

    answers.set('p1b', {
      id: 'p1b',
      fraction: { numerator: 3, denominator: 4 },
      claimedBy: 'player1',
    });
    expect(checkWinner(answers, bars)).toBe('player1');
  });
});
