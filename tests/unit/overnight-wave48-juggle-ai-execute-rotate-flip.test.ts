/**
 * Wave 48 overnight — Juggle executeAITurn from selectingShape. Tests-only.
 * Single random=0; no hard spy storm (#213).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, doRollDice } from '../../src/games/juggle/rules';
import { executeAITurn } from '../../src/games/juggle/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 juggle overnight — executeAITurn', () => {
  it('medium execute after roll places a piece', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const rolled = doRollDice(createInitialState());
    const next = executeAITurn(rolled, 'player1', 'medium');
    expect(next.moveHistory.length).toBeGreaterThanOrEqual(1);
    expect(next.boards.player1.cells.flat().some(Boolean)).toBe(true);
  });
});
