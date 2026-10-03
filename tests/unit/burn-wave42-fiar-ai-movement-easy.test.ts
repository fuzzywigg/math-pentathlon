/**
 * Wave 42 — FIAR AI movement-phase getAIMove (easy depth).
 * Distinct from wave41 FIAR rules. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIMove } from '../../src/games/fiar/ai';
import { placeToMovement } from './fiar-test-helpers';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 FIAR AI — movement easy', () => {
  it('returns type=move with from/to on movement board', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = placeToMovement();
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
