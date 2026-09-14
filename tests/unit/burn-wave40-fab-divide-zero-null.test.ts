/**
 * Wave 40 — Fab-a-Diffy calculateResult divide-by-zero + unknown op.
 * Tests-only leftover after #178. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  calculateResult,
  selectOperation,
  executeMove,
  createInitialState,
  getOperationSymbol,
} from '../../src/games/fab-a-diffy/rules';
import type { FractionOperation } from '../../src/core/fractions/types';

describe('Wave 40 fab — divide-zero / unknown op', () => {
  it('calculateResult divide by zero numerator returns null', () => {
    expect(
      calculateResult({ numerator: 1, denominator: 2 }, { numerator: 0, denominator: 1 }, 'divide')
    ).toBeNull();
  });

  it('calculateResult add still works beside divide-zero', () => {
    const r = calculateResult(
      { numerator: 1, denominator: 2 },
      { numerator: 1, denominator: 3 },
      'add'
    );
    expect(r).toEqual({ numerator: 5, denominator: 6 });
  });

  it('calculateResult unknown operation returns null', () => {
    expect(
      calculateResult(
        { numerator: 1, denominator: 2 },
        { numerator: 1, denominator: 3 },
        'xor' as FractionOperation
      )
    ).toBeNull();
  });

  it('selectOperation / executeMove identity when bars missing or wrong phase', () => {
    const state = createInitialState();
    expect(selectOperation(state, 'add')).toBe(state);
    expect(executeMove(state, 'answer-0')).toBe(state);

    const missingBars = {
      ...state,
      phase: 'selectingOperation' as const,
      selectedBar1: null,
      selectedBar2: null,
    };
    expect(selectOperation(missingBars, 'multiply')).toBe(missingBars);

    const confirmingEmpty = {
      ...state,
      phase: 'confirmingMove' as const,
      selectedBar1: null,
      selectedBar2: 'bar-1',
      selectedOperation: 'add' as const,
    };
    expect(executeMove(confirmingEmpty, 'answer-0')).toBe(confirmingEmpty);
  });

  it('getOperationSymbol covers four ops', () => {
    expect(getOperationSymbol('add')).toBe('+');
    expect(getOperationSymbol('subtract')).toBe('−');
    expect(getOperationSymbol('multiply')).toBe('×');
    expect(getOperationSymbol('divide')).toBe('÷');
  });
});
