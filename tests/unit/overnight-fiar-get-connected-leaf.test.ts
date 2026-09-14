/**
 * Overnight TOKENMAXX — FIAR getConnectedNodes degree leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createFiarBoard,
  getConnectedNodes,
  areConnected,
} from '../../src/games/fiar/types';

describe('Overnight fiar — connected degree', () => {
  it('corner degree less than center; all connected', () => {
    const board = createFiarBoard();
    const corner = getConnectedNodes(board, '0-0');
    const center = getConnectedNodes(board, '2-2');
    expect(corner.length).toBeLessThan(center.length);
    for (const id of center) {
      expect(areConnected(board, '2-2', id)).toBe(true);
    }
  });
});
