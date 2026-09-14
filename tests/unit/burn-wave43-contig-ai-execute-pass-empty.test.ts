/**
 * Wave 43 — Contig executeAITurn passes when no placements. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { executeAITurn, isAITurn } from '../../src/games/contig-60/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 contig — AI pass when empty placements', () => {
  it('fills board then AI pass increments consecutivePasses', () => {
    const state = createInitialState();
    for (const cell of state.cells.values()) cell.owner = 'player2';
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const next = executeAITurn(state, 'player1', 'easy');
    expect(next.currentPlayer).toBe('player2');
    expect(next.consecutivePasses.player1).toBe(1);
  });
});
