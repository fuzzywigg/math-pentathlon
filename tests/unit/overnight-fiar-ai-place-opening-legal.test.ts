/**
 * Overnight HEAVY — FIAR easy AI opening placement is legal + phase place.
 * Uses easy (depth 1) to keep overnight suite light. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIMove, applyAIMove } from '../../src/games/fiar/ai';
import { canPlaceChip } from '../../src/games/fiar/rules';
import { createInitialState } from '../../src/games/fiar/types';

afterEach(() => vi.restoreAllMocks());

describe('Overnight fiar — AI opening place', () => {
  it('easy with randomness off returns place on empty legal node', () => {
    vi.spyOn(Math, 'random').mockReturnValue(1);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.type).toBe('place');
    expect(move!.nodeId).toBeTruthy();
    expect(canPlaceChip(state, move!.nodeId!)).toBe(true);
    const next = applyAIMove(state, move!);
    expect(next.chipsPlaced.player1).toBe(1);
    expect(next.currentPlayer).toBe('player2');
  });
});
