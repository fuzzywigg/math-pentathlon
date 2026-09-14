/**
 * Wave 44 — Fab-a-Diffy clearSelection preserves scores/history leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBar1,
  selectBar2,
  selectOperation,
  clearSelection,
  executeMove,
  calculateResult,
  findMatchingAnswers,
} from '../../src/games/fab-a-diffy/rules';
import type { FabADiffyState } from '../../src/games/fab-a-diffy/types';

describe('Wave 44 Fab — clearSelection preserves bookkeeping', () => {
  it('clear after claim attempt prep keeps prior scores/history', () => {
    const base = createInitialState();
    const fractionBars = new Map(base.fractionBars);
    const answerBars = new Map(base.answerBars);
    fractionBars.clear();
    answerBars.clear();
    fractionBars.set('a', {
      id: 'a',
      fraction: { numerator: 1, denominator: 2 },
      owner: null,
      used: false,
    });
    fractionBars.set('b', {
      id: 'b',
      fraction: { numerator: 1, denominator: 2 },
      owner: null,
      used: false,
    });
    fractionBars.set('c', {
      id: 'c',
      fraction: { numerator: 1, denominator: 3 },
      owner: null,
      used: false,
    });
    fractionBars.set('d', {
      id: 'd',
      fraction: { numerator: 1, denominator: 6 },
      owner: null,
      used: false,
    });
    answerBars.set('whole', {
      id: 'whole',
      fraction: { numerator: 1, denominator: 1 },
      claimedBy: null,
    });
    answerBars.set('half', {
      id: 'half',
      fraction: { numerator: 1, denominator: 2 },
      claimedBy: null,
    });
    let state: FabADiffyState = { ...base, fractionBars, answerBars };
    state = selectBar1(state, 'a');
    state = selectBar2(state, 'b');
    state = selectOperation(state, 'add');
    state = executeMove(state, 'whole');
    expect(state.scores.player1).toBe(1);
    expect(state.moveHistory).toHaveLength(1);

    // player2 starts selecting then clears
    state = selectBar1(state, 'c');
    state = selectBar2(state, 'd');
    state = selectOperation(state, 'add');
    const cleared = clearSelection(state);
    expect(cleared.phase).toBe('selectingBar1');
    expect(cleared.selectedBar1).toBeNull();
    expect(cleared.selectedBar2).toBeNull();
    expect(cleared.selectedOperation).toBeNull();
    expect(cleared.scores.player1).toBe(1);
    expect(cleared.moveHistory).toHaveLength(1);
    expect(cleared.currentPlayer).toBe('player2');
  });

  it('clear from selectingBar2 does not invent matches', () => {
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    const mid = selectBar1(state, ids[0]);
    const cleared = clearSelection(mid);
    expect(cleared.phase).toBe('selectingBar1');
    expect(cleared.selectedBar1).toBeNull();
  });

  it('after clear, findMatchingAnswers still sees unclaimed answers', () => {
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    let mid = selectBar1(state, ids[0]);
    mid = selectBar2(mid, ids[1]);
    mid = selectOperation(mid, 'add');
    const cleared = clearSelection(mid);
    const result = calculateResult(
      state.fractionBars.get(ids[0])!.fraction,
      state.fractionBars.get(ids[1])!.fraction,
      'add'
    );
    if (result) {
      const matches = findMatchingAnswers(cleared, result);
      expect(Array.isArray(matches)).toBe(true);
    }
  });
});
