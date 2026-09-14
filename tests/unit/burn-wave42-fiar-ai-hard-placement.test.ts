/**
 * Wave 42 — FIAR AI hard placement on a nearly-full board (few candidates).
 * Depth-3 on an empty 5×5 is too slow for unit CI; constrain empties. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, BoardNode } from '../../src/games/fiar/types';
import { canPlaceChip } from '../../src/games/fiar/rules';
import { getAIMove } from '../../src/games/fiar/ai';

afterEach(() => vi.restoreAllMocks());

function nearlyFullPlacement() {
  const state = createInitialState();
  const nodes = new Map(state.board.nodes);
  let i = 0;
  for (const [id, node] of nodes) {
    // Leave only two empties near center
    if (id === '2-2' || id === '2-3') continue;
    const owner = i % 2 === 0 ? 'player1' : 'player2';
    nodes.set(id, { ...node, chip: owner as BoardNode['chip'] });
    i++;
  }
  return {
    ...state,
    board: { ...state.board, nodes },
    chipsPlaced: { player1: 3, player2: 3 },
    currentPlayer: 'player1' as const,
    phase: 'placement' as const,
  };
}

describe('Wave 42 FIAR AI — hard placement', () => {
  it('hard returns one of the two remaining empties', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = nearlyFullPlacement();
    const move = getAIMove(state, 'player1', 'hard');
    expect(move?.type).toBe('place');
    expect(['2-2', '2-3']).toContain(move!.nodeId);
    expect(canPlaceChip(state, move!.nodeId!)).toBe(true);
  });

  it('hard as player2 also places on remaining empty', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = { ...nearlyFullPlacement(), currentPlayer: 'player2' as const };
    const move = getAIMove(state, 'player2', 'hard');
    expect(move?.type).toBe('place');
    expect(canPlaceChip(state, move!.nodeId!)).toBe(true);
  });
});
