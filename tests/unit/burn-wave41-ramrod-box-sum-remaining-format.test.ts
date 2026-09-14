/**
 * Wave 41 — Ramrod getBoxSum / getRemainingValue / formatMove leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  getBoxSum,
  getRemainingValue,
  formatMove,
  selectRod,
  placeRod,
  getValidPlacements,
} from '../../src/games/ramrod/rules';
import type { Rod, SumBox } from '../../src/games/ramrod/types';

describe('Wave 41 ramrod — box sum / remaining / format', () => {
  it('getBoxSum null until both slots filled', () => {
    const state = createInitialState();
    const box = [...state.boxes.values()][0];
    expect(getBoxSum(box)).toBeNull();

    const partial: SumBox = {
      ...box,
      rods: [
        {
          id: 'a',
          length: 2,
          color: '#e',
          owner: 'player1',
          position: { boxId: box.id, slot: 0 },
        },
        null,
      ],
    };
    expect(getBoxSum(partial)).toBeNull();

    const filled: SumBox = {
      ...partial,
      rods: [
        partial.rods[0],
        {
          id: 'b',
          length: 3,
          color: '#g',
          owner: 'player2',
          position: { boxId: box.id, slot: 1 },
        },
      ],
    };
    expect(getBoxSum(filled)).toBe(5);
  });

  it('getRemainingValue reflects empty / one-filled / both-empty slots', () => {
    const state = createInitialState();
    const box = [...state.boxes.values()][0];
    expect(getRemainingValue(box)).toBe(box.targetSum);

    const slot0: SumBox = {
      ...box,
      rods: [
        {
          id: 'r0',
          length: 3,
          color: '#x',
          owner: 'player1',
          position: { boxId: box.id, slot: 0 },
        },
        null,
      ],
    };
    expect(getRemainingValue(slot0)).toBe(box.targetSum - 3);

    const slot1: SumBox = {
      ...box,
      rods: [
        null,
        {
          id: 'r1',
          length: 4,
          color: '#y',
          owner: 'player2',
          position: { boxId: box.id, slot: 1 },
        },
      ],
    };
    expect(getRemainingValue(slot1)).toBe(box.targetSum - 4);
  });

  it('formatMove shows length; capture suffix when capturedBox', () => {
    const state = createInitialState();
    const rod = state.rods.get(state.playerRods.player1[0])!;
    expect(
      formatMove({
        player: 'player1',
        rod,
        boxId: 'b',
        slot: 0,
        capturedBox: false,
        pointsScored: 0,
        moveNumber: 1,
      })
    ).toBe(`Rod ${rod.length}cm`);

    expect(
      formatMove({
        player: 'player1',
        rod,
        boxId: 'b',
        slot: 0,
        capturedBox: true,
        pointsScored: 7,
        moveNumber: 2,
      })
    ).toBe(`Rod ${rod.length}cm (+7cm)`);
  });

  it('after first place remaining updates on that box', () => {
    let state = createInitialState();
    const rodId = state.playerRods.player1[0];
    const rod = state.rods.get(rodId)!;
    state = selectRod(state, rodId);
    const { boxId, slot } = getValidPlacements(state, rodId)[0];
    state = placeRod(state, boxId, slot);
    const box = state.boxes.get(boxId)!;
    if (box.rods[0] && box.rods[1]) {
      expect(getBoxSum(box)).toBe(box.rods[0].length + box.rods[1].length);
    } else {
      expect(getBoxSum(box)).toBeNull();
      expect(getRemainingValue(box)).toBe(box.targetSum - rod.length);
    }
  });
});
