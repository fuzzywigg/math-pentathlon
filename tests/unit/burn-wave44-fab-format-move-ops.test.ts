/**
 * Wave 44 — Fab-a-Diffy formatMove real history strings leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  formatMove,
  getOperationSymbol,
} from '../../src/games/fab-a-diffy/rules';
import type { FabMove, FabADiffyState } from '../../src/games/fab-a-diffy/types';

describe('Wave 44 Fab — formatMove all ops', () => {
  function board(): FabADiffyState {
    const state = createInitialState();
    const fractionBars = new Map(state.fractionBars);
    const answerBars = new Map(state.answerBars);
    fractionBars.clear();
    answerBars.clear();
    fractionBars.set('b1', {
      id: 'b1',
      fraction: { numerator: 1, denominator: 2 },
      owner: null,
      used: true,
    });
    fractionBars.set('b2', {
      id: 'b2',
      fraction: { numerator: 1, denominator: 4 },
      owner: null,
      used: true,
    });
    answerBars.set('r', {
      id: 'r',
      fraction: { numerator: 3, denominator: 4 },
      claimedBy: 'player1',
    });
    return { ...state, fractionBars, answerBars };
  }

  function move(op: FabMove['operation']): FabMove {
    return {
      player: 'player1',
      bar1Id: 'b1',
      bar2Id: 'b2',
      operation: op,
      resultId: 'r',
      moveNumber: 1,
    };
  }

  it('formats add / subtract / multiply / divide with symbols', () => {
    const state = board();
    expect(formatMove(state, move('add'))).toBe(
      `1/2 ${getOperationSymbol('add')} 1/4 = 3/4`
    );
    expect(formatMove(state, move('subtract'))).toBe(
      `1/2 ${getOperationSymbol('subtract')} 1/4 = 3/4`
    );
    expect(formatMove(state, move('multiply'))).toBe(
      `1/2 ${getOperationSymbol('multiply')} 1/4 = 3/4`
    );
    expect(formatMove(state, move('divide'))).toBe(
      `1/2 ${getOperationSymbol('divide')} 1/4 = 3/4`
    );
  });

  it('missing answer id → ? even when bars exist', () => {
    const state = board();
    expect(
      formatMove(state, {
        ...move('add'),
        resultId: 'gone',
      })
    ).toBe('?');
  });

  it('missing only bar2 → ?', () => {
    const state = board();
    expect(
      formatMove(state, {
        ...move('multiply'),
        bar2Id: 'missing-bar',
      })
    ).toBe('?');
  });
});
