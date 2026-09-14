/**
 * Wave 35 — Fab-a-Diffy formatMove / operation symbols / possible results.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  formatMove,
  getOperationSymbol,
  getPossibleResults,
} from '../../src/games/fab-a-diffy/rules';

describe('Wave 35 Fab-a-Diffy — format helpers', () => {
  it('getOperationSymbol matrix covers four ops', () => {
    expect(getOperationSymbol('add')).toBe('+');
    expect(getOperationSymbol('subtract')).toBe('−');
    expect(getOperationSymbol('multiply')).toBe('×');
    expect(getOperationSymbol('divide')).toBe('÷');
  });

  it('formatMove returns ? for unknown bar ids', () => {
    const state = createInitialState();
    expect(
      formatMove(state, {
        player: 'player1',
        bar1Id: 'x',
        bar2Id: 'y',
        operation: 'add',
        resultId: 'z',
        moveNumber: 1,
      })
    ).toBe('?');
  });

  it('formatMove renders real bars with symbol', () => {
    const state = createInitialState();
    const barIds = [...state.fractionBars.keys()];
    const answerIds = [...state.answerBars.keys()];
    const formatted = formatMove(state, {
      player: 'player1',
      bar1Id: barIds[0],
      bar2Id: barIds[1],
      operation: 'multiply',
      resultId: answerIds[0],
      moveNumber: 1,
    });
    expect(formatted).toContain('×');
    expect(formatted).toContain('=');
  });

  it('getPossibleResults returns nonempty ops including reverse subtract/divide', () => {
    const state = createInitialState();
    const bars = [...state.fractionBars.values()];
    const results = getPossibleResults(bars[0], bars[1]);
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThanOrEqual(6);
    for (const r of results) {
      expect(['add', 'subtract', 'multiply', 'divide']).toContain(r.operation);
    }
  });
});
