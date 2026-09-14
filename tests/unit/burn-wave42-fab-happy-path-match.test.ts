/**
 * Wave 42 — Fab-a-Diffy select→operate→execute happy path match. Tests-only.
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
import type { FractionOperation } from '../../src/core/fractions/types';

describe('Wave 42 fab — happy path match', () => {
  it('finds a real matching pair and claims an answer', () => {
    const state = createInitialState();
    const bars = [...state.fractionBars.values()].filter((b) => !b.used);
    const ops: FractionOperation[] = ['add', 'subtract', 'multiply', 'divide'];

    let found: {
      bar1Id: string;
      bar2Id: string;
      op: FractionOperation;
      answerId: string;
    } | null = null;

    outer: for (let i = 0; i < bars.length; i++) {
      for (let j = 0; j < bars.length; j++) {
        if (i === j) continue;
        for (const op of ops) {
          const result = calculateResult(bars[i].fraction, bars[j].fraction, op);
          if (!result || result.numerator < 0) continue;
          const matches = findMatchingAnswers(state, result);
          if (matches.length > 0) {
            found = {
              bar1Id: bars[i].id,
              bar2Id: bars[j].id,
              op,
              answerId: matches[0],
            };
            break outer;
          }
        }
      }
    }

    expect(found).not.toBeNull();
    let next = selectBar1(state, found!.bar1Id);
    expect(next.phase).toBe('selectingBar2');
    next = selectBar2(next, found!.bar2Id);
    expect(next.phase).toBe('selectingOperation');
    next = selectOperation(next, found!.op);
    expect(next.phase).toBe('confirmingMove');
    next = executeMove(next, found!.answerId);
    expect(next.answerBars.get(found!.answerId)?.claimedBy).toBe('player1');
    expect(next.fractionBars.get(found!.bar1Id)?.used).toBe(true);
    expect(next.fractionBars.get(found!.bar2Id)?.used).toBe(true);
    expect(next.scores.player1).toBe(1);
    expect(next.phase === 'selectingBar1' || next.phase === 'gameOver').toBe(
      true
    );
  });
});
