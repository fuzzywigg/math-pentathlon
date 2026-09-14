/**
 * Wave 42 — FIAR areConnected / getNodesInDirection / getDirections helpers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFiarBoard,
  areConnected,
  getNodesInDirection,
  getDirections,
  getConnectedNodes,
} from '../../src/games/fiar/types';

describe('Wave 42 fiar — graph direction helpers', () => {
  it('areConnected true for adjacent H/V/diag edges, false otherwise', () => {
    const board = createFiarBoard();
    expect(areConnected(board, '0-0', '0-1')).toBe(true);
    expect(areConnected(board, '0-0', '1-0')).toBe(true);
    expect(areConnected(board, '0-0', '1-1')).toBe(true);
    expect(areConnected(board, '0-0', '0-2')).toBe(false);
    expect(areConnected(board, '0-0', '2-0')).toBe(false);
    expect(areConnected(board, 'ghost', '0-0')).toBe(false);
  });

  it('getNodesInDirection walks right / down until edge', () => {
    const board = createFiarBoard();
    const dirs = getDirections();
    const right = dirs.find((d) => d.dx > 0 && d.dy === 0)!;
    const down = dirs.find((d) => d.dx === 0 && d.dy > 0)!;
    expect(getNodesInDirection(board, '0-0', right.dx, right.dy)).toEqual([
      '0-1',
      '0-2',
      '0-3',
      '0-4',
    ]);
    expect(getNodesInDirection(board, '0-0', down.dx, down.dy)).toEqual([
      '1-0',
      '2-0',
      '3-0',
      '4-0',
    ]);
  });

  it('getNodesInDirection down-right diagonal; unknown start empty', () => {
    const board = createFiarBoard();
    const dirs = getDirections();
    const dr = dirs.find((d) => d.dx > 0 && d.dy > 0)!;
    expect(getNodesInDirection(board, '0-0', dr.dx, dr.dy)).toEqual([
      '1-1',
      '2-2',
      '3-3',
      '4-4',
    ]);
    expect(getNodesInDirection(board, 'nope', dr.dx, dr.dy)).toEqual([]);
  });

  it('getDirections has 8 unique axis-aligned + diagonal vectors', () => {
    const dirs = getDirections();
    expect(dirs).toHaveLength(8);
    const keys = new Set(dirs.map((d) => `${d.dx},${d.dy}`));
    expect(keys.size).toBe(8);
    expect(dirs.every((d) => d.dx !== 0 || d.dy !== 0)).toBe(true);
  });

  it('getConnectedNodes degree matches edge incidence', () => {
    const board = createFiarBoard();
    const corner = getConnectedNodes(board, '0-0');
    expect(corner).toEqual(expect.arrayContaining(['0-1', '1-0', '1-1']));
    expect(corner).toHaveLength(3);
    const center = getConnectedNodes(board, '2-2');
    expect(center.length).toBeGreaterThan(corner.length);
  });
});
