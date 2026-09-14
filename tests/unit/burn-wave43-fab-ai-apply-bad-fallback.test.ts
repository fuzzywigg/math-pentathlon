/**
 * Wave 43 TOKENMAXX — Fab applyAIMoveSteps bad-move fallback. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { applyAIMoveSteps } from '../../src/games/fab-a-diffy/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 fab — applyAIMoveSteps fallback', () => {
  it('bad bar1 falls back to passTurn (seat flip)', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const state = createInitialState();
    const [real] = [...state.fractionBars.keys()];
    const [ans] = [...state.answerBars.keys()];
    const next = applyAIMoveSteps(state, {
      bar1Id: 'missing',
      bar2Id: real,
      operation: 'add',
      answerId: ans,
    });
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('selectingBar1');
    expect(next.moveHistory).toHaveLength(0);
  });
});
