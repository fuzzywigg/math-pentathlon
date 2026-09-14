/**
 * Wave 41 — Fab-a-Diffy result/match matrix leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  calculateResult,
  getPossibleResults,
  findMatchingAnswers,
  getOperationSymbol,
  formatMove,
} from '../../src/games/fab-a-diffy/rules';
import type { FractionBar, FabMove } from '../../src/games/fab-a-diffy/types';
import {
  createBarId,
  createAnswerId,
  getOpponent,
  shuffleArray,
  FRACTION_BAR_VALUES,
  ANSWER_BAR_VALUES,
} from '../../src/games/fab-a-diffy/types';

function bar(id: string, n: number, d: number): FractionBar {
  return { id, fraction: { numerator: n, denominator: d }, owner: null, used: false };
}

describe('Wave 41 Fab — calculateResult / possibleResults matrix', () => {
  it.each([
    ['add', { numerator: 1, denominator: 2 }, { numerator: 1, denominator: 3 }, 5 / 6],
    ['subtract', { numerator: 3, denominator: 4 }, { numerator: 1, denominator: 4 }, 0.5],
    ['multiply', { numerator: 1, denominator: 2 }, { numerator: 1, denominator: 3 }, 1 / 6],
    ['divide', { numerator: 1, denominator: 2 }, { numerator: 1, denominator: 4 }, 2],
  ] as const)('%s yields expected simplified value', (op, a, b, approx) => {
    const r = calculateResult(a, b, op);
    expect(r).not.toBeNull();
    expect(r!.numerator / r!.denominator).toBeCloseTo(approx, 5);
  });

  it('divide by zero and unknown op return null', () => {
    expect(
      calculateResult(
        { numerator: 1, denominator: 2 },
        { numerator: 0, denominator: 1 },
        'divide'
      )
    ).toBeNull();
    expect(
      calculateResult(
        { numerator: 1, denominator: 2 },
        { numerator: 1, denominator: 3 },
        // @ts-expect-error intentional invalid op
        'modulo'
      )
    ).toBeNull();
  });

  it('getPossibleResults includes reverse subtract/divide when distinct', () => {
    const a = bar('a', 1, 2);
    const b = bar('b', 1, 4);
    const results = getPossibleResults(a, b);
    const ops = results.map((r) => r.operation);
    expect(ops).toContain('add');
    expect(ops).toContain('multiply');
    expect(ops).toContain('subtract');
    expect(ops).toContain('divide');
    expect(results.every((r) => r.result.numerator >= 0)).toBe(true);
  });

  it('negative subtract path is filtered out', () => {
    const a = bar('a', 1, 8);
    const b = bar('b', 7, 8);
    const results = getPossibleResults(a, b);
    // 1/8 - 7/8 is negative; reverse 7/8 - 1/8 is positive
    expect(
      results.some(
        (r) =>
          r.operation === 'subtract' &&
          r.result.numerator / r.result.denominator === 0.75
      )
    ).toBe(true);
  });
});

describe('Wave 41 Fab — matching / display helpers / types', () => {
  it('findMatchingAnswers returns unclaimed equivalents only', () => {
    const state = createInitialState();
    const first = [...state.answerBars.values()][0];
    const matches = findMatchingAnswers(state, first.fraction);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((id) => state.answerBars.get(id)?.claimedBy === null)).toBe(
      true
    );
    const claimed = {
      ...state,
      answerBars: new Map(state.answerBars),
    };
    for (const id of matches) {
      claimed.answerBars.set(id, {
        ...claimed.answerBars.get(id)!,
        claimedBy: 'player1',
      });
    }
    expect(findMatchingAnswers(claimed, first.fraction)).toEqual([]);
  });

  it('getOperationSymbol + formatMove cover all ops', () => {
    expect(getOperationSymbol('add')).toBe('+');
    expect(getOperationSymbol('subtract')).toBe('−');
    expect(getOperationSymbol('multiply')).toBe('×');
    expect(getOperationSymbol('divide')).toBe('÷');
    const state = createInitialState();
    const [b1, b2] = [...state.fractionBars.keys()];
    const answerId = [...state.answerBars.keys()][0];
    const move: FabMove = {
      player: 'player1',
      bar1Id: b1,
      bar2Id: b2,
      operation: 'add',
      resultId: answerId,
      moveNumber: 1,
    };
    const formatted = formatMove(state, move);
    expect(formatted).toContain('+');
    expect(formatted).toContain('=');
    expect(formatMove(state, { ...move, bar1Id: 'missing' })).toBe('?');
  });

  it('type helpers: ids, opponent, shuffle, catalogs nonempty', () => {
    expect(createBarId(3)).toContain('3');
    expect(createAnswerId(7)).toContain('7');
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
    expect(FRACTION_BAR_VALUES.length).toBeGreaterThan(5);
    expect(ANSWER_BAR_VALUES.length).toBeGreaterThan(5);
    const arr = [1, 2, 3, 4];
    const shuffled = shuffleArray(arr);
    expect(shuffled).toHaveLength(4);
    expect(shuffled.sort()).toEqual([1, 2, 3, 4]);
    expect(arr).toEqual([1, 2, 3, 4]); // original untouched
  });
});
