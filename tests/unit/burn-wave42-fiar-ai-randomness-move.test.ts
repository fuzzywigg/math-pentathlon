/**
 * Wave 42 — FIAR AI movement randomness branch.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { placeChip } from '../../src/games/fiar/rules';
import { getAIMove } from '../../src/games/fiar/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 FIAR AI — move randomness', () => {
  it('easy movement with random<0.4 returns move payload', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.05);
    let state = createInitialState();
    for (let i = 0; i < 8; i++) {
      const empty = [...state.board.nodes.entries()].find(([, n]) => n.chip === null)?.[0]!;
      state = placeChip(state, empty);
    }
    const move = getAIMove(state, state.currentPlayer, 'easy');
    expect(move?.type).toBe('move');
    expect(move!.from).toBeTruthy();
    expect(move!.to).toBeTruthy();
  });
});
