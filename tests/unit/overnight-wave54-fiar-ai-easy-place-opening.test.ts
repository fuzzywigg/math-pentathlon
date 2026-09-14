/**
 * Wave 54 leftover after #237 — FIAR easy opening placement leftover.
 * Hard depth-3 on empty 5x5 is too slow for unit CI; easy maxDepth 1 is residual.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { getAIMove, applyAIMove } from '../../src/games/fiar/ai';
import { canPlaceChip } from '../../src/games/fiar/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 54 fiar — easy place opening', () => {
  it('easy place is legal and applyAIMove occupies the node', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move?.type).toBe('place');
    expect(move?.nodeId).toBeTruthy();
    expect(canPlaceChip(state, move!.nodeId!)).toBe(true);
    const next = applyAIMove(state, move!);
    expect(next.board.nodes.get(move!.nodeId!)?.chip).toBe('player1');
    expect(next.chipsPlaced.player1).toBe(1);
  });
});
