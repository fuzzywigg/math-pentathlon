/**
 * Wave 19 — lookup / occupancy helpers (getCellAt, findCellByValue, king pos, empty).
 * Distinct from wave 14 adjacency counts and wave 18 geometry transforms.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createHag,
  getCellAt,
  isValidPosition as hagValidPos,
} from '../../src/games/hex-a-gone/types';
import {
  selectBlock as selectHag,
  commitSelection,
  selectBlockForPlacement,
  placeBlock as placeHag,
  getValidPlacements as hagPlacements,
} from '../../src/games/hex-a-gone/rules';

import {
  createInitialState as createPrime,
  findCellByValue,
  rollDice as primeRoll,
  placeChip as primePlace,
  getValidPlacements as primePlacements,
} from '../../src/games/prime-gold/rules';

import {
  createInitialGameState as createKings,
  selectKing,
  moveKing,
  placeQuadraphage,
  getKingPosition,
  getSupply,
} from '../../src/games/kings-quadraphages/game-state';
import {
  isEmpty,
  getPiece,
  hasSupply,
} from '../../src/games/kings-quadraphages/board';

import {
  createInitialState as createStar,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';
import {
  drawChains,
  selectChain,
  getProgress,
  isGameOver as starOver,
} from '../../src/games/star-track/rules';

import {
  cellsInRing,
  normalizePosition,
  getAdjacent,
  cellKey,
  parseKey,
  CONFIG as QG_CFG,
} from '../../src/games/queens-guards/types';

import { getNeighbors } from '../../src/games/hex/rules';
import { DEFAULT_BOARD_SIZE } from '../../src/games/hex/types';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 19 lookup — Hex-a-Gone getCellAt / isValidPosition', () => {
  it('hit known cells and miss OOB coords', () => {
    const state = createHag();
    expect(state.board.length).toBeGreaterThan(0);
    const sample = state.board[0];
    expect(getCellAt(state, sample.q, sample.r)).toEqual(sample);
    expect(hagValidPos(state, sample.q, sample.r)).toBe(true);
    expect(getCellAt(state, 999, 999)).toBeUndefined();
    expect(hagValidPos(state, 999, 999)).toBe(false);
  });

  it('occupancy flips after a legal place when AI seed allows', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.22);
    let state = createHag();
    const available = (['triangle', 'square', 'rhombus', 'trapezoid', 'hexagon'] as const).filter(
      (s) => state.bank[s] > 0
    );
    expect(available.length).toBeGreaterThan(0);
    state = selectHag(state, available[0]);
    state = commitSelection(state);
    state = selectBlockForPlacement(state, available[0]);
    const spots = hagPlacements(state);
    if (spots.length > 0) {
      const { q, r } = spots[0];
      const before = getCellAt(state, q, r);
      expect(before?.filled).toBe(false);
      state = placeHag(state, q, r);
      const after = getCellAt(state, q, r);
      expect(after?.filled).toBe(true);
      expect(after?.filledBy).toBe('player1');
    }
  });
});

describe('Wave 19 lookup — Prime Gold findCellByValue', () => {
  it('finds every board value and nulls missing', () => {
    const state = createPrime();
    const values = [...state.cells.values()].map((c) => c.value);
    expect(values.length).toBeGreaterThan(10);
    for (const v of values.slice(0, 8)) {
      const cell = findCellByValue(state, v);
      expect(cell).not.toBeNull();
      expect(cell!.value).toBe(v);
    }
    expect(findCellByValue(state, -1)).toBeNull();
    expect(findCellByValue(state, 10_000)).toBeNull();
  });

  it('owner updates after placeChip when placement exists', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.35);
    let state = primeRoll(createPrime());
    const placements = primePlacements(state);
    if (placements.length > 0) {
      const { value, expr } = placements[0];
      const before = findCellByValue(state, value);
      expect(before?.owner).toBeNull();
      state = primePlace(state, value, expr);
      const after = findCellByValue(state, value);
      expect(after?.owner).toBe('player1');
    }
  });
});

describe('Wave 19 lookup — Kings position / empty / supply', () => {
  it('getKingPosition tracks move; isEmpty/getPiece/hasSupply agree', () => {
    let state = createKings();
    const p1Start = getKingPosition(state, 'player1');
    expect(p1Start).toEqual({ row: 1, col: 5 });
    expect(getKingPosition(state, 'player2')).toEqual({ row: 9, col: 5 });

    // Opening king cell is not empty
    expect(isEmpty(state.board, { row: 0, col: 4 })).toBe(false);
    expect(getPiece(state.board, { row: 0, col: 4 })?.type).toBe('king');
    expect(hasSupply(state, 'player1')).toBe(true);
    expect(getSupply(state, 'player1')).toBe(30);

    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    expect(getKingPosition(state, 'player1')).toEqual({ row: 2, col: 5 });
    expect(isEmpty(state.board, { row: 0, col: 4 })).toBe(true);
    expect(isEmpty(state.board, { row: 1, col: 4 })).toBe(false);

    state = placeQuadraphage(state, { row: 3, col: 5 });
    expect(getSupply(state, 'player1')).toBe(29);
    expect(getPiece(state.board, { row: 2, col: 4 })?.type).toBe('quadraphage');
  });
});

describe('Wave 19 lookup — Star Track progress', () => {
  it('getProgress starts at 0; selectChain advances when drawn', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.41);
    let state = createStar();
    expect(getProgress(state, 'player1')).toBe(0);
    expect(getProgress(state, 'player2')).toBe(0);
    expect(starOver(state)).toBe(false);

    state = drawChains(state);
    expect(state.drawnChains).not.toBeNull();
    if (state.drawnChains) {
      const chain = state.drawnChains[0];
      state = selectChain(state, 0);
      expect(getProgress(state, 'player1')).toBeGreaterThan(0);
      expect(getProgress(state, 'player1')).toBe(
        (Math.min(chain.length, TRACK_LENGTH) / TRACK_LENGTH) * 100
      );
    }
  });
});

describe('Wave 19 lookup — Queens ring math + Hex neighbor uniqueness', () => {
  it('cellsInRing / normalizePosition / getAdjacent edges', () => {
    expect(cellsInRing(0)).toBe(1);
    expect(cellsInRing(1)).toBe(6);
    expect(cellsInRing(2)).toBe(12);
    expect(normalizePosition(0, 99)).toBe(0);
    expect(normalizePosition(1, 6)).toBe(0);
    expect(normalizePosition(1, -1)).toBe(5);

    const centerAdj = getAdjacent({ ring: 0, position: 0 });
    expect(centerAdj).toHaveLength(6);
    expect(centerAdj.every((c) => c.ring === 1)).toBe(true);

    const ring1 = getAdjacent({ ring: 1, position: 0 });
    expect(ring1.some((c) => c.ring === 0)).toBe(true);
    expect(ring1.length).toBeGreaterThanOrEqual(3);

    const outer = QG_CFG.NUM_RINGS - 1;
    const outerAdj = getAdjacent({ ring: outer, position: 0 });
    expect(outerAdj.every((c) => c.ring <= outer)).toBe(true);

    expect(parseKey(cellKey(2, 5))).toEqual({
      ring: 2,
      position: 5,
    });
  });

  it('hex getNeighbors never duplicates and stays in-bounds', () => {
    const size = DEFAULT_BOARD_SIZE;
    for (const pos of [
      { row: 0, col: 0 },
      { row: 5, col: 5 },
      { row: size - 1, col: size - 1 },
      { row: 0, col: 5 },
      { row: 5, col: 0 },
    ]) {
      const n = getNeighbors(pos, size);
      const keys = n.map((p) => `${p.row},${p.col}`);
      expect(new Set(keys).size).toBe(keys.length);
      for (const p of n) {
        expect(p.row).toBeGreaterThanOrEqual(0);
        expect(p.col).toBeGreaterThanOrEqual(0);
        expect(p.row).toBeLessThan(size);
        expect(p.col).toBeLessThan(size);
      }
    }
  });
});
