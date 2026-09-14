/**
 * Wave 41 — Fab-a-Diffy select/ops/execute leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  selectBar1,
  selectBar2,
  clearSelection,
  selectOperation,
  executeMove,
  findMatchingAnswers,
  calculateResult,
  getPossibleResults,
} from '../../src/games/fab-a-diffy/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 41 Fab — select / clear / op gates', () => {
  it('selectBar1 wrong phase / used / missing is identity', () => {
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    expect(selectBar1({ ...state, phase: 'selectingBar2' }, ids[0])).toEqual({
      ...state,
      phase: 'selectingBar2',
    });
    expect(selectBar1(state, 'no-such-bar')).toBe(state);
    const used = {
      ...state,
      fractionBars: new Map(state.fractionBars),
    };
    used.fractionBars.set(ids[0], {
      ...used.fractionBars.get(ids[0])!,
      used: true,
    });
    expect(selectBar1(used, ids[0])).toBe(used);
  });

  it('selectBar1 → selectBar2 → clearSelection restores selectingBar1', () => {
    let state = createInitialState();
    const [a, b] = [...state.fractionBars.keys()];
    state = selectBar1(state, a);
    expect(state.phase).toBe('selectingBar2');
    expect(state.selectedBar1).toBe(a);
    expect(selectBar2(state, a)).toBe(state); // same bar rejected
    state = selectBar2(state, b);
    expect(state.phase).toBe('selectingOperation');
    expect(state.selectedBar2).toBe(b);
    state = clearSelection(state);
    expect(state.phase).toBe('selectingBar1');
    expect(state.selectedBar1).toBeNull();
    expect(state.selectedBar2).toBeNull();
    expect(state.selectedOperation).toBeNull();
  });

  it('selectOperation only from selectingOperation with both bars', () => {
    let state = createInitialState();
    const [a, b] = [...state.fractionBars.keys()];
    expect(selectOperation(state, 'add')).toBe(state);
    state = selectBar1(state, a);
    expect(selectOperation(state, 'add')).toBe(state);
    state = selectBar2(state, b);
    state = selectOperation(state, 'multiply');
    expect(state.phase).toBe('confirmingMove');
    expect(state.selectedOperation).toBe('multiply');
  });

  it('full legal claim path records history and flips seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState();
    const bars = [...state.fractionBars.values()].filter((b) => !b.used);
    let found: {
      b1: string;
      b2: string;
      op: 'add' | 'subtract' | 'multiply' | 'divide';
      answer: string;
    } | null = null;
    outer: for (let i = 0; i < bars.length; i++) {
      for (let j = i + 1; j < bars.length; j++) {
        for (const { operation, result } of getPossibleResults(bars[i], bars[j])) {
          const matches = findMatchingAnswers(state, result);
          if (matches.length) {
            found = {
              b1: bars[i].id,
              b2: bars[j].id,
              op: operation,
              answer: matches[0],
            };
            break outer;
          }
        }
      }
    }
    expect(found).not.toBeNull();
    state = selectBar1(state, found!.b1);
    state = selectBar2(state, found!.b2);
    state = selectOperation(state, found!.op);
    const next = executeMove(state, found!.answer);
    expect(next.moveHistory).toHaveLength(1);
    expect(next.scores.player1).toBe(1);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('selectingBar1');
    expect(next.answerBars.get(found!.answer)?.claimedBy).toBe('player1');
    expect(next.fractionBars.get(found!.b1)?.used).toBe(true);
    expect(next.fractionBars.get(found!.b2)?.used).toBe(true);
  });

  it('executeMove rejects wrong phase, claimed answer, mismatch', () => {
    const state = createInitialState();
    const answerId = [...state.answerBars.keys()][0];
    expect(executeMove(state, answerId)).toBe(state);
    const [a, b] = [...state.fractionBars.keys()];
    let mid = selectBar1(state, a);
    mid = selectBar2(mid, b);
    mid = selectOperation(mid, 'add');
    const claimed = {
      ...mid,
      answerBars: new Map(mid.answerBars),
    };
    claimed.answerBars.set(answerId, {
      ...claimed.answerBars.get(answerId)!,
      claimedBy: 'player2',
    });
    expect(executeMove(claimed, answerId)).toBe(claimed);
    // mismatched result for add may still reject if answer not equivalent
    const result = calculateResult(
      mid.fractionBars.get(a)!.fraction,
      mid.fractionBars.get(b)!.fraction,
      'add'
    )!;
    const nonMatch = [...mid.answerBars.entries()].find(
      ([, ans]) =>
        ans.claimedBy === null &&
        (ans.fraction.numerator !== result.numerator ||
          ans.fraction.denominator !== result.denominator)
    );
    if (nonMatch) {
      expect(executeMove(mid, nonMatch[0])).toBe(mid);
    }
  });
});
