/**
 * Overnight TOKENMAXX — FIAR areConnected edge leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createFiarBoard, areConnected } from '../../src/games/fiar/types';

describe('Overnight fiar — areConnected', () => {
  it('rejects self/unknown; accepts known diag', () => {
    const board = createFiarBoard();
    expect(areConnected(board, '0-0', '0-0')).toBe(false);
    expect(areConnected(board, 'ghost', '0-0')).toBe(false);
    expect(areConnected(board, '0-0', '1-1')).toBe(true);
    expect(areConnected(board, '0-0', '0-1')).toBe(true);
  });
});
