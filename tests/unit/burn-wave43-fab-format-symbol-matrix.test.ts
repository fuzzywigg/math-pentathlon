/**
 * Wave 43 TOKENMAXX — Fab formatMove / op symbols leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getOperationSymbol,
  formatMove,
} from '../../src/games/fab-a-diffy/rules';
import type { FabMove } from '../../src/games/fab-a-diffy/types';

describe('Wave 43 fab — format / symbols', () => {
  it('operation symbols cover four ops', () => {
    expect(getOperationSymbol('add')).toBe('+');
    expect(getOperationSymbol('subtract')).toBe('−');
    expect(getOperationSymbol('multiply')).toBe('×');
    expect(getOperationSymbol('divide')).toBe('÷');
  });

  it('formatMove renders known bars and falls back for missing', () => {
    const state = createInitialState();
    const [b1, b2] = [...state.fractionBars.keys()];
    const [ans] = [...state.answerBars.keys()];
    const move: FabMove = {
      player: 'player1',
      bar1Id: b1,
      bar2Id: b2,
      operation: 'add',
      resultId: ans,
      moveNumber: 1,
    };
    const text = formatMove(state, move);
    expect(text).toContain('+');
    expect(text).toContain('=');
    expect(formatMove(state, { ...move, bar1Id: 'nope' })).toBe('?');
  });
});
