/**
 * Wave 47 leftover after #214/#215 leftovers D — Hex-a-Gone bank catalog. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  INITIAL_BANK,
  BLOCK_SIZES,
  BLOCK_COLORS,
  type BlockShape,
} from '../../src/games/hex-a-gone/types';

const SHAPES: BlockShape[] = [
  'hexagon',
  'trapezoid',
  'rhombus',
  'triangle',
  'square',
];

describe('Wave 47 hex-a-gone deepen 9 — hexagone — INITIAL_BANK / BLOCK_SIZES / BLOCK_COLORS', () => {
  it('INITIAL_BANK counts match catalog', () => {
    expect(INITIAL_BANK.hexagon).toBe(3);
    expect(INITIAL_BANK.trapezoid).toBe(6);
    expect(INITIAL_BANK.rhombus).toBe(6);
    expect(INITIAL_BANK.triangle).toBe(12);
    expect(INITIAL_BANK.square).toBe(6);
  });

  it('BLOCK_SIZES match unit triangle coverage', () => {
    expect(BLOCK_SIZES.hexagon).toBe(6);
    expect(BLOCK_SIZES.trapezoid).toBe(3);
    expect(BLOCK_SIZES.rhombus).toBe(2);
    expect(BLOCK_SIZES.triangle).toBe(1);
    expect(BLOCK_SIZES.square).toBe(2);
  });

  it('BLOCK_COLORS are hex strings for all shapes', () => {
    for (const shape of SHAPES) {
      expect(BLOCK_COLORS[shape]).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
    expect(BLOCK_COLORS.hexagon).toBe('#FFD700');
    expect(BLOCK_COLORS.trapezoid).toBe('#FF4444');
    expect(BLOCK_COLORS.rhombus).toBe('#4169E1');
    expect(BLOCK_COLORS.triangle).toBe('#32CD32');
    expect(BLOCK_COLORS.square).toBe('#FF8C00');
  });

  it('sum of INITIAL_BANK equals 33', () => {
    const sum = SHAPES.reduce((n, s) => n + INITIAL_BANK[s], 0);
    expect(sum).toBe(33);
  });
});
