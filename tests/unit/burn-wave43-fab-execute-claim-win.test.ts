/**
 * Wave 43 TOKENMAXX — Fab executeMove all-answers claim win. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
  getPossibleResults,
  findMatchingAnswers,
} from '../../src/games/fab-a-diffy/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 fab — execute claim win', () => {
  it('claiming final unclaimed answer settles gameOver', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState();
    const bars = [...state.fractionBars.values()].filter((b) => !b.used);
    let found: { b1: string; b2: string; op: 'add' | 'subtract' | 'multiply' | 'divide'; answer: string } | null = null;
    outer: for (let i = 0; i < bars.length; i++) {
      for (let j = i + 1; j < bars.length; j++) {
        for (const { operation, result } of getPossibleResults(bars[i], bars[j])) {
          const matches = findMatchingAnswers(state, result);
          if (matches.length) {
            found = { b1: bars[i].id, b2: bars[j].id, op: operation, answer: matches[0] };
            break outer;
          }
        }
      }
    }
    expect(found).not.toBeNull();

    // pre-claim every other answer for player2 so this claim finishes the board
    const answers = new Map(state.answerBars);
    for (const [id] of answers) {
      if (id === found!.answer) continue;
      answers.set(id, { ...answers.get(id)!, claimedBy: 'player2' });
    }
    state = { ...state, answerBars: answers, scores: { player1: 0, player2: answers.size - 1 } };

    state = selectBar1(state, found!.b1);
    state = selectBar2(state, found!.b2);
    state = selectOperation(state, found!.op);
    const next = executeMove(state, found!.answer);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player2'); // majority already player2
    expect(next.answerBars.get(found!.answer)?.claimedBy).toBe('player1');
  });
});
