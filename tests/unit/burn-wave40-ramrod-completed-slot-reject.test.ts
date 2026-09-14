/**
 * Wave 40 — Ramrod completed/occupied reject + placeRod identity + remaining.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  isValidPlacement,
  placeRod,
  getRemainingValue,
} from '../../src/games/ramrod/rules';
import type { SumBox, Rod } from '../../src/games/ramrod/types';

describe('Wave 40 ramrod — completed slot reject / place / remaining', () => {
  it('isValidPlacement false for completedBy set / occupied slot', () => {
    const state = createInitialState();
    const rodId = state.playerRods.player1[0];
    const boxId = [...state.boxes.keys()][0];
    const box = state.boxes.get(boxId)!;

    const filler: Rod = {
      id: 'filler',
      length: 2,
      color: '#000',
      owner: 'player2',
      position: { boxId, slot: 0 },
    };

    const occupiedBoxes = new Map(state.boxes);
    occupiedBoxes.set(boxId, {
      ...box,
      rods: [filler, null],
      completedBy: null,
    });
    expect(isValidPlacement({ ...state, boxes: occupiedBoxes }, rodId, boxId, 0)).toBe(
      false
    );

    const completedBoxes = new Map(state.boxes);
    completedBoxes.set(boxId, {
      ...box,
      rods: [null, null],
      completedBy: 'player2',
    });
    expect(
      isValidPlacement({ ...state, boxes: completedBoxes }, rodId, boxId, 0)
    ).toBe(false);
  });

  it('placeRod identity wrong phase / no selection', () => {
    const state = createInitialState();
    expect(state.phase).toBe('selectingRod');
    expect(state.selectedRod).toBeNull();
    const boxId = [...state.boxes.keys()][0];
    expect(placeRod(state, boxId, 0)).toBe(state);
  });

  it('getRemainingValue empty vs one rod filled', () => {
    const empty: SumBox = {
      id: 'b0-0',
      targetSum: 8,
      row: 0,
      col: 0,
      rods: [null, null],
      completedBy: null,
    };
    expect(getRemainingValue(empty)).toBe(8);

    const half: SumBox = {
      ...empty,
      rods: [
        {
          id: 'r1',
          length: 3,
          color: '#111',
          owner: 'player1',
          position: { boxId: 'b0-0', slot: 0 },
        },
        null,
      ],
    };
    expect(getRemainingValue(half)).toBe(5);
  });
});
