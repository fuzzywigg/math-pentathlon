/**
 * Wave 41 — Ramrod passTurn / format / box helpers leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  passTurn,
  hasValidMoves,
  formatMove,
  getBoxSum,
  getRemainingValue,
  selectRod,
  placeRod,
  getValidPlacements,
} from '../../src/games/ramrod/rules';
import type { RamrodMove, SumBox, Rod } from '../../src/games/ramrod/types';

describe('Wave 41 Ramrod — pass format helpers', () => {
  it('passTurn flips seat and clears selection', () => {
    let state = createInitialState();
    state = selectRod(state, state.playerRods.player1[0]);
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.selectedRod).toBeNull();
    expect(next.phase).toBe('selectingRod');
  });

  it('opening hasValidMoves true; empty hand false', () => {
    const state = createInitialState();
    expect(hasValidMoves(state)).toBe(true);
    const empty = {
      ...state,
      playerRods: { ...state.playerRods, player1: [] as string[] },
    };
    expect(hasValidMoves(empty)).toBe(false);
  });

  it('formatMove includes length and optional capture bonus', () => {
    const rod: Rod = {
      id: 'r',
      length: 4,
      color: '#8e24aa',
      owner: 'player1',
      position: null,
    };
    const base: RamrodMove = {
      player: 'player1',
      rod,
      boxId: 'box-0-0',
      slot: 0,
      capturedBox: false,
      pointsScored: 0,
      moveNumber: 1,
    };
    expect(formatMove(base)).toBe('Rod 4cm');
    expect(
      formatMove({ ...base, capturedBox: true, pointsScored: 8 })
    ).toBe('Rod 4cm (+8cm)');
  });

  it('getBoxSum null until both rods present', () => {
    const state = createInitialState();
    const box = state.boxes.get('box-0-0')!;
    expect(getBoxSum(box)).toBeNull();
    const rod: Rod = {
      id: 'x',
      length: 3,
      color: '#0',
      owner: 'player1',
      position: { boxId: box.id, slot: 0 },
    };
    const half: SumBox = { ...box, rods: [rod, null] };
    expect(getBoxSum(half)).toBeNull();
    const full: SumBox = {
      ...box,
      rods: [rod, { ...rod, id: 'y', length: 4 }],
    };
    expect(getBoxSum(full)).toBe(7);
  });

  it('getRemainingValue reflects empty, half-filled slot0, and slot1', () => {
    const state = createInitialState();
    const box = state.boxes.get('box-1-2')!;
    expect(getRemainingValue(box)).toBe(box.targetSum);
    const r: Rod = {
      id: 'r',
      length: 2,
      color: '#e',
      owner: 'player1',
      position: { boxId: box.id, slot: 0 },
    };
    expect(getRemainingValue({ ...box, rods: [r, null] })).toBe(
      box.targetSum - 2
    );
    expect(getRemainingValue({ ...box, rods: [null, r] })).toBe(
      box.targetSum - 2
    );
  });

  it('after a place, remaining value updates on partial box', () => {
    let state = createInitialState();
    const rodId = state.playerRods.player1[0];
    state = selectRod(state, rodId);
    const { boxId, slot } = getValidPlacements(state, rodId)[0];
    const next = placeRod(state, boxId, slot);
    const box = next.boxes.get(boxId)!;
    if (!box.completedBy) {
      const rem = getRemainingValue(box);
      expect(rem).toBeLessThanOrEqual(box.targetSum);
      expect(rem).toBeGreaterThanOrEqual(0);
      // partial: one slot filled
      expect(box.rods.filter(Boolean)).toHaveLength(1);
    } else {
      expect(getBoxSum(box)).toBe(box.targetSum);
    }
  });
});
