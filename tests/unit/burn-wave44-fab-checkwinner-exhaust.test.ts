/**
 * Wave 44 — Fab-a-Diffy checkWinner exhaust / early-null leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, checkWinner } from '../../src/games/fab-a-diffy/rules';
import type { AnswerBar, FractionBar } from '../../src/games/fab-a-diffy/types';

describe('Wave 44 Fab — checkWinner exhaust edges', () => {
  it('near-exhaust equal claims → null (not majority)', () => {
    const state = createInitialState();
    const answers = new Map<string, AnswerBar>([
      [
        'a',
        {
          id: 'a',
          fraction: { numerator: 1, denominator: 2 },
          claimedBy: 'player1',
        },
      ],
      [
        'b',
        {
          id: 'b',
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
    const bars = new Map<string, FractionBar>();
    const all = [...state.fractionBars.values()];
    all.forEach((b, idx) => {
      bars.set(b.id, { ...b, used: idx < all.length - 1 });
    });
    expect(checkWinner(answers, bars)).toBeNull();
  });

  it('plenty of unused bars + partial claims → null', () => {
    const state = createInitialState();
    const answers = new Map(state.answerBars);
    const ids = [...answers.keys()];
    answers.set(ids[0], { ...answers.get(ids[0])!, claimedBy: 'player1' });
    answers.set(ids[1], { ...answers.get(ids[1])!, claimedBy: 'player2' });
    // leave most bars unused
    expect(checkWinner(answers, state.fractionBars)).toBeNull();
  });

  it('all answers claimed with p2 majority', () => {
    const answers = new Map<string, AnswerBar>();
    for (let i = 0; i < 5; i++) {
      answers.set(`a${i}`, {
        id: `a${i}`,
        fraction: { numerator: 1, denominator: i + 2 },
        claimedBy: i === 0 ? 'player1' : 'player2',
      });
    }
    const bars = new Map<string, FractionBar>([
      [
        'x',
        {
          id: 'x',
          fraction: { numerator: 1, denominator: 2 },
          owner: null,
          used: false,
        },
      ],
    ]);
    expect(checkWinner(answers, bars)).toBe('player2');
  });

  it('usedBars >= size-1 with p1 lead', () => {
    const answers = new Map<string, AnswerBar>([
      [
        'c1',
        {
          id: 'c1',
          fraction: { numerator: 1, denominator: 2 },
          claimedBy: 'player1',
        },
      ],
      [
        'c2',
        {
          id: 'c2',
          fraction: { numerator: 1, denominator: 3 },
          claimedBy: 'player1',
        },
      ],
      [
        'open',
        {
          id: 'open',
          fraction: { numerator: 1, denominator: 5 },
          claimedBy: null,
        },
      ],
    ]);
    const bars = new Map<string, FractionBar>([
      [
        'u1',
        {
          id: 'u1',
          fraction: { numerator: 1, denominator: 2 },
          owner: null,
          used: true,
        },
      ],
      [
        'u2',
        {
          id: 'u2',
          fraction: { numerator: 1, denominator: 3 },
          owner: null,
          used: true,
        },
      ],
      [
        'left',
        {
          id: 'left',
          fraction: { numerator: 1, denominator: 4 },
          owner: null,
          used: false,
        },
      ],
    ]);
    // used = 2, size = 3 → used >= size-1
    expect(checkWinner(answers, bars)).toBe('player1');
  });
});
