/**
 * Wave 42 leftovers B — FIAR applyAIMove after seed place sequence.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/fiar/types';
import { placeChip, getValidMoves } from '../../src/games/fiar/rules';
import { applyAIMove, getAIMove } from '../../src/games/fiar/ai';

describe('Wave 42 fiar — apply after placements', () => {
  it('placeChip then applyAIMove place for p2', () => {
    let state = createInitialState();
    state = placeChip(state, '2-2');
    expect(state.currentPlayer).toBe('player2');
    const ai = getAIMove(state, 'player2', 'easy');
    expect(ai?.type).toBe('place');
    const next = applyAIMove(state, ai!);
    expect(next.chipsPlaced.player2).toBe(1);
    expect(next.currentPlayer).toBe('player1');
  });

  it('movement getValidMoves non-empty after 8 placements', () => {
    let state = createInitialState();
    const ids = ['0-0', '0-4', '4-0', '4-4', '0-1', '0-3', '4-1', '4-3'];
    for (const id of ids) {
      state = placeChip(state, id);
    }
    expect(state.phase).toBe('movement');
    const own = [...state.board.nodes.values()].find(
      (n) => n.chip === state.currentPlayer
    )!;
    const moves = getValidMoves(state, own.id);
    expect(Array.isArray(moves)).toBe(true);
  });
});
