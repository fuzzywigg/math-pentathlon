/**
 * Overnight HEAVY leftover after #280 — Board findValid vs Grid getAllValid.
 * Distinct from wave58 count-empty / is-board-filled. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createBoard,
  createGrid,
  findValidPlacements,
  getAllValidPositions,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 59 core poly — find valid vs grid pos', () => {
  it('Board and Grid duals agree on monomino count for 4x4', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    const boardCount = findValidPlacements(createBoard(4, 4), mono).length;
    const gridCount = getAllValidPositions(
      createGrid(4, 4),
      mono,
      0,
      false
    ).length;
    expect(boardCount).toBe(16);
    expect(gridCount).toBe(boardCount);
  });
});
