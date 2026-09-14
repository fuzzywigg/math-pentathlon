/**
 * Wave 54 leftover after #237 — FIAR hard opening placement leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { getAIMove, applyAIMove } from '../../src/games/fiar/ai';
import { canPlaceChip } from '../../src/games/fiar/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 54 fiar — hard place opening', () => {
  it('hard place is legal and applyAIMove occupies the node', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'hard');
    expect(move?.type).toBe('place');
    expect(move?.nodeId).toBeTruthy();
    expect(canPlaceChip(state, move!.nodeId!)).toBe(true);
    const next = applyAIMove(state, move!);
    expect(next.board.nodes.get(move!.nodeId!)?.chip).toBe('player1');
    expect(next.chipsPlaced.player1).toBe(1);
  });
});
