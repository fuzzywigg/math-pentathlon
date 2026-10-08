/**
 * burn-1008-mp-mutation-audit — strengthen Par 55 board/adjacency rules
 * coverage to kill surviving mutants (tests only).
 */
import { describe, it, expect } from 'vitest';
import { CONFIG, createBaseId } from '../../src/games/par-55/types';
import {
  createInitialState,
  isValidPlacement,
  getValidPlacements,
  selectBlock,
  placeBlock,
  calculateScore,
  hasValidMoves,
  passTurn,
} from '../../src/games/par-55/rules';

function expectedBaseCount(): number {
  let n = 0;
  for (let row = 0; row < CONFIG.BOARD_ROWS; row++) {
    const cols = row % 2 === 1 ? CONFIG.BOARD_COLS - 1 : CONFIG.BOARD_COLS;
    n += cols;
  }
  return n;
}

describe('mutation/par-55 – board geometry', () => {
  it('creates the staggered pentagon grid with exact base counts', () => {
    const state = createInitialState();
    expect(CONFIG.BOARD_ROWS).toBe(5);
    expect(CONFIG.BOARD_COLS).toBe(7);
    expect(state.bases.size).toBe(expectedBaseCount());
    expect(state.bases.size).toBe(33); // 7+6+7+6+7

    // Even rows have BOARD_COLS; odd rows have BOARD_COLS - 1
    for (let row = 0; row < CONFIG.BOARD_ROWS; row++) {
      const expectedCols =
        row % 2 === 1 ? CONFIG.BOARD_COLS - 1 : CONFIG.BOARD_COLS;
      let count = 0;
      for (let col = 0; col < CONFIG.BOARD_COLS; col++) {
        if (state.bases.has(createBaseId(row, col))) count++;
      }
      expect(count).toBe(expectedCols);
    }

    // Odd-row last column (col 6) must NOT exist when BOARD_COLS is 7
    expect(state.bases.has(createBaseId(1, CONFIG.BOARD_COLS - 1))).toBe(false);
    expect(state.bases.has(createBaseId(1, CONFIG.BOARD_COLS - 2))).toBe(true);
  });

  it('wires hexagonal adjacencies for corner and odd-row cells', () => {
    const state = createInitialState();
    const corner = state.bases.get(createBaseId(0, 0))!;
    expect(corner.adjacentBases.length).toBeGreaterThanOrEqual(2);
    expect(corner.adjacentBases).toContain(createBaseId(0, 1));
    expect(corner.adjacentBases).toContain(createBaseId(1, 0));
    // Even-row top-left must NOT claim a top-left diagonal that is off-board
    expect(corner.adjacentBases).not.toContain(createBaseId(-1, -1));
    expect(corner.adjacentBases).not.toContain(createBaseId(0, -1));

    const odd = state.bases.get(createBaseId(1, 0))!;
    // Odd-row neighbors use [row-1,col] and [row-1,col+1] (not col-1)
    expect(odd.adjacentBases).toContain(createBaseId(0, 0));
    expect(odd.adjacentBases).toContain(createBaseId(0, 1));
    expect(odd.adjacentBases).toContain(createBaseId(1, 1));
    expect(odd.adjacentBases).toContain(createBaseId(2, 0));
    expect(odd.adjacentBases).toContain(createBaseId(2, 1));
    // Left neighbor is col-1 when present (not col+1)
    expect(odd.adjacentBases).not.toContain(createBaseId(1, 2));

    // Row 3 is also odd under %2 — must keep odd-row neighbor offsets
    const oddRow3 = state.bases.get(createBaseId(3, 1))!;
    expect(oddRow3.adjacentBases).toContain(createBaseId(2, 1));
    expect(oddRow3.adjacentBases).toContain(createBaseId(2, 2));
    expect(oddRow3.adjacentBases).toContain(createBaseId(3, 0));
    expect(oddRow3.adjacentBases).toContain(createBaseId(3, 2));
    expect(oddRow3.adjacentBases).toContain(createBaseId(4, 1));
    expect(oddRow3.adjacentBases).toContain(createBaseId(4, 2));
  });

  it('seeds a neutral starting block at the geometric center', () => {
    const state = createInitialState();
    const centerId = createBaseId(
      Math.floor(CONFIG.BOARD_ROWS / 2),
      Math.floor(CONFIG.BOARD_COLS / 2)
    );
    const center = state.bases.get(centerId)!;
    expect(center.block).not.toBeNull();
    expect(center.placedBy).toBeNull();
    expect(state.hands.player1).toHaveLength(CONFIG.HAND_SIZE);
    expect(state.hands.player2).toHaveLength(CONFIG.HAND_SIZE);
  });
});

describe('mutation/par-55 – placement / scoring gates', () => {
  it('valid placements are empty and adjacent to an occupied base only', () => {
    const state = createInitialState();
    const valid = getValidPlacements(state);
    expect(valid.length).toBeGreaterThan(0);
    for (const id of valid) {
      expect(isValidPlacement(state, id)).toBe(true);
      expect(state.bases.get(id)!.block).toBeNull();
    }
    // Occupied center is never valid
    const centerId = createBaseId(
      Math.floor(CONFIG.BOARD_ROWS / 2),
      Math.floor(CONFIG.BOARD_COLS / 2)
    );
    expect(isValidPlacement(state, centerId)).toBe(false);
    expect(isValidPlacement(state, 'missing')).toBe(false);
  });

  it('placeBlock scores against adjacent neighbors and flips the seat', () => {
    const state = createInitialState();
    const blockId = state.hands.player1[0].id;
    const selected = selectBlock(state, blockId);
    const target = getValidPlacements(selected)[0];
    const block = selected.hands.player1.find((b) => b.id === blockId)!;
    const expected = calculateScore(selected, block, target);

    const next = placeBlock(selected, target);
    expect(next.bases.get(target)?.block?.id).toBe(blockId);
    expect(next.scores.player1).toBe(expected.totalPoints);
    expect(next.moveHistory).toHaveLength(1);
    if (next.phase !== 'gameOver') {
      expect(next.currentPlayer).toBe('player2');
    }
  });

  it('passTurn advances the player when the opponent still has moves', () => {
    const state = createInitialState();
    expect(hasValidMoves(state)).toBe(true);
    const passed = passTurn(state);
    expect(passed.currentPlayer).toBe('player2');
    expect(passed.phase).toBe('selectingBlock');
  });
});
