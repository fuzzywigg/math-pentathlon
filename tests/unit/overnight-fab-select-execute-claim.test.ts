/**
 * Overnight TOKENMAXX — Fab select/execute claim leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
  clearSelection,
  findMatchingAnswers,
  calculateResult,
} from '../../src/games/fab-a-diffy/rules';

describe('Overnight fab — select/execute claim path', () => {
  it('full claim path scores and flips seat', () => {
    let state = createInitialState();
    const unused = [...state.fractionBars.values()].filter((b) => !b.used);
    // Find a pair+op that matches an unclaimed answer
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
    expect(state.phase).toBe('confirmingMove');
    state = executeMove(state, found!.ans);
    expect(state.scores.player1).toBe(1);
    expect(state.phase).toBe('selectingBar1');
    expect(state.currentPlayer).toBe('player2');
    expect(state.answerBars.get(found!.ans)?.claimedBy).toBe('player1');
  });

  it('clearSelection resets mid-select', () => {
    let state = createInitialState();
    const first = [...state.fractionBars.keys()][0];
    state = selectBar1(state, first);
    state = clearSelection(state);
    expect(state.phase).toBe('selectingBar1');
    expect(state.selectedBar1).toBeNull();
  });

  it('used bar / wrong phase / claimed answer are identity', () => {
    let state = createInitialState();
    const id = [...state.fractionBars.keys()][0];
    expect(selectBar2(state, id)).toBe(state);
    state = { ...state, phase: 'confirmingMove', selectedBar1: id, selectedBar2: id, selectedOperation: 'add' };
    const claimedId = [...state.answerBars.keys()][0];
    const answers = new Map(state.answerBars);
    answers.set(claimedId, { ...answers.get(claimedId)!, claimedBy: 'player2' });
    state = { ...state, answerBars: answers };
    expect(executeMove(state, claimedId)).toEqual(state);
  });
});
