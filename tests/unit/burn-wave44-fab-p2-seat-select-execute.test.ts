/**
 * Wave 44 overnight HEAVY — Fab player2 seat select/execute.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
  calculateResult,
  findMatchingAnswers,
} from '../../src/games/fab-a-diffy/rules';

describe('Wave 44 fab — P2 seat', () => {
  it('P2 can claim after seat flip', () => {
    let s = { ...createInitialState(), currentPlayer: 'player2' as const };
    const unused = [...s.fractionBars.values()];
    let found: { b1: string; b2: string; op: 'add' | 'multiply'; ans: string } | null = null;
    outer: for (let i = 0; i < unused.length; i++) {
      for (let j = 0; j < unused.length; j++) {
        if (i === j) continue;
        for (const op of ['add', 'multiply'] as const) {
          const result = calculateResult(unused[i].fraction, unused[j].fraction, op);
          if (!result) continue;
          const matches = findMatchingAnswers(s, result);
          if (matches.length) {
            found = { b1: unused[i].id, b2: unused[j].id, op, ans: matches[0] };
            break outer;
          }
        }
      }
    }
    expect(found).not.toBeNull();
    s = selectOperation(selectBar2(selectBar1(s, found!.b1), found!.b2), found!.op);
    const next = executeMove(s, found!.ans);
    expect(next.scores.player2).toBe(1);
    expect(next.answerBars.get(found!.ans)!.claimedBy).toBe('player2');
    expect(next.currentPlayer).toBe('player1');
  });
});
