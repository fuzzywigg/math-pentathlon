/**
 * Wave 44 — Fab-a-Diffy applyAIMoveSteps selectBar2 failure leftovers.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { applyAIMoveSteps, type AIMove } from '../../src/games/fab-a-diffy/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 Fab AI — applyAIMoveSteps selectBar2 fail', () => {
  it('same bar1/bar2 → passTurn with console.error', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const state = createInitialState();
    const id = [...state.fractionBars.keys()][0];
    const bad: AIMove = {
      bar1Id: id,
      bar2Id: id,
      operation: 'add',
      answerId: [...state.answerBars.keys()][0],
    };
    const next = applyAIMoveSteps(state, bad);
    expect(next.moveHistory).toHaveLength(0);
    expect(next.currentPlayer).toBe('player2');
    expect(errorSpy).toHaveBeenCalled();
  });

  it('used bar2 → passTurn without claiming', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    const bars = new Map(state.fractionBars);
    bars.set(ids[1], { ...bars.get(ids[1])!, used: true });
    const jammed = { ...state, fractionBars: bars };
    const bad: AIMove = {
      bar1Id: ids[0],
      bar2Id: ids[1],
      operation: 'multiply',
      answerId: [...state.answerBars.keys()][0],
    };
    const next = applyAIMoveSteps(jammed, bad);
    expect(next.scores.player1).toBe(0);
    expect(next.currentPlayer).toBe('player2');
    expect(errorSpy).toHaveBeenCalled();
  });
});
