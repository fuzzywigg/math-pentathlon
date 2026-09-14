/**
 * Wave 39 — SIMPLE_SHAPES catalog placeability leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  SIMPLE_SHAPES,
  getShapeById,
  getShapesBySize,
  createBoard,
  canPlaceShape,
  findValidPlacements,
} from '../../src/core/polyomino';

describe('Wave 39 poly — simple shapes catalog', () => {
  it('every SIMPLE_SHAPES id resolves and placeable on open board', () => {
    const board = createBoard(10, 10);
    for (const shape of SIMPLE_SHAPES) {
      expect(getShapeById(shape.id, SIMPLE_SHAPES)?.id).toBe(shape.id);
      expect(canPlaceShape(board, shape)).toBe(true);
      expect(findValidPlacements(board, shape).length).toBeGreaterThan(0);
    }
  });

  it('getShapesBySize partitions match SIMPLE_SHAPES sizes', () => {
    const sizes = new Set(SIMPLE_SHAPES.map((s) => s.size));
    for (const size of sizes) {
      const bySize = getShapesBySize(size, SIMPLE_SHAPES);
      expect(bySize.every((s) => s.size === size)).toBe(true);
      expect(bySize).toHaveLength(
        SIMPLE_SHAPES.filter((s) => s.size === size).length
      );
    }
  });
});
