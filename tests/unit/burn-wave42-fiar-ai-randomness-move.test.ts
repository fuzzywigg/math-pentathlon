/**
 * Wave 42 — FIAR AI movement randomness branch.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIMove } from '../../src/games/fiar/ai';
import { placeToMovement } from './fiar-test-helpers';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 FIAR AI — move randomness', () => {
  it('easy movement with random<0.4 returns move payload', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.05);
    const state = placeToMovement();
    const move = getAIMove(state, state.currentPlayer, 'easy');
    expect(move?.type).toBe('move');
    expect(move!.from).toBeTruthy();
    expect(move!.to).toBeTruthy();
  });
});
