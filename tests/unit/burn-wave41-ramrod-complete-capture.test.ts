/**
 * Wave 41 — Ramrod completing placement capture leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectRod,
  placeRod,
  getValidPlacements,
  isValidPlacement,
  getBoxSum,
} from '../../src/games/ramrod/rules';
import type { RamrodState, Rod } from '../../src/games/ramrod/types';

describe('Wave 41 ramrod — complete box capture', () => {
  it('second rod that matches remaining completes box and scores targetSum', () => {
    let state = createInitialState();
    // Seed slot 0 with a known length on a chosen box
    const box = [...state.boxes.values()][0];
    const seedLen = Math.min(3, box.targetSum - 1);
    const need = box.targetSum - seedLen;

    const rods = new Map(state.rods);
    const seed: Rod = {
      id: 'seed-complete',
      length: seedLen,
      color: '#aaa',
      owner: 'player2',
      position: { boxId: box.id, slot: 0 },
    };
    rods.set(seed.id, seed);
    const boxes = new Map(state.boxes);
    boxes.set(box.id, { ...box, rods: [seed, null] });

    // Ensure player1 has a rod of exact remaining length
    let completerId = state.playerRods.player1.find(
      (id) => rods.get(id)!.length === need
    );
    if (!completerId) {
      const forged: Rod = {
        id: 'completer',
        length: need,
        color: '#bbb',
        owner: 'player1',
        position: null,
      };
      rods.set(forged.id, forged);
      completerId = forged.id;
      state = {
        ...state,
        rods,
        boxes,
        playerRods: {
          ...state.playerRods,
          player1: [...state.playerRods.player1, forged.id],
        },
      };
    } else {
      state = { ...state, rods, boxes };
    }

    expect(isValidPlacement(state, completerId, box.id, 1)).toBe(true);
    state = selectRod(state, completerId);
    const next = placeRod(state, box.id, 1);
    expect(next.boxes.get(box.id)?.completedBy).toBe('player1');
    expect(next.scores.player1).toBe(state.scores.player1 + box.targetSum);
    expect(getBoxSum(next.boxes.get(box.id)!)).toBe(box.targetSum);
    expect(next.moveHistory.at(-1)!.capturedBox).toBe(true);
  });

  it('getValidPlacements includes completing slot when remaining matches', () => {
    const state0 = createInitialState();
    const box = [...state0.boxes.values()][0];
    const seedLen = 2;
    const need = box.targetSum - seedLen;
    if (need < 1 || need > 10) return;

    const rods = new Map(state0.rods);
    const seed: Rod = {
      id: 's',
      length: seedLen,
      color: '#c',
      owner: 'player2',
      position: { boxId: box.id, slot: 0 },
    };
    rods.set(seed.id, seed);
    const boxes = new Map(state0.boxes);
    boxes.set(box.id, { ...box, rods: [seed, null] });
    const completer: Rod = {
      id: 'c',
      length: need,
      color: '#d',
      owner: 'player1',
      position: null,
    };
    rods.set(completer.id, completer);
    const state: RamrodState = {
      ...state0,
      rods,
      boxes,
      playerRods: {
        ...state0.playerRods,
        player1: [...state0.playerRods.player1, completer.id],
      },
    };
    const placements = getValidPlacements(state, completer.id);
    expect(placements).toContainEqual({ boxId: box.id, slot: 1 });
  });
});
