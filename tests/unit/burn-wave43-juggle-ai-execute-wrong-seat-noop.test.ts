/**
 * Wave 43 — executeAITurn wrong seat leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, doRollDice } from '../../src/games/juggle/rules';
import { executeAITurn } from '../../src/games/juggle/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 juggle — execute wrong seat', () => {
  it('executeAITurn for wrong seat leaves state', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const s = doRollDice(createInitialState());
    const next = executeAITurn(s, 'player2', 'easy');
    expect(next).toEqual(s);
  });
});
