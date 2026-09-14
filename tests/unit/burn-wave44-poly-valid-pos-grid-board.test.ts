/**
 * Wave 44 — getAllValidPositions vs findValidPlacements parity leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createGrid,
  createBoard,
  getAllValidPositions,
  findValidPlacements,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 44 poly — valid positions grid/board parity', () => {
  it('empty 4x4 domino counts match across APIs', () => {
    const domino = SIMPLE_SHAPES.find((s) => s.id === 'domino')!;
    const gridPos = getAllValidPositions(createGrid(4, 4), domino, 0, false);
    const boardPos = findValidPlacements(createBoard(4, 4), domino, 0, false);
    expect(gridPos.length).toBe(boardPos.length);
    expect(gridPos.length).toBeGreaterThan(0);
  });
});
