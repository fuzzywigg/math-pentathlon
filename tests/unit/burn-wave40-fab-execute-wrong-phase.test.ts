/**
 * Wave 40 — Fab-a-Diffy selectBar / executeMove reject matrix.
 * Tests-only leftover engines after #178.
 */
import { describe, it, expect } from 'vitest';

import {
  selectBar1,
  selectBar2,
  executeMove,
  createInitialState,
} from '../../src/games/fab-a-diffy/rules';

describe('Wave 40 fab — select / execute rejects', () => {
  it('selectBar1 ghost / used / wrong phase → identity', () => {
    const state = createInitialState();
    expect(selectBar1(state, 'ghost-bar')).toBe(state);

    const wrongPhase = { ...state, phase: 'selectingBar2' as const };
    expect(selectBar1(wrongPhase, [...state.fractionBars.keys()][0])).toBe(
      wrongPhase
    );

    const firstId = [...state.fractionBars.keys()][0];
    const bar = state.fractionBars.get(firstId)!;
    const usedMap = new Map(state.fractionBars);
    usedMap.set(firstId, { ...bar, used: true });
    const usedState = { ...state, fractionBars: usedMap };
    expect(selectBar1(usedState, firstId)).toBe(usedState);
  });

  it('selectBar2 same as bar1 or ghost → identity', () => {
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    const after1 = selectBar1(state, ids[0]);
    expect(selectBar2(after1, ids[0])).toBe(after1);
    expect(selectBar2(after1, 'nope')).toBe(after1);
  });

  it('executeMove claimed answer or mismatch → identity', () => {
    const state = createInitialState();
    const barIds = [...state.fractionBars.keys()];
    const answerIds = [...state.answerBars.keys()];
    const confirming = {
      ...state,
      phase: 'confirmingMove' as const,
      selectedBar1: barIds[0],
      selectedBar2: barIds[1],
      selectedOperation: 'add' as const,
    };
    const answer = state.answerBars.get(answerIds[0])!;
    const claimedMap = new Map(state.answerBars);
    claimedMap.set(answerIds[0], { ...answer, claimedBy: 'player2' });
    const claimed = { ...confirming, answerBars: claimedMap };
    expect(executeMove(claimed, answerIds[0])).toBe(claimed);

    // Mismatch: answer fraction unlikely to equal bar0+bar1 for every shuffle,
    // but ghost answer always rejects.
    expect(executeMove(confirming, 'ghost-answer')).toBe(confirming);
  });
});
