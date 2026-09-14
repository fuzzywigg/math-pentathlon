/**
 * Wave 42 — Fab-a-Diffy executeMove wrong answer / wrong phase identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
  calculateResult,
} from '../../src/games/fab-a-diffy/rules';
import { areEquivalent } from '../../src/core/fractions/arithmetic';

describe('Wave 42 fab — execute wrong identity', () => {
  it('wrong phase is identity', () => {
    const state = createInitialState();
    const answerId = [...state.answerBars.keys()][0];
    expect(executeMove(state, answerId)).toBe(state);
  });

  it('wrong answer for confirmed op is identity', () => {
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    let mid = selectBar1(state, ids[0]);
    mid = selectBar2(mid, ids[1]);
    mid = selectOperation(mid, 'add');
    const bar1 = mid.fractionBars.get(mid.selectedBar1!)!;
    const bar2 = mid.fractionBars.get(mid.selectedBar2!)!;
    const result = calculateResult(bar1.fraction, bar2.fraction, 'add');
    expect(result).not.toBeNull();
    const wrong = [...mid.answerBars.entries()].find(
      ([, a]) => a.claimedBy === null && !areEquivalent(a.fraction, result!)
    );
    expect(wrong).toBeTruthy();
    expect(executeMove(mid, wrong![0])).toBe(mid);
  });

  it('missing selection fields are identity in confirmingMove', () => {
    const state = createInitialState();
    const ghost = {
      ...state,
      phase: 'confirmingMove' as const,
      selectedBar1: null,
      selectedBar2: [...state.fractionBars.keys()][0],
      selectedOperation: 'add' as const,
    };
    expect(executeMove(ghost, [...state.answerBars.keys()][0])).toBe(ghost);
  });
});
