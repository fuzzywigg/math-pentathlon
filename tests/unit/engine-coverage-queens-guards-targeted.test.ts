/**
 * Targeted branch coverage for queens-guards/types.ts adjacency helpers —
 * hand-built coords only. Edge-of-board rings, illegal outward moves,
 * center/outer neighbors. Engine code unchanged.
 */
import { describe, it, expect } from 'vitest';

import {
  getAdjacent,
  isMoveValid,
  cellsInRing,
  normalizePosition,
  cellKey,
  parseKey,
  CONFIG,
  createBoard,
  createInitialState,
  getOpponent,
  type BoardCoord,
} from '../../src/games/queens-guards/types';

describe('Queens-Guards types targeted — edge adjacency + illegal moves', () => {
  it('center (ring 0) fans out to all six ring-1 cells', () => {
    const adj = getAdjacent({ ring: 0, position: 0 });
    expect(adj).toHaveLength(6);
    expect(adj.every((c) => c.ring === 1)).toBe(true);
  });

  it('ring-1 cell includes center and rejects outward-as-normal-move', () => {
    const from: BoardCoord = { ring: 1, position: 0 };
    const adj = getAdjacent(from);
    expect(adj.some((c) => c.ring === 0 && c.position === 0)).toBe(true);
    expect(adj.some((c) => c.ring === 2)).toBe(true);

    expect(isMoveValid(from, { ring: 0, position: 0 })).toBe(true); // inward
    expect(isMoveValid(from, { ring: 1, position: 1 })).toBe(true); // sideways
    expect(isMoveValid(from, { ring: 2, position: 0 })).toBe(false); // outward
  });

  it('outermost ring has no outer neighbors (board edge)', () => {
    const outer = CONFIG.NUM_RINGS - 1;
    const count = cellsInRing(outer);
    for (let pos = 0; pos < count; pos++) {
      const adj = getAdjacent({ ring: outer, position: pos });
      expect(adj.every((c) => c.ring <= outer)).toBe(true);
      expect(adj.some((c) => c.ring === outer + 1)).toBe(false);
    }
  });

  it('mid-ring cells expose both inner and outer neighbors', () => {
    const samples: BoardCoord[] = [
      { ring: 2, position: 0 },
      { ring: 2, position: 5 },
      { ring: 3, position: 0 },
      { ring: 3, position: 8 },
      { ring: 4, position: 0 },
      { ring: 4, position: 11 },
    ];
    for (const coord of samples) {
      const adj = getAdjacent(coord);
      expect(adj.some((c) => c.ring === coord.ring - 1)).toBe(true);
      expect(adj.some((c) => c.ring === coord.ring + 1)).toBe(true);
      expect(adj.some((c) => c.ring === coord.ring)).toBe(true);
    }
  });

  it('normalizePosition wraps negative / overflow; ring 0 collapses to 0', () => {
    expect(normalizePosition(0, 99)).toBe(0);
    expect(normalizePosition(2, -1)).toBe(cellsInRing(2) - 1);
    expect(normalizePosition(2, cellsInRing(2))).toBe(0);
  });

  it('cellKey / parseKey round-trip; createBoard seats queens on outer ring', () => {
    expect(parseKey(cellKey(3, 7))).toEqual({ ring: 3, position: 7 });
    const board = createBoard();
    const outer = CONFIG.NUM_RINGS - 1;
    expect(board.get(cellKey(outer, 7))?.piece?.type).toBe('queen');
    expect(board.get(cellKey(outer, 22))?.piece?.type).toBe('queen');
    expect(createInitialState().currentPlayer).toBe('player1');
    expect(getOpponent('player1')).toBe('player2');
  });
});
