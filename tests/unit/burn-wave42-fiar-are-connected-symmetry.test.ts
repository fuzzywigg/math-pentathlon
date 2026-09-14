/**
 * Wave 42 leftovers B — FIAR areConnected symmetry + unknown node.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFiarBoard,
  areConnected,
  getConnectedNodes,
} from '../../src/games/fiar/types';

describe('Wave 42 fiar — areConnected symmetry', () => {
  it('edges are bidirectional; unknown never connected', () => {
    const board = createFiarBoard();
    expect(areConnected(board, '2-2', '2-3')).toBe(true);
    expect(areConnected(board, '2-3', '2-2')).toBe(true);
    expect(areConnected(board, '2-2', 'missing')).toBe(false);
    expect(getConnectedNodes(board, '2-2')).toContain('2-3');
    expect(getConnectedNodes(board, '2-2')).toContain('3-2');
  });
});
