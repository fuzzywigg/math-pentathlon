/**
 * Wave 44 overnight HEAVY — Fab executeMove claims + scores.
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

describe('Wave 44 fab — executeMove score', () => {
  it('claims matching answer and bumps score', () => {
    let s = createInitialState();
    // Find a concrete matching combo from available bars
    const unused = [...s.fractionBars.values()].filter((b) => !b.used);
    let found: { b1: string; b2: string; op: 'add' | 'subtract' | 'multiply' | 'divide'; ans: string } | null = null;
    outer: for (let i = 0; i < unused.length; i++) {
      for (let j = 0; j < unused.length; j++) {
        if (i === j) continue;
        for (const op of ['add', 'subtract', 'multiply', 'divide'] as const) {
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
    expect(next.scores.player1).toBe(1);
    expect(next.answerBars.get(found!.ans)!.claimedBy).toBe('player1');
    expect(next.fractionBars.get(found!.b1)!.used).toBe(true);
    expect(next.fractionBars.get(found!.b2)!.used).toBe(true);
    expect(next.moveHistory).toHaveLength(1);
    expect(next.currentPlayer).toBe('player2');
  });
});
