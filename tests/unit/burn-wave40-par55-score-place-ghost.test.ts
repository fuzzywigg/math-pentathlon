/**
 * Wave 40 — Par 55 calculateScore ghost base + placeBlock hand miss / occupied.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  calculateScore,
  placeBlock,
  isValidPlacement,
} from '../../src/games/par-55/rules';

describe('Wave 40 par-55 — score / place ghost', () => {
  it('calculateScore missing/ghost baseId → {0, []}', () => {
    const state = createInitialState();
    const block = state.hands.player1[0];
    expect(calculateScore(state, block, 'ghost-base')).toEqual({
      totalPoints: 0,
      matchDetails: [],
    });
    expect(calculateScore(state, block, 'not-a-base-id')).toEqual({
      totalPoints: 0,
      matchDetails: [],
    });
  });

  it('placeBlock with selectedBlock not in hand → identity', () => {
    const state = {
      ...createInitialState(),
      phase: 'placingBlock' as const,
      selectedBlock: 'ghost-block-not-in-hand',
    };
    const baseId = [...state.bases.keys()].find((id) =>
      isValidPlacement(state, id)
    );
    expect(baseId).toBeDefined();
    expect(placeBlock(state, baseId!)).toBe(state);
  });

  it('isValidPlacement occupied base → false; placeBlock identity', () => {
    const state = createInitialState();
    const occupiedId = [...state.bases.values()].find((b) => b.block !== null)
      ?.id;
    expect(occupiedId).toBeDefined();
    expect(isValidPlacement(state, occupiedId!)).toBe(false);

    const placing = {
      ...state,
      phase: 'placingBlock' as const,
      selectedBlock: state.hands.player1[0].id,
    };
    expect(placeBlock(placing, occupiedId!)).toBe(placing);
  });
});
