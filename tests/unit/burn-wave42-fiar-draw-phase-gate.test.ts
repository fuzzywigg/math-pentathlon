/**
 * Wave 42 — FIAR isDraw false in placement; true when no selectable in movement. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { isDraw, getSelectableNodes, placeChip } from '../../src/games/fiar/rules';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';

describe('Wave 42 fiar — draw phase gate', () => {
  it('isDraw false throughout placement', () => {
    let state = createInitialState();
    expect(isDraw(state)).toBe(false);
    state = placeChip(state, '0-0');
    expect(isDraw(state)).toBe(false);
  });

  it('isDraw true when movement has zero selectable chips', () => {
    const state = {
      ...createInitialState(),
      phase: 'movement' as const,
      chipsPlaced: {
        player1: CONFIG.CHIPS_PER_PLAYER,
        player2: CONFIG.CHIPS_PER_PLAYER,
      },
    };
    expect(getSelectableNodes(state)).toEqual([]);
    expect(isDraw(state)).toBe(true);
  });

  it('isDraw false after full place when seat has movable chips', () => {
    let state = createInitialState();
    const ids = [...state.board.nodes.keys()];
    for (let i = 0; i < CONFIG.CHIPS_PER_PLAYER * 2; i++) {
      state = placeChip(state, ids[i]);
    }
    expect(state.phase).toBe('movement');
    expect(getSelectableNodes(state).length).toBeGreaterThan(0);
    expect(isDraw(state)).toBe(false);
  });
});
