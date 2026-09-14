/**
 * Wave 40 — Ramrod boxSum null + select/place reject leftovers.
 * After #177; tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectRod,
  clearSelection,
  placeRod,
  getBoxSum,
  getRemainingValue,
  isValidPlacement,
  getValidPlacements,
  passTurn,
} from '../../src/games/ramrod/rules';

describe('Wave 40 ramrod — boxSum null / select rejects', () => {
  it('selectRod rejects not-owned and wrong phase', () => {
    const state = createInitialState();
    expect(selectRod(state, '__ghost__')).toBe(state);

    const oppRod = state.playerRods.player2[0];
    expect(selectRod(state, oppRod)).toBe(state);

    const wrong = { ...state, phase: 'placingRod' as const };
    const own = state.playerRods.player1[0];
    expect(selectRod(wrong, own)).toBe(wrong);
  });

  it('getBoxSum null when incomplete; getRemainingValue tracks slots', () => {
    const state = createInitialState();
    const box = [...state.boxes.values()][0];
    expect(getBoxSum(box)).toBeNull();
    expect(getRemainingValue(box)).toBe(box.targetSum);

    const rod = state.rods.get(state.playerRods.player1[0])!;
    const partial = {
      ...box,
      rods: [{ ...rod }, null] as [typeof rod, null],
    };
    expect(getBoxSum(partial)).toBeNull();
    expect(getRemainingValue(partial)).toBe(box.targetSum - rod.length);
  });

  it('placeRod identity without selection; clearSelection resets', () => {
    const state = createInitialState();
    const boxId = [...state.boxes.keys()][0];
    expect(placeRod(state, boxId, 0)).toBe(state);

    const own = state.playerRods.player1[0];
    const selected = selectRod(state, own);
    expect(selected.phase).toBe('placingRod');
    const cleared = clearSelection(selected);
    expect(cleared.selectedRod).toBeNull();
    expect(cleared.phase).toBe('selectingRod');

    const valids = getValidPlacements(selected, own);
    expect(Array.isArray(valids)).toBe(true);
    // Invalid slot on completed box if any
    const completed = [...state.boxes.values()].find((b) => b.completedBy);
    if (completed) {
      expect(isValidPlacement(selected, own, completed.id, 0)).toBe(false);
    }
  });

  it('passTurn advances player', () => {
    const state = createInitialState();
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
  });
});
