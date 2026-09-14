/**
 * Wave 42 — FIAR AI movement-phase getAIMove (easy depth).
 * Distinct from wave41 FIAR rules. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { placeChip } from '../../src/games/fiar/rules';
import { getAIMove } from '../../src/games/fiar/ai';

afterEach(() => vi.restoreAllMocks());

function exhaustPlacement() {
  let state = createInitialState();
  for (let i = 0; i < 8; i++) {
    const empty = [...state.board.nodes.entries()].find(([, n]) => n.chip === null)?.[0]!;
    state = placeChip(state, empty);
  }
  return state;
}

describe('Wave 42 FIAR AI — movement easy', () => {
  it('returns type=move with from/to on movement board', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = exhaustPlacement();
    expect(state.phase).toBe('movement');
    const move = getAIMove(state, state.currentPlayer, 'easy');
    expect(move).not.toBeNull();
    expect(move!.type).toBe('move');
    expect(typeof move!.from).toBe('string');
    expect(typeof move!.to).toBe('string');
    expect(state.board.nodes.get(move!.from!)?.chip).toBe(state.currentPlayer);
    expect(state.board.nodes.get(move!.to!)?.chip).toBeNull();
  });
});
