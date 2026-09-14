/**
 * Wave 43 TOKENMAXX — Fab executeMove missing-bar / null-result gates. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
} from '../../src/games/fab-a-diffy/rules';

describe('Wave 43 fab — executeMove missing bars', () => {
  it('identity when selected bars vanish from map', () => {
    let state = createInitialState();
    const [a, b] = [...state.fractionBars.keys()];
    const answerId = [...state.answerBars.keys()][0];
    state = selectBar1(state, a);
    state = selectBar2(state, b);
    state = selectOperation(state, 'add');

    const brokenBars = new Map(state.fractionBars);
    brokenBars.delete(a);
    const broken = { ...state, fractionBars: brokenBars };
    expect(executeMove(broken, answerId)).toBe(broken);

    const noAnswer = {
      ...state,
      answerBars: new Map(state.answerBars),
    };
    noAnswer.answerBars.delete(answerId);
    expect(executeMove(noAnswer, answerId)).toBe(noAnswer);
  });

  it('identity when confirmingMove lacks selectedOperation', () => {
    const state = createInitialState();
    const [a, b] = [...state.fractionBars.keys()];
    const answerId = [...state.answerBars.keys()][0];
    const forged = {
      ...state,
      phase: 'confirmingMove' as const,
      selectedBar1: a,
      selectedBar2: b,
      selectedOperation: null,
    };
    expect(executeMove(forged, answerId)).toBe(forged);
  });
});
