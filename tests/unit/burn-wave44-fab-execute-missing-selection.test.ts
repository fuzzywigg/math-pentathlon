/**
 * Wave 44 — Fab-a-Diffy executeMove missing bars / null selection leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
} from '../../src/games/fab-a-diffy/rules';
import type { FabADiffyState } from '../../src/games/fab-a-diffy/types';

describe('Wave 44 Fab — executeMove missing selection / bars', () => {
  it('confirmingMove with null selectedOperation → identity', () => {
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    const mid: FabADiffyState = {
      ...state,
      phase: 'confirmingMove',
      selectedBar1: ids[0],
      selectedBar2: ids[1],
      selectedOperation: null,
    };
    const answerId = [...state.answerBars.keys()][0];
    expect(executeMove(mid, answerId)).toBe(mid);
  });

  it('confirmingMove with bar ids deleted from map → identity', () => {
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    let mid = selectBar1(state, ids[0]);
    mid = selectBar2(mid, ids[1]);
    mid = selectOperation(mid, 'add');
    const bars = new Map(mid.fractionBars);
    bars.delete(ids[0]);
    bars.delete(ids[1]);
    const broken: FabADiffyState = { ...mid, fractionBars: bars };
    const answerId = [...broken.answerBars.keys()][0];
    expect(executeMove(broken, answerId)).toBe(broken);
  });

  it('null selectedBar1 despite confirmingMove → identity', () => {
    const state = createInitialState();
    const mid: FabADiffyState = {
      ...state,
      phase: 'confirmingMove',
      selectedBar1: null,
      selectedBar2: [...state.fractionBars.keys()][0],
      selectedOperation: 'multiply',
    };
    expect(executeMove(mid, [...state.answerBars.keys()][0])).toBe(mid);
  });
});
