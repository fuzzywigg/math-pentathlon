/**
 * Wave 42 — Remainder Islands previewDivision null edges.
 * Beyond wave41 happy-path preview matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import {
  previewDivision,
  calculateDivision,
  setSelectedIsland,
} from '../../src/games/remainder-islands/rules';

describe('Wave 42 remainder — preview null edges', () => {
  it('null without currentRoll', () => {
    const state = createInitialState();
    expect(previewDivision(state, state.islands[0].id)).toBeNull();
  });

  it('null for unknown island id', () => {
    const state = {
      ...createInitialState(),
      currentRoll: { die1: 4, die2: 5, total: 9 },
    };
    expect(previewDivision(state, 'ghost')).toBeNull();
  });

  it('matches calculateDivision; setSelectedIsland is orthogonal', () => {
    const island = createInitialState().islands[2];
    const state = {
      ...createInitialState(),
      currentRoll: { die1: 6, die2: 5, total: 11 },
    };
    const preview = previewDivision(state, island.id);
    expect(preview).toEqual(calculateDivision(11, island.value));
    const selected = setSelectedIsland(state, island.id);
    expect(selected.selectedIsland).toBe(island.id);
    expect(previewDivision(selected, island.id)).toEqual(preview);
  });
});
