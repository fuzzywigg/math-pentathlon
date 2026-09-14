/**
 * Wave 44 overnight HEAVY — Fab symbols + formatMove.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getOperationSymbol,
  formatMove,
} from '../../src/games/fab-a-diffy/rules';

describe('Wave 44 fab — symbols / formatMove', () => {
  it('symbol matrix', () => {
    expect(getOperationSymbol('add')).toBe('+');
    expect(getOperationSymbol('subtract')).toBe('−');
    expect(getOperationSymbol('multiply')).toBe('×');
    expect(getOperationSymbol('divide')).toBe('÷');
  });

  it('formatMove happy and missing → ?', () => {
    const s = createInitialState();
    const barIds = [...s.fractionBars.keys()];
    const ansIds = [...s.answerBars.keys()];
    const move = {
      player: 'player1' as const,
      bar1Id: barIds[0],
      bar2Id: barIds[1],
      operation: 'add' as const,
      resultId: ansIds[0],
      moveNumber: 1,
    };
    expect(formatMove(s, move)).toMatch(/=/);
    expect(formatMove(s, { ...move, bar1Id: 'missing' })).toBe('?');
  });
});
