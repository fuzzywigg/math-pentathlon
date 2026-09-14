/**
 * Overnight HEAVY leftover after #241 — canPlaceShape respects canRotate:false on I.
 * Distinct from wave52 rotate default passthrough / flip-ignores-flag. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  canPlaceShape,
  createBoard,
  TETROMINOES,
} from '../../src/core/polyomino';

describe('Wave 53 core poly — canRotate false I', () => {
  it('stock I fits a 4×1 column via rotation; frozen I does not', () => {
    const I = TETROMINOES.find((s) => s.id === 'I')!;
    const frozen = { ...I, canRotate: false };
    const tall = createBoard(4, 1);
    const wide = createBoard(1, 4);
    expect(canPlaceShape(wide, I)).toBe(true);
    expect(canPlaceShape(wide, frozen)).toBe(true);
    expect(canPlaceShape(tall, I)).toBe(true);
    expect(canPlaceShape(tall, frozen)).toBe(false);
  });
});
