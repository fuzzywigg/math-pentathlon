/**
 * Wave 42 — FIAR AI medium after several placements.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { placeChip, canPlaceChip } from '../../src/games/fiar/rules';
import { getAIMove } from '../../src/games/fiar/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 FIAR AI — medium mid placement', () => {
  it('places legally after 3 chips down', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    let state = createInitialState();
    for (const id of ['0-0', '0-1', '1-0']) {
      state = placeChip(state, id);
    }
    const move = getAIMove(state, state.currentPlayer, 'medium');
    expect(move?.type).toBe('place');
    expect(canPlaceChip(state, move!.nodeId!)).toBe(true);
  });
});
