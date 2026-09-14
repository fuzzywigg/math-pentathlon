/**
 * Wave 42 leftovers B — FIAR getDirections spacing + connected degree matrix.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFiarBoard,
  getConnectedNodes,
  getDirections,
  getNodesInDirection,
  areConnected,
} from '../../src/games/fiar/types';

describe('Wave 42 fiar — direction / degree matrix', () => {
  it('directions use spacing 80 and include diagonals', () => {
    const dirs = getDirections();
    expect(dirs.some((d) => d.dx === 80 && d.dy === 0)).toBe(true);
    expect(dirs.some((d) => d.dx === 80 && d.dy === 80)).toBe(true);
    expect(dirs.some((d) => d.dx === -80 && d.dy === 80)).toBe(true);
  });

  it('edge vs center connectivity and straight-line walk', () => {
    const board = createFiarBoard();
    expect(getConnectedNodes(board, '0-2').length).toBeGreaterThanOrEqual(3);
    expect(getConnectedNodes(board, '4-4').length).toBeGreaterThanOrEqual(2);

    const down = getNodesInDirection(board, '0-2', 0, 80);
    expect(down[0]).toBe('1-2');
    expect(down).toContain('4-2');

    expect(areConnected(board, '1-1', '2-2')).toBe(true);
    expect(areConnected(board, '1-1', '2-0')).toBe(true);
  });
});
