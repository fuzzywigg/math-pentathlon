/**
 * burn-1008-mp-mutation-audit — strengthen Ramrod board target-sum matrix
 * coverage to kill surviving mutants (tests only).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { CONFIG, createBoxId } from '../../src/games/ramrod/types';
import {
  createInitialState,
  selectRod,
  getValidPlacements,
  placeRod,
  getBoxSum,
  getRemainingValue,
  isValidPlacement,
  passTurn,
  hasValidMoves,
} from '../../src/games/ramrod/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

/** Exact target-sum layout from createBoard in rules.ts */
const EXPECTED_TARGETS = [
  [5, 6, 7, 8],
  [6, 7, 8, 9],
  [7, 8, 9, 10],
];

describe('mutation/ramrod – board target matrix', () => {
  it('creates a 3×4 board with the exact target-sum layout', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    expect(CONFIG.BOARD_ROWS).toBe(3);
    expect(CONFIG.BOARD_COLS).toBe(4);
    expect(state.boxes.size).toBe(12);

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        const box = state.boxes.get(createBoxId(row, col));
        expect(box).toBeDefined();
        expect(box!.targetSum).toBe(EXPECTED_TARGETS[row][col]);
        expect(box!.rods).toEqual([null, null]);
        expect(box!.completedBy).toBeNull();
      }
    }

    // Spot-check corners / edges so ±1 mutants on individual cells die
    expect(state.boxes.get(createBoxId(0, 0))!.targetSum).toBe(5);
    expect(state.boxes.get(createBoxId(0, 3))!.targetSum).toBe(8);
    expect(state.boxes.get(createBoxId(1, 0))!.targetSum).toBe(6);
    expect(state.boxes.get(createBoxId(1, 3))!.targetSum).toBe(9);
    expect(state.boxes.get(createBoxId(2, 0))!.targetSum).toBe(7);
    expect(state.boxes.get(createBoxId(2, 3))!.targetSum).toBe(10);
  });

  it('deals starting rods and begins in selectingRod', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    expect(state.phase).toBe('selectingRod');
    expect(state.playerRods.player1).toHaveLength(
      CONFIG.STARTING_RODS_PER_PLAYER
    );
    expect(state.playerRods.player2).toHaveLength(
      CONFIG.STARTING_RODS_PER_PLAYER
    );
    expect(state.currentPlayer).toBe('player1');
  });
});

describe('mutation/ramrod – placement against targets', () => {
  it('rejects rods that exceed remaining target capacity', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    const rodId = state.playerRods.player1[0];
    const rod = state.rods.get(rodId)!;
    const selected = selectRod(state, rodId);
    expect(selected.phase).toBe('placingRod');

    for (const { boxId, slot } of getValidPlacements(selected, rodId)) {
      expect(isValidPlacement(selected, rodId, boxId, slot)).toBe(true);
      const box = selected.boxes.get(boxId)!;
      expect(rod.length).toBeLessThanOrEqual(getRemainingValue(box));
    }

    // A placement that would overflow the smallest box (target 5) if rod > 5
    const tiny = state.boxes.get(createBoxId(0, 0))!;
    if (rod.length > tiny.targetSum) {
      expect(isValidPlacement(selected, rodId, tiny.id, 0)).toBe(false);
    }
  });

  it('getBoxSum / getRemainingValue track partial fills', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState();
    const rodId = state.playerRods.player1[0];
    state = selectRod(state, rodId);
    const placements = getValidPlacements(state, rodId);
    expect(placements.length).toBeGreaterThan(0);
    const { boxId, slot } = placements[0];
    const before = state.boxes.get(boxId)!;
    // getBoxSum is null until both slots are filled
    expect(getBoxSum(before)).toBeNull();
    expect(getRemainingValue(before)).toBe(before.targetSum);

    state = placeRod(state, boxId, slot);
    const after = state.boxes.get(boxId)!;
    const placed = after.rods[slot]!;
    if (after.rods[0] && after.rods[1]) {
      expect(getBoxSum(after)).toBe(after.rods[0]!.length + after.rods[1]!.length);
    } else {
      expect(getBoxSum(after)).toBeNull();
      expect(getRemainingValue(after)).toBe(after.targetSum - placed.length);
    }
  });

  it('passTurn flips seat while moves remain', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    expect(hasValidMoves(state)).toBe(true);
    const passed = passTurn(state);
    expect(passed.currentPlayer).toBe('player2');
  });
});
