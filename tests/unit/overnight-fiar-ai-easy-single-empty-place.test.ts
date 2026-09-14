/**
 * Overnight TOKENMAXX — FIAR easy AI single-empty place leftover. Tests-only.
 * Avoids hard minimax on open board (CI timeout risk per #213).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { getAIMove } from '../../src/games/fiar/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight fiar — easy single empty', () => {
  it('easy places the sole empty node', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    for (const [, node] of state.board.nodes) {
      if (node.id !== '2-2') node.chip = 'player2';
    }
    state.chipsPlaced = { player1: 0, player2: 0 }; // still placement
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.type).toBe('place');
    expect(move!.nodeId).toBe('2-2');
  });
});
