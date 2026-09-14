/**
 * Overnight TOKENMAXX — Fab formatMove happy-path leftovers. Tests-only.
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
  formatMove,
} from '../../src/games/fab-a-diffy/rules';

describe('Overnight fab — formatMove after claim', () => {
  it('formats claimed history entry', () => {
    let state = createInitialState();
    const unused = [...state.fractionBars.values()].filter((b) => !b.used);
    let found: { b1: string; b2: string; op: 'add' | 'subtract' | 'multiply' | 'divide'; ans: string } | null = null;
    outer: for (let i = 0; i < unused.length; i++) {
      for (let j = 0; j < unused.length; j++) {
        if (i === j) continue;
        for (const op of ['add', 'subtract', 'multiply', 'divide'] as const) {
          const result = calculateResult(unused[i].fraction, unused[j].fraction, op);
          if (!result || result.numerator < 0) continue;
          const matches = findMatchingAnswers(state, result);
          if (matches.length) {
            found = { b1: unused[i].id, b2: unused[j].id, op, ans: matches[0] };
            break outer;
          }
        }
      }
    }
    expect(found).not.toBeNull();
    state = selectBar1(state, found!.b1);
    state = selectBar2(state, found!.b2);
    state = selectOperation(state, found!.op);
    state = executeMove(state, found!.ans);
    const text = formatMove(state, state.moveHistory[0]);
    expect(text).toContain('=');
    expect(text).not.toBe('?');
  });
});
