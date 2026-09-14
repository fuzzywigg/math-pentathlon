/**
 * Wave 41 — Fab-a-Diffy executeMove / selectOperation phase guards. Tests-only.
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
import type { FabADiffyState } from '../../src/games/fab-a-diffy/types';
import { areEquivalent } from '../../src/core/fractions/arithmetic';

describe('Wave 41 fab-a-diffy — execute phase guards', () => {
  it('selectOperation identity outside selectingOperation', () => {
    const state = createInitialState();
    expect(selectOperation(state, 'add')).toBe(state);
    const confirming: FabADiffyState = {
      ...state,
      phase: 'confirmingMove',
      selectedBar1: 'a',
      selectedBar2: 'b',
      selectedOperation: 'add',
    };
    expect(selectOperation(confirming, 'multiply')).toBe(confirming);
  });

  it('executeMove identity on wrong phase / missing selection / claimed', () => {
    const state = createInitialState();
    expect(executeMove(state, 'ans')).toBe(state);

    const ids = [...state.fractionBars.keys()];
    let mid = selectBar1(state, ids[0]);
    mid = selectBar2(mid, ids[1]);
    mid = selectOperation(mid, 'add');
    expect(mid.phase).toBe('confirmingMove');

    expect(executeMove(mid, 'no-such-answer')).toBe(mid);

    const answerId = [...mid.answerBars.keys()][0];
    const claimedBars = new Map(mid.answerBars);
    const ans = claimedBars.get(answerId)!;
    claimedBars.set(answerId, { ...ans, claimedBy: 'player2' });
    const claimed: FabADiffyState = { ...mid, answerBars: claimedBars };
    expect(executeMove(claimed, answerId)).toBe(claimed);
  });

  it('executeMove identity when result does not match answer', () => {
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    let mid = selectBar1(state, ids[0]);
    mid = selectBar2(mid, ids[1]);
    mid = selectOperation(mid, 'add');
    const bar1 = mid.fractionBars.get(mid.selectedBar1!)!;
    const bar2 = mid.fractionBars.get(mid.selectedBar2!)!;
    const result = calculateResult(bar1.fraction, bar2.fraction, 'add');
    expect(result).not.toBeNull();
    const mismatchId = [...mid.answerBars.entries()].find(
      ([, a]) => a.claimedBy === null && !areEquivalent(a.fraction, result!)
    )?.[0];
    if (mismatchId) {
      expect(executeMove(mid, mismatchId)).toBe(mid);
    }
    const matches = findMatchingAnswers(mid, result!);
    if (matches.length > 0) {
      const next = executeMove(mid, matches[0]);
      expect(next).not.toBe(mid);
      expect(next.scores.player1).toBe(1);
    }
  });
});
