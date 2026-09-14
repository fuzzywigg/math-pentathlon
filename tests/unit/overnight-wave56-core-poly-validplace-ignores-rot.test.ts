/**
 * Overnight HEAVY leftover after #256 — isValidPlacement always identity transform;
 * getAllValidPositions honors rotation. Distinct from wave55 place ignores rot.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createGrid,
  isValidPlacement,
  getAllValidPositions,
  TETROMINOES,
} from '../../src/core/polyomino';

describe('Wave 56 core poly — isValidPlacement ignores rotation', () => {
  it('I on 4×1 grid fails identity validate; rotated validpos nonempty', () => {
    const I = TETROMINOES.find((s) => s.id === 'I')!;
    const tall = createGrid(4, 1);
    expect(isValidPlacement(tall, I, { row: 0, col: 0 })).toBe(false);
    expect(getAllValidPositions(tall, I, 90, false).length).toBeGreaterThan(0);
    expect(getAllValidPositions(tall, I, 0, false)).toEqual([]);
  });
});
