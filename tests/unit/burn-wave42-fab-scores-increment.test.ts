/**
 * Wave 42 — Fab-a-Diffy scores increment on execute leftovers. Tests-only.
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

function findClaimable(state: ReturnType<typeof createInitialState>) {
  const bars = [...state.fractionBars.values()].filter((b) => !b.used);
  const ops: FractionOperation[] = ['add', 'subtract', 'multiply', 'divide'];
  for (let i = 0; i < bars.length; i++) {
    for (let j = 0; j < bars.length; j++) {
      if (i === j) continue;
      for (const op of ops) {
        const result = calculateResult(bars[i].fraction, bars[j].fraction, op);
        if (!result || result.numerator < 0) continue;
        const matches = findMatchingAnswers(state, result);
        if (matches.length > 0) {
          return {
            bar1Id: bars[i].id,
            bar2Id: bars[j].id,
            op,
            answerId: matches[0],
          };
        }
      }
    }
  }
  return null;
}

describe('Wave 42 fab — scores increment', () => {
  it('executeMove bumps current player score by 1', () => {
    const state = createInitialState();
    const found = findClaimable(state);
    expect(found).not.toBeNull();
    let next = selectBar1(state, found!.bar1Id);
    next = selectBar2(next, found!.bar2Id);
    next = selectOperation(next, found!.op);
    next = executeMove(next, found!.answerId);
    expect(next.scores.player1).toBe(1);
    expect(next.scores.player2).toBe(0);
  });

  it('second successful claim increments the next seat', () => {
    let state = createInitialState();
    const first = findClaimable(state);
    expect(first).not.toBeNull();
    state = selectBar1(state, first!.bar1Id);
    state = selectBar2(state, first!.bar2Id);
    state = selectOperation(state, first!.op);
    state = executeMove(state, first!.answerId);
    if (state.phase === 'gameOver') {
      expect(state.scores.player1).toBe(1);
      return;
    }
    expect(state.currentPlayer).toBe('player2');
    const second = findClaimable(state);
    expect(second).not.toBeNull();
    state = selectBar1(state, second!.bar1Id);
    state = selectBar2(state, second!.bar2Id);
    state = selectOperation(state, second!.op);
    state = executeMove(state, second!.answerId);
    expect(state.scores.player1).toBe(1);
    expect(state.scores.player2).toBe(1);
  });
});
