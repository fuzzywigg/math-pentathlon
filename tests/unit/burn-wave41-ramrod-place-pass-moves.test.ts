/**
 * Wave 41 — Ramrod placeRod / passTurn / hasValidMoves leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectRod,
  placeRod,
  passTurn,
  hasValidMoves,
  getValidPlacements,
} from '../../src/games/ramrod/rules';
import type { RamrodState } from '../../src/games/ramrod/types';

describe('Wave 41 ramrod — place / pass / moves', () => {
  it('placeRod identity without placingRod phase or selection', () => {
    const state = createInitialState();
    const boxId = [...state.boxes.keys()][0];
    expect(placeRod(state, boxId, 0)).toBe(state);
    const mid: RamrodState = {
      ...state,
      phase: 'placingRod',
      selectedRod: null,
    };
    expect(placeRod(mid, boxId, 0)).toBe(mid);
  });

  it('placeRod identity on illegal placement; success updates box', () => {
    let state = createInitialState();
    const rodId = state.playerRods.player1[0];
    state = selectRod(state, rodId);
    expect(placeRod(state, 'ghost-box', 0)).toBe(state);

    const { boxId, slot } = getValidPlacements(state, rodId)[0];
    const next = placeRod(state, boxId, slot);
    expect(next).not.toBe(state);
    expect(next.boxes.get(boxId)?.rods[slot]?.id).toBe(rodId);
    expect(next.selectedRod).toBeNull();
    expect(next.moveHistory).toHaveLength(1);
    expect(next.playerRods.player1).not.toContain(rodId);
  });

  it('passTurn flips seat and clears selection', () => {
    let state = createInitialState();
    state = selectRod(state, state.playerRods.player1[0]);
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.selectedRod).toBeNull();
    expect(next.phase).toBe('selectingRod');
  });

  it('hasValidMoves true at open; false with empty player rods', () => {
    const open = createInitialState();
    expect(hasValidMoves(open)).toBe(true);

    const empty: RamrodState = {
      ...open,
      playerRods: { ...open.playerRods, player1: [] },
    };
    expect(hasValidMoves(empty)).toBe(false);
  });
});
