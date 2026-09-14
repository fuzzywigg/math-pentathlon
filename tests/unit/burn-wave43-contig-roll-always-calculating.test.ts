/**
 * Wave 43 — Contig doRollDice always enters calculating. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { doRollDice } from '../../src/games/contig-60/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 contig — roll always calculating', () => {
  it('even on full board phase becomes calculating', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    for (const cell of state.cells.values()) cell.owner = 'player1';
    const next = doRollDice(state);
    expect(next.phase).toBe('calculating');
    expect(next.currentDice).not.toBeNull();
  });
});
